import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { NavHeader } from "@/components/NavHeader";

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

  // Mock orders data showing $333k+ in recent transactions
  const orders = [
    {
      id: "ORD-2026-147",
      date: "2026-02-23",
      status: "delivered",
      total: 8450.00,
      items: [
        { name: "Sour Diesel (Premium)", quantity: "500g", price: 1500.00 },
        { name: "OG Kush (Top Shelf)", quantity: "1000g", price: 3000.00 },
        { name: "Girl Scout Cookies", quantity: "500g", price: 1650.00 },
        { name: "Wedding Cake", quantity: "750g", price: 2300.00 }
      ],
      trackingNumber: "ZAP2026147A"
    },
    {
      id: "ORD-2026-146",
      date: "2026-02-22",
      status: "delivered",
      total: 12750.00,
      items: [
        { name: "Sour Diesel (Bulk)", quantity: "1500g", price: 4500.00 },
        { name: "Gelato #33 (Premium)", quantity: "1000g", price: 3500.00 },
        { name: "Runtz (Limited Edition)", quantity: "750g", price: 2850.00 },
        { name: "Purple Haze", quantity: "500g", price: 1900.00 }
      ],
      trackingNumber: "ZAP2026146B"
    },
    {
      id: "ORD-2026-145",
      date: "2026-02-21",
      status: "in_transit",
      total: 15200.00,
      items: [
        { name: "Gorilla Glue #4 (Wholesale)", quantity: "2000g", price: 6000.00 },
        { name: "Zkittlez (Premium)", quantity: "1000g", price: 3800.00 },
        { name: "Sunset Sherbet", quantity: "1000g", price: 3400.00 },
        { name: "Jack Herer", quantity: "500g", price: 2000.00 }
      ],
      trackingNumber: "ZAP2026145C"
    },
    {
      id: "ORD-2026-144",
      date: "2026-02-20",
      status: "delivered",
      total: 9850.00,
      items: [
        { name: "White Widow (Classic)", quantity: "1000g", price: 3200.00 },
        { name: "Northern Lights", quantity: "750g", price: 2550.00 },
        { name: "AK-47", quantity: "1000g", price: 3100.00 },
        { name: "Pineapple Express", quantity: "250g", price: 1000.00 }
      ],
      trackingNumber: "ZAP2026144D"
    },
    {
      id: "ORD-2026-143",
      date: "2026-02-19",
      status: "delivered",
      total: 18500.00,
      items: [
        { name: "Granddaddy Purple (Bulk)", quantity: "2500g", price: 7500.00 },
        { name: "Durban Poison", quantity: "1500g", price: 5250.00 },
        { name: "Strawberry Cough", quantity: "1000g", price: 3750.00 },
        { name: "Lemon Haze", quantity: "500g", price: 2000.00 }
      ],
      trackingNumber: "ZAP2026143E"
    },
    {
      id: "ORD-2026-142",
      date: "2026-02-18",
      status: "delivered",
      total: 22400.00,
      items: [
        { name: "Chemdawg (Premium)", quantity: "3000g", price: 9000.00 },
        { name: "Trainwreck", quantity: "2000g", price: 6800.00 },
        { name: "Super Silver Haze", quantity: "1500g", price: 5100.00 },
        { name: "Bubba Kush", quantity: "350g", price: 1500.00 }
      ],
      trackingNumber: "ZAP2026142F"
    },
    {
      id: "ORD-2026-141",
      date: "2026-02-17",
      status: "delivered",
      total: 16800.00,
      items: [
        { name: "Green Crack (Wholesale)", quantity: "2000g", price: 6400.00 },
        { name: "Maui Wowie", quantity: "1500g", price: 5100.00 },
        { name: "Blueberry Kush", quantity: "1000g", price: 3600.00 },
        { name: "Tangie", quantity: "425g", price: 1700.00 }
      ],
      trackingNumber: "ZAP2026141G"
    },
    {
      id: "ORD-2026-140",
      date: "2026-02-16",
      status: "delivered",
      total: 28900.00,
      items: [
        { name: "Cookies & Cream (Bulk)", quantity: "4000g", price: 12000.00 },
        { name: "Mimosa (Premium)", quantity: "2500g", price: 8750.00 },
        { name: "Do-Si-Dos", quantity: "2000g", price: 6900.00 },
        { name: "Forbidden Fruit", quantity: "300g", price: 1250.00 }
      ],
      trackingNumber: "ZAP2026140H"
    },
    {
      id: "ORD-2026-139",
      date: "2026-02-15",
      status: "delivered",
      total: 19650.00,
      items: [
        { name: "Gelato #41 (Limited)", quantity: "2500g", price: 8750.00 },
        { name: "Biscotti", quantity: "1500g", price: 5400.00 },
        { name: "Cereal Milk", quantity: "1000g", price: 3800.00 },
        { name: "Apples & Bananas", quantity: "400g", price: 1700.00 }
      ],
      trackingNumber: "ZAP2026139I"
    },
    {
      id: "ORD-2026-138",
      date: "2026-02-14",
      status: "delivered",
      total: 31200.00,
      items: [
        { name: "Permanent Marker (Wholesale)", quantity: "4500g", price: 13500.00 },
        { name: "Jealousy (Premium)", quantity: "3000g", price: 10500.00 },
        { name: "Gushers", quantity: "1500g", price: 5400.00 },
        { name: "Pink Rozay", quantity: "450g", price: 1800.00 }
      ],
      trackingNumber: "ZAP2026138J"
    },
    {
      id: "ORD-2026-137",
      date: "2026-02-13",
      status: "delivered",
      total: 24750.00,
      items: [
        { name: "Slurricane (Bulk)", quantity: "3500g", price: 10500.00 },
        { name: "Motorbreath", quantity: "2000g", price: 7000.00 },
        { name: "Tropicana Cookies", quantity: "1500g", price: 5250.00 },
        { name: "London Pound Cake", quantity: "500g", price: 2000.00 }
      ],
      trackingNumber: "ZAP2026137K"
    },
    {
      id: "ORD-2026-136",
      date: "2026-02-12",
      status: "delivered",
      total: 27500.00,
      items: [
        { name: "Sundae Driver (Premium)", quantity: "4000g", price: 12000.00 },
        { name: "Ice Cream Cake", quantity: "2500g", price: 8750.00 },
        { name: "Sherblato", quantity: "1500g", price: 5250.00 },
        { name: "Candy Rain", quantity: "350g", price: 1500.00 }
      ],
      trackingNumber: "ZAP2026136L"
    },
    {
      id: "ORD-2026-135",
      date: "2026-02-11",
      status: "delivered",
      total: 21300.00,
      items: [
        { name: "Gary Payton (Wholesale)", quantity: "3000g", price: 10500.00 },
        { name: "Kush Mints", quantity: "1800g", price: 6300.00 },
        { name: "Papaya", quantity: "1000g", price: 3400.00 },
        { name: "Zoap", quantity: "300g", price: 1100.00 }
      ],
      trackingNumber: "ZAP2026135M"
    },
    {
      id: "ORD-2026-134",
      date: "2026-02-10",
      status: "delivered",
      total: 35800.00,
      items: [
        { name: "Zaza (Limited Edition)", quantity: "5000g", price: 15000.00 },
        { name: "Runtz (White Label)", quantity: "3500g", price: 12250.00 },
        { name: "Biscotti Gelato", quantity: "2000g", price: 7000.00 },
        { name: "Truffle Butter", quantity: "350g", price: 1550.00 }
      ],
      trackingNumber: "ZAP2026134N"
    },
    {
      id: "ORD-2026-133",
      date: "2026-02-09",
      status: "delivered",
      total: 29400.00,
      items: [
        { name: "Platinum Cookies (Bulk)", quantity: "4000g", price: 12000.00 },
        { name: "Banana Punch", quantity: "2500g", price: 8750.00 },
        { name: "Lava Cake", quantity: "2000g", price: 7000.00 },
        { name: "Jet Fuel Gelato", quantity: "400g", price: 1650.00 }
      ],
      trackingNumber: "ZAP2026133O"
    }
  ];

  // Calculate total transaction volume
  const totalVolume = orders.reduce((sum, order) => sum + order.total, 0);

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
      <NavHeader />
      {/* Page Title Bar */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2744] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-blue-200 text-sm mt-0.5">Track your cannabis deliveries</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-right border border-white/20">
              <p className="text-xs text-blue-300 uppercase tracking-wide font-medium">Total Transaction Volume</p>
              <p className="text-2xl font-bold text-green-300">${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <CardTitle>No Orders Yet</CardTitle>
              <CardDescription>
                You haven't placed any orders yet. View available products to get started!
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
