import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BarChart3, Shield, DollarSign, TrendingUp, Package, Users, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ForFarmers() {
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
                  src="/logo.png" 
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
                <a className="text-blue-900 font-semibold">
                  For Farmers
                </a>
              </Link>
              <Link href="/for-transporters">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  For Transporters
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  How It Works
                </a>
              </Link>
              {!isAuthenticated ? (
                <Button onClick={() => setLocation("/farmer/register")}>
                  Get Started
                </Button>
              ) : (
                <Button onClick={() => setLocation("/farmer/dashboard")}>
                  Dashboard
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
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 border-green-300 text-lg px-6 py-2">
              For Licensed Cannabis Farmers
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Grow Your Business
              <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Nationwide
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with dispensaries and consumers across America. List your premium cannabis products and reach customers in all legal states.
              <span className="font-semibold text-white block mt-2">Just 5.2% commission — you keep 94.8%</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/farmer/register")}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-8 py-6 shadow-2xl"
              >
                Start Listing Products
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => setLocation("/how-it-works")}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6"
              >
                Learn How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Why Farmers Choose ZAPPAY
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The premier marketplace for licensed cannabis farmers to expand their reach and maximize revenue
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-slate-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Nationwide Reach</CardTitle>
                  <CardDescription className="text-base">
                    Access dispensaries and consumers in all 50+ legal states from a single platform
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Real-Time Analytics</CardTitle>
                  <CardDescription className="text-base">
                    Track sales, monitor trends, and optimize your product offerings with live data
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Built-in Compliance</CardTitle>
                  <CardDescription className="text-base">
                    Automated compliance tools ensure all transactions meet state regulations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-red-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl">Instant Payments</CardTitle>
                  <CardDescription className="text-base">
                    Get paid instantly via ACH when orders are placed — no waiting for payment
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-yellow-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-2xl">Live Brokering</CardTitle>
                  <CardDescription className="text-base">
                    Dynamically adjust prices in real-time to respond to market conditions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-indigo-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl">Pre-Sold Products</CardTitle>
                  <CardDescription className="text-base">
                    Consumers can pre-order specific strains, ensuring your products are sold before harvest
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Pricing Example */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Transparent Pricing Example</CardTitle>
                <CardDescription className="text-base">See exactly how much you keep from each sale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Product Price:</span>
                    <span className="font-semibold">$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State/Local Taxes (12%):</span>
                    <span className="font-semibold">$12.00</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-slate-600">Total Sale:</span>
                    <span className="font-semibold">$120.00</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>ZAPPAY Commission (5.2%):</span>
                    <span className="font-semibold">-$6.24</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 text-green-600 text-xl">
                    <span className="font-bold">You Receive:</span>
                    <span className="font-bold">$114.00</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-4">
                    * Instant ACH payment upon order placement
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join hundreds of licensed farmers already selling on ZAPPAY
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation("/farmer/register")}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-12 py-6"
            >
              Start Listing Products Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
