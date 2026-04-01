import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const suppliersRouter = router({
  // Public: list all approved suppliers with optional category filter
  list: publicProcedure
    .input((val: unknown) => val as { category?: string; nationwide?: boolean } | undefined)
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return [];
      const { suppliers } = await import('../drizzle/schema');
      const { eq, and } = await import('drizzle-orm');

      const conditions = [eq(suppliers.status, 'approved')];
      if (input?.category && input.category !== 'all') {
        conditions.push(eq(suppliers.supplierType, input.category as any));
      }

      return await db
        .select()
        .from(suppliers)
        .where(and(...conditions))
        .orderBy(suppliers.featured, suppliers.businessName);
    }),

  // Public: get a single supplier by slug
  getBySlug: publicProcedure
    .input((val: unknown) => val as { slug: string })
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return null;
      const { suppliers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const [supplier] = await db.select().from(suppliers).where(eq(suppliers.slug, input.slug));
      return supplier ?? null;
    }),

  // Public: list products for a supplier
  getProducts: publicProcedure
    .input((val: unknown) => val as { supplierId: number; category?: string })
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return [];
      const { supplierProducts } = await import('../drizzle/schema');
      const { eq, and } = await import('drizzle-orm');

      const conditions = [
        eq(supplierProducts.supplierId, input.supplierId),
        eq(supplierProducts.status, 'active'),
      ];
      if (input.category && input.category !== 'all') {
        conditions.push(eq(supplierProducts.category, input.category as any));
      }

      return await db.select().from(supplierProducts).where(and(...conditions));
    }),

  // Public: browse all active supplier products with optional filters
  browseProducts: publicProcedure
    .input((val: unknown) => val as { category?: string; localPickup?: boolean; search?: string } | undefined)
    .query(async ({ input }) => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return [];
      const { supplierProducts, suppliers } = await import('../drizzle/schema');
      const { eq, and, like } = await import('drizzle-orm');

      const conditions = [eq(supplierProducts.status, 'active')];
      if (input?.category && input.category !== 'all') {
        conditions.push(eq(supplierProducts.category, input.category as any));
      }
      if (input?.localPickup) {
        conditions.push(eq(supplierProducts.localPickup, 'yes'));
      }

      const rows = await db
        .select({
          id: supplierProducts.id,
          supplierId: supplierProducts.supplierId,
          name: supplierProducts.name,
          description: supplierProducts.description,
          category: supplierProducts.category,
          subcategory: supplierProducts.subcategory,
          unitPrice: supplierProducts.unitPrice,
          unitLabel: supplierProducts.unitLabel,
          minOrderQty: supplierProducts.minOrderQty,
          inStock: supplierProducts.inStock,
          localPickup: supplierProducts.localPickup,
          photos: supplierProducts.photos,
          externalUrl: supplierProducts.externalUrl,
          supplierName: suppliers.businessName,
          supplierSlug: suppliers.slug,
          supplierLogoUrl: suppliers.logoUrl,
          supplierState: suppliers.state,
          supplierCity: suppliers.city,
          supplierNationwide: suppliers.nationwide,
        })
        .from(supplierProducts)
        .leftJoin(suppliers, eq(supplierProducts.supplierId, suppliers.id))
        .where(and(...conditions));

      // Apply search filter in JS (simple name/description match)
      if (input?.search) {
        const q = input.search.toLowerCase();
        return rows.filter(
          r => r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q)
        );
      }

      return rows;
    }),

  // Public: submit a supplier application
  applyAsSupplier: publicProcedure
    .input((val: unknown) => val as any)
    .mutation(async ({ input }) => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) throw new Error('Database unavailable');
      const { supplierApplications } = await import('../drizzle/schema');
      const { notifyOwner } = await import('./_core/notification');

      await db.insert(supplierApplications).values({
        businessName: input.businessName,
        supplierType: input.supplierType,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone ?? null,
        websiteUrl: input.websiteUrl ?? null,
        state: input.state,
        city: input.city ?? null,
        description: input.description ?? null,
        nationwide: input.nationwide ?? 'yes',
        message: input.message ?? null,
        status: 'pending',
      });

      await notifyOwner({
        title: `New Supplier Application: ${input.businessName}`,
        content: `${input.contactName} (${input.contactEmail}) applied as a ${input.supplierType} supplier from ${input.city ?? ''}, ${input.state}.\nDescription: ${input.description ?? 'N/A'}\nWebsite: ${input.websiteUrl ?? 'N/A'}`,
      });

      return { success: true };
    }),

  // Admin: list all supplier applications
  getAllApplications: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') throw new Error('Forbidden');
    const { getDb } = await import('./db');
    const db = await getDb();
    if (!db) return [];
    const { supplierApplications } = await import('../drizzle/schema');
    return await db.select().from(supplierApplications).orderBy(supplierApplications.createdAt);
  }),

  // Admin: approve a supplier application and create supplier profile
  approveApplication: protectedProcedure
    .input((val: unknown) => val as { id: number })
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') throw new Error('Forbidden');
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) throw new Error('Database unavailable');
      const { supplierApplications, suppliers } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');

      const [app] = await db.select().from(supplierApplications).where(eq(supplierApplications.id, input.id));
      if (!app) throw new Error('Application not found');

      // Create slug from business name
      const slug = app.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      await db.insert(suppliers).values({
        businessName: app.businessName,
        slug,
        supplierType: app.supplierType,
        description: app.description ?? null,
        websiteUrl: app.websiteUrl ?? null,
        contactName: app.contactName,
        contactEmail: app.contactEmail,
        contactPhone: app.contactPhone ?? null,
        state: app.state,
        city: app.city ?? null,
        nationwide: app.nationwide,
        status: 'approved',
      });

      await db.update(supplierApplications).set({ status: 'approved' }).where(eq(supplierApplications.id, input.id));

      return { success: true };
    }),
});
