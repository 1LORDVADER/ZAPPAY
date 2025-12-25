import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Leaf, Package, Zap, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all products
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  
  // Fetch cart items
  const { data: cartItems = [] } = trpc.cart.getItems.useQuery();
  
  // Filter products based on search and category
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.strain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Browse
                </a>
              </Link>
              {isAuthenticated && user?.role === 'farmer' && (
                <Link href="/farmer/dashboard">
                  <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                    Sell Products
                  </a>
                </Link>
              )}
              {isAuthenticated && (
                <Link href="/orders">
                  <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                    My Orders
                  </a>
                </Link>
              )}
              
              <Link href="/cart">
                <a className="relative">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <Badge className="ml-2 bg-red-600 text-white">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </a>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {user?.name || user?.email}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => logout()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => window.location.href = getLoginUrl()}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">World's First Precision Cannabis Marketplace</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Cannabis
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              Search by strain, THC%, or price. Direct from licensed farmers.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by strain name, THC%, or product type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white text-slate-900 border-0 shadow-xl"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{products.length}+</div>
                <div className="text-sm text-blue-200">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">5.2%</div>
                <div className="text-sm text-blue-200">Commission Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">24/7</div>
                <div className="text-sm text-blue-200">Marketplace Open</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid with Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-6 max-w-3xl mx-auto mb-8">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="flower">
                <Leaf className="h-4 w-4 mr-2" />
                Flower
              </TabsTrigger>
              <TabsTrigger value="edibles">Edibles</TabsTrigger>
              <TabsTrigger value="concentrates">Concentrates</TabsTrigger>
              <TabsTrigger value="pre-rolls">Pre-Rolls</TabsTrigger>
              <TabsTrigger value="vapes">Vapes</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-8">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 text-lg">No products found</p>
                  <p className="text-slate-500 text-sm mt-2">
                    {searchQuery ? "Try a different search term" : "Check back soon for new listings"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-xl transition-shadow border-2 border-slate-200 hover:border-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {product.category}
                          </Badge>
                          {product.isPreOrder === 'yes' && (
                            <Badge className="bg-orange-100 text-orange-800">
                              Pre-Order
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {product.strain}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">THC:</span>
                            <span className="font-semibold text-green-600">{product.thcPercentage || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">CBD:</span>
                            <span className="font-semibold text-blue-600">{product.cbdPercentage || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Quantity:</span>
                            <span className="font-semibold">{product.quantity} {product.unit}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-slate-900">
                                ${(product.price / 100).toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-500">per {product.unit}</span>
                            </div>
                            <Link href={`/product/${product.id}`}>
                              <a>
                                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section for Farmers */}
      {!isAuthenticated || user?.role !== 'farmer' ? (
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Are you a licensed cannabis farmer?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              List your products and reach thousands of consumers. Just 5.2% commission.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6"
            >
              <Leaf className="h-5 w-5 mr-2" />
              Start Selling Today
            </Button>
          </div>
        </section>
      ) : null}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/zappay-logo.jpeg" 
                alt="ZAPPAY Logo" 
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-slate-400 text-sm">
                America's premier cannabis marketplace connecting farmers with consumers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Shop</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">All Products</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Flower</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Edibles</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Concentrates</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Sell</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">For Farmers</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">For Dispensaries</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Transportation</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors text-sm">Compliance</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2025 ZAPPAY. All rights reserved. Licensed cannabis marketplace platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
