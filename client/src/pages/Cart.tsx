import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getGuestCart, updateGuestCartQuantity, removeFromGuestCart, clearGuestCart, type CartItem as GuestCartItem } from "@/lib/cartPersistence";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Cart() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [mixingItemId, setMixingItemId] = useState<number | null>(null);
  const [mixedStrains, setMixedStrains] = useState<Array<{ productId: number; quantity: number }>>([]);
  const [guestCart, setGuestCart] = useState<GuestCartItem[]>([]);
  
  // Fetch cart items
  const { data: cartItems = [], isLoading } = trpc.cart.getItems.useQuery();
  
  // Fetch products for cart items
  const { data: products = [] } = trpc.products.list.useQuery();
  
  // Load guest cart from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestCart(getGuestCart());
    }
  }, [isAuthenticated]);
  
  // Update quantity mutation
  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Cart updated");
    },
  });
  
  // Remove item mutation
  const removeItemMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
    },
  });
  
  // Clear cart mutation
  const clearCartMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      utils.cart.getItems.invalidate();
      toast.success("Cart cleared");
    },
  });

  // Handle guest cart removal
  const handleGuestRemove = (productId: number) => {
    removeFromGuestCart(productId);
    setGuestCart(getGuestCart());
    toast.success("Item removed from cart");
  };
  
  // Handle guest cart quantity update
  const handleGuestQuantityUpdate = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Minimum order is 1 gram");
      return;
    }
    updateGuestCartQuantity(productId, newQuantity);
    setGuestCart(getGuestCart());
    toast.success("Cart updated");
  };
  
  // Handle guest cart clear
  const handleGuestClear = () => {
    clearGuestCart();
    setGuestCart([]);
    toast.success("Cart cleared");
  };
  
  // If not authenticated, show guest cart
  if (!isAuthenticated) {
    const guestCartWithProducts = guestCart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return { ...item, product, id: item.productId };
    }).filter(item => item.product);
    
    const guestSubtotal = guestCartWithProducts.reduce((sum, item) => {
      return sum + (item.product!.price * item.quantity);
    }, 0);
    
    const guestTax = guestSubtotal * 0.08;
    const guestPlatformFee = guestSubtotal * 0.052;
    const guestTotal = guestSubtotal + guestTax + guestPlatformFee;
    
    if (guestCart.length === 0) {
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
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <a className="flex items-center gap-3 cursor-pointer">
                  <img src="/logo.png" alt="ZAPPAY Logo" className="h-12 w-auto object-contain" />
                </a>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/">
                  <a>
                    <Button variant="outline" size="sm">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/">
              <a className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </a>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-600">{guestCart.length} Items</p>
                <Button variant="outline" size="sm" onClick={handleGuestClear}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
              
              {guestCartWithProducts.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                        <img
                        src={item.product!.photos || '/placeholder.png'}
                        alt={item.product!.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                      
                      <div className="flex-1">
                        <Link href={`/product/${item.product!.id}`}>
                          <a className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                            {item.product!.name}
                          </a>
                        </Link>
                        <p className="text-sm text-slate-600">{item.product!.strain}</p>
                        <p className="text-sm text-slate-500">THC: {item.product!.thcPercentage} CBD: {item.product!.cbdPercentage}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGuestQuantityUpdate(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}g</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGuestQuantityUpdate(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">
                          ${(item.product!.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">
                          ${item.product!.price.toFixed(2)} per gram
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGuestRemove(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">${guestSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span className="font-semibold">${guestTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Platform Fee (5.2%)</span>
                    <span className="font-semibold">${guestPlatformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-blue-600">${guestTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    Login to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
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

  const tax = subtotal * 0.08; // 8% tax
  const platformFee = subtotal * 0.052; // 5.2% platform fee
  const total = subtotal + tax;

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Minimum order is 1 gram");
      return;
    }
    updateQuantityMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCartMutation.mutate();
    }
  };

  const handleMixStrains = (item: typeof cartWithProducts[0]) => {
    if (item.quantity < 5) {
      toast.error("Strain mixing is only available for orders of 5+ grams");
      return;
    }
    
    // Get products from the same farmer
    const farmerProducts = products.filter(p => 
      p.farmerId === item.product!.farmerId && 
      p.id !== item.productId &&
      p.status === 'active'
    );
    
    if (farmerProducts.length === 0) {
      toast.error("No other strains available from this farmer");
      return;
    }
    
    setMixingItemId(item.id);
    setMixedStrains([{ productId: item.productId, quantity: item.quantity }]);
  };

  const handleAddMixedStrain = (productId: number) => {
    const existingIndex = mixedStrains.findIndex(s => s.productId === productId);
    if (existingIndex >= 0) {
      toast.error("This strain is already in your mix");
      return;
    }
    
    setMixedStrains([...mixedStrains, { productId, quantity: 1 }]);
  };

  const handleUpdateMixedQuantity = (productId: number, delta: number) => {
    setMixedStrains(prev => {
      const newStrains = prev.map(s => 
        s.productId === productId 
          ? { ...s, quantity: Math.max(1, s.quantity + delta) }
          : s
      );
      
      // Ensure total is at least 5 grams
      const total = newStrains.reduce((sum, s) => sum + s.quantity, 0);
      if (total < 5) {
        toast.error("Total must be at least 5 grams");
        return prev;
      }
      
      return newStrains;
    });
  };

  const handleRemoveMixedStrain = (productId: number) => {
    if (mixedStrains.length <= 1) {
      toast.error("You must have at least one strain");
      return;
    }
    setMixedStrains(prev => prev.filter(s => s.productId !== productId));
  };

  const handleSaveMix = () => {
    const totalQuantity = mixedStrains.reduce((sum, s) => sum + s.quantity, 0);
    if (totalQuantity < 5) {
      toast.error("Total must be at least 5 grams");
      return;
    }
    
    // Update cart item with mixed strains
    updateQuantityMutation.mutate({
      id: mixingItemId!,
      quantity: totalQuantity,
      isMixed: 'yes',
      mixedStrains: JSON.stringify(mixedStrains),
    });
    
    setMixingItemId(null);
    setMixedStrains([]);
    toast.success("Strain mix saved!");
  };

  const getMixingItem = () => {
    return cartWithProducts.find(item => item.id === mixingItemId);
  };

  const getAvailableMixStrains = () => {
    const mixingItem = getMixingItem();
    if (!mixingItem) return [];
    
    return products.filter(p => 
      p.farmerId === mixingItem.product!.farmerId && 
      p.status === 'active' &&
      !mixedStrains.some(s => s.productId === p.id)
    );
  };

  const mixedTotal = mixedStrains.reduce((sum, s) => sum + s.quantity, 0);

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
                          
                          {/* Strain Mixing Button */}
                          {item.quantity >= 5 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => handleMixStrains(item)}
                            >
                              <Shuffle className="h-4 w-4 mr-2" />
                              Mix Strains ({item.quantity}g)
                            </Button>
                          )}
                          
                          {item.isMixed === 'yes' && item.mixedStrains && (
                            <div className="mt-2 text-xs text-green-600 font-medium">
                              ✓ Mixed Strain Order
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">{item.quantity}g</span>
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
                            ${(item.product!.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-500">
                            ${item.product!.price.toFixed(2)} per gram
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItemMutation.mutate({ id: item.id })}
                          disabled={removeItemMutation.isPending}
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
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Tax (8%)</span>
                      <span className="font-semibold text-slate-900">
                        ${(tax).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Platform Fee (5.2%)</span>
                      <span className="font-semibold">
                        ${(platformFee).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-lg font-semibold text-slate-900">Total</span>
                        <span className="text-3xl font-bold text-slate-900">
                          ${total.toFixed(2)}
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

      {/* Strain Mixing Modal */}
      <Dialog open={mixingItemId !== null} onOpenChange={(open) => !open && setMixingItemId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mix Your Strains</DialogTitle>
            <DialogDescription>
              Select multiple strains from the same farm. Minimum 5 grams total.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Mix */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Your Mix ({mixedTotal} grams)</h3>
              <div className="space-y-2">
                {mixedStrains.map((strain) => {
                  const product = products.find(p => p.id === strain.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={strain.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-grow">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-slate-600">{product.strain} • THC: {product.thcPercentage}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateMixedQuantity(strain.productId, -1)}
                          disabled={strain.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{strain.quantity}g</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateMixedQuantity(strain.productId, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {mixedStrains.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMixedStrain(strain.productId)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {mixedTotal < 5 && (
                <p className="text-sm text-red-600 mt-2">
                  Need {5 - mixedTotal} more gram{5 - mixedTotal !== 1 ? 's' : ''} to reach minimum
                </p>
              )}
            </div>

            {/* Available Strains */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Add More Strains</h3>
              <div className="grid grid-cols-1 gap-3">
                {getAvailableMixStrains().map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.strain} • THC: {product.thcPercentage}</p>
                      <p className="text-sm font-semibold text-green-600">${(product.price / 100).toFixed(2)}/g</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMixedStrain(product.id)}
                    >
                      Add to Mix
                    </Button>
                  </div>
                ))}
                
                {getAvailableMixStrains().length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No more strains available from this farmer
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3">
              <Button
                className="flex-grow"
                size="lg"
                onClick={handleSaveMix}
                disabled={mixedTotal < 5}
              >
                Save Mix ({mixedTotal}g)
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setMixingItemId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
