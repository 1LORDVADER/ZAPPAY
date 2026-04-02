import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Package, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { NavHeader } from "@/components/NavHeader";

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: orders, isLoading: ordersLoading } = trpc.orders.myOrders.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

  const totalVolume = (orders ?? []).reduce((sum, order) => sum + (order.total / 100), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
      case "in_transit":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
      case "confirmed":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
      case "refunded":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      delivered: { label: "Delivered", className: "bg-green-100 text-green-800 border-green-300" },
      shipped: { label: "Shipped", className: "bg-blue-100 text-blue-800 border-blue-300" },
      in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-800 border-blue-300" },
      processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      confirmed: { label: "Confirmed", className: "bg-teal-100 text-teal-800 border-teal-300" },
      pending: { label: "Pending", className: "bg-slate-100 text-slate-700 border-slate-300" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-300" },
      refunded: { label: "Refunded", className: "bg-orange-100 text-orange-700 border-orange-300" },
    };
    const variant = variants[status] || { label: status, className: "bg-slate-100 text-slate-700" };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavHeader />

      {/* Page Title Bar */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2744] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLocation("/")}
                className="text-blue-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-blue-200 text-sm mt-0.5">Track your cannabis deliveries</p>
              </div>
            </div>
            {(orders?.length ?? 0) > 0 && (
              <div className="bg-white/10 rounded-xl px-5 py-3 text-right border border-white/20">
                <p className="text-xs text-blue-300 uppercase tracking-wide font-medium">Total Transaction Volume</p>
                <p className="text-2xl font-bold text-green-300">
                  ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-12">
        {!orders || orders.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>
                You haven't placed any orders yet. Browse the marketplace to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/grower-marketplace">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-xl font-mono">{order.orderId}</CardTitle>
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
                  {/* Delivery Address */}
                  {order.deliveryAddress && (
                    <div className="text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-2">
                      <span className="font-medium text-slate-700">Delivery: </span>
                      {order.deliveryAddress}{order.deliveryCity ? `, ${order.deliveryCity}` : ''}{order.deliveryState ? `, ${order.deliveryState}` : ''}{order.deliveryZipCode ? ` ${order.deliveryZipCode}` : ''}
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="space-y-0.5">
                      <p className="text-sm text-slate-500">Subtotal: ${(order.subtotal / 100).toFixed(2)}</p>
                      <p className="text-sm text-slate-500">Platform fee (5.2%): ${(order.platformFee / 100).toFixed(2)}</p>
                      <p className="text-sm text-slate-500">Tax: ${(order.tax / 100).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="text-2xl font-bold text-red-600">${(order.total / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
