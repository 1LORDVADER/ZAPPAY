import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp, Target, Zap, Users, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { NavHeader } from "@/components/NavHeader";

export default function Advertise() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      name: "Micro Ads",
      price: "$150/day",
      annualPrice: "$54,750/year",
      color: "from-blue-500 to-blue-600",
      features: [
        "2 hours daily display time",
        "500K daily impressions",
        "Banner ads (300x250px)",
        "8-12 displays per day",
        "Basic analytics",
        "State-level targeting",
      ],
      roi: "25,000% ROI",
      projectedSales: "$37,500/day in sales",
    },
    {
      name: "Standard Ads",
      price: "$500/day",
      annualPrice: "$182,500/year",
      color: "from-purple-500 to-purple-600",
      features: [
        "6 hours daily display time",
        "2M daily impressions",
        "Banner + carousel ads",
        "20-30 displays per day",
        "Advanced analytics",
        "City-level targeting",
        "A/B testing (2 variants)",
      ],
      roi: "30,000% ROI",
      projectedSales: "$150,000/day in sales",
    },
    {
      name: "Premium Ads",
      price: "$1,500/day",
      annualPrice: "$547,500/year",
      color: "from-orange-500 to-orange-600",
      popular: true,
      features: [
        "12 hours daily display time",
        "5M daily impressions",
        "Homepage hero + search results",
        "40-60 displays per day",
        "Premium analytics dashboard",
        "Multi-state + demographic targeting",
        "Video ads (15-30 seconds)",
        "Priority placement (top 3)",
      ],
      roi: "25,000% ROI",
      projectedSales: "$375,000/day in sales",
    },
    {
      name: "Platinum Ads",
      price: "$5,000/day",
      annualPrice: "$1,825,000/year",
      color: "from-red-500 to-red-600",
      features: [
        "24 hours continuous display",
        "15M daily impressions",
        "Exclusive homepage takeover",
        "100+ displays per day",
        "Enterprise analytics",
        "Dedicated account manager",
        "Custom creative development",
        "Nationwide targeting",
        "Sponsored email campaigns",
      ],
      roi: "22,500% ROI",
      projectedSales: "$1,125,000/day in sales",
    },
    {
      name: "Enterprise Sponsorships",
      price: "$25,000/day",
      annualPrice: "$9,125,000/year",
      color: "from-pink-500 to-pink-600",
      features: [
        "Exclusive category sponsorship",
        "50M monthly impressions",
        "Custom branded landing pages",
        "Email/SMS marketing integration",
        "Mobile app push notifications",
        "Co-branded content",
        "Priority customer support",
        "Quarterly business reviews",
      ],
      roi: "15,000% ROI",
      projectedSales: "$3,750,000/month in sales",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-red-600 text-white hover:bg-red-700">
            <Zap className="mr-2 h-4 w-4" />
            50M+ Monthly Active Users
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Advertise on ZAPPAY
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Reach 50 million cannabis consumers with the highest ROI advertising platform in the industry. 
            <span className="font-semibold text-white"> 25,000%+ ROI guaranteed.</span>
          </p>
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">$2B+</div>
              <div className="text-sm text-blue-200">Annual GMV</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">95%</div>
              <div className="text-sm text-blue-200">Market Share</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">10K+</div>
              <div className="text-sm text-blue-200">Verified Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ZAPPAY Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Advertise on ZAPPAY?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              The only cannabis marketplace with transaction data, closed-loop attribution, and instant ROI tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">High-Intent Users</CardTitle>
                <CardDescription className="text-base">
                  Users come to ZAPPAY to buy, not browse. 8-12% conversion rate vs 1-2% industry average.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Transaction Data</CardTitle>
                <CardDescription className="text-base">
                  We know what users buy, not just what they click. Optimize campaigns based on actual purchases.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-green-500 transition-all">
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Instant Attribution</CardTitle>
                <CardDescription className="text-base">
                  Track ad impression → purchase in real-time. See ROI within hours, not weeks.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Advertising Tiers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From $150/day to $25,000/day. Choose the tier that fits your budget and goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative border-2 transition-all hover:shadow-2xl ${
                  tier.popular ? "border-orange-500 shadow-xl" : "border-slate-200"
                } ${selectedTier === tier.name ? "ring-4 ring-blue-500" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className={`h-16 w-16 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-4xl font-bold text-slate-900 my-2">{tier.price}</div>
                  <div className="text-sm text-slate-600">{tier.annualPrice}</div>
                  <div className="mt-4 space-y-2">
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      {tier.roi}
                    </Badge>
                    <div className="text-sm text-slate-600">{tier.projectedSales}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() => setSelectedTier(tier.name)}
                  >
                    Apply for {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      {selectedTier && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="border-2 border-blue-500">
              <CardHeader>
                <CardTitle className="text-3xl">Apply for {selectedTier}</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and our team will contact you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your Cannabis Brand"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@cannabisbrand.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Business License Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CA-123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Advertising Budget
                    </label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>$5,000 - $15,000</option>
                      <option>$15,000 - $50,000</option>
                      <option>$50,000 - $150,000</option>
                      <option>$150,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Campaign Goals
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your advertising goals and target audience..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Application
                  </Button>

                  <p className="text-sm text-slate-600 text-center">
                    By submitting, you agree to ZAPPAY's advertising terms and conditions.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

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
