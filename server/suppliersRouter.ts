import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "./db";
import {
  suppliers,
  supplierProducts,
  supplierApplications,
} from "../drizzle/schema";
import { eq, and, desc, asc } from "drizzle-orm";

// ─── DB helper (throws if DB unavailable) ────────────────────────────────────
async function dbc() {
  const d = await getDb();
  if (!d) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  return d;
}

// ─── Slug helper ─────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

// ─── Category enum ────────────────────────────────────────────────────────────
const CATEGORIES = ["equipment", "seeds", "nutrients", "lighting", "soil", "packaging", "services", "technology", "other"] as const;
type Category = typeof CATEGORIES[number];

// ─── Router ──────────────────────────────────────────────────────────────────
export const suppliersRouter = router({

  // ── Public: browse approved suppliers ──────────────────────────────────────
  browse: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      state: z.string().optional(),
      nationwide: z.boolean().optional(),
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(24),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const { search, state, nationwide, featured, limit = 24, offset = 0 } = input ?? {};
      const db = await dbc();
      const rows = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.status, "approved"))
        .orderBy(desc(suppliers.featured), desc(suppliers.createdAt))
        .limit(limit)
        .offset(offset);

      return rows.filter((s) => {
        if (search && !s.businessName.toLowerCase().includes(search.toLowerCase())) return false;
        if (state && s.state !== state) return false;
        if (nationwide !== undefined) {
          const val = nationwide ? "yes" : "no";
          if (s.nationwide !== val) return false;
        }
        if (featured !== undefined) {
          const val = featured ? "yes" : "no";
          if (s.featured !== val) return false;
        }
        return true;
      });
    }),

  // ── Public: get supplier by slug ───────────────────────────────────────────
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await dbc();
      const [supplier] = await db
        .select()
        .from(suppliers)
        .where(and(eq(suppliers.slug, input.slug), eq(suppliers.status, "approved")))
        .limit(1);
      if (!supplier) throw new TRPCError({ code: "NOT_FOUND", message: "Supplier not found" });
      const products = await db
        .select()
        .from(supplierProducts)
        .where(and(eq(supplierProducts.supplierId, supplier.id), eq(supplierProducts.status, "active")))
        .orderBy(asc(supplierProducts.category), asc(supplierProducts.name));
      return { supplier, products };
    }),

  // ── Public: browse supplier products (marketplace) ────────────────────────
  browseProducts: publicProcedure
    .input(z.object({
      category: z.enum(CATEGORIES).optional(),
      search: z.string().optional(),
      inStockOnly: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(48),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const { category, search, inStockOnly, limit = 48, offset = 0 } = input ?? {};
      const db = await dbc();
      const rows = await db
        .select({
          product: supplierProducts,
          supplierName: suppliers.businessName,
          supplierSlug: suppliers.slug,
          supplierLogoUrl: suppliers.logoUrl,
        })
        .from(supplierProducts)
        .innerJoin(
          suppliers,
          and(eq(supplierProducts.supplierId, suppliers.id), eq(suppliers.status, "approved"))
        )
        .where(eq(supplierProducts.status, "active"))
        .orderBy(desc(supplierProducts.createdAt))
        .limit(limit)
        .offset(offset);

      return rows.filter((r) => {
        if (category && r.product.category !== category) return false;
        if (inStockOnly && r.product.inStock !== "yes") return false;
        if (search) {
          const q = search.toLowerCase();
          const match =
            r.product.name.toLowerCase().includes(q) ||
            (r.product.description ?? "").toLowerCase().includes(q) ||
            r.supplierName.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });
    }),

  // ── Public: submit supplier application (no auth required for now) ─────────
  submitApplication: publicProcedure
    .input(z.object({
      businessName: z.string().min(2).max(255),
      supplierType: z.enum(CATEGORIES),
      contactName: z.string().min(2).max(255),
      contactEmail: z.string().email(),
      contactPhone: z.string().optional(),
      websiteUrl: z.string().url().optional().or(z.literal("")),
      state: z.string().length(2),
      city: z.string().optional(),
      description: z.string().optional(),
      nationwide: z.boolean().default(false),
      message: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await dbc();
      await db.insert(supplierApplications).values({
        businessName: input.businessName,
        supplierType: input.supplierType,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        websiteUrl: input.websiteUrl || null,
        state: input.state,
        city: input.city,
        description: input.description,
        nationwide: input.nationwide ? "yes" : "no",
        message: input.message,
        status: "pending",
      });
      return { success: true };
    }),

  // ── Protected: get my supplier profile ─────────────────────────────────────
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await dbc();
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.userId, ctx.user.id))
      .limit(1);
    return supplier ?? null;
  }),

  // ── Protected: update my supplier profile ──────────────────────────────────
  updateProfile: protectedProcedure
    .input(z.object({
      businessName: z.string().min(2).max(255).optional(),
      description: z.string().optional(),
      logoUrl: z.string().url().optional().or(z.literal("")),
      websiteUrl: z.string().url().optional().or(z.literal("")),
      instagramUrl: z.string().url().optional().or(z.literal("")),
      facebookUrl: z.string().url().optional().or(z.literal("")),
      twitterUrl: z.string().url().optional().or(z.literal("")),
      linkedinUrl: z.string().url().optional().or(z.literal("")),
      youtubeUrl: z.string().url().optional().or(z.literal("")),
      contactName: z.string().optional(),
      contactEmail: z.string().email().optional(),
      contactPhone: z.string().optional(),
      city: z.string().optional(),
      state: z.string().length(2).optional(),
      zipCode: z.string().optional(),
      nationwide: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await dbc();
      const [supplier] = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id))
        .limit(1);
      if (!supplier) throw new TRPCError({ code: "NOT_FOUND", message: "Supplier profile not found." });

      const updates: Record<string, unknown> = {};
      if (input.businessName !== undefined) {
        updates.businessName = input.businessName;
        updates.slug = slugify(input.businessName);
      }
      if (input.description !== undefined) updates.description = input.description;
      if (input.logoUrl !== undefined) updates.logoUrl = input.logoUrl || null;
      if (input.websiteUrl !== undefined) updates.websiteUrl = input.websiteUrl || null;
      if (input.instagramUrl !== undefined) updates.instagramUrl = input.instagramUrl || null;
      if (input.facebookUrl !== undefined) updates.facebookUrl = input.facebookUrl || null;
      if (input.twitterUrl !== undefined) updates.twitterUrl = input.twitterUrl || null;
      if (input.linkedinUrl !== undefined) updates.linkedinUrl = input.linkedinUrl || null;
      if (input.youtubeUrl !== undefined) updates.youtubeUrl = input.youtubeUrl || null;
      if (input.contactName !== undefined) updates.contactName = input.contactName;
      if (input.contactEmail !== undefined) updates.contactEmail = input.contactEmail;
      if (input.contactPhone !== undefined) updates.contactPhone = input.contactPhone;
      if (input.city !== undefined) updates.city = input.city;
      if (input.state !== undefined) updates.state = input.state;
      if (input.zipCode !== undefined) updates.zipCode = input.zipCode;
      if (input.nationwide !== undefined) updates.nationwide = input.nationwide ? "yes" : "no";

      await db.update(suppliers).set(updates).where(eq(suppliers.id, supplier.id));
      return { success: true };
    }),

  // ── Protected: get my products ─────────────────────────────────────────────
  myProducts: protectedProcedure.query(async ({ ctx }) => {
    const db = await dbc();
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.userId, ctx.user.id))
      .limit(1);
    if (!supplier) return [];
    return db
      .select()
      .from(supplierProducts)
      .where(eq(supplierProducts.supplierId, supplier.id))
      .orderBy(asc(supplierProducts.category), asc(supplierProducts.name));
  }),

  // ── Protected: create product ──────────────────────────────────────────────
  createProduct: protectedProcedure
    .input(z.object({
      name: z.string().min(2).max(255),
      description: z.string().optional(),
      category: z.enum(CATEGORIES),
      subcategory: z.string().optional(),
      unitPrice: z.number().int().min(1),
      unitLabel: z.string().default("each"),
      minOrderQty: z.number().int().min(1).default(1),
      inStock: z.boolean().default(true),
      localPickup: z.boolean().default(false),
      externalUrl: z.string().url().optional().or(z.literal("")),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await dbc();
      const [supplier] = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id))
        .limit(1);
      if (!supplier) throw new TRPCError({ code: "FORBIDDEN", message: "You must have an approved supplier profile." });

      await db.insert(supplierProducts).values({
        supplierId: supplier.id,
        name: input.name,
        description: input.description,
        category: input.category,
        subcategory: input.subcategory,
        unitPrice: input.unitPrice,
        unitLabel: input.unitLabel,
        minOrderQty: input.minOrderQty,
        inStock: input.inStock ? "yes" : "no",
        localPickup: input.localPickup ? "yes" : "no",
        externalUrl: input.externalUrl || null,
        status: "active",
      });
      return { success: true };
    }),

  // ── Protected: update product ──────────────────────────────────────────────
  updateProduct: protectedProcedure
    .input(z.object({
      id: z.number().int(),
      name: z.string().min(2).max(255).optional(),
      description: z.string().optional(),
      category: z.enum(CATEGORIES).optional(),
      subcategory: z.string().optional(),
      unitPrice: z.number().int().min(1).optional(),
      unitLabel: z.string().optional(),
      minOrderQty: z.number().int().min(1).optional(),
      inStock: z.boolean().optional(),
      localPickup: z.boolean().optional(),
      externalUrl: z.string().url().optional().or(z.literal("")),
      status: z.enum(["active", "inactive", "sold_out"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await dbc();
      const [supplier] = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id))
        .limit(1);
      if (!supplier) throw new TRPCError({ code: "FORBIDDEN" });

      const { id, inStock, localPickup, externalUrl, ...rest } = input;
      const updates: Record<string, unknown> = { ...rest };
      if (inStock !== undefined) updates.inStock = inStock ? "yes" : "no";
      if (localPickup !== undefined) updates.localPickup = localPickup ? "yes" : "no";
      if (externalUrl !== undefined) updates.externalUrl = externalUrl || null;

      await db
        .update(supplierProducts)
        .set(updates)
        .where(and(eq(supplierProducts.id, id), eq(supplierProducts.supplierId, supplier.id)));
      return { success: true };
    }),

  // ── Protected: delete product ──────────────────────────────────────────────
  deleteProduct: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const db = await dbc();
      const [supplier] = await db
        .select()
        .from(suppliers)
        .where(eq(suppliers.userId, ctx.user.id))
        .limit(1);
      if (!supplier) throw new TRPCError({ code: "FORBIDDEN" });

      await db
        .delete(supplierProducts)
        .where(and(eq(supplierProducts.id, input.id), eq(supplierProducts.supplierId, supplier.id)));
      return { success: true };
    }),

  // ── Admin: list all applications ───────────────────────────────────────────
  adminListApplications: protectedProcedure
    .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await dbc();
      const rows = await db
        .select()
        .from(supplierApplications)
        .orderBy(desc(supplierApplications.createdAt));
      if (input?.status) return rows.filter((r) => r.status === input.status);
      return rows;
    }),

  // ── Admin: approve / reject application ────────────────────────────────────
  adminReviewApplication: protectedProcedure
    .input(z.object({
      applicationId: z.number().int(),
      decision: z.enum(["approved", "rejected"]),
      reviewNotes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await dbc();

      const [app] = await db
        .select()
        .from(supplierApplications)
        .where(eq(supplierApplications.id, input.applicationId))
        .limit(1);
      if (!app) throw new TRPCError({ code: "NOT_FOUND" });

      await db
        .update(supplierApplications)
        .set({ status: input.decision })
        .where(eq(supplierApplications.id, input.applicationId));

      // If approved, create the supplier profile (linked to admin for now — no userId on applications table)
      if (input.decision === "approved") {
        const slug = slugify(app.businessName);
        const [existing] = await db
          .select()
          .from(suppliers)
          .where(eq(suppliers.slug, slug))
          .limit(1);
        if (!existing) {
          await db.insert(suppliers).values({
            userId: ctx.user.id, // admin creates it; owner can claim later
            businessName: app.businessName,
            slug,
            supplierType: app.supplierType,
            description: app.description,
            contactName: app.contactName,
            contactEmail: app.contactEmail,
            contactPhone: app.contactPhone,
            websiteUrl: app.websiteUrl,
            city: app.city,
            state: app.state,
            nationwide: app.nationwide,
            status: "approved",
          });
        } else {
          await db.update(suppliers).set({ status: "approved" }).where(eq(suppliers.id, existing.id));
        }
      }

      return { success: true };
    }),

  // ── Admin: list all suppliers ──────────────────────────────────────────────
  adminListSuppliers: protectedProcedure
    .input(z.object({ status: z.enum(["pending", "approved", "suspended"]).optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await dbc();
      const rows = await db
        .select()
        .from(suppliers)
        .orderBy(desc(suppliers.featured), desc(suppliers.createdAt));
      if (input?.status) return rows.filter((r) => r.status === input.status);
      return rows;
    }),

  // ── Admin: toggle featured ─────────────────────────────────────────────────
  adminToggleFeatured: protectedProcedure
    .input(z.object({ supplierId: z.number().int(), featured: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await dbc();
      await db
        .update(suppliers)
        .set({ featured: input.featured ? "yes" : "no" })
        .where(eq(suppliers.id, input.supplierId));
      return { success: true };
    }),

  // ── Admin: set supplier status ─────────────────────────────────────────────
  adminSetStatus: protectedProcedure
    .input(z.object({ supplierId: z.number().int(), status: z.enum(["approved", "suspended", "pending"]) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await dbc();
      await db
        .update(suppliers)
        .set({ status: input.status })
        .where(eq(suppliers.id, input.supplierId));
      return { success: true };
    }),
});
