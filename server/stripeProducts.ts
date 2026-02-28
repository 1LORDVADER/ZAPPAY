/**
 * ZAPPAY Farmer Subscription Tiers
 * Prices are created dynamically at checkout (no pre-created Stripe Price IDs needed for test mode).
 * In production, create Stripe Products/Prices in the dashboard and replace these with real Price IDs.
 */

export const FARMER_TIERS = {
  premium: {
    name: "Premium",
    description: "For established farms ready to scale",
    monthlyPriceCents: 110000, // $1,100/month
    features: [
      "Unlimited product listings",
      "5.2% platform commission",
      "Priority search placement",
      "Advanced analytics & insights",
      "Featured farmer badge",
      "Email marketing tools",
      "Custom storefront design",
      "24/7 priority support",
      "API access",
    ],
  },
  payAsYouGo: {
    name: "Pay-As-You-Go",
    description: "No upfront cost — fee deducted from earnings",
    monthlyPriceCents: 110000, // $1,100/month deducted from sales
    features: [
      "Unlimited product listings",
      "5.2% + $1,100/mo deducted from sales",
      "No upfront payment required",
      "Priority search placement",
      "Advanced analytics & insights",
      "Featured farmer badge",
      "Email marketing tools",
      "Custom storefront design",
      "24/7 priority support",
    ],
  },
  elite: {
    name: "Elite Grower",
    description: "Maximum value — best ROI anywhere in the world",
    monthlyPriceCents: 299700, // $2,997/month
    features: [
      "Everything in Premium, PLUS:",
      "24/7 monthly ad campaigns (premium placement)",
      "Dedicated account manager",
      "Priority 24/7 live chat support",
      "AI-powered analytics & insights",
      "Top 3 search result placement",
      "Exclusive beta feature access",
      "API access for inventory management",
      "White-label delivery tracking",
      "Quarterly business strategy reviews",
      "Custom marketing materials",
      "Priority dispute resolution",
      "Advanced demand forecasting",
      "Multi-location management",
    ],
  },
} as const;

export type FarmerTierKey = keyof typeof FARMER_TIERS;
