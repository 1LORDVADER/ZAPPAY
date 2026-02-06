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

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  
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
      window.location.href = getLoginUrl();
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
              <Button className="mt-4">Back to Marketplace</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = 4.5; // TODO: Calculate from reviews
  const totalReviews = 0; // TODO: Get from reviews

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
              Back to Marketplace
            </a>
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
              {product.photos ? (
                <img 
                  src={product.photos} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-12 flex items-center justify-center">
                  <div className="text-center">
                    <Leaf className="h-48 w-48 text-green-600 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Product image coming soon</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  {product.category}
                </Badge>
                {product.isPreOrder === 'yes' && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Pre-Order
                  </Badge>
                )}
                {product.isFeatured === 'yes' && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Featured
                  </Badge>
                )}
                {product.isSponsored === 'yes' && (
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
                <span className="text-sm text-slate-600">
                  {averageRating} ({totalReviews} reviews)
                </span>
              </div>

              {/* Price with Comparison */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-green-700">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <span className="text-lg text-slate-600">per {product.unit}</span>
                </div>
                
                {product.retailPrice && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Typical Retail Price:</span>
                      <span className="text-lg text-slate-400 line-through">
                        ${(product.retailPrice / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-700">Your ZAPPAY Savings:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${((product.retailPrice - product.price) / 100).toFixed(2)}
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
                    <span className="ml-2 font-semibold text-green-600">
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
                      product.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
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
                      <Leaf className="h-5 w-5 text-green-600" />
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
              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Sold by Licensed Farmer
                </h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
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
                  <TrendingUp className="h-5 w-5 text-green-600" />
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
        </div>
      </section>
    </div>
  );
}
