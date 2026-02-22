import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";

export default function Orders() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
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

  // Mock orders data - replace with real data from tRPC
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-02-20",
      status: "delivered",
      total: 156.50,
      items: [
        { name: "Blue Dream", quantity: "7g", price: 21.00 },
        { name: "OG Kush", quantity: "14g", price: 42.00 },
        { name: "Girl Scout Cookies", quantity: "7g", price: 28.00 }
      ],
      trackingNumber: "ZAP1771799363438"
    },
    {
      id: "ORD-2024-002",
      date: "2024-02-18",
      status: "in_transit",
      total: 89.00,
      items: [
        { name: "Sour Diesel", quantity: "7g", price: 21.00 },
        { name: "Gelato #33", quantity: "7g", price: 28.00 }
      ],
      trackingNumber: "ZAP1771799362976"
    },
    {
      id: "ORD-2024-003",
      date: "2024-02-15",
      status: "processing",
      total: 125.00,
      items: [
        { name: "Wedding Cake", quantity: "14g", price: 56.00 },
        { name: "Runtz", quantity: "7g", price: 30.80 }
      ],
      trackingNumber: null
    }
  ];

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
      processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800 border-yellow-300" }
    };
    const variant = variants[status] || { label: "Unknown", className: "" };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">My Orders</h1>
                <p className="text-blue-200 mt-1">Track your cannabis deliveries</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-200">Logged in as</p>
              <p className="font-semibold">{user.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
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
            {orders.map((order) => (
              <Card key={order.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <CardTitle className="text-xl">{order.id}</CardTitle>
                        <CardDescription>
                          Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
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
                  {/* Order Items */}
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-slate-600 ml-2">({item.quantity})</span>
                        </div>
                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-red-600">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
                      <div>
                        <p className="text-sm text-slate-600">Tracking Number</p>
                        <p className="font-mono font-semibold">{order.trackingNumber}</p>
                      </div>
                      <Link href={`/track/${order.trackingNumber}`}>
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
