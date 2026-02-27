import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { CreditCard, ArrowLeft, ShoppingCart, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { STATE_COMPLIANCE } from "@shared/stateCompliance";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { userState, loading: geoLoading } = useGeolocation();
  
  // Check if user's state allows cannabis purchases
  const stateInfo = userState ? STATE_COMPLIANCE[userState] : null;
  const canPurchase = stateInfo?.recreational || stateInfo?.medical;
  
  // Fetch cart items
  const { data: cartItems = [] } = trpc.cart.getItems.useQuery();
  
  // Fetch products for cart items
  const { data: products = [] } = trpc.products.list.useQuery();
  
  // Shipping information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Create checkout session mutation
  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsProcessing(false);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Please login to checkout</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const cartWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartWithProducts.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const tax = Math.round(subtotal * 0.08); // 8% tax
  const platformFee = Math.round(subtotal * 0.052); // 5.2% platform fee
  const total = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check state legality
    if (!canPurchase) {
      toast.error(`Cannabis purchases are not legal in ${userState || 'your state'}. Please check your location.`);
      return;
    }
    
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsProcessing(true);
    
    // Create checkout session
    createCheckoutMutation.mutate({
      items: cartWithProducts.map(item => ({
        productId: item.product!.id,
        quantity: item.quantity,
        price: item.product!.price,
        name: item.product!.name,
      })),
      shippingInfo,
    });
  };

  if (cartWithProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">Your cart is empty</p>
          <Link href="/">
            <a>
              <Button>Start Shopping</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 cursor-pointer">
                <img 
                  src="/zappay-logo.jpeg" 
                  alt="ZAPPAY Logo" 
                  className="h-12 w-auto object-contain"
                />
              </a>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/cart">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Back to Cart
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link href="/cart">
            <a className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </a>
          </Link>

          <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

          {/* State Legality Warning */}
          {!geoLoading && !canPurchase && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Cannabis Not Legal in Your State</AlertTitle>
              <AlertDescription>
                Cannabis purchases are not currently legal in {userState || 'your state'}. 
                Please verify your location or contact support if you believe this is an error.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCheckout}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={shippingInfo.fullName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={shippingInfo.state}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                          maxLength={2}
                          placeholder="CA"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="border-2 border-slate-200">
                  <CardHeader>
                    <CardTitle>Order Items ({cartWithProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartWithProducts.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                        <div className="h-16 w-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-slate-900">{item.product!.name}</p>
                          <p className="text-sm text-slate-600">
                            {item.product!.strain} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          ${((item.product!.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="border-2 border-slate-200 sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        ${(subtotal / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Tax (8%)</span>
                      <span className="font-semibold text-slate-900">
                        ${(tax / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Platform Fee (5.2%)</span>
                      <span className="font-semibold">
                        ${(platformFee / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-3xl font-bold text-slate-900">
                          ${(total / 100).toFixed(2)}
                        </span>
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                        disabled={isProcessing || createCheckoutMutation.isPending}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {isProcessing ? "Processing..." : "Pay with Stripe"}
                      </Button>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Secure checkout powered by Stripe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Your payment information is encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Direct from licensed cannabis farmers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
