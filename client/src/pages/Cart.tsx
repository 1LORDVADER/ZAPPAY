import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  // Fetch cart items
  const { data: cartItems = [], isLoading } = trpc.cart.getItems.useQuery();
  
  // Fetch products for cart items
  const { data: products = [] } = trpc.products.list.useQuery();
  
  // Update quantity mutation
  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Cart updated");
    },
  });
  
  // Clear cart mutation
  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Cart cleared");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">Please login to view your cart</p>
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

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    updateQuantityMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCartMutation.mutate();
    }
  };

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
              <Link href="/">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Continue Shopping
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </a>
          </Link>

          <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading cart...</p>
            </div>
          ) : cartWithProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg mb-4">Your cart is empty</p>
              <Link href="/">
                <a>
                  <Button>Start Shopping</Button>
                </a>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {cartWithProducts.length} {cartWithProducts.length === 1 ? 'Item' : 'Items'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={clearCartMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                {cartWithProducts.map((item) => (
                  <Card key={item.id} className="border-2 border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Product Image Placeholder */}
                        <div className="h-24 w-24 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="h-8 w-8 text-green-600" />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <Link href={`/product/${item.product!.id}`}>
                            <a className="text-lg font-semibold text-slate-900 hover:text-blue-900">
                              {item.product!.name}
                            </a>
                          </Link>
                          <p className="text-sm text-slate-600 mb-2">
                            {item.product!.strain}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-600">
                              THC: <span className="font-semibold text-green-600">{item.product!.thcPercentage}</span>
                            </span>
                            <span className="text-slate-600">
                              CBD: <span className="font-semibold text-blue-600">{item.product!.cbdPercentage}</span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-900">
                            ${((item.product!.price * item.quantity) / 100).toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-500">
                            ${(item.product!.price / 100).toFixed(2)} each
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, 0)}
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                      
                      <Link href="/checkout">
                        <a>
                          <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                          >
                            Proceed to Checkout
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </Button>
                        </a>
                      </Link>
                      
                      <p className="text-xs text-slate-500 text-center mt-4">
                        Secure checkout powered by Stripe
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
