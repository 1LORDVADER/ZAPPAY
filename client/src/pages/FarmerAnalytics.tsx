import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { TrendingUp, DollarSign, Package, Users, ArrowUp, ArrowDown, Loader2, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function FarmerAnalytics() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Fetch farmer's products
  const { data: products = [], isLoading: productsLoading } = trpc.products.myProducts.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Fetch farmer's orders (we'll need to create this procedure)
  const { data: orders = [], isLoading: ordersLoading } = trpc.orders.farmerOrders.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading || productsLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">Please login to view analytics</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalProducts = products.length;
  const activeProducts = products.filter((p: any) => p.stock > 0).length;
  
  // Calculate total revenue from orders
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  
  // Calculate average order value
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Get top selling products
  const productSales = products.map((product: any) => {
    const productOrders = orders.filter((order: any) => 
      order.items?.some((item: any) => item.productId === product.id)
    );
    const totalSold = productOrders.reduce((sum: number, order: any) => {
      const item = order.items?.find((i: any) => i.productId === product.id);
      return sum + (item?.quantity || 0);
    }, 0);
    
    return {
      ...product,
      totalSold,
      revenue: totalSold * product.price
    };
  }).sort((a: any, b: any) => b.totalSold - a.totalSold);

  const topProducts = productSales.slice(0, 5);

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
              <Link href="/farmer/dashboard">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Dashboard
                </a>
              </Link>
              <Link href="/farmer/analytics">
                <a className="text-blue-900 font-medium">
                  Analytics
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Analytics Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Sales Analytics</h1>
            <p className="text-slate-600 text-lg">Track your performance and optimize your pricing strategy</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-2 border-[#c5d0dc] bg-gradient-to-br from-[#E8231A] to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-[#0D1B2A]" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#0D1B2A]">
                  ${(totalRevenue / 100).toFixed(2)}
                </p>
                <p className="text-xs text-slate-600 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-blue-600" />
                  Active Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {activeProducts}/{totalProducts}
                </p>
                <p className="text-xs text-slate-600 mt-1">In stock</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {orders.length}
                </p>
                <p className="text-xs text-slate-600 mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  Avg Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  ${(avgOrderValue / 100).toFixed(2)}
                </p>
                <p className="text-xs text-slate-600 mt-1">Per order</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing strains</CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <div className="space-y-4">
                  {topProducts.map((product: any, index: number) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{product.name}</h3>
                          <p className="text-sm text-slate-600">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{product.totalSold} sold</p>
                        <p className="text-sm text-[#0D1B2A]">${(product.revenue / 100).toFixed(2)} revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">No sales data yet</p>
                  <p className="text-sm text-slate-500">Start selling to see analytics</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Optimization Tips */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle>Live Brokering Insights</CardTitle>
              <CardDescription>Optimize your pricing strategy with dynamic adjustments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <ArrowUp className="h-5 w-5 text-[#0D1B2A] mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">High Demand Products</h3>
                  <p className="text-sm text-slate-600">
                    Consider increasing prices by 5-10% on top sellers to maximize revenue
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ArrowDown className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Slow Moving Inventory</h3>
                  <p className="text-sm text-slate-600">
                    Reduce prices by 10-20% on products with low sales to increase turnover
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Market Timing</h3>
                  <p className="text-sm text-slate-600">
                    Adjust prices during peak hours (evenings/weekends) to capture more demand
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <Link href="/farmer/dashboard">
                  <a>
                    <Button className="w-full">
                      Go to Dashboard to Adjust Prices
                    </Button>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
