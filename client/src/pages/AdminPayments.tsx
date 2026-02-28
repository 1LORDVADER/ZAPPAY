import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavHeader } from "@/components/NavHeader";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

export default function AdminPayments() {
  const { data: orders = [], isLoading } = trpc.orders.getAll.useQuery();

  const totalRevenue = orders
    .filter((o: any) => o.status === "paid" || o.status === "completed" || o.status === "delivered")
    .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o: any) => o.status === "paid" || o.status === "completed" || o.status === "delivered").length;
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

  const platformFees = totalRevenue * 0.052;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/admin/applications">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-red-400" />
            Payment Processing
          </h1>
          <p className="text-slate-400">Real-time view of all processed payments on the ZAPPAY platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Platform Fees (5.2%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                <span className="text-2xl font-bold text-white">${platformFees.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-400" />
                <span className="text-2xl font-bold text-white">{totalOrders}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Paid / Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold text-white">{paidOrders}</span>
                <span className="text-slate-500">/</span>
                <span className="text-xl font-bold text-yellow-400">{pendingOrders}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-400" />
              All Processed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <CreditCard className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg font-medium">No payments processed yet</p>
                <p className="text-slate-500 text-sm mt-1">Payments will appear here once customers complete checkout</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Fee</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-slate-300 font-mono text-sm">#{order.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white text-sm font-medium">{order.shippingName || "Guest"}</p>
                            <p className="text-slate-500 text-xs">{order.shippingEmail || ""}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-400 font-semibold">${(order.totalAmount || 0).toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-red-400 text-sm">${((order.totalAmount || 0) * 0.052).toFixed(2)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`text-xs border ${getStatusColor(order.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-400 text-sm">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
