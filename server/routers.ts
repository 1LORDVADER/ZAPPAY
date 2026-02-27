import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { salesRepsRouter } from "./salesRepsRouter";
import { transportationRouter } from "./transportationRouter";
import { salesRouter } from "./salesRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  salesReps: salesRepsRouter,
  transportation: transportationRouter,
  sales: salesRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products
  products: router({
    list: publicProcedure.query(async () => {
      const { getAllActiveProducts } = await import('./db');
      return await getAllActiveProducts();
    }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val === 'object' && val !== null && 'id' in val) {
          return val as { id: number };
        }
        throw new Error('Invalid input');
      })
      .query(async ({ input }) => {
        const { getProductById } = await import('./db');
        return await getProductById(input.id);
      }),
    myProducts: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getProductsByFarmerId } = await import('./db');
      return await getProductsByFarmerId(ctx.user.id);
    }),
    create: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { createProduct } = await import('./db');
        return await createProduct({
          ...input,
          farmerId: ctx.user.id,
        });
      }),
    update: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateProduct } = await import('./db');
        await updateProduct(input.id, input.updates);
        return { success: true };
      }),
    delete: publicProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { deleteProduct } = await import('./db');
        await deleteProduct(input.id);
        return { success: true };
      }),
    updatePrice: publicProcedure
      .input((val: unknown) => val as { id: number; price: number })
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateProduct } = await import('./db');
        await updateProduct(input.id, { price: input.price });
        return { success: true };
      }),
  }),

  // Shopping Cart
  cart: router({
    getItems: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getCartItems } = await import('./db');
      return await getCartItems(ctx.user.id);
    }),
    addItem: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { addToCart } = await import('./db');
        await addToCart({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
        });
        return { success: true };
      }),
    updateQuantity: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateCartItemQuantity } = await import('./db');
        await updateCartItemQuantity(input.id, input.quantity, input.isMixed, input.mixedStrains);
        return { success: true };
      }),
    clear: publicProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user) throw new Error('Not authenticated');
      const { clearCart } = await import('./db');
      await clearCart(ctx.user.id);
      return { success: true };
    }),
    removeItem: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateCartItemQuantity } = await import('./db');
        await updateCartItemQuantity(input.id, 0); // Setting quantity to 0 will delete the item
        return { success: true };
      }),
  }),

  // Orders
  orders: router({
    myOrders: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getOrdersByConsumerId } = await import('./db');
      return await getOrdersByConsumerId(ctx.user.id);
    }),
    farmerOrders: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getOrdersByFarmerId } = await import('./db');
      return await getOrdersByFarmerId(ctx.user.id);
    }),
    create: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { createOrder, createOrderItem, clearCart } = await import('./db');
        const { nanoid } = await import('nanoid');
        
        // Create order
        const orderId = nanoid(10);
        await createOrder({
          orderId,
          consumerId: ctx.user.id,
          farmerId: input.farmerId,
          status: 'pending',
          subtotal: input.subtotal,
          tax: input.tax,
          platformFee: input.platformFee,
          total: input.total,
          deliveryAddress: input.deliveryAddress,
          deliveryCity: input.deliveryCity,
          deliveryState: input.deliveryState,
          deliveryZipCode: input.deliveryZipCode,
        });
        
        // Create order items
        for (const item of input.items) {
          await createOrderItem(item);
        }
        
        // Clear cart
        await clearCart(ctx.user.id);
        
        return { success: true, orderId };
      }),
    updateStatus: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateOrderStatus } = await import('./db');
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Payment (Stripe)
  payment: router({ createCheckoutSession: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        
        const stripe = (await import('stripe')).default;
        const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
        
        // Calculate totals
        const subtotal = input.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.08);
        const total = subtotal + tax;
        
        // Create Stripe checkout session
        const session = await stripeClient.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: input.items.map((item: any) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
              },
              unit_amount: item.price,
            },
            quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${ctx.req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/checkout`,
          customer_email: input.shippingInfo.email,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: input.shippingInfo.email,
            customer_name: input.shippingInfo.fullName,
            shipping_address: input.shippingInfo.address,
            shipping_city: input.shippingInfo.city,
            shipping_state: input.shippingInfo.state,
            shipping_zip: input.shippingInfo.zipCode,
          },
          allow_promotion_codes: true,
        });
        
        return { url: session.url };
      }),
  }),

  // User Profiles
  profile: router({
    getFarmerProfile: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getFarmerProfileByUserId } = await import('./db');
      return await getFarmerProfileByUserId(ctx.user.id);
    }),
    createFarmerProfile: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { createFarmerProfile } = await import('./db');
        await createFarmerProfile({
          ...input,
          userId: ctx.user.id,
        });
        
        // Send notification to admin
        const { notifyOwner } = await import('./_core/notification');
        await notifyOwner({
          title: 'New Farmer Application',
          content: `${input.businessName} has applied to join ZAPPAY as a licensed farmer. License: ${input.licenseNumber}, State: ${input.state}. Review at /admin/applications`
        });
        
        return { success: true };
      }),
    updateFarmerProfile: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateFarmerProfile } = await import('./db');
        await updateFarmerProfile(ctx.user.id, input);
        return { success: true };
      }),
    getConsumerProfile: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getConsumerProfileByUserId } = await import('./db');
      return await getConsumerProfileByUserId(ctx.user.id);
    }),
    createConsumerProfile: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { createConsumerProfile } = await import('./db');
        await createConsumerProfile({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true };
      }),
    updateConsumerProfile: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateConsumerProfile } = await import('./db');
        await updateConsumerProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Applications
  applications: router({
    getMyApplications: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return { farmer: null, driver: null, company: null, salesRep: null, dispensary: null, advertiser: null };
      const { getFarmerProfileByUserId, getDriverByUserId, getCompanyByUserId, getSalesApplicationByUserId } = await import('./db');
      const { getDb } = await import('./db');
      const db = await getDb();
      
      const [farmer, driver, company, salesRep] = await Promise.all([
        getFarmerProfileByUserId(ctx.user.id),
        getDriverByUserId(ctx.user.id),
        getCompanyByUserId(ctx.user.id),
        getSalesApplicationByUserId(ctx.user.id),
      ]);

      let dispensary = null;
      let advertiser = null;
      
      if (db) {
        const { dispensaryApplications, advertiserApplications } = await import('../drizzle/schema');
        
        // Get all applications and filter by email (same pattern as sales rep)
        const allDispensaryApps = await db.select().from(dispensaryApplications);
        const allAdvertiserApps = await db.select().from(advertiserApplications);
        
        dispensary = allDispensaryApps.find(app => app.email === ctx.user?.email) || null;
        advertiser = allAdvertiserApps.find(app => app.email === ctx.user?.email) || null;
      }
      
      return { farmer, driver, company, salesRep, dispensary, advertiser };
    }),
    getMyDriverApplication: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getDriverByUserId } = await import('./db');
      return await getDriverByUserId(ctx.user.id);
    }),
    getMyCompanyApplication: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getCompanyByUserId } = await import('./db');
      return await getCompanyByUserId(ctx.user.id);
    }),
    getMySalesApplication: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return null;
      const { getSalesApplicationByUserId } = await import('./db');
      return await getSalesApplicationByUserId(ctx.user.id);
    }),
    
    // Dispensary Applications
    submitDispensaryApplication: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { dispensaryApplications } = await import('../drizzle/schema');
        const [application] = await db.insert(dispensaryApplications).values({
          businessName: input.businessName,
          licenseNumber: input.licenseNumber,
          licenseState: input.licenseState,
          contactName: input.contactName,
          email: input.email,
          phone: input.phone,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          yearsInBusiness: input.yearsInBusiness,
          currentSuppliers: input.currentSuppliers,
          monthlyVolume: input.monthlyVolume,
          targetStrains: input.targetStrains,
          status: "pending",
        });
        return application;
      }),

    getAllDispensaryApplications: protectedProcedure.query(async () => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return [];
      const { dispensaryApplications } = await import('../drizzle/schema');
      return await db.select().from(dispensaryApplications);
    }),

    approveDispensaryApplication: protectedProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { dispensaryApplications } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await db
          .update(dispensaryApplications)
          .set({ status: "approved" })
          .where(eq(dispensaryApplications.id, input.id));
        return { success: true };
      }),

    rejectDispensaryApplication: protectedProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { dispensaryApplications } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await db
          .update(dispensaryApplications)
          .set({ status: "rejected" })
          .where(eq(dispensaryApplications.id, input.id));
        return { success: true };
      }),

    // Advertiser Applications
    submitAdvertiserApplication: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { advertiserApplications } = await import('../drizzle/schema');
        const [application] = await db.insert(advertiserApplications).values({
          companyName: input.companyName,
          contactName: input.contactName,
          email: input.email,
          phone: input.phone,
          website: input.website,
          industry: input.industry,
          tier: input.tier,
          budget: input.budget,
          targetAudience: input.targetAudience,
          campaignGoals: input.campaignGoals,
          adCreativeUrl: input.adCreativeUrl,
          status: "pending",
        });
        return application;
      }),

    getAllAdvertiserApplications: protectedProcedure.query(async () => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) return [];
      const { advertiserApplications } = await import('../drizzle/schema');
      return await db.select().from(advertiserApplications);
    }),

    approveAdvertiserApplication: protectedProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { advertiserApplications } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await db
          .update(advertiserApplications)
          .set({ status: "approved" })
          .where(eq(advertiserApplications.id, input.id));
        return { success: true };
      }),

    rejectAdvertiserApplication: protectedProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { advertiserApplications } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await db
          .update(advertiserApplications)
          .set({ status: "rejected" })
          .where(eq(advertiserApplications.id, input.id));
        return { success: true };
      }),
  }),

  // Farmers
  farmers: router({
    getPendingApplications: publicProcedure.query(async () => {
      const { getAllPendingFarmerProfiles } = await import('./db');
      return await getAllPendingFarmerProfiles();
    }),
    approveApplication: publicProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { approveFarmerProfile, getFarmerProfileById } = await import('./db');
        const farmerProfile = await getFarmerProfileById(input.id);
        await approveFarmerProfile(input.id);
        
        // Send onboarding email
        if (farmerProfile) {
          const { notifyOwner } = await import('./_core/notification');
          // Get user email from users table
          const { getDb } = await import('./db');
          const db = await getDb();
          if (db) {
            const { users } = await import('../drizzle/schema');
            const { eq } = await import('drizzle-orm');
            const [user] = await db.select().from(users).where(eq(users.id, farmerProfile.userId));
            await notifyOwner({
              title: 'Farmer Onboarding - Action Required',
              content: `${farmerProfile.businessName} has been approved! Next steps: 1) Log in to your Farmer Dashboard at /farmer/dashboard 2) Complete your profile with product listings 3) Set up payment information 4) Start selling! Contact: ${user?.email || 'N/A'}`
            });
          }
        }
        
        return { success: true };
      }),
    rejectApplication: publicProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { rejectFarmerProfile } = await import('./db');
        await rejectFarmerProfile(input.id);
        return { success: true };
      }),
  }),

  // Admin Analytics
  admin: router({
    getAnalytics: publicProcedure.query(async () => {
      const { getDb } = await import('./db');
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const { farmerProfiles, drivers, transportationCompanies, salesRepApplications } = await import('../drizzle/schema');
      
      // Get all applications
      const [farmers, allDrivers, companies, salesReps] = await Promise.all([
        db.select().from(farmerProfiles),
        db.select().from(drivers),
        db.select().from(transportationCompanies),
        db.select().from(salesRepApplications),
      ]);
      
      const totalApplications = farmers.length + allDrivers.length + companies.length + salesReps.length;
      
      // Count by status
      const pendingFarmers = farmers.filter(f => f.verified === 'pending').length;
      const pendingDrivers = allDrivers.filter(d => d.status === 'pending_approval').length;
      const pendingCompanies = companies.filter(c => c.status === 'pending_approval').length;
      const pendingSalesReps = salesReps.filter(s => s.status === 'pending_approval').length;
      const pendingApplications = pendingFarmers + pendingDrivers + pendingCompanies + pendingSalesReps;
      
      const approvedFarmers = farmers.filter(f => f.verified === 'approved').length;
      const approvedDrivers = allDrivers.filter(d => d.status === 'active').length;
      const approvedCompanies = companies.filter(c => c.status === 'active').length;
      const approvedSalesReps = salesReps.filter(s => s.status === 'approved').length;
      const approvedApplications = approvedFarmers + approvedDrivers + approvedCompanies + approvedSalesReps;
      
      const rejectedFarmers = farmers.filter(f => f.verified === 'rejected').length;
      const rejectedDrivers = allDrivers.filter(d => d.status === 'inactive').length;
      const rejectedCompanies = companies.filter(c => c.status === 'inactive').length;
      const rejectedSalesReps = salesReps.filter(s => s.status === 'rejected').length;
      const rejectedApplications = rejectedFarmers + rejectedDrivers + rejectedCompanies + rejectedSalesReps;
      
      // Calculate conversion rate
      const conversionRate = totalApplications > 0 
        ? Math.round((approvedApplications / totalApplications) * 100) 
        : 0;
      
      // Calculate average approval time (simplified - using 24 hours as placeholder)
      const avgApprovalTime = 24;
      
      // Get top states
      const stateCount: Record<string, number> = {};
      farmers.forEach(f => {
        stateCount[f.state] = (stateCount[f.state] || 0) + 1;
      });
      allDrivers.forEach(d => {
        if (d.licenseState) {
          stateCount[d.licenseState] = (stateCount[d.licenseState] || 0) + 1;
        }
      });
      companies.forEach(c => {
        if (c.state) {
          stateCount[c.state] = (stateCount[c.state] || 0) + 1;
        }
      });
      
      const topStates = Object.entries(stateCount)
        .map(([state, count]) => ({ state, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        conversionRate,
        avgApprovalTime,
        totalFarmers: farmers.length,
        totalDrivers: allDrivers.length,
        totalCompanies: companies.length,
        totalSalesReps: salesReps.length,
        topStates,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
