import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sprout, Store, Truck, Zap, Shield, TrendingUp, Users, 
  CheckCircle, ArrowRight, Star, MapPin, Clock, BarChart3,
  Leaf, Package, DollarSign, Award, Target, Rocket
} from 'lucide-react'
import OptimizedOnboarding from '../components/OptimizedOnboarding'
import GPSTracking from '../components/GPSTracking'
import AutomatedDispatch from '../components/AutomatedDispatch'

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingType, setOnboardingType] = useState('farmer')

  const handleOnboarding = (type: string) => {
    setOnboardingType(type)
    setShowOnboarding(true)
  }

  if (showOnboarding) {
    return <OptimizedOnboarding initialType={onboardingType} onBack={() => setShowOnboarding(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/zappay-logo.jpeg" 
                alt="ZAPPAY Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#farmers" className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                For Farmers
              </a>
              <a href="#dispensaries" className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                For Dispensaries
              </a>
              <a href="#transportation" className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                Transportation
              </a>
              <a href="#features" className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                Platform Features
              </a>
              <Button 
                onClick={() => handleOnboarding('farmer')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Bold & Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Zap className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">America's Premier Cannabis Marketplace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Connecting Cannabis
              <span className="block bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Farmers with Dispensaries
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              The premier marketplace connecting licensed cannabis farmers with consumers through verified dispensaries. 
              <span className="font-semibold text-white"> Just 5.2% commission</span> — creating a seamless ecosystem that benefits everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => handleOnboarding('farmer')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg px-8 py-6 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all"
              >
                <Sprout className="mr-2 h-5 w-5" />
                Join as Farmer
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => handleOnboarding('dispensary')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6 transition-all"
              >
                <Store className="mr-2 h-5 w-5" />
                Join as Dispensary
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">5.2%</div>
                <div className="text-sm text-blue-200">Commission Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">50+</div>
                <div className="text-sm text-blue-200">Legal States</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2">24/7</div>
                <div className="text-sm text-blue-200">GPS Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Farmers Section */}
      <section id="farmers" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
                <Sprout className="mr-2 h-4 w-4" />
                For Farmers
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Grow Your Cannabis Business Nationwide
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Connect with dispensaries across America and expand your reach while keeping 94.8% of your revenue.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="border-2 border-slate-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Expanded Market Reach</CardTitle>
                  <CardDescription className="text-base">
                    Access dispensaries in all 50+ legal states from a single platform
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Valuable Insights</CardTitle>
                  <CardDescription className="text-base">
                    Track sales, monitor trends, and optimize your product offerings
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Simplified Compliance</CardTitle>
                  <CardDescription className="text-base">
                    Built-in compliance tools ensure all transactions meet state regulations
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Dispensaries Section */}
      <section id="dispensaries" className="py-24 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300">
                <Store className="mr-2 h-4 w-4" />
                For Dispensaries
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Source Premium Cannabis Products
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Connect directly with verified farmers and offer your customers the highest quality products.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-slate-200 hover:border-orange-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-2xl">Diverse Selection</CardTitle>
                  <CardDescription className="text-base">
                    Access hundreds of verified farmers offering premium flower, edibles, and concentrates
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Verified & Compliant</CardTitle>
                  <CardDescription className="text-base">
                    All farmers are licensed and products meet state testing requirements
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl">
                <CardHeader>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Seamless Integration</CardTitle>
                  <CardDescription className="text-base">
                    Easy ordering, real-time inventory, and automated compliance documentation
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation Section */}
      <section id="transportation" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300">
                <Truck className="mr-2 h-4 w-4" />
                Transportation Services
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Legal Cannabis Transportation
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Certified transporters with real-time tracking and automated dispatch. Same 5.2% commission structure.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-2 border-slate-200 hover:border-purple-500 transition-all hover:shadow-xl bg-gradient-to-br from-purple-50 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      View Demo
                    </Button>
                  </div>
                  <CardTitle className="text-2xl">Real-time GPS Tracking</CardTitle>
                  <CardDescription className="text-base mb-4">
                    Monitor every shipment with live location updates and geofencing alerts
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Live vehicle location tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Automated pickup/delivery notifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Route optimization and ETA updates</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200 hover:border-blue-500 transition-all hover:shadow-xl bg-gradient-to-br from-blue-50 to-transparent">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      View Demo
                    </Button>
                  </div>
                  <CardTitle className="text-2xl">Automated Dispatch</CardTitle>
                  <CardDescription className="text-base mb-4">
                    AI-powered matching connects shipments with the best available transporters
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Smart matching based on location & capacity</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Automatic driver notifications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Priority queue management</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <Card className="border-2 border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Transportation Pricing</CardTitle>
                <CardDescription className="text-slate-300">Same transparent commission structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Transportation Fee:</span>
                    <span className="font-semibold">$200.00</span>
                  </div>
                  <div className="flex justify-between text-red-400">
                    <span>ZAPPAY Commission (5.2%):</span>
                    <span className="font-semibold">-$10.40</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-600 pt-3 text-green-400 text-xl">
                    <span className="font-bold">Transporter Receives:</span>
                    <span className="font-bold">$189.60</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-white/10 text-white hover:bg-white/20 border-white/20">
                <Rocket className="mr-2 h-4 w-4" />
                Advanced Platform Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for Scale, Designed for Success
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Three high-impact features that streamline operations for farmers, dispensaries, and transporters.
              </p>
            </div>

            <Tabs defaultValue="onboarding" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20">
                <TabsTrigger value="onboarding" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <Users className="mr-2 h-4 w-4" />
                  Streamlined Onboarding
                </TabsTrigger>
                <TabsTrigger value="tracking" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <MapPin className="mr-2 h-4 w-4" />
                  GPS Tracking
                </TabsTrigger>
                <TabsTrigger value="dispatch" className="data-[state=active]:bg-white data-[state=active]:text-blue-900">
                  <Zap className="mr-2 h-4 w-4" />
                  Smart Dispatch
                </TabsTrigger>
              </TabsList>

              <TabsContent value="onboarding" className="mt-8">
                <Card className="border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">Optimized Onboarding Funnel</CardTitle>
                        <CardDescription className="text-blue-200">Multi-step registration process with real-time validation</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          Key Features
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-400 mt-1" />
                            <span className="text-sm text-blue-100">Multi-step registration (4 steps) with progress indicators</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-400 mt-1" />
                            <span className="text-sm text-blue-100">Support for farmers, dispensaries, and transporters</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-400 mt-1" />
                            <span className="text-sm text-blue-100">Real-time validation and error messaging</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-yellow-400 mt-1" />
                            <span className="text-sm text-blue-100">Document upload functionality with drag-and-drop</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-red-400" />
                          Success Metrics
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <div className="text-3xl font-bold text-green-400 mb-1">+15%</div>
                            <div className="text-sm text-blue-200">Registration completion rate</div>
                          </div>
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <div className="text-3xl font-bold text-blue-400 mb-1">-25%</div>
                            <div className="text-sm text-blue-200">Time to activation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button 
                        onClick={() => handleOnboarding('farmer')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Try Onboarding Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracking" className="mt-8">
                <GPSTracking />
              </TabsContent>

              <TabsContent value="dispatch" className="mt-8">
                <AutomatedDispatch />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join ZAPPAY?
            </h2>
            <p className="text-xl mb-12 text-red-100">
              Start growing your cannabis business today with America's premier marketplace platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => handleOnboarding('farmer')}
                className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-6"
              >
                <Sprout className="mr-2 h-5 w-5" />
                Become a Farmer
              </Button>
              <Button 
                size="lg"
                onClick={() => handleOnboarding('dispensary')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6"
              >
                <Store className="mr-2 h-5 w-5" />
                Become a Dispensary
              </Button>
              <Button 
                size="lg"
                onClick={() => handleOnboarding('transporter')}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-6"
              >
                <Truck className="mr-2 h-5 w-5" />
                Become a Transporter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <img 
                src="/zappay-logo.jpeg" 
                alt="ZAPPAY Logo" 
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-slate-400 text-sm">
                America's premier cannabis marketplace connecting farmers with dispensaries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#farmers" className="block text-slate-400 hover:text-white transition-colors">For Farmers</a>
                <a href="#dispensaries" className="block text-slate-400 hover:text-white transition-colors">For Dispensaries</a>
                <a href="#transportation" className="block text-slate-400 hover:text-white transition-colors">Transportation</a>
                <a href="#features" className="block text-slate-400 hover:text-white transition-colors">Features</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">About Us</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Blog</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Compliance</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Licenses</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2025 ZAPPAY. All rights reserved. Licensed cannabis marketplace platform.
          </div>
        </div>
      </footer>
    </div>
  )
}

