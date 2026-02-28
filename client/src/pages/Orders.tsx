import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Loader2 } from "lucide-react";
import { NavHeader } from "@/components/NavHeader";
import { trpc } from "@/lib/trpc";

export default function Orders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: orders = [], isLoading: ordersLoading } = trpc.orders.myOrders.useQuery();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to view your orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Log In
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVolume = orders.reduce((sum: number, order: any) => sum + ((order.total || 0) / 100), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-300" },
      in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-800 border-blue-300" },
      processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      pending: { label: "Pending", className: "bg-slate-100 text-slate-800 border-slate-300" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-300" },
    };
    const variant = variants[status] || { label: status, className: "bg-slate-100 text-slate-800" };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavHeader />
      {/* Page Title Bar */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2744] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link href="/">
                <a className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-2 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Marketplace
                </a>
              </Link>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-blue-200 text-sm mt-0.5">Track your cannabis deliveries</p>
            </div>
            {orders.length > 0 && (
              <div className="bg-white/10 rounded-xl px-5 py-3 text-right border border-white/20">
                <p className="text-xs text-blue-300 uppercase tracking-wide font-medium">Total Transaction Volume</p>
                <p className="text-2xl font-bold text-green-300">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-12">
        {ordersLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader className="text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>
                You haven't placed any orders yet. Browse our products to get started!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order: any) => (
              <Card key={order.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-xl">{order.orderId || `ORD-${order.id}`}</CardTitle>
                        <CardDescription>
                          Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Totals */}
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                    {order.subtotal != null && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span>${(order.subtotal / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {order.tax != null && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax (8%)</span>
                        <span>${(order.tax / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {order.platformFee != null && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Platform Fee (5.2%)</span>
                        <span>${(order.platformFee / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-red-600">
                      ${order.total != null ? (order.total / 100).toFixed(2) : '0.00'}
                    </span>
                  </div>

                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="bg-blue-50 rounded-lg p-3 text-sm">
                      <p className="text-slate-600 font-medium mb-1">Delivery Address</p>
                      <p className="text-slate-800">
                        {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState} {order.deliveryZipCode}
                      </p>
                    </div>
                  )}

                  {/* Track Order */}
                  {order.orderId && (
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                      <div>
                        <p className="text-sm text-slate-600">Order ID</p>
                        <p className="font-mono font-semibold">{order.orderId}</p>
                      </div>
                      <Link href={`/track/${order.orderId}`}>
                        <Button size="sm" variant="outline">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
