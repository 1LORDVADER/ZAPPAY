import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, TrendingUp, Rocket, Crown } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const tiers = [
    {
      name: "Free Trial",
      price: "$0",
      period: "First Year",
      description: "Perfect for getting started with ZAPPAY",
      color: "from-blue-500 to-blue-600",
      icon: Sparkles,
      features: [
        { text: "List up to 10 products", included: true },
        { text: "5.2% platform commission", included: true },
        { text: "Basic product listings", included: true },
        { text: "Standard customer support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Basic analytics dashboard", included: true },
        { text: "Search visibility", included: false },
        { text: "Priority placement", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Dedicated account manager", included: false },
      ],
      cta: "Start Free Trial",
      highlight: false,
    },
    {
      name: "Premium",
      price: "$1,100",
      period: "per month",
      description: "For established farms ready to scale",
      color: "from-purple-500 to-purple-600",
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
      name: "Pay-As-You-Go",
      price: "$1,100",
      period: "paid from fees",
      description: "No upfront cost - pay from your earnings",
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
      name: "Early Adopters",
      price: "$3,379",
      period: "per month",
      description: "Exclusive benefits for the first 20 farmers",
      color: "from-red-500 to-red-600",
      icon: Crown,
      features: [
        { text: "Everything in Premium, PLUS:", included: true },
        { text: "Permanent homepage placement", included: true },
        { text: "Strain mixing feature (5+ grams)", included: true },
        { text: "Demand forecasting AI", included: true },
        { text: "Direct customer messaging", included: true },
        { text: "Custom branded storefront", included: true },
        { text: "Market intelligence reports", included: true },
        { text: "Co-marketing campaigns", included: true },
        { text: "Lifetime pricing lock", included: true },
        { text: "Equity participation option", included: true },
        { text: "3,970% ROI guarantee", included: true },
      ],
      cta: "Claim Early Adopter",
      highlight: true,
      badge: "Only 20 Spots",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3">
              <img src="/zappay-logo.jpeg" alt="ZAPPAY" className="h-12" />
            </a>
          </Link>
          <Link href="/">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[#1e3a5f]">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Farmer Pricing Plans
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Choose the plan that fits your farm's growth stage. All plans include access to 50M+ cannabis consumers.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              <Check className="mr-2 h-4 w-4" />
              No Setup Fees
            </Badge>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              <Check className="mr-2 h-4 w-4" />
              Cancel Anytime
            </Badge>
            <Badge className="bg-purple-600 text-white hover:bg-purple-700">
              <Check className="mr-2 h-4 w-4" />
              5.2% Commission
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.name}
                  className={`relative border-2 transition-all hover:shadow-2xl ${
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
                    <Link href="/farmer/register">
                      <Button
                        className={`w-full ${
                          tier.highlight
                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                            : ""
                        }`}
                        size="lg"
                      >
                        {tier.cta}
                      </Button>
                    </Link>
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
                  <th className="text-center p-4 text-slate-900 font-semibold">Free Trial</th>
                  <th className="text-center p-4 text-slate-900 font-semibold">Premium</th>
                  <th className="text-center p-4 text-slate-900 font-semibold">Pay-As-You-Go</th>
                  <th className="text-center p-4 text-red-600 font-semibold">Early Adopters</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Product Listings</td>
                  <td className="text-center p-4 text-slate-600">Up to 10</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Platform Commission</td>
                  <td className="text-center p-4 text-slate-600">5.2%</td>
                  <td className="text-center p-4 text-slate-600">5.2%</td>
                  <td className="text-center p-4 text-slate-600">5.2% + fees</td>
                  <td className="text-center p-4 text-slate-600">5.2%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Priority Search Placement</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Advanced Analytics</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Custom Storefront</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Permanent Homepage Placement</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Strain Mixing Feature</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Demand Forecasting AI</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Lifetime Pricing Lock</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-700">Equity Participation</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">What's included in the Free Trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  The first year is completely free with up to 10 product listings, full marketplace access, and basic analytics. After the first year, you can choose to upgrade to Premium or Pay-As-You-Go.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">How does Pay-As-You-Go work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Instead of paying $1,100 upfront each month, we deduct the monthly fee from your transaction fees. You only pay when you make sales, making it completely risk-free for growing farms.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">What makes Early Adopters special?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Early Adopters get exclusive features like permanent homepage placement, strain mixing, demand forecasting AI, and lifetime pricing lock. Only 20 spots available with 3,970% ROI guarantee based on market intelligence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Can I switch plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. Early Adopter benefits are locked in permanently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Grow Your Cannabis Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ licensed farmers already selling on ZAPPAY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/farmer/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg px-8 py-6"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2026 ZAPPAY. All rights reserved. | <a href="mailto:Zappay.co@gmail.com" className="hover:text-white">Zappay.co@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
