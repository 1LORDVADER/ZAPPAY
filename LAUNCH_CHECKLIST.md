# ZAPPAY Launch Checklist

**Last Updated:** February 15, 2026  
**Current Status:** 33 products live, all images working, ratings implemented

---

## ✅ COMPLETED

### Platform Foundation
- [x] 33 premium cannabis strains with AI-generated product photos
- [x] Star ratings (3.8-5.0) on all products
- [x] Product statuses: Ready to Ship, Pre-Order, Being Cultivated, Sold Out
- [x] Fast CDN image delivery
- [x] Responsive product cards with hover effects
- [x] Product detail pages with full strain information
- [x] THC/CBD percentages displayed
- [x] Retail price comparison showing savings
- [x] Clean, professional design
- [x] Mobile-responsive layout
- [x] User authentication system
- [x] Database schema with products, users, orders tables
- [x] GitHub repository setup and synced

---

## 🚨 CRITICAL - MUST COMPLETE BEFORE LAUNCH (26 hours)

### 1. Age Verification Gate (2 hours) - **LEGAL REQUIREMENT**
**Why:** Federal and state law requires age verification before viewing cannabis products  
**What to build:**
- Modal popup on first site visit: "Are you 21 years or older?"
- Two buttons: "Yes, I'm 21+" and "No, I'm under 21"
- Session storage to remember verification
- Redirect to "Sorry, you must be 21+" page if they click No
- Block all product browsing until verified

**Implementation:**
```tsx
// client/src/components/AgeGate.tsx
- Check sessionStorage for 'ageVerified'
- Show modal if not verified
- Store verification in sessionStorage on "Yes" click
- Wrap App.tsx with AgeGate component
```

### 2. Stripe Checkout Flow (6 hours) - **REVENUE BLOCKER**
**Why:** Customers can't actually buy products without payment processing  
**What to build:**
- Cart functionality (add/remove items, update quantities)
- Checkout button creates Stripe session
- Redirect to Stripe hosted checkout
- Success page after payment
- Order confirmation email
- Save order to database with payment_intent_id

**Critical:** Claim your Stripe sandbox before Feb 22, 2026 at https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2hneGs1UXZSQXYzOENFLDE3NjcxNDUxNjEv100OSHNJWbF

**Implementation:**
```typescript
// server/routers.ts - Add checkout procedure
createCheckoutSession: protectedProcedure
  .input(z.object({ items: z.array(...) }))
  .mutation(async ({ input, ctx }) => {
    const session = await stripe.checkout.sessions.create({
      line_items: input.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${ctx.req.headers.origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ctx.req.headers.origin}/cart`,
      customer_email: ctx.user.email,
      metadata: {
        user_id: ctx.user.id,
        order_items: JSON.stringify(input.items),
      },
    });
    return { url: session.url };
  });

