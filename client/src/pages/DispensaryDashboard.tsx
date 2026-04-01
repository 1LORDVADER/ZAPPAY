import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Store, Package, ShoppingCart, TrendingUp, Users, BarChart3,
  Truck, MapPin, Star, ExternalLink, Bell, CheckCircle, Clock,
  DollarSign, Leaf, Zap, ArrowRight, Globe
} from 'lucide-react';
import { NavHeader } from '@/components/NavHeader';

const stats = [
  { label: 'Active Orders', value: '12', icon: ShoppingCart, color: 'text-blue-900', bg: 'bg-blue-50' },
  { label: 'Monthly Revenue', value: '$48,200', icon: DollarSign, color: 'text-green-700', bg: 'bg-green-50' },
  { label: 'Farmer Partners', value: '8', icon: Leaf, color: 'text-green-800', bg: 'bg-green-50' },
  { label: 'Foot Traffic (mo)', value: '+34%', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
];

const recentOrders = [
  { id: 'ORD-1041', farmer: 'Green Valley Farms', product: 'Blue Dream (AAA)', qty: '5 lbs', status: 'In Transit', eta: 'Today 4pm' },
  { id: 'ORD-1040', farmer: 'Cascade Cannabis Co.', product: 'OG Kush Shatter', qty: '200g', status: 'Processing', eta: 'Tomorrow' },
  { id: 'ORD-1039', farmer: 'Pacific Growers LLC', product: 'Gelato #33 Flower', qty: '3 lbs', status: 'Delivered', eta: 'Completed' },
  { id: 'ORD-1038', farmer: 'High Desert Farms', product: 'Sour Diesel Pre-Rolls', qty: '500 units', status: 'Delivered', eta: 'Completed' },
];

const featuredFarmers = [
  { name: 'Green Valley Farms', state: 'California', rating: 4.9, products: 24, badge: 'Verified', specialty: 'Premium Flower' },
  { name: 'Cascade Cannabis Co.', state: 'Oregon', rating: 4.8, products: 18, badge: 'Elite', specialty: 'Concentrates' },
  { name: 'Pacific Growers LLC', state: 'Washington', rating: 4.7, products: 31, badge: 'Verified', specialty: 'Full Spectrum' },
];

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-amber-100 text-amber-800',
  'Delivered': 'bg-green-100 text-green-800',
};

export default function DispensaryDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 pb-8 text-center">
            <Store className="h-12 w-12 text-blue-900 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Dispensary Dashboard</h2>
            <p className="text-slate-500 mb-6">Sign in to access your dispensary management panel.</p>
            <Link href="/dispensary-application">
              <Button className="bg-blue-900 text-white hover:bg-blue-800 w-full">Apply as Dispensary Partner</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dispensary Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, {user?.name || 'Partner'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/grower-marketplace">
              <Button className="bg-blue-900 text-white hover:bg-blue-800">
                <Package className="h-4 w-4 mr-2" />
                Grower Marketplace
              </Button>
            </Link>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="border border-slate-200 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="farmers">Farmer Network</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-slate-900">Recent Orders</CardTitle>
                      <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-50 text-xs" onClick={() => setActiveTab('orders')}>
                        View All <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{order.product}</p>
                            <p className="text-xs text-slate-500">{order.farmer} · {order.qty}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-slate-400">{order.eta}</span>
                            <Badge className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/grower-marketplace">
                      <Button className="w-full bg-blue-900 text-white hover:bg-blue-800 justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Browse Farmer Products
                      </Button>
                    </Link>
                    <Button className="w-full bg-green-700 text-white hover:bg-green-800 justify-start">
                      <Truck className="h-4 w-4 mr-2" />
                      Schedule Delivery
                    </Button>
                    <Button className="w-full bg-slate-700 text-white hover:bg-slate-800 justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Sales Report
                    </Button>
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700 justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Instant Reorder
                    </Button>
                  </CardContent>
                </Card>

                {/* ZAPPAY Advantage Banner */}
                <Card className="border-0 bg-blue-900 text-white shadow-sm">
                  <CardContent className="pt-5 pb-5">
                    <Zap className="h-6 w-6 text-red-400 mb-3" />
                    <h3 className="font-semibold text-sm mb-1">Instant ACH Payments</h3>
                    <p className="text-xs text-blue-200 mb-3">Your farmers get paid instantly. No net-30, no delays. Powered by ZAPPAY's payment rail.</p>
                    <Badge className="bg-red-600 text-white text-xs">5.2% commission only</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-slate-900">All Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                          <Badge className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-700">{order.product}</p>
                        <p className="text-xs text-slate-500">{order.farmer} · {order.qty} · ETA: {order.eta}</p>
                      </div>
                      <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 flex-shrink-0">
                        Track
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Network Tab */}
          <TabsContent value="farmers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredFarmers.map((farmer) => (
                <Card key={farmer.name} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-green-700" />
                      </div>
                      <Badge className={farmer.badge === 'Elite' ? 'bg-red-600 text-white text-xs' : 'bg-blue-100 text-blue-800 text-xs'}>
                        {farmer.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{farmer.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{farmer.state}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{farmer.rating}</span>
                      <span>{farmer.products} products</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-4">Specialty: {farmer.specialty}</p>
                    <Button className="w-full bg-blue-900 text-white hover:bg-blue-800 text-sm">
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {/* Browse More CTA */}
              <Card className="border-2 border-dashed border-slate-200 shadow-none">
                <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center text-center">
                  <Globe className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm font-medium text-slate-600 mb-1">Browse All Farmers</p>
                  <p className="text-xs text-slate-400 mb-4">Nationwide network of verified cannabis farmers</p>
                  <Link href="/">
                    <Button className="bg-blue-900 text-white hover:bg-blue-800 text-sm">
                      Browse Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="pt-8 pb-8 text-center">
                <Package className="h-12 w-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Grower Supply Marketplace</h3>
                <p className="text-slate-500 mb-2 max-w-md mx-auto text-sm">
                  Access equipment, packaging, display fixtures, and services from verified suppliers — all processed through ZAPPAY's payment rail.
                </p>
                <p className="text-xs text-slate-400 mb-6">Dispensary supplies, display cases, packaging, POS accessories, and more.</p>
                <Link href="/grower-marketplace">
                  <Button className="bg-blue-900 text-white hover:bg-blue-800">
                    Open Marketplace <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-900" />
                    Sales Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Flower', pct: 45, color: 'bg-green-600' },
                      { label: 'Concentrates', pct: 28, color: 'bg-blue-900' },
                      { label: 'Edibles', pct: 17, color: 'bg-amber-600' },
                      { label: 'Pre-Rolls', pct: 10, color: 'bg-red-600' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-700">{item.label}</span>
                          <span className="font-medium text-slate-900">{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-900" />
                    Customer Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'New Customers This Month', value: '+127', positive: true },
                      { label: 'Repeat Purchase Rate', value: '68%', positive: true },
                      { label: 'Avg. Order Value', value: '$84.50', positive: true },
                      { label: 'ZAPPAY-Driven Traffic', value: '+34%', positive: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className={`text-sm font-semibold ${item.positive ? 'text-green-700' : 'text-red-600'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
