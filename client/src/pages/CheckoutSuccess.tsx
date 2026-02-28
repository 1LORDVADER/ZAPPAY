import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CheckoutSuccess() {
  const [location] = useLocation();
  const utils = trpc.useUtils();
  
  // Extract session_id from URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const sessionId = searchParams.get('session_id');

  // Clear cart after successful checkout
  useEffect(() => {
    if (sessionId) {
      // Invalidate cart to refresh it (it should be empty after checkout)
      utils.cart.getItems.invalidate();
    }
  }, [sessionId, utils]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl mb-2">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase. Your order has been successfully processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {sessionId && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 mb-1">Order Reference</p>
              <p className="font-mono text-sm text-slate-900">{sessionId}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">What's Next?</h3>
                <p className="text-sm text-slate-600">
                  You'll receive an email confirmation shortly with your order details and tracking information. 
                  Your cannabis products will be shipped from licensed farmers and should arrive within 3-5 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Direct from Farmers</h3>
                <p className="text-sm text-slate-600">
                  Your order supports licensed cannabis farmers directly. ZAPPAY's 5.2% platform fee ensures 
                  farmers receive fair compensation while you get the best prices.
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
  );
}
