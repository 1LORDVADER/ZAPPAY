import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Store, Truck, ShoppingCart, CheckCircle, DollarSign, Shield, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function HowItWorks() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3">
                <img 
                  src="/zappay-logo.jpeg" 
                  alt="ZAPPAY Logo" 
                  className="h-12 w-auto object-contain"
                />
              </a>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Home
                </a>
              </Link>
              <Link href="/for-farmers">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  For Farmers
                </a>
              </Link>
              <Link href="/for-transporters">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  For Transporters
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="text-blue-900 font-semibold">
                  How It Works
                </a>
              </Link>
              {!isAuthenticated ? (
                <Button onClick={() => setLocation("/")}>
                  Browse Products
                </Button>
              ) : (
                <Button onClick={() => setLocation("/")}>
                  Shop Now
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 text-lg px-6 py-2">
              The ZAPPAY Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              How ZAPPAY
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              A seamless, secure, and legal cannabis marketplace connecting farmers, dispensaries, transporters, and consumers nationwide.
              <span className="font-semibold text-white block mt-2">Just 5.2% commission — the lowest in the industry</span>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Simple, Secure, Legal
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Four easy steps connect farmers with consumers across America
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Step 1 */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-transparent relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-green-100">1</div>
                <CardHeader>
                  <div className="h-16 w-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Sprout className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Farmers List Products</CardTitle>
                  <CardDescription className="text-base">
                    Licensed cannabis farmers across America list their premium products on the ZAPPAY marketplace. They set prices, manage inventory, and can dynamically adjust pricing with our live brokering feature.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 2 */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-blue-100">2</div>
                <CardHeader>
                  <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Consumers Browse & Order</CardTitle>
                  <CardDescription className="text-base">
                    Consumers search for specific strains, THC levels, and product types. They can pre-order products before harvest or purchase ready-to-ship inventory. Payment is instant and secure via stablecoin conversion.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 3 */}
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-transparent relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-orange-100">3</div>
                <CardHeader>
                  <div className="h-16 w-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">Licensed Transport</CardTitle>
                  <CardDescription className="text-base">
                    Licensed transporters pick up products from farmers and deliver to dispensaries or directly to consumers (where legal). Real-time GPS tracking ensures security and compliance throughout the journey.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Step 4 */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-transparent relative overflow-hidden">
                <div className="absolute top-4 right-4 text-6xl font-bold text-purple-100">4</div>
                <CardHeader>
                  <div className="h-16 w-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Store className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Pickup at Dispensary</CardTitle>
                  <CardDescription className="text-base">
                    Consumers pick up their orders at verified dispensaries. Dispensaries benefit from increased foot traffic and additional sales opportunities. Everyone wins in the ZAPPAY ecosystem.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Instant Payments</CardTitle>
                  <CardDescription className="text-sm">
                    ACH transfers upon order placement
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-green-500 transition-all">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">5.2% Commission</CardTitle>
                  <CardDescription className="text-sm">
                    Lowest fees in the industry
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Full Compliance</CardTitle>
                  <CardDescription className="text-sm">
                    Built-in regulatory tools
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-red-500 transition-all">
                <CardHeader className="text-center">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">24/7 Tracking</CardTitle>
                  <CardDescription className="text-sm">
                    Real-time GPS monitoring
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Business Models */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Two Ways to Connect
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                ZAPPAY supports multiple transaction models to serve all participants
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Model A */}
              <Card className="border-2 border-blue-200 bg-white">
                <CardHeader>
                  <Badge className="mb-4 bg-blue-100 text-blue-800 w-fit">Model A</Badge>
                  <CardTitle className="text-2xl">Direct Farmer-to-Consumer</CardTitle>
                  <CardDescription className="text-base">
                    Precision matching connects consumers directly with farmers for specific strains and THC levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Consumers search for exact strains and THC percentages</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Pre-order before harvest or buy ready-to-ship products</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Licensed transporters deliver to dispensaries for pickup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Farmers get paid instantly, consumers get exactly what they want</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Model B */}
              <Card className="border-2 border-purple-200 bg-white">
                <CardHeader>
                  <Badge className="mb-4 bg-purple-100 text-purple-800 w-fit">Model B</Badge>
                  <CardTitle className="text-2xl">Dispensary-Facilitated</CardTitle>
                  <CardDescription className="text-base">
                    Drive foot traffic to dispensaries while connecting farmers with consumers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dispensaries list inventory from multiple farmers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Consumers browse and order for dispensary pickup</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Dispensaries benefit from increased foot traffic and sales</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Farmers reach more customers through dispensary partnerships</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join the nation's premier legal cannabis marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/farmer/registration")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-8 py-6"
              >
                I'm a Farmer
              </Button>
              <Button 
                size="lg"
                onClick={() => setLocation("/driver/registration")}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg px-8 py-6"
              >
                I'm a Transporter
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation("/")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-6"
              >
                I'm a Consumer
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
