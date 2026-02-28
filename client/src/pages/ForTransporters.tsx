import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, DollarSign, Shield, TrendingUp, Zap, Package } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function ForTransporters() {
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
                <a className="text-blue-900 font-semibold">
                  For Transporters
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  How It Works
                </a>
              </Link>
              {!isAuthenticated ? (
                <Button onClick={() => setLocation("/driver/registration")}>
                  Get Started
                </Button>
              ) : (
                <Button onClick={() => setLocation("/")}>
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
            <Badge className="mb-6 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300 text-lg px-6 py-2">
              For Licensed Cannabis Transporters
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Drive Revenue
              <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Nationwide
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join the premier cannabis logistics network. Connect with farmers and dispensaries across America for consistent, legal, and profitable delivery opportunities.
              <span className="font-semibold text-white block mt-2">Earn competitive rates + 24/7 GPS tracking</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => setLocation("/driver/registration")}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg px-8 py-6 shadow-2xl"
              >
                Start Transporting
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
                Why Transporters Choose ZAPPAY
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The most reliable and profitable cannabis logistics platform in America
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-slate-200 hover:border-orange-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">Consistent Work</CardTitle>
                  <CardDescription className="text-base">
                    Access a steady stream of delivery requests from verified farmers and dispensaries
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Instant Payments</CardTitle>
                  <CardDescription className="text-base">
                    Get paid immediately upon delivery completion via instant ACH transfer
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">24/7 GPS Tracking</CardTitle>
                  <CardDescription className="text-base">
                    Real-time tracking and route optimization for maximum efficiency and safety
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Full Compliance</CardTitle>
                  <CardDescription className="text-base">
                    Built-in compliance tools ensure all deliveries meet state and federal regulations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-red-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle className="text-2xl">Flexible Schedule</CardTitle>
                  <CardDescription className="text-base">
                    Choose your own routes and delivery times — work when and where you want
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-indigo-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-2xl">Interstate Commerce</CardTitle>
                  <CardDescription className="text-base">
                    Opportunity to transport across state lines as regulations evolve
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Requirements */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl">Transporter Requirements</CardTitle>
                <CardDescription className="text-base">What you need to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
                    <span>Valid state-issued cannabis transportation license</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
                    <span>Commercial driver's license (CDL) or equivalent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
                    <span>Insured vehicle meeting state requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
                    <span>Clean background check and driving record</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800 mt-1">✓</Badge>
                    <span>GPS-enabled smartphone for real-time tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join the nation's premier cannabis logistics network today
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation("/driver/registration")}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg px-12 py-6"
            >
              Apply Now as a Transporter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
