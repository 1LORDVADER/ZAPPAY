import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, TrendingUp, Rocket, Crown, Loader2 } from "lucide-react";
import { NavHeader } from "@/components/NavHeader";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

type TierKey = "premium" | "payAsYouGo" | "elite";

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);

  const createSubscription = (trpc as any).payment.createSubscriptionCheckout.useMutation({
    onSuccess: (data: { url: string | null }) => {
      setLoadingTier(null);
      if (data?.url) {
        toast.info("Redirecting to secure checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (err: Error) => {
      setLoadingTier(null);
      toast.error(err.message || "Failed to start checkout. Please try again.");
    },
  });

  const handleSelectTier = (tierKey: TierKey) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLoadingTier(tierKey);
    createSubscription.mutate({ tier: tierKey });
  };

  const tiers: Array<{
    key: TierKey;
    name: string;
    price: string;
    period: string;
    description: string;
    color: string;
    icon: typeof TrendingUp;
    features: { text: string; included: boolean }[];
    cta: string;
    highlight: boolean;
    badge?: string;
  }> = [
    {
      key: "premium",
      name: "Premium",
      price: "$1,100",
      period: "per month",
      description: "For established farms ready to scale",
      color: "from-blue-800 to-blue-900",
      icon: TrendingUp,
      features: [
        { text: "Unlimited product listings", included: true },
        { text: "5.2% platform commission", included: true },
        { text: "Priority search placement", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Featured farmer badge", included: true },
        { text: "Email marketing tools", included: true },
        { text: "Custom storefront design", included: true },
        { text: "24/7 priority support", included: true },
        { text: "API access", included: true },
        { text: "Quarterly business reviews", included: false },
      ],
      cta: "Upgrade to Premium",
      highlight: false,
    },
    {
      key: "payAsYouGo",
      name: "Pay-As-You-Go",
      price: "$1,100",
      period: "paid from fees",
      description: "No upfront cost — pay from your earnings",
      color: "from-green-500 to-green-600",
      icon: Rocket,
      features: [
        { text: "Unlimited product listings", included: true },
        { text: "5.2% + $1,100/mo from sales", included: true },
        { text: "No upfront payment required", included: true },
        { text: "Priority search placement", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Featured farmer badge", included: true },
        { text: "Email marketing tools", included: true },
        { text: "Custom storefront design", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Risk-free growth model", included: true },
      ],
      cta: "Choose Pay-As-You-Go",
      highlight: false,
    },
    {
      key: "elite",
      name: "Elite Grower",
      price: "$2,997",
      period: "per month",
      description: "Maximum value — best ROI anywhere in the world",
      color: "from-red-500 to-red-600",
      icon: Crown,
      features: [
        { text: "Everything in Premium, PLUS:", included: true },
        { text: "24/7 monthly ad campaigns (premium placement)", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Priority 24/7 live chat support", included: true },
        { text: "AI-powered analytics & insights", included: true },
        { text: "Featured farmer badge on all listings", included: true },
        { text: "Top 3 search result placement", included: true },
        { text: "Exclusive beta feature access", included: true },
        { text: "API access for inventory management", included: true },
        { text: "White-label delivery tracking", included: true },
        { text: "Quarterly business strategy reviews", included: true },
        { text: "Custom marketing materials", included: true },
        { text: "Priority dispute resolution", included: true },
        { text: "Advanced demand forecasting", included: true },
        { text: "Multi-location management", included: true },
      ],
      cta: "Get Elite Grower",
      highlight: true,
      badge: "BEST VALUE",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Farmer Pricing Plans
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            ZAPPAY processes payments for your cannabis sales. No upfront costs — all subscription fees are automatically deducted from your processed transaction earnings. List your products and let us handle the payment infrastructure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              No Setup Fees
            </Badge>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              <Check className="mr-2 h-4 w-4" />
              Cancel Anytime
            </Badge>
            <Badge className="bg-blue-800 text-white hover:bg-blue-900">
              <Check className="mr-2 h-4 w-4" />
              5.2% Processing Fee
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Mobile: horizontal scroll; Desktop: 3-column grid */}
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory md:snap-none">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isLoading = loadingTier === tier.key;
              return (
                <Card
                  key={tier.name}
                  className={`relative border-2 transition-all hover:shadow-2xl flex-shrink-0 w-[300px] md:w-auto snap-center ${
                    tier.highlight
                      ? "border-red-500 shadow-xl ring-4 ring-red-200"
                      : "border-slate-200"
                  }`}
                >
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-red-500 text-white px-4 py-1">
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className={`h-16 w-16 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <div className="text-4xl font-bold text-slate-900">{tier.price}</div>
                      <div className="text-sm text-slate-600">{tier.period}</div>
                    </div>
                    <CardDescription className="text-base mt-4">
                      {tier.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? "text-slate-700" : "text-slate-400"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelectTier(tier.key)}
                      disabled={isLoading}
                      className={`w-full ${
                        tier.highlight
                          ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                          : ""
                      }`}
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Opening checkout...
                        </>
                      ) : (
                        tier.cta
                      )}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-xs text-slate-400 text-center mt-2">
                        You'll be asked to log in first
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See exactly what's included in each plan
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-4 text-slate-900 font-semibold">Feature</th>
                  <th className="text-center p-4 text-slate-900 font-semibold">Premium</th>
                  <th className="text-center p-4 text-slate-900 font-semibold">Pay-As-You-Go</th>
                  <th className="text-center p-4 text-blue-800 font-semibold">Elite Grower</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Product Listings", "Unlimited", "Unlimited", "Unlimited"],
                  ["Platform Commission", "5.2%", "5.2% + fees", "5.2%"],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} className="border-b border-slate-100">
                    <td className="p-4 text-slate-700">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="text-center p-4 text-slate-600">{v}</td>
                    ))}
                  </tr>
                ))}
                {[
                  "Priority Search Placement",
                  "Advanced Analytics",
                  "Custom Storefront",
                  "24/7 Support",
                  "Featured Badge",
                  "API Access",
                  "Monthly Ad Campaigns",
                  "Dedicated Account Manager",
                  "Demand Forecasting",
                  "Quarterly Business Reviews",
                ].map((feature, idx) => {
                  const premiumHas = idx < 6;
                  const payGoHas = idx < 6;
                  const eliteHas = true;
                  return (
                    <tr key={feature} className="border-b border-slate-100">
                      <td className="p-4 text-slate-700">{feature}</td>
                      <td className="text-center p-4">
                        {premiumHas ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center p-4">
                        {payGoHas ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center p-4">
                        {eliteHas ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                q: "How does billing work?",
                a: "ZAPPAY charges a 5.2% processing fee on every transaction we facilitate. Your chosen plan's monthly subscription fee is automatically deducted from your processed earnings — no invoices, no upfront payments.",
              },
              {
                q: "Can I change my plan?",
                a: "Yes. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards through our secure Stripe-powered checkout. Promo codes are also supported.",
              },
              {
                q: "Is there a free trial?",
                a: "New farmers receive a 30-day onboarding period to set up their profile and listings before the first billing cycle begins.",
              },
              {
                q: "What is the 5.2% commission for?",
                a: "The 5.2% covers payment processing, compliance tooling, platform infrastructure, and customer support — so you can focus on growing.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
