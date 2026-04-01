import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package, Globe, MapPin, ExternalLink, Instagram, Facebook,
  Twitter, Linkedin, Youtube, Plus, Edit, BarChart3, Users,
  ShoppingCart, TrendingUp, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SupplierDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  // In a full implementation, this would fetch the supplier profile linked to the user
  // For now, we show the pending/approved state based on application status
  const { data: applications } = trpc.applications.getMyApplications.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl border-0">
          <CardContent className="pt-10 pb-8 px-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Sign In Required</h2>
            <p className="text-slate-500 mb-6">Please sign in to access your Supplier Dashboard.</p>
            <Link href="/">
              <Button className="bg-blue-900 text-white hover:bg-blue-800 w-full">Sign In with ZAPPAY</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Placeholder dashboard — shows what the supplier dashboard will look like
  // once a supplier is approved and linked to a user account
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Supplier Dashboard</h1>
            <p className="text-blue-100 mt-1">Manage your brand page, product listings, and orders</p>
          </div>
          <div className="flex gap-3">
            <Link href="/grower-marketplace">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-900">
                View Marketplace
              </Button>
            </Link>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Application Status Banner */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Application Under Review</h3>
            <p className="text-amber-700 text-sm mt-1">
              Your supplier application has been submitted and is currently under review by the ZAPPAY team. You will receive an email at <strong>{user?.email}</strong> within 2–3 business days once approved.
            </p>
            <p className="text-amber-600 text-sm mt-2">
              Once approved, you will have full access to list products, manage your brand page, view orders, and process payments through ZAPPAY.
            </p>
          </div>
        </div>

        {/* Stats Preview (locked until approved) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: '—', icon: Package, color: 'bg-blue-100 text-blue-900' },
            { label: 'Monthly Views', value: '—', icon: BarChart3, color: 'bg-green-100 text-green-800' },
            { label: 'Total Orders', value: '—', icon: ShoppingCart, color: 'bg-orange-100 text-orange-800' },
            { label: 'Revenue (MTD)', value: '—', icon: TrendingUp, color: 'bg-red-100 text-red-800' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="border-0 shadow-md opacity-60">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-2xl font-bold text-slate-400">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Brand Page */}
          <Card className="border-0 shadow-md opacity-70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-blue-900" />
                </div>
                <CardTitle className="text-base">Brand Page</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Your public brand page with logo, description, social media links, and product listings. Visible to all ZAPPAY users.
              </p>
              <div className="flex gap-2 flex-wrap">
                {[Instagram, Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <div key={i} className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </div>
              <Button disabled className="w-full mt-4 bg-slate-200 text-slate-500 cursor-not-allowed text-sm">
                Edit Brand Page (Pending Approval)
              </Button>
            </CardContent>
          </Card>

          {/* Product Listings */}
          <Card className="border-0 shadow-md opacity-70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-700" />
                </div>
                <CardTitle className="text-base">Product Listings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Add products and services with photos, unit pricing, minimum order quantities, and local pickup availability.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 mb-4">
                <li>• Single unit pricing for all product types</li>
                <li>• Local pickup and nationwide shipping options</li>
                <li>• Product photos and detailed descriptions</li>
                <li>• Real-time inventory management</li>
              </ul>
              <Button disabled className="w-full bg-slate-200 text-slate-500 cursor-not-allowed text-sm">
                Manage Products (Pending Approval)
              </Button>
            </CardContent>
          </Card>

          {/* CRM & Orders */}
          <Card className="border-0 shadow-md opacity-70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-700" />
                </div>
                <CardTitle className="text-base">CRM & Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Manage customer relationships, track orders, and process payments through the ZAPPAY payment railway.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 mb-4">
                <li>• Order management and fulfillment tracking</li>
                <li>• Customer contact history</li>
                <li>• ZAPPAY payment processing integration</li>
                <li>• Revenue analytics and reporting</li>
              </ul>
              <Button disabled className="w-full bg-slate-200 text-slate-500 cursor-not-allowed text-sm">
                View Orders (Pending Approval)
              </Button>
            </CardContent>
          </Card>

          {/* Advertising */}
          <Card className="border-0 shadow-md opacity-70">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-red-700" />
                </div>
                <CardTitle className="text-base">Advertising</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Advertise directly to ZAPPAY's network of licensed growers, dispensaries, and wholesalers. Highly targeted and cost-effective.
              </p>
              <ul className="text-xs text-slate-400 space-y-1 mb-4">
                <li>• Featured placement in Grower Marketplace</li>
                <li>• Banner ads on the Browse and Home pages</li>
                <li>• Targeted by state, license type, and category</li>
              </ul>
              <Link href="/advertise">
                <Button className="w-full bg-blue-900 text-white hover:bg-blue-800 text-sm">
                  Learn About Advertising
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment Processing */}
          <Card className="border-0 shadow-md opacity-70 md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-slate-700" />
                </div>
                <CardTitle className="text-base">ZAPPAY Payment Processing</CardTitle>
                <Badge className="bg-green-100 text-green-800 border-0 ml-auto">Included</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                All transactions on the ZAPPAY platform are processed through the ZAPPAY payment railway — giving your customers a seamless, secure checkout experience and giving you instant settlement.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Instant Settlement', icon: CheckCircle },
                  { label: 'Fraud Protection', icon: CheckCircle },
                  { label: 'Compliance Built-In', icon: CheckCircle },
                  { label: 'Multi-State Support', icon: CheckCircle },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-blue-900 rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Application Review', desc: 'Our team reviews your application within 2–3 business days. We may reach out for additional information.' },
              { step: '2', title: 'Account Activation', desc: 'Once approved, you receive an email with your Supplier Dashboard credentials and onboarding guide.' },
              { step: '3', title: 'Go Live', desc: 'Upload your logo, add your first products, and start reaching thousands of buyers on the ZAPPAY network.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-blue-100 text-sm">
              Questions? Contact us at{' '}
              <a href="mailto:hello@zappayus.co" className="text-white underline">hello@zappayus.co</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
