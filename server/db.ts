import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Product Management
import { products, InsertProduct, farmerProfiles, InsertFarmerProfile, consumerProfiles, InsertConsumerProfile, cartItems, InsertCartItem, orders, InsertOrder, orderItems, InsertOrderItem, transactions, InsertTransaction, reviews, InsertReview } from "../drizzle/schema";
import { desc, and } from "drizzle-orm";

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  return result;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (result.length === 0) return undefined;
  
  const p = result[0];
  let photoUrl = '';
  if (p.photos) {
    try {
      const parsed = JSON.parse(p.photos);
      photoUrl = Array.isArray(parsed) ? parsed[0] || '' : p.photos;
    } catch {
      photoUrl = p.photos;
    }
  }
  return {
    ...p,
    photos: photoUrl,
    price: p.price / 100,
    retailPrice: p.retailPrice ? p.retailPrice / 100 : null,
    isPreOrder: p.isPreOrder === 'yes',
    isFeatured: p.isFeatured === 'yes',
    isSponsored: p.isSponsored === 'yes',
  };
}

export async function getProductsByFarmerId(farmerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(products).where(eq(products.farmerId, farmerId)).orderBy(desc(products.createdAt));
}

export async function getAllActiveProducts(filters?: {
  search?: string;
  category?: string;
  minThc?: number;
  maxThc?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  // Return all non-inactive products (active, sold_out, growing, pre-order)
  const allProducts = await db.select().from(products).orderBy(desc(products.isFeatured), desc(products.createdAt));
  
  // Filter out inactive and format photos
  return allProducts
    .filter(p => p.status !== 'inactive')
    .map(p => {
      // Parse photos JSON to get first image URL
      let photoUrl = '';
      if (p.photos) {
        try {
          const parsed = JSON.parse(p.photos);
          photoUrl = Array.isArray(parsed) ? parsed[0] || '' : p.photos;
        } catch {
          photoUrl = p.photos;
        }
      }
      return {
        ...p,
        photos: photoUrl,
        price: p.price / 100, // Convert cents to dollars
        retailPrice: p.retailPrice ? p.retailPrice / 100 : null,
        isPreOrder: p.isPreOrder === 'yes',
        isFeatured: p.isFeatured === 'yes',
        isSponsored: p.isSponsored === 'yes',
      };
    });
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(updates).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(products).where(eq(products.id, id));
}

// Farmer Profile Management
export async function createFarmerProfile(profile: InsertFarmerProfile & { referralCode?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { referralCode, ...profileData } = profile;
  
  // Create farmer profile
  const result = await db.insert(farmerProfiles).values(profileData);
  const farmerId = result[0].insertId;
  
  // If referral code provided, track the referral
  if (referralCode) {
    const { getSalesRepByReferralCode, trackReferral, convertReferral } = await import("./salesReps");
    const salesRep = await getSalesRepByReferralCode(referralCode);
    
    if (salesRep) {
      // Track referral
      await trackReferral(salesRep.id, farmerId, referralCode);
      
      // Convert referral immediately (farmer subscribed)
      await convertReferral(farmerId, profileData.subscriptionTier as "standard" | "premium");
    }
  }
  
  // Create subscription record
  const { farmerSubscriptions } = await import("../drizzle/schema");
  const trialEndDate = new Date();
  trialEndDate.setFullYear(trialEndDate.getFullYear() + 1); // 1 year free trial
  
  let referredById: number | undefined = undefined;
  if (referralCode) {
    const { getSalesRepByReferralCode } = await import("./salesReps");
    const rep = await getSalesRepByReferralCode(referralCode);
    referredById = rep?.id;
  }
  
  await db.insert(farmerSubscriptions).values({
    farmerId: Number(farmerId),
    tier: profileData.subscriptionTier as "standard" | "premium",
    status: "trial",
    billingCycle: "monthly",
    monthlyPrice: profileData.subscriptionTier === "premium" ? 110000 : 25000,
    trialEndsAt: trialEndDate,
    currentPeriodStart: new Date(),
    currentPeriodEnd: trialEndDate,
    referredBy: referredById,
  });
  
  return result;
}

export async function getFarmerProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(farmerProfiles).where(eq(farmerProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateFarmerProfile(userId: number, updates: Partial<InsertFarmerProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(farmerProfiles).set(updates).where(eq(farmerProfiles.userId, userId));
}

// Consumer Profile Management
export async function createConsumerProfile(profile: InsertConsumerProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(consumerProfiles).values(profile);
  return result;
}

export async function getConsumerProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(consumerProfiles).where(eq(consumerProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateConsumerProfile(userId: number, updates: Partial<InsertConsumerProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(consumerProfiles).set(updates).where(eq(consumerProfiles.userId, userId));
}

// Shopping Cart Management
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(item: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if item already exists in cart
  const existing = await db.select().from(cartItems)
    .where(and(eq(cartItems.userId, item.userId), eq(cartItems.productId, item.productId)))
    .limit(1);
  
  if (existing.length > 0) {
    // Update quantity
    await db.update(cartItems)
      .set({ quantity: existing[0].quantity + item.quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // Insert new item
    await db.insert(cartItems).values(item);
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
  }
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Order Management
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrdersByConsumerId(consumerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.consumerId, consumerId)).orderBy(desc(orders.createdAt));
}

export async function getOrdersByFarmerId(farmerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orders).where(eq(orders.farmerId, farmerId)).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
}

// Order Items
export async function createOrderItem(item: InsertOrderItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(orderItems).values(item);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Transaction Management
export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(transactions).values(transaction);
  return result;
}

export async function updateTransactionStatus(id: number, status: string, stripePaymentId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updates: any = { status };
  if (stripePaymentId) updates.stripePaymentId = stripePaymentId;
  
  await db.update(transactions).set(updates).where(eq(transactions.id, id));
}

// Reviews
export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(reviews).values(review);
}

export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

// Sales Rep Applications
export async function createSalesRepApplication(application: {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  linkedinUrl: string | null;
  resume: string | null;
  whyJoin: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { salesRepApplications } = await import('../drizzle/schema');
  const [result] = await db.insert(salesRepApplications).values(application);
  return { id: result.insertId };
}


// Get all pending farmer profiles
export async function getAllPendingFarmerProfiles() {
  const db = await getDb();
  if (!db) return [];
  const { farmerProfiles } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  return await db.select().from(farmerProfiles).where(eq(farmerProfiles.verified, 'pending'));
}

// Approve farmer profile
export async function approveFarmerProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { farmerProfiles } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  await db.update(farmerProfiles).set({ verified: 'approved' }).where(eq(farmerProfiles.id, id));
}

// Reject farmer profile
export async function rejectFarmerProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { farmerProfiles } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  await db.update(farmerProfiles).set({ verified: 'rejected' }).where(eq(farmerProfiles.id, id));
}

// Get all sales rep applications
export async function getAllSalesRepApplications() {
  const db = await getDb();
  if (!db) return [];
  const { salesRepApplications } = await import('../drizzle/schema');
  return await db.select().from(salesRepApplications);
}

// Approve sales rep application
export async function approveSalesRepApplication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesRepApplications } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  await db.update(salesRepApplications).set({ status: 'approved' }).where(eq(salesRepApplications.id, id));
}

// Reject sales rep application
export async function rejectSalesRepApplication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesRepApplications } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');
  await db.update(salesRepApplications).set({ status: 'rejected' }).where(eq(salesRepApplications.id, id));
}
