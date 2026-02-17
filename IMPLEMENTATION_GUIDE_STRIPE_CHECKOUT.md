# Stripe Checkout Flow - Complete Implementation Guide

**Estimated Time:** 6 hours  
**Priority:** CRITICAL - Revenue blocker  
**Difficulty:** Medium

---

## Overview

This guide walks you through implementing a complete Stripe checkout flow for ZAPPAY, including:
- Shopping cart functionality
- Stripe Checkout session creation
- Payment success/failure handling
- Order storage in database
- Webhook for payment confirmation
- Order confirmation emails

---

## Prerequisites

### 1. Claim Your Stripe Sandbox (5 minutes)

**CRITICAL:** Your Stripe test sandbox expires on **February 22, 2026**

1. Visit: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2hneGs1UXZSQXYzOENFLDE3NjcxNDUxNjEv100OSHNJWbF
2. Click "Claim Sandbox"
3. Your test keys are already configured in the project:
   - `STRIPE_SECRET_KEY` (server-side)
   - `VITE_STRIPE_PUBLISHABLE_KEY` (client-side)
   - `STRIPE_WEBHOOK_SECRET` (webhook verification)

### 2. Install Stripe SDK (Already Done)

The Stripe SDK is already installed in your project. Verify by checking `package.json`:

```json
{
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

---

## Part 1: Database Schema for Orders (30 minutes)

### Step 1.1: Update Schema

Edit `drizzle/schema.ts` and add the orders table:

```typescript
import { mysqlTable, varchar, int, decimal, timestamp, text, boolean } from "drizzle-orm/mysql-core";

