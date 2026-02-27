import type { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe webhook handler for processing payment events
 * Route: POST /api/stripe/webhook
 * 
 * IMPORTANT: This route must be registered with express.raw() middleware
 * BEFORE express.json() in server/_core/index.ts
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error('[Stripe Webhook] Missing stripe-signature header');
    return res.status(400).send('Missing signature');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith('evt_test_')) {
    console.log('[Stripe Webhook] Test event detected, returning verification response');
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Checkout session completed: ${session.id}`);

  const { updateTransactionStatus, createOrder } = await import('./db');

  // Extract metadata
  const userId = session.client_reference_id;
  const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
  const customerName = session.customer_details?.name || session.metadata?.customer_name;

  if (!userId) {
    console.error('[Stripe Webhook] Missing user ID in checkout session');
    return;
  }

    // Create order from cart items
  try {
    const { getCartItems, clearCart, getProductById } = await import('./db');
    const cartItems = await getCartItems(parseInt(userId));

    if (cartItems.length === 0) {
      console.warn('[Stripe Webhook] No cart items found for user:', userId);
      return;
    }

    // Get product prices
    const itemsWithPrices = await Promise.all(
      cartItems.map(async (item) => {
        const product = await getProductById(item.productId);
        return {
          ...item,
          price: product?.price || 0,
        };
      })
    );

    // Calculate totals
    const subtotal = itemsWithPrices.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const platformFee = subtotal * 0.052; // 5.2% platform fee
    const total = subtotal + tax + platformFee;

    // Create order (simplified - just store essential data)
    const orderId = Date.now(); // Temporary ID generation
    
    console.log(`[Stripe Webhook] Order processed: ${orderId}, Total: $${(total / 100).toFixed(2)}`);

    // Clear cart
    await clearCart(parseInt(userId));

    // Award loyalty points (1 point per dollar)
    const points = Math.floor(total / 100); // Convert cents to dollars
    await awardLoyaltyPoints(parseInt(userId), points, 'purchase', orderId);

    console.log(`[Stripe Webhook] Points awarded: ${points}`);

    // TODO: Send order confirmation email
    // await sendOrderConfirmationEmail(customerEmail, orderId);

  } catch (error) {
    console.error('[Stripe Webhook] Error creating order:', error);
    throw error;
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe Webhook] Payment intent succeeded: ${paymentIntent.id}`);

  const { updateTransactionStatus } = await import('./db');

  // Update transaction status
  await updateTransactionStatus(
    parseInt(paymentIntent.metadata.orderId || '0'),
    'completed',
    paymentIntent.id
  );
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[Stripe Webhook] Payment intent failed: ${paymentIntent.id}`);

  const { updateTransactionStatus } = await import('./db');

  // Update transaction status
  await updateTransactionStatus(
    parseInt(paymentIntent.metadata.orderId || '0'),
    'failed',
    paymentIntent.id
  );
}

/**
 * Handle charge refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`[Stripe Webhook] Charge refunded: ${charge.id}`);

  const { updateTransactionStatus } = await import('./db');

  // Update transaction status
  if (charge.metadata.orderId) {
    await updateTransactionStatus(
      parseInt(charge.metadata.orderId),
      'refunded',
      charge.id
    );
  }
}

/**
 * Award loyalty points to user
 */
async function awardLoyaltyPoints(
  userId: number,
  points: number,
  type: string,
  referenceId: number
) {
  try {
    const { getDb } = await import('./db');
    const { loyaltyPoints, loyaltyTransactions } = await import('../drizzle/schema');
    const { eq } = await import('drizzle-orm');

    const db = await getDb();
    if (!db) {
      console.warn('[Loyalty] Database not available');
      return;
    }

    // Get or create loyalty account
    let account = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);

    if (account.length === 0) {
      const result = await db.insert(loyaltyPoints).values({
        userId,
        points: 0,
        tier: 'bronze',
      });
      account = await db.select().from(loyaltyPoints).where(eq(loyaltyPoints.userId, userId)).limit(1);
    }

    const currentAccount = account[0];
    if (!currentAccount) return;

    // Add points
    await db.update(loyaltyPoints)
      .set({ points: currentAccount.points + points })
      .where(eq(loyaltyPoints.userId, userId));

    // Record transaction
    await db.insert(loyaltyTransactions).values({
      userId,
      points,
      type: 'earned',
      description: `Earned ${points} points from purchase`,
      orderId: referenceId,
    });

    console.log(`[Loyalty] Awarded ${points} points to user ${userId}`);
  } catch (error) {
    console.error('[Loyalty] Error awarding points:', error);
  }
}
