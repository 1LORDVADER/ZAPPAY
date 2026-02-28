import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, ArrowLeft, Star, Leaf, Package, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { addToGuestCart } from "@/lib/cartPersistence";
import { ProductReviews } from "@/components/ProductReviews";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const MIN_QUANTITY = 4; // 4-gram minimum order
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  
  const productId = parseInt(params.id || "0");
  
  // Fetch product details
  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  
  // Fetch reviews
  const { data: reviews = [] } = trpc.products.getById.useQuery({ id: productId });
  
  // Add to cart mutation
  const addToCartMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Add to localStorage for guest users
      addToGuestCart(product!.id, quantity);
      toast.success("Added to cart! Login to checkout.");
      return;
    }
    
    addToCartMutation.mutate({
      productId: product!.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-slate-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Product not found</p>
          <Link href="/">
            <a>
              <Button className="mt-4">Back to Products</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = product.rating ? parseFloat(product.rating) : 4.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 cursor-pointer">
                <img 
                  src="/logo.png" 
                  alt="ZAPPAY Logo" 
                  className="h-12 w-auto object-contain"
                />
              </a>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Browse
                </a>
              </Link>
              <Link href="/cart">
                <a>
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                  </Button>
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </a>
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg aspect-square">
              {product.photos ? (
                <img 
                  src={product.photos} 
                  alt={product.name}
                  loading="eager"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="bg-gradient-to-br from-[#E8231A] to-blue-50 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Leaf className="h-48 w-48 text-[#0D1B2A] mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Product image coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Badge className="bg-[#fde8e7] text-[#0D1B2A] hover:bg-[#fbd5d3]">
                  {product.category}
                </Badge>
                {product.isPreOrder && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Pre-Order
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                )}
                {product.isSponsored && (
                  <Badge className="bg-purple-100 text-purple-800">
                    Sponsored
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              
              <p className="text-xl text-slate-600 mb-6">
                {product.strain}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {averageRating}
                </span>
              </div>

              {/* Price with Comparison */}
              <div className="bg-gradient-to-br from-[#E8231A] to-blue-50 rounded-xl p-6 border-2 border-[#c5d0dc] mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-[#0D1B2A]">
                    ${(product.price).toFixed(2)}
                  </span>
                  <span className="text-2xl font-semibold text-slate-700">/gram</span>
                </div>
                
                {product.retailPrice && (
                  <div className="mt-4 pt-4 border-t border-[#c5d0dc]">
                    <div className="flex items-center justify-between">
                      <span className="text-lg text-slate-600">Typical Retail Price:</span>
                      <span className="text-lg font-semibold text-slate-700 line-through">
                        ${(product.retailPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#0D1B2A]">Your ZAPPAY Savings:</span>
                      <span className="text-2xl font-bold text-[#0D1B2A]">
                        ${((product.retailPrice - product.price)).toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-3 bg-white/80 rounded-lg p-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        💡 <strong>Why cheaper?</strong> ZAPPAY connects you directly with farmers, eliminating retail overhead (no storefront lease, utilities, or middleman markup). You get premium quality at wholesale prices.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <span className="text-slate-600">THC:</span>
                    <span className="ml-2 font-semibold text-[#0D1B2A]">
                      {product.thcPercentage || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">CBD:</span>
                    <span className="ml-2 font-semibold text-blue-600">
                      {product.cbdPercentage || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Available:</span>
                    <span className="ml-2 font-semibold">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Status:</span>
                    <span className={`ml-2 font-semibold ${
                      product.status === 'active' ? 'text-[#0D1B2A]' : 
                      product.status === 'growing' ? 'text-amber-600' : 
                      product.status === 'sold_out' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {product.status === 'active' && product.isPreOrder ? 'Pre-Order' :
                       product.status === 'active' ? 'Available Now' : 
                       product.status === 'growing' ? 'Being Cultivated' : 
                       product.status === 'sold_out' ? 'Sold Out' : product.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity <span className="text-xs text-slate-500 font-normal">(4g minimum order)</span>
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(MIN_QUANTITY, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(MIN_QUANTITY, parseInt(e.target.value) || MIN_QUANTITY))}
                    className="w-20 text-center"
                    min="4"
                    max={product.quantity}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg py-6"
                onClick={handleAddToCart}
                disabled={product.status !== 'active' || addToCartMutation.isPending}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>

              {/* Rich Strain Information */}
              <div className="mt-8 space-y-6">
                {product.origin && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-[#0D1B2A]" />
                      Origin Story
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.origin}
                    </p>
                  </div>
                )}

                {product.lore && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Legacy & Lore
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.lore}
                    </p>
                  </div>
                )}

                {product.effects && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Effects
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.effects}
                    </p>
                  </div>
                )}

                {product.flavor && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Flavor Profile
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.flavor}
                    </p>
                  </div>
                )}

                {product.bestFor && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Best For
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.bestFor}
                    </p>
                  </div>
                )}

                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Farmer Info */}
              <div className="mt-8 bg-gradient-to-r from-[#E8231A] to-blue-50 rounded-xl p-6 border-2 border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Sold by Licensed Farmer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-[#E8231A] rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Farmer ID: {product.farmerId}</p>
                    <p className="text-sm text-slate-600">Licensed & Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0D1B2A]" />
                  Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{product.views || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{product.clicks || 0}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{averageRating}/5</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <ProductReviews productId={productId} />
          </div>
        </div>
      </section>
    </div>
  );
}