// Add this new table
export const orders = mysqlTable("orders", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  
  // Stripe payment info
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeSessionId: varchar("stripe_session_id", { length: 255 }),
  
  // Order details
  totalAmount: int("total_amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("usd"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, shipped, delivered, cancelled
  
  // Customer info
  customerEmail: varchar("customer_email", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  shippingAddress: text("shipping_address"),
  
  // Items (stored as JSON)
  items: text("items").notNull(), // JSON array of {productId, name, quantity, price}
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  paidAt: timestamp("paid_at"),
});

export const orderItems = mysqlTable("order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull(),
  productId: int("product_id").notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  pricePerUnit: int("price_per_unit").notNull(), // in cents
  totalPrice: int("total_price").notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Step 1.2: Push Schema Changes

```bash
cd /home/ubuntu/zappay-redesigned
pnpm db:push
```

This will create the `orders` and `order_items` tables in your database.

---

## Part 2: Shopping Cart State Management (45 minutes)

### Step 2.1: Create Cart Context

Create `client/src/contexts/CartContext.tsx`:

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: number;
  name: string;
  price: number; // in cents
  quantity: number;
  photo: string;
  thc: string;
  cbd: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number; // in cents
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on init
    const saved = localStorage.getItem("zappay-cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("zappay-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        // Increment quantity
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        // Add new item
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
```

### Step 2.2: Wrap App with CartProvider

Update `client/src/main.tsx`:

```tsx
import { CartProvider } from "@/contexts/CartContext";  // Add this import

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>  {/* Add this wrapper */}
        <App />
      </CartProvider>
    </QueryClientProvider>
  </trpc.Provider>
);
```

### Step 2.3: Add "Add to Cart" Button to Product Detail Page

Update `client/src/pages/ProductDetail.tsx`:

```tsx
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Inside the ProductDetail component:
const { addItem } = useCart();
const { toast } = useToast();

const handleAddToCart = () => {
  if (!product) return;
  
  addItem({
    productId: product.id,
    name: product.name,
    price: product.price, // already in cents
    photo: product.photos[0] || "",
    thc: product.thc || "N/A",
    cbd: product.cbd || "N/A",
  });

  toast({
    title: "Added to cart",
    description: `${product.name} has been added to your cart.`,
  });
};

// Add this button in the product detail UI (replace or add near existing buttons):
<Button
  onClick={handleAddToCart}
  size="lg"
  className="w-full sm:w-auto"
  disabled={product.sold_out}
>
  {product.sold_out ? "Sold Out" : "Add to Cart"}
</Button>
```

### Step 2.4: Update Header Cart Badge

Update `client/src/pages/Home.tsx` (or create a shared Header component):

```tsx
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

// Inside your header:
const { totalItems } = useCart();

<Link href="/cart">
  <Button variant="outline" className="relative">
    <ShoppingCart className="h-5 w-5" />
    {totalItems > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {totalItems}
      </span>
    )}
  </Button>
</Link>
```

---

## Part 3: Cart Page UI (60 minutes)

### Step 3.1: Create Cart Page

Create `client/src/pages/Cart.tsx`:

```tsx
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckout = trpc.checkout.createSession.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    createCheckout.mutate({
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Add some premium cannabis products to get started.
            </p>
            <Link href="/">
              <Button className="w-full">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/zappay-logo.jpeg" alt="ZAPPAY" className="h-10" />
            </Link>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-24 w-24 object-cover rounded-lg"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        THC: {item.thc} | CBD: {item.cbd}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        ${(item.price / 100).toFixed(2)}/gram
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}g
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm font-semibold">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      ${(totalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5.2%)</span>
                    <span className="font-semibold">
                      ${((totalPrice * 0.052) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">
                      ${((totalPrice * 1.052) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 3.2: Add Cart Route

Update `client/src/App.tsx`:

```tsx
import Cart from "@/pages/Cart";

<Switch>
  <Route path="/" component={Home} />
  <Route path="/product/:id" component={ProductDetail} />
  <Route path="/cart" component={Cart} />  {/* Add this */}
  <Route component={NotFound} />
</Switch>
```

---

## Part 4: Backend Checkout Logic (90 minutes)

### Step 4.1: Create Stripe Helper

Create `server/stripe.ts`:

```typescript
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
```

### Step 4.2: Add Checkout Router

Update `server/routers.ts`:

```typescript
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { stripe } from "./stripe";
import { orders, orderItems } from "../drizzle/schema";
import { db } from "./db";

export const appRouter = router({
  // ... existing routes ...

  checkout: router({
    createSession: protectedProcedure
      .input(
        z.object({
          items: z.array(
            z.object({
              productId: z.number(),
              name: z.string(),
              price: z.number(), // in cents
              quantity: z.number(),
            })
          ),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { items } = input;

        // Calculate total
        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const platformFee = Math.round(subtotal * 0.052);
        const total = subtotal + platformFee;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            ...items.map((item) => ({
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${item.name} (${item.quantity}g)`,
                },
                unit_amount: item.price,
              },
              quantity: item.quantity,
            })),
            // Add platform fee as a line item
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Platform Fee (5.2%)",
                },
                unit_amount: platformFee,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${ctx.req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/cart`,
          customer_email: ctx.user.email,
          metadata: {
            userId: ctx.user.id.toString(),
            userName: ctx.user.name || "",
            orderItems: JSON.stringify(items),
          },
        });

        return { url: session.url! };
      }),
  }),
});

export type AppRouter = typeof appRouter;
```

---

## Part 5: Stripe Webhook Handler (90 minutes)

### Step 5.1: Create Webhook Route

Create `server/webhooks/stripe.ts`:

```typescript
import { Request, Response } from "express";
import { stripe } from "../stripe";
import { db } from "../db";
import { orders, orderItems } from "../../drizzle/schema";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    return res.status(400).send("Missing stripe-signature header");
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log("[Webhook] Event type:", event.type);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case "payment_intent.succeeded":
      console.log("[Webhook] Payment succeeded:", event.data.object.id);
      break;

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log("[Webhook] Checkout session completed:", session.id);

  const { userId, userName, orderItems: itemsJson } = session.metadata;
  const items = JSON.parse(itemsJson);

  // Create order in database
  const [order] = await db.insert(orders).values({
    userId: parseInt(userId),
    stripePaymentIntentId: session.payment_intent,
    stripeSessionId: session.id,
    totalAmount: session.amount_total,
    currency: session.currency,
    status: "paid",
    customerEmail: session.customer_email,
    customerName: userName,
    items: itemsJson,
    paidAt: new Date(),
  });

  // Create order items
  for (const item of items) {
    await db.insert(orderItems).values({
      orderId: order.insertId,
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity,
      pricePerUnit: item.price,
      totalPrice: item.price * item.quantity,
    });
  }

  console.log("[Webhook] Order created:", order.insertId);

  // TODO: Send order confirmation email
  // TODO: Notify farmer of new order
}
```

### Step 5.2: Register Webhook Route

Update `server/_core/index.ts`:

```typescript
import express from "express";
import { handleStripeWebhook } from "../webhooks/stripe";

const app = express();

// IMPORTANT: Webhook route MUST come BEFORE express.json() middleware
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Now add the JSON middleware
app.use(express.json());

// ... rest of your routes ...
```

### Step 5.3: Test Webhook Locally

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
# or
curl -s https://packages.stripe.com/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg
```

Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will give you a webhook signing secret. Update your `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Part 6: Success & Cancel Pages (30 minutes)

### Step 6.1: Create Order Success Page

Create `client/src/pages/OrderSuccess.tsx`:

```tsx
import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function OrderSuccess() {
  const [location] = useLocation();
  const { clearCart } = useCart();
  const sessionId = new URLSearchParams(location.split("?")[1]).get("session_id");

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold">Order Confirmed!</h2>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{sessionId?.slice(0, 20)}...</p>
          </div>

          <p className="text-sm text-muted-foreground">
            You'll receive an order confirmation email shortly.
          </p>

          <div className="flex flex-col gap-2">
            <Link href="/orders">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 6.2: Add Routes

Update `client/src/App.tsx`:

```tsx
import OrderSuccess from "@/pages/OrderSuccess";

<Switch>
  <Route path="/" component={Home} />
  <Route path="/product/:id" component={ProductDetail} />
  <Route path="/cart" component={Cart} />
  <Route path="/order/success" component={OrderSuccess} />
  <Route component={NotFound} />
</Switch>
```

---

## Part 7: Testing (60 minutes)

### Test Checklist

#### 1. Add to Cart Flow
- [ ] Click "Add to Cart" on product detail page
- [ ] Toast notification appears
- [ ] Cart badge updates with item count
- [ ] Cart persists after page refresh

#### 2. Cart Page
- [ ] All cart items display correctly
- [ ] Can increase/decrease quantity
- [ ] Can remove items
- [ ] Subtotal and total calculate correctly
- [ ] Platform fee (5.2%) is added

#### 3. Checkout Flow
- [ ] Click "Proceed to Checkout"
- [ ] Redirects to Stripe Checkout page
- [ ] Can enter test card: `4242 4242 4242 4242`
- [ ] Expiry: any future date (e.g., 12/34)
- [ ] CVC: any 3 digits (e.g., 123)
- [ ] ZIP: any 5 digits (e.g., 12345)

#### 4. Payment Success
- [ ] After payment, redirects to success page
- [ ] Cart is cleared
- [ ] Order is saved in database
- [ ] Webhook received and processed

#### 5. Webhook Testing
```bash
# In terminal 1: Start your dev server
pnpm dev

# In terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In terminal 3: Trigger test webhook
stripe trigger checkout.session.completed
```

Check your database:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
SELECT * FROM order_items ORDER BY created_at DESC LIMIT 10;
```

---

## Common Issues & Solutions

### Issue: "No such checkout session"
**Solution:** Ensure you're using the correct Stripe API keys (test mode vs live mode)

### Issue: Webhook signature verification fails
**Solution:** Make sure webhook route uses `express.raw()` middleware, not `express.json()`

### Issue: Order not created in database
**Solution:** Check webhook logs in Stripe Dashboard → Developers → Webhooks

### Issue: Cart doesn't persist
**Solution:** Check browser localStorage is enabled (not in incognito mode)

### Issue: Platform fee calculation wrong
**Solution:** Verify you're calculating on subtotal, not total: `subtotal * 0.052`

---

## Next Steps

1. **Add order history page** (`/orders`) showing user's past orders
2. **Send order confirmation emails** using the notification system
3. **Add shipping address collection** in Stripe Checkout
4. **Implement refund flow** for cancelled orders
5. **Add order tracking** with status updates

---

## Estimated Time Breakdown

- Database schema: 30 minutes
- Cart state management: 45 minutes
- Cart page UI: 60 minutes
- Backend checkout logic: 90 minutes
- Webhook handler: 90 minutes
- Success/cancel pages: 30 minutes
- Testing: 60 minutes

**Total: 6 hours 45 minutes**

---

## Ready to Launch?

Once checkout is working, you're ready to accept real payments! Just switch to live Stripe keys after completing KYC verification.
