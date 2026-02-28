import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Home, Receipt } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { NavHeader } from "@/components/NavHeader";

export default function CheckoutSuccess() {
  const [location] = useLocation();
  const utils = trpc.useUtils();

  // Extract session_id from URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = searchParams.get('session_id');

  // Fetch latest order with items for the receipt breakdown
  const { data: latestOrderData } = trpc.orders.getLatestWithItems.useQuery(undefined, {
    enabled: !!sessionId,
  });

  // Clear cart after successful checkout
  useEffect(() => {
    if (sessionId) {
      utils.cart.getItems.invalidate();
    }
  }, [sessionId, utils]);

  const order = latestOrderData?.order;
  const items = latestOrderData?.items ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />
      <div className="flex items-center justify-center p-4 pt-8">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl mb-2">Order Confirmed!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your purchase. Your payment has been successfully processed by ZAPPAY.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sessionId && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Payment Reference</p>
                <p className="font-mono text-sm text-slate-900 break-all">{sessionId}</p>
              </div>
            )}

            {/* Per-gram receipt breakdown */}
            {items.length > 0 && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <Receipt className="h-4 w-4 text-slate-600" />
                  <span className="font-semibold text-slate-800 text-sm">Order Receipt</span>
                </div>
                <div className="p-4 space-y-3">
                  {items.map((item) => {
                    const pricePerGram = item.pricePerUnit / 100;
                    const lineTotal = item.total / 100;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1 pr-4">
                          <p className="font-medium text-slate-900">{item.productName}</p>
                          {item.productStrain && (
                            <p className="text-xs text-slate-500">{item.productStrain}</p>
                          )}
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <span className="text-slate-600">
                            {item.quantity}g × ${pricePerGram.toFixed(2)}/g
                          </span>
                          <span className="ml-3 font-semibold text-slate-900">
                            = ${lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {order && (
                    <>
                      <Separator />
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Subtotal</span>
                          <span>${(order.subtotal / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>ZAPPAY Processing Fee (5.2%)</span>
                          <span>${(order.platformFee / 100).toFixed(2)}</span>
                        </div>
                        {order.tax > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>Tax</span>
                            <span>${(order.tax / 100).toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold text-slate-900 text-base">
                          <span>Total Charged</span>
                          <span>${(order.total / 100).toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <Package className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">What's Next?</h3>
                  <p className="text-sm text-slate-600">
                    You'll receive an email confirmation shortly with your order details and tracking information. Your order will be fulfilled by the licensed farmer and transported by a ZAPPAY-verified carrier.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Direct from Farmers</h3>
                  <p className="text-sm text-slate-600">
                    ZAPPAY processed your payment securely. Our 5.2% processing fee maintains the payment infrastructure — the farmer receives the rest directly via ACH.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/orders">
                <Button className="w-full sm:w-auto" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  View My Orders
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <p className="text-xs text-center text-slate-500 pt-4 border-t">
              Questions about your order? Contact us at support@zappayus.co
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
