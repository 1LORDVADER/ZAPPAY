import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { salesRepsRouter } from "./salesRepsRouter";
import { transportationRouter } from "./transportationRouter";
import { salesRouter } from "./salesRouter";
import { publicProcedure, router } from "./_core/trpc";

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
        await updateCartItemQuantity(input.id, input.quantity);
        return { success: true };
      }),
    clear: publicProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user) throw new Error('Not authenticated');
      const { clearCart } = await import('./db');
      await clearCart(ctx.user.id);
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

  // Farmers
  farmers: router({
    getPendingApplications: publicProcedure.query(async () => {
      const { getAllPendingFarmerProfiles } = await import('./db');
      return await getAllPendingFarmerProfiles();
    }),
    approveApplication: publicProcedure
      .input((val: unknown) => val as { id: number })
      .mutation(async ({ input }) => {
        const { approveFarmerProfile } = await import('./db');
        await approveFarmerProfile(input.id);
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
});

export type AppRouter = typeof appRouter;
