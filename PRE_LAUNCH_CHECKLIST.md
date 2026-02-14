# ZAPPAY Pre-Launch Checklist

## Status: 🟡 IN PROGRESS
**Target Launch Date:** Monday, February 17, 2026 (4 days)

---

## ✅ COMPLETED

### Platform Foundation
- [x] Full-stack e-commerce website built (React + tRPC + TiDB)
- [x] 62+ products seeded across 5 categories
- [x] Product detail pages with add-to-cart
- [x] Shopping cart functionality
- [x] User authentication (Manus OAuth)
- [x] Database schema with 9 tables
- [x] 8 demo farmers seeded
- [x] Stripe integration initialized
- [x] Per-gram pricing display
- [x] CDN image delivery (fast loading)
- [x] Duplicate products removed
- [x] Image aspect ratios fixed
- [x] Mobile-responsive design
- [x] Navy blue branding (#1e3a5f)

---

## 🔴 CRITICAL BLOCKERS (Must Fix Before Launch)

### Legal & Compliance
- [ ] **Age gate (21+ verification)** - REQUIRED BY LAW
  - Add modal on site entry
  - "Are you 21 or older?" Yes/No
  - Store consent in session
  - Block access if No
  - **Time:** 2 hours
  
- [ ] **Terms of Service page**
  - Cannabis-specific legal disclaimers
  - State-by-state compliance notes
  - Liability limitations
  - **Time:** 4 hours (use template + legal review)
  
- [ ] **Privacy Policy page**
  - GDPR/CCPA compliant
  - Data collection disclosure
  - Cookie policy
  - **Time:** 3 hours (use template)

### Payment Processing
- [ ] **Complete Stripe checkout flow**
  - Test card payments (4242 4242 4242 4242)
  - Order confirmation page
  - Payment success/failure handling
  - **Time:** 6 hours
  
- [ ] **Claim Stripe sandbox account**
  - URL: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2hneGs1UXZSQXYzOENFLDE3NjcxNDUxNjEv100OSHNJWbF
  - Expires: 2026-02-22
  - **Time:** 30 minutes
  
- [ ] **Order confirmation emails**
  - Customer receipt
  - Farmer notification
  - Order details + tracking
  - **Time:** 4 hours

### Core Features
- [ ] **Farmer dashboard**
  - Product management (add/edit/delete)
  - Inventory tracking
  - Order notifications
  - Sales analytics
  - **Time:** 12 hours
  
- [ ] **Order management system**
  - Order status tracking
  - Farmer fulfillment workflow
  - Customer order history page
  - **Time:** 8 hours

---

## 🟡 HIGH PRIORITY (Needed for Professional Launch)

### User Experience
- [ ] **Sticky navigation header**
  - Always visible while scrolling
  - **Time:** 1 hour
  
- [ ] **Advanced product filtering**
  - Filter by: THC%, price range, strain type, effects
  - Sort by: price, popularity, THC%
  - **Time:** 6 hours
  
- [ ] **Search improvements**
  - Search by strain name, effects, THC%
  - Autocomplete suggestions
  - **Time:** 4 hours
  
- [ ] **Product image zoom**
  - Hover to zoom on desktop
  - Tap to zoom on mobile
  - **Time:** 3 hours

### Trust & Credibility
- [ ] **Customer reviews system**
  - Star ratings
  - Written reviews
  - Verified purchase badges
  - **Time:** 8 hours
  
- [ ] **Farmer verification badges**
  - "Licensed & Verified" badge
  - State license display
  - **Time:** 3 hours
  
- [ ] **Security badges at checkout**
  - SSL certificate display
  - "Secure Payment" badges
  - **Time:** 1 hour

### Content
- [ ] **FAQ page**
  - How ZAPPAY works
  - Pricing explanation
  - Delivery/pickup process
  - Legal compliance
  - **Time:** 4 hours
  
- [ ] **About page**
  - Mission statement
  - How we're different
  - Team (optional)
  - **Time:** 3 hours
  
- [ ] **Contact/Support page**
  - Contact form
  - Email address
  - Response time expectations
  - **Time:** 2 hours

---

## 🟢 NICE TO HAVE (Post-Launch)

### Marketing
- [ ] Educational blog
- [ ] Strain guides
- [ ] Cannabis 101 content
- [ ] SEO optimization

### Features
- [ ] Live chat support
- [ ] Loyalty program
- [ ] Referral system
- [ ] Mobile app
- [ ] Real-time GPS tracking
- [ ] Subscription tiers for farmers

---

## 📊 TECHNICAL DEBT

### Code Quality
- [ ] Write unit tests for critical flows
- [ ] Fix ProductDetail.tsx syntax error (line 201)
- [ ] Add error boundaries
- [ ] Implement proper error logging

### Performance
- [ ] Add skeleton loading states
- [ ] Implement image preloading
- [ ] Optimize bundle size
- [ ] Add service worker for PWA

### Security
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all forms
- [ ] SQL injection prevention audit
- [ ] XSS protection review

---

## 🚀 LAUNCH READINESS SCORE

**Current: 45% Ready**

| Category | Status | Completion |
|----------|--------|------------|
| Legal Compliance | 🔴 Critical | 0% |
| Payment Processing | 🔴 Critical | 30% |
| Core Features | 🟡 In Progress | 60% |
| User Experience | 🟡 In Progress | 40% |
| Trust Signals | 🟡 In Progress | 20% |
| Content Pages | 🔴 Critical | 0% |

**Estimated Time to Launch:** 60-80 hours of development

---

## MINIMUM VIABLE LAUNCH (MVP)

To launch by Monday (Feb 17), focus ONLY on:

1. ✅ Age gate (2 hours)
2. ✅ Complete Stripe checkout (6 hours)
3. ✅ Terms of Service (4 hours)
4. ✅ Privacy Policy (3 hours)
5. ✅ Order confirmation emails (4 hours)
6. ✅ FAQ page (4 hours)
7. ✅ Contact page (2 hours)
8. ✅ Fix ProductDetail.tsx error (1 hour)

**Total MVP Time: 26 hours (3-4 days)**

Everything else can be added post-launch.

---

## LAUNCH DAY CHECKLIST

### Pre-Launch (Day Before)
- [ ] Test all user flows end-to-end
- [ ] Test on mobile devices (iOS + Android)
- [ ] Test checkout with real Stripe test cards
- [ ] Verify all links work
- [ ] Check all images load
- [ ] Test age gate on all pages
- [ ] Backup database
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (Google Analytics)

### Launch Day
- [ ] Switch Stripe to live mode
- [ ] Update environment variables
- [ ] Deploy to production
- [ ] Test live checkout with $1 transaction
- [ ] Monitor error logs
- [ ] Monitor server performance
- [ ] Have rollback plan ready

### Post-Launch (First Week)
- [ ] Monitor user feedback
- [ ] Fix critical bugs immediately
- [ ] Track conversion rates
- [ ] Optimize based on analytics
- [ ] Respond to support inquiries within 24 hours

---

## NOTES

**Current Blockers:**
1. No age gate = illegal to operate
2. Incomplete checkout = can't process payments
3. No legal pages = liability risk
4. No farmer dashboard = can't onboard farmers

**Quick Wins:**
1. Age gate can be built in 2 hours
2. Legal pages can use templates
3. Stripe checkout is 70% done
4. Design is already professional

**Recommendation:**
Focus on MVP checklist above. Launch with basic features, then iterate based on real user feedback. Better to launch imperfect and improve than wait for perfection.