// Webhook at /api/stripe/webhook to handle payment_intent.succeeded
```

### 3. Legal Pages (7 hours) - **COMPLIANCE REQUIREMENT**
**Why:** Required by law and Stripe Terms of Service  
**What to build:**
- Terms of Service page
- Privacy Policy page
- Refund/Return Policy page
- Shipping Policy page
- Footer links to all legal pages

**Use templates:**
- Cannabis-specific legal templates from LegalZoom or Rocket Lawyer
- Modify for ZAPPAY's 5.2% commission model
- Include state-by-state compliance language
- Add "Products only available in legal states" disclaimer

### 4. Order Confirmation System (4 hours)
**Why:** Customers need proof of purchase and order tracking  
**What to build:**
- Order confirmation page showing order details
- Email confirmation sent immediately after payment
- "My Orders" page showing order history
- Order status tracking (Processing → Shipped → Delivered)

### 5. Contact/Support Pages (4 hours)
**Why:** Customers and farmers need to reach you  
**What to build:**
- Contact Us page with email form
- FAQ page answering common questions:
  - How does ZAPPAY work?
  - What states do you ship to?
  - How long does delivery take?
  - What if I'm not satisfied?
  - How do farmers join?
- Support email forwarding to F5onellc@gmail.com

### 6. Farmer Onboarding Flow (3 hours)
**Why:** You need farmers to supply products  
**What to build:**
- "Become a Farmer" landing page
- Application form collecting:
  - Business name and license number
  - State(s) of operation
  - Product types (flower, edibles, concentrates)
  - Expected monthly volume
  - Contact information
- Email notification to you when farmer applies
- Approval workflow (manual for now)

---

## 🎯 PHASE 2 - ENHANCE FOR GROWTH (Post-Launch)

### Product Expansion (8 hours)
- [ ] Add 20+ edibles products (gummies, chocolates, baked goods)
- [ ] Add 15+ concentrates (shatter, wax, live resin)
- [ ] Add 10+ pre-roll products
- [ ] Add 15+ vape cartridges
- [ ] Implement product categories filter
- [ ] Add "New Arrivals" section

### Search & Discovery (6 hours)
- [ ] Implement search functionality (by strain name, THC%, price)
- [ ] Add filters: THC range, CBD range, price range, strain type
- [ ] Sort options: Price (low/high), THC% (high/low), Rating, Newest
- [ ] "Featured Products" carousel on homepage
- [ ] "Similar Products" recommendations on detail pages

### User Experience (10 hours)
- [ ] Wishlist/Favorites functionality
- [ ] Product reviews and ratings from verified buyers
- [ ] Strain comparison tool (compare up to 3 strains side-by-side)
- [ ] "Notify me when available" for sold-out products
- [ ] Live chat support widget
- [ ] Mobile app (React Native)

### Farmer Dashboard (12 hours)
- [ ] Farmer portal to manage their products
- [ ] Upload product photos and descriptions
- [ ] Set prices and inventory levels
- [ ] View sales analytics
- [ ] Payout history and tracking
- [ ] Messaging system with customers

### Marketing & Growth (Ongoing)
- [ ] SEO optimization (meta tags, sitemap, schema markup)
- [ ] Blog with cannabis education content
- [ ] Email newsletter signup
- [ ] Referral program (give $10, get $10)
- [ ] Social media integration
- [ ] Google Analytics and conversion tracking

### Advanced Features (20+ hours)
- [ ] Subscription boxes ("Monthly Strain Box")
- [ ] Bulk discounts for larger orders
- [ ] Loyalty points program
- [ ] Live inventory tracking
- [ ] Real-time order tracking with GPS
- [ ] Multi-state tax calculation
- [ ] Automated compliance reporting

---

## 📊 LAUNCH READINESS SCORECARD

| Category | Status | Blocker? |
|----------|--------|----------|
| **Product Catalog** | ✅ 100% | No |
| **User Authentication** | ✅ 100% | No |
| **Age Verification** | ❌ 0% | **YES** |
| **Payment Processing** | ❌ 0% | **YES** |
| **Legal Compliance** | ❌ 0% | **YES** |
| **Order Management** | ❌ 0% | **YES** |
| **Customer Support** | ❌ 0% | No |
| **Farmer Onboarding** | ❌ 0% | No |

**Launch Readiness:** 25% (2/8 categories complete)  
**Estimated Time to Launch:** 26 hours (3-4 days of focused work)

---

## 🚀 RECOMMENDED LAUNCH SEQUENCE

### Week 1 (This Week)
**Monday-Tuesday:** Age gate + Legal pages (9 hours)  
**Wednesday-Thursday:** Stripe checkout flow (6 hours)  
**Friday:** Order confirmation system (4 hours)  
**Weekend:** Contact pages + FAQ (4 hours)

### Week 2
**Monday:** Farmer onboarding flow (3 hours)  
**Tuesday:** Final testing and bug fixes (4 hours)  
**Wednesday:** SOFT LAUNCH to 10-20 beta customers  
**Thursday-Friday:** Gather feedback, fix issues  
**Weekend:** Monitor orders, customer support

### Week 3
**Monday:** PUBLIC LAUNCH + press release  
**Tuesday-Friday:** Customer acquisition campaigns  
**Ongoing:** Add products, onboard farmers, scale

---

## 💰 FUNDRAISING READINESS

### What You Have (Strong Foundation)
✅ Working platform with 33 products  
✅ Professional design and branding  
✅ Competitive pricing (65-75% below retail)  
✅ Unique value proposition (5.2% commission)  
✅ Clear business model (B2B2C marketplace)  
✅ Technical proof of concept

### What You Need Before Pitching
- [ ] 50-100 paying customers (proof of demand)
- [ ] 5-10 farmers onboarded (proof of supply)
- [ ] $5K-10K in GMV (proof of concept)
- [ ] Pitch deck (see FINANCIAL_PROJECTIONS_AND_FUNDRAISING.md)
- [ ] Financial model with actuals (not just projections)
- [ ] 3-minute demo video

**Timeline to Fundraising:** 4-6 weeks after launch  
**Target Raise:** $250K-500K seed round  
**Use of Funds:** Sales team (farmer acquisition), marketing, compliance, engineering

---

## 📈 SUCCESS METRICS TO TRACK

### Week 1 Post-Launch
- 10+ orders placed
- $500+ in GMV
- 2-3 farmers onboarded
- 100+ site visitors

### Month 1 Post-Launch
- 50-100 customers
- $5K-10K in GMV
- 5-10 farmers
- 1,000+ site visitors
- 10-15% conversion rate

### Month 3 (Fundraising Ready)
- 500+ customers
- $50K+ in GMV
- 20-30 farmers
- 10,000+ site visitors
- Positive unit economics

---

## ⚠️ RISKS & MITIGATION

### Legal/Compliance Risks
**Risk:** Operating without proper age verification  
**Mitigation:** Implement age gate immediately (2 hours)

**Risk:** Violating state cannabis laws  
**Mitigation:** Add state-by-state shipping restrictions, legal disclaimers

**Risk:** Payment processor shutdown (Stripe)  
**Mitigation:** Have backup processor ready (Square, PayPal), consider crypto payments

### Operational Risks
**Risk:** No farmers = no products to sell  
**Mitigation:** Manually recruit 5-10 farmers before launch, offer zero fees for first 90 days

**Risk:** Customer acquisition cost too high  
**Mitigation:** Focus on organic/referral growth first, target cannabis communities on Reddit

**Risk:** Logistics/shipping delays  
**Mitigation:** Partner with licensed transporters, set clear delivery expectations

### Financial Risks
**Risk:** Running out of money before product-market fit  
**Mitigation:** Bootstrap to 100 customers, then raise with traction

**Risk:** 5.2% commission too low to be profitable  
**Mitigation:** Model shows profitability at $1M+ GMV/month (see financial projections)

---

## 🎯 NEXT ACTIONS (Start Today)

1. **Claim Stripe sandbox** (5 minutes) - Expires Feb 22!
2. **Build age verification gate** (2 hours) - Legal requirement
3. **Write Terms of Service** (3 hours) - Use template, customize for ZAPPAY
4. **Build Stripe checkout flow** (6 hours) - Revenue blocker
5. **Test end-to-end purchase** (1 hour) - Use test card 4242 4242 4242 4242

**Total Time to MVP:** 12 hours (can finish this weekend)

---

## 📞 SUPPORT

Questions? Email F5onellc@gmail.com or review:
- `PRE_LAUNCH_CHECKLIST.md` - Detailed technical checklist
- `FINANCIAL_PROJECTIONS_AND_FUNDRAISING.md` - Business model and fundraising strategy
- `DISPENSARY_RESEARCH.md` - Competitor analysis

**You're 26 hours away from launch. Let's ship it.** 🚀
