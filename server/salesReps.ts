import { getDb } from "./db";
import { salesReps, referrals, commissions, farmerSubscriptions, farmerProfiles, users } from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Generate unique referral code for sales rep
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude confusing characters
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create new sales rep
 */
export async function createSalesRep(userId: number) {
  const referralCode = generateReferralCode();
  
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [salesRep] = await db.insert(salesReps).values({
    userId,
    referralCode,
    status: "active",
  });
  
  return salesRep;
}

/**
 * Get sales rep by user ID
 */
export async function getSalesRepByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [salesRep] = await db.select().from(salesReps).where(eq(salesReps.userId, userId));
  return salesRep;
}

/**
 * Get sales rep by referral code
 */
export async function getSalesRepByReferralCode(referralCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [salesRep] = await db.select().from(salesReps).where(eq(salesReps.referralCode, referralCode));
  return salesRep;
}

/**
 * Get sales rep dashboard data
 */
export async function getSalesRepDashboard(salesRepId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [rep] = await db.select().from(salesReps).where(eq(salesReps.id, salesRepId));
  
  if (!rep) {
    throw new Error("Sales rep not found");
  }
  
  // Get all referrals
  const allReferrals = await db
    .select({
      id: referrals.id,
      farmerId: referrals.farmerId,
      status: referrals.status,
      subscriptionTier: referrals.subscriptionTier,
      convertedAt: referrals.convertedAt,
      createdAt: referrals.createdAt,
      farmerName: farmerProfiles.businessName,
      farmerEmail: users.email,
    })
    .from(referrals)
    .leftJoin(farmerProfiles, eq(referrals.farmerId, farmerProfiles.id))
    .leftJoin(users, eq(farmerProfiles.userId, users.id))
    .where(eq(referrals.salesRepId, salesRepId))
    .orderBy(desc(referrals.createdAt));
  
  // Get commissions
  const allCommissions = await db
    .select()
    .from(commissions)
    .where(eq(commissions.salesRepId, salesRepId))
    .orderBy(desc(commissions.createdAt));
  
  return {
    rep,
    referrals: allReferrals,
    commissions: allCommissions,
  };
}

/**
 * Track farmer referral
 */
export async function trackReferral(salesRepId: number, farmerId: number, referralCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [referral] = await db.insert(referrals).values({
    salesRepId,
    farmerId,
    referralCode,
    status: "pending",
  });
  
  return referral;
}

/**
 * Convert referral when farmer subscribes
 */
export async function convertReferral(farmerId: number, subscriptionTier: "standard" | "premium") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update referral status
  await db
    .update(referrals)
    .set({
      status: "converted",
      subscriptionTier,
      convertedAt: new Date(),
    })
    .where(eq(referrals.farmerId, farmerId));
  
  // Get referral to find sales rep
  const [referral] = await db
    .select()
    .from(referrals)
    .where(eq(referrals.farmerId, farmerId));
  
  if (!referral) {
    return;
  }
  
  // Calculate commissions
  const signupBonus = subscriptionTier === "premium" ? 100000 : 50000; // $1,000 or $500
  const monthlyCommission = subscriptionTier === "premium" ? 22000 : 5000; // 20% of $1,100 or $250
  
  // Create signup bonus commission
  await db.insert(commissions).values({
    salesRepId: referral.salesRepId,
    farmerId,
    type: "signup_bonus",
    amount: signupBonus,
    status: "pending",
  });
  
  // Create 12 months of recurring commissions
  for (let month = 1; month <= 12; month++) {
    await db.insert(commissions).values({
      salesRepId: referral.salesRepId,
      farmerId,
      type: "recurring_monthly",
      amount: monthlyCommission,
      status: "pending",
      subscriptionMonth: month,
    });
  }
  
  // Update sales rep stats
  await db
    .update(salesReps)
    .set({
      totalReferrals: sql`${salesReps.totalReferrals} + 1`,
      activeReferrals: sql`${salesReps.activeReferrals} + 1`,
      pendingCommissions: sql`${salesReps.pendingCommissions} + ${signupBonus + (monthlyCommission * 12)}`,
    })
    .where(eq(salesReps.id, referral.salesRepId));
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const leaderboard = await db
    .select({
      id: salesReps.id,
      referralCode: salesReps.referralCode,
      totalReferrals: salesReps.totalReferrals,
      activeReferrals: salesReps.activeReferrals,
      totalCommissionsEarned: salesReps.totalCommissionsEarned,
      userName: users.name,
    })
    .from(salesReps)
    .leftJoin(users, eq(salesReps.userId, users.id))
    .where(eq(salesReps.status, "active"))
    .orderBy(desc(salesReps.totalReferrals))
    .limit(limit);
  
  return leaderboard;
}

/**
 * Approve commission for payout
 */
export async function approveCommission(commissionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(commissions)
    .set({ status: "approved" })
    .where(eq(commissions.id, commissionId));
}

/**
 * Mark commission as paid
 */
export async function markCommissionPaid(commissionId: number, stripePayoutId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [commission] = await db
    .select()
    .from(commissions)
    .where(eq(commissions.id, commissionId));
  
  if (!commission) {
    throw new Error("Commission not found");
  }
  
  await db
    .update(commissions)
    .set({
      status: "paid",
      paidAt: new Date(),
      stripePayoutId,
    })
    .where(eq(commissions.id, commissionId));
  
  // Update sales rep stats
  await db
    .update(salesReps)
    .set({
      pendingCommissions: sql`${salesReps.pendingCommissions} - ${commission.amount}`,
      paidCommissions: sql`${salesReps.paidCommissions} + ${commission.amount}`,
      totalCommissionsEarned: sql`${salesReps.totalCommissionsEarned} + ${commission.amount}`,
    })
    .where(eq(salesReps.id, commission.salesRepId));
}


/**
 * Get admin stats
 */
export async function getAdminStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [stats] = await db
    .select({
      totalReps: sql<number>`COUNT(DISTINCT ${salesReps.id})`,
      totalFarmers: sql<number>`COUNT(DISTINCT ${referrals.farmerId})`,
      pendingCommissions: sql<number>`SUM(CASE WHEN ${commissions.status} = 'pending' THEN ${commissions.amount} ELSE 0 END)`,
      paidCommissions: sql<number>`SUM(CASE WHEN ${commissions.status} = 'paid' THEN ${commissions.amount} ELSE 0 END)`,
    })
    .from(salesReps)
    .leftJoin(referrals, eq(salesReps.id, referrals.salesRepId))
    .leftJoin(commissions, eq(salesReps.id, commissions.salesRepId));
  
  return stats;
}

/**
 * Get pending commissions for admin review
 */
export async function getPendingCommissions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const pending = await db
    .select({
      id: commissions.id,
      salesRepId: commissions.salesRepId,
      farmerId: commissions.farmerId,
      type: commissions.type,
      amount: commissions.amount,
      status: commissions.status,
      subscriptionMonth: commissions.subscriptionMonth,
      createdAt: commissions.createdAt,
      salesRep: {
        name: users.name,
        referralCode: salesReps.referralCode,
      },
      farmer: {
        businessName: farmerProfiles.businessName,
        subscriptionTier: farmerProfiles.subscriptionTier,
      },
    })
    .from(commissions)
    .leftJoin(salesReps, eq(commissions.salesRepId, salesReps.id))
    .leftJoin(users, eq(salesReps.userId, users.id))
    .leftJoin(farmerProfiles, eq(commissions.farmerId, farmerProfiles.id))
    .where(eq(commissions.status, "pending"))
    .orderBy(desc(commissions.createdAt));
  
  return pending;
}
