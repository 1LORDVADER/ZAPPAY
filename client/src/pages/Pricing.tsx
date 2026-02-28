import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, TrendingUp, Rocket, Crown } from "lucide-react";
import { Link } from "wouter";
import { NavHeader } from "@/components/NavHeader";

export default function Pricing() {
  const tiers = [
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
      name: "Elite Grower",
      price: "$2,997",
      period: "per month",
      description: "Maximum value - Best ROI anywhere in the world",
      color: "from-purple-500 to-purple-600",
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
                  <th className="text-center p-4 text-slate-900 font-semibold">Premium</th>
                  <th className="text-center p-4 text-slate-900 font-semibold">Pay-As-You-Go</th>
                  <th className="text-center p-4 text-purple-600 font-semibold">Elite Grower</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Product Listings</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                  <td className="text-center p-4 text-slate-600">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Platform Commission</td>
                  <td className="text-center p-4 text-slate-600">5.2%</td>
                  <td className="text-center p-4 text-slate-600">5.2% + fees</td>
                  <td className="text-center p-4 text-slate-600">5.2%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Priority Search Placement</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Advanced Analytics</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Custom Storefront</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">24/7 Ad Campaigns</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Dedicated Account Manager</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Advanced Demand Forecasting</td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><X className="h-5 w-5 text-slate-300 mx-auto" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-4 text-slate-700">Priority 24/7 Support</td>
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
                <CardTitle className="text-xl">How does ZAPPAY pricing work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  ZAPPAY charges a 5.2% processing fee on every transaction we facilitate for your business. On top of that, your chosen plan's monthly subscription fee is automatically deducted from your processed earnings — no invoices, no upfront payments. You keep the rest.
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
                <CardTitle className="text-xl">What makes Elite Grower the best value?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Elite Grower includes monthly 24/7 ad campaigns, a dedicated account manager, AI-powered demand forecasting, top-3 search placement, and continuously engineered platform features — all designed to maximize your transaction volume. It is priced to deliver the most advantages per dollar of any cannabis payment processing plan available anywhere in the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl">Can I switch plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle, and your subscription fee adjustment is reflected in the following month's deductions from your transaction earnings.
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
            Ready to Start Processing Payments?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join licensed farmers already processing transactions through ZAPPAY
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/farmer/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg px-8 py-6"
              >
                Apply as a Farmer
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
