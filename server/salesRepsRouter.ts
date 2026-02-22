import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createSalesRep,
  getSalesRepByUserId,
  getSalesRepByReferralCode,
  getSalesRepDashboard,
  trackReferral,
  convertReferral,
  getLeaderboard,
  approveCommission,
  markCommissionPaid,
} from "./salesReps";

export const salesRepsRouter = router({
  // Register as sales rep
  register: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if user is already a sales rep
    const existing = await getSalesRepByUserId(ctx.user.id);
    if (existing) {
      return { success: false, message: "You are already registered as a sales rep" };
    }

    const salesRep = await createSalesRep(ctx.user.id);
    return { success: true, salesRep };
  }),

  // Get current user's sales rep profile
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const salesRep = await getSalesRepByUserId(ctx.user.id);
    return salesRep;
  }),

  // Get sales rep dashboard data
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const salesRep = await getSalesRepByUserId(ctx.user.id);
    if (!salesRep) {
      throw new Error("You are not registered as a sales rep");
    }

    const dashboard = await getSalesRepDashboard(salesRep.id);
    return dashboard;
  }),

  // Verify referral code (public endpoint for farmer registration)
  verifyReferralCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const salesRep = await getSalesRepByReferralCode(input.code);
      if (!salesRep) {
        return { valid: false };
      }
      return { valid: true, salesRep };
    }),

  // Get leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ input }) => {
      const leaderboard = await getLeaderboard(input.limit);
      return leaderboard;
    }),

  // Admin: Approve commission
  approveCommission: protectedProcedure
    .input(z.object({ commissionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can approve commissions");
      }

      await approveCommission(input.commissionId);
      return { success: true };
    }),

  // Admin: Mark commission as paid
  markCommissionPaid: protectedProcedure
    .input(
      z.object({
        commissionId: z.number(),
        stripePayoutId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can mark commissions as paid");
      }

      await markCommissionPaid(input.commissionId, input.stripePayoutId || "manual");
      return { success: true };
    }),

  // Admin: Get admin stats
  getAdminStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Only admins can view stats");
    }

    const { getAdminStats } = await import("./salesReps");
    return await getAdminStats();
  }),

  // Admin: Get pending commissions
  getPendingCommissions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Only admins can view pending commissions");
    }

    const { getPendingCommissions } = await import("./salesReps");
    return await getPendingCommissions();
  }),
});
