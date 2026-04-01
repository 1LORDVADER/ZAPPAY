import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2, Package, ShoppingCart, TrendingUp, Users, BarChart3,
  Truck, MapPin, Star, Globe, Bell, DollarSign, Leaf, Zap,
  ArrowRight, FileText, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { NavHeader } from '@/components/NavHeader';

const stats = [
  { label: 'Active Orders', value: '38', icon: ShoppingCart, color: 'text-blue-900', bg: 'bg-blue-50' },
  { label: 'Monthly GMV', value: '$312,000', icon: DollarSign, color: 'text-green-700', bg: 'bg-green-50' },
  { label: 'Farmer Partners', value: '27', icon: Leaf, color: 'text-green-800', bg: 'bg-green-50' },
  { label: 'Dispensary Clients', value: '14', icon: Building2, color: 'text-red-600', bg: 'bg-red-50' },
];

const recentOrders = [
  { id: 'WHL-2201', source: 'Green Valley Farms', dest: 'Pacific Dispensary Group', product: 'Blue Dream (Bulk)', qty: '50 lbs', status: 'In Transit', value: '$18,500' },
  { id: 'WHL-2200', source: 'Cascade Cannabis Co.', dest: 'Northwest Retail Chain', product: 'OG Kush Shatter (Bulk)', qty: '2 kg', status: 'Processing', value: '$9,200' },
  { id: 'WHL-2199', source: 'High Desert Farms', dest: 'SoCal Dispensaries LLC', product: 'Sour Diesel Flower', qty: '30 lbs', status: 'Delivered', value: '$12,000' },
  { id: 'WHL-2198', source: 'Pacific Growers LLC', dest: 'Bay Area Retail Group', product: 'Gelato #33 Pre-Rolls', qty: '2,000 units', status: 'Delivered', value: '$7,800' },
];

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-amber-100 text-amber-800',
  'Delivered': 'bg-green-100 text-green-800',
};

const topFarmers = [
  { name: 'Green Valley Farms', state: 'CA', rating: 4.9, volume: '$84k/mo', badge: 'Elite' },
  { name: 'Cascade Cannabis Co.', state: 'OR', rating: 4.8, volume: '$61k/mo', badge: 'Verified' },
  { name: 'Pacific Growers LLC', state: 'WA', rating: 4.7, volume: '$55k/mo', badge: 'Verified' },
  { name: 'High Desert Farms', state: 'NV', rating: 4.6, volume: '$42k/mo', badge: 'Verified' },
];

export default function WholesalerDashboard() {
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
            <Building2 className="h-12 w-12 text-blue-900 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Wholesaler Dashboard</h2>
            <p className="text-slate-500 mb-6">Sign in to access your wholesale management panel.</p>
            <Link href="/wholesaler-waitlist">
              <Button className="bg-blue-900 text-white hover:bg-blue-800 w-full">Join as Wholesaler</Button>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Wholesaler Dashboard</h1>
              <p className="text-sm text-slate-500">Welcome back, {user?.name || 'Partner'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button className="bg-blue-900 text-white hover:bg-blue-800">
                <Package className="h-4 w-4 mr-2" />
                Browse Farmers
              </Button>
            </Link>
            <Link href="/grower-marketplace">
              <Button className="bg-green-700 text-white hover:bg-green-800">
                <Truck className="h-4 w-4 mr-2" />
                Supply Marketplace
              </Button>
            </Link>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white border border-slate-200 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="farmers">Farmer Network</TabsTrigger>
            <TabsTrigger value="dispensaries">Dispensary Clients</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
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
                        <div key={order.id} className="px-6 py-4">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <p className="text-sm font-medium text-slate-900 truncate">{order.product}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-semibold text-green-700">{order.value}</span>
                              <Badge className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{order.source} → {order.dest} · {order.qty}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/">
                      <Button className="w-full bg-blue-900 text-white hover:bg-blue-800 justify-start">
                        <Leaf className="h-4 w-4 mr-2" />
                        Source from Farmers
                      </Button>
                    </Link>
                    <Button className="w-full bg-green-700 text-white hover:bg-green-800 justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Manage Dispensary Clients
                    </Button>
                    <Button className="w-full bg-slate-700 text-white hover:bg-slate-800 justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Invoice
                    </Button>
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700 justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-blue-900 text-white shadow-sm">
                  <CardContent className="pt-5 pb-5">
                    <Zap className="h-6 w-6 text-red-400 mb-3" />
                    <h3 className="font-semibold text-sm mb-1">ZAPPAY Payment Rail</h3>
                    <p className="text-xs text-blue-200 mb-3">
                      Process wholesale transactions instantly. Farmers and dispensaries both benefit from same-day settlement.
                    </p>
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
                <CardTitle className="text-base font-semibold text-slate-900">All Wholesale Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                          <Badge className={`text-xs ${statusColors[order.status]}`}>{order.status}</Badge>
                        </div>
                        <span className="text-sm font-semibold text-green-700">{order.value}</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-1">{order.product} · {order.qty}</p>
                      <p className="text-xs text-slate-500">{order.source} → {order.dest}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Network Tab */}
          <TabsContent value="farmers">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topFarmers.map((farmer) => (
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
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{farmer.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{farmer.state}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" />{farmer.rating}</span>
                    </div>
                    <p className="text-xs font-medium text-green-700 mb-4">{farmer.volume}</p>
                    <Button className="w-full bg-blue-900 text-white hover:bg-blue-800 text-xs">
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Dispensary Clients Tab */}
          <TabsContent value="dispensaries">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="pt-8 pb-8 text-center">
                <Building2 className="h-12 w-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dispensary Client Network</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
                  Manage your dispensary client relationships, track orders, and grow your distribution network through the ZAPPAY platform.
                </p>
                <Button className="bg-blue-900 text-white hover:bg-blue-800">
                  Invite Dispensary Client <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="pt-8 pb-8 text-center">
                <Package className="h-12 w-12 text-blue-900 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Supply & Equipment Marketplace</h3>
                <p className="text-slate-500 mb-2 max-w-md mx-auto text-sm">
                  Source packaging, logistics equipment, storage solutions, and commercial supplies from verified suppliers — all processed through ZAPPAY.
                </p>
                <p className="text-xs text-slate-400 mb-6">Bulk pricing available for wholesaler-tier accounts.</p>
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
                    GMV by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Bulk Flower', pct: 52, color: 'bg-green-600' },
                      { label: 'Concentrates', pct: 24, color: 'bg-blue-900' },
                      { label: 'Pre-Rolls', pct: 14, color: 'bg-amber-600' },
                      { label: 'Edibles', pct: 10, color: 'bg-red-600' },
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
                    <BarChart3 className="h-4 w-4 text-blue-900" />
                    Network Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Avg. Order Value', value: '$8,200' },
                      { label: 'On-Time Delivery Rate', value: '96.4%' },
                      { label: 'Farmer Retention Rate', value: '91%' },
                      { label: 'Dispensary Satisfaction', value: '4.8 / 5.0' },
                      { label: 'ZAPPAY Commission Paid', value: '$16,224/mo' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <span className="text-sm font-semibold text-slate-900">{item.value}</span>
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
