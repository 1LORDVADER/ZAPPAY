import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Leaf, Package, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getGuestCartCount } from "@/lib/cartPersistence";
import { StateSelector } from "@/components/StateSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { canAccessTHC } from "@shared/stateCompliance";
import { AgeVerification } from "@/components/AgeVerification";
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { NavHeader } from "@/components/NavHeader";
import { Toaster } from "sonner";
import { StrainRecommendations } from "@/components/StrainRecommendations";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const { userState, isLegal, stateInfo } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [guestCartCount, setGuestCartCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    thcMin: 0,
    thcMax: 40,
    cbdMin: 0,
    cbdMax: 30,
    strainTypes: [],
    effects: [],
    categories: [],
  });
  
  // Fetch all products
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  
  // Fetch cart items
  const { data: cartItems = [] } = trpc.cart.getItems.useQuery();
  
  // Update guest cart count on mount and when cart changes
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestCartCount(getGuestCartCount());
    }
  }, [isAuthenticated, cartItems]);
  
  // Filter products based on search and category
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.strain.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    
    // Geofencing: hemp products (<0.3% THC) are federally legal in all 50 states under the 2018 Farm Bill.
    // THC products are only shown in states where cannabis is not fully illegal.
    const isHempProduct = product.category === 'hemp' || (product as any).isHemp === true;
    const matchesState = isHempProduct ? true : canAccessTHC(userState);
    
    // Advanced filter: THC percentage
    const thcValue = parseFloat(product.thcPercentage || "0") || 0;
    const matchesTHC = thcValue >= filters.thcMin && thcValue <= filters.thcMax;
    
    // Advanced filter: CBD percentage
    const cbdValue = parseFloat(product.cbdPercentage || "0") || 0;
    const matchesCBD = cbdValue >= filters.cbdMin && cbdValue <= filters.cbdMax;
    
    // Advanced filter: Strain type
    const matchesStrainType = filters.strainTypes.length === 0 || 
      filters.strainTypes.some(type => product.strain.toLowerCase().includes(type.toLowerCase()));
    
    // Advanced filter: Effects (would need effects field in product schema)
    const matchesEffects = filters.effects.length === 0; // Placeholder for now
    
    // Advanced filter: Categories
    const matchesFilterCategory = filters.categories.length === 0 || 
      filters.categories.includes(product.category);
    
    return matchesSearch && matchesCategory && matchesState && matchesTHC && matchesCBD && matchesStrainType && matchesEffects && matchesFilterCategory;
  });

  // Use database cart for authenticated users, localStorage for guests
  const cartItemCount = isAuthenticated 
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : guestCartCount;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <AgeVerification />
      {/* Header - using shared NavHeader for consistency */}
      <NavHeader />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-green-50"
      >
        <div className="container mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Cannabis Payment Processing, Built for the Industry
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              ZAPPAY processes payments between licensed farmers, dispensaries, and consumers — legally, instantly, and at just 5.2%. We don't sell products; we power the transactions.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{products.length}+</p>
                      <p className="text-sm text-slate-600">Listed Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">5.2%</p>
                      <p className="text-sm text-slate-600">Processing Fee</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">24/7</p>
                      <p className="text-sm text-slate-600">Always Open</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by strain, THC%, or price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>
              <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Strain Recommendations */}
      <section className="py-4 px-4">
        <div className="container mx-auto max-w-3xl">
          <StrainRecommendations />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 px-4 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
        <div className="container mx-auto">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 mb-8">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="flower">Flower</TabsTrigger>
                <TabsTrigger value="edibles">Edibles</TabsTrigger>
                <TabsTrigger value="concentrates">Concentrates</TabsTrigger>
                <TabsTrigger value="pre-rolls">Pre-Rolls</TabsTrigger>
                <TabsTrigger value="vapes">Vapes</TabsTrigger>
                <TabsTrigger value="hemp" className="text-green-700 font-semibold">
                  Hemp / CBD
                  <Badge className="ml-1 bg-green-100 text-green-700 text-xs px-1 py-0 border border-green-300 hidden md:inline-flex">50 States</Badge>
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <TabsContent value={activeCategory} className="mt-0">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600">No products found</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -5 }}
                      transition={{ type: "spring" as const, stiffness: 300 }}
                    >
                      <Link href={`/product/${product.id}`}>
                        <Card className="overflow-hidden h-full hover:shadow-xl transition-all cursor-pointer">
                        <CardHeader className="p-0">
                          <div className="relative aspect-square bg-white overflow-hidden">
                            {product.photos ? (
                              <img 
                                src={(() => {
                                  try {
                                    const photos = typeof product.photos === 'string' ? JSON.parse(product.photos) : product.photos;
                                    return Array.isArray(photos) ? photos[0] : product.photos;
                                  } catch {
                                    return product.photos;
                                  }
                                })()} 
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-contain p-4"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                                <Leaf className="h-20 w-20 text-green-600 opacity-20" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                              <Badge variant="secondary" className="capitalize bg-white/90">
                                {product.category}
                              </Badge>
                              {product.status === 'sold_out' && (
                                <Badge className="bg-red-600 text-white hover:bg-red-700">
                                  Sold Out
                                </Badge>
                              )}
                              {product.status === 'growing' && (
                                <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                                  Being Cultivated
                                </Badge>
                              )}
                              {product.isPreOrder && product.status !== 'sold_out' && (
                                <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                                  Pre-Order
                                </Badge>
                              )}
                              {product.isFeatured && (
                                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                                  Ready to Ship
                                </Badge>
                              )}
                            </div>
                            {product.status === 'sold_out' && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl tracking-wider rotate-[-15deg]">SOLD OUT</span>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                          <CardDescription className="mb-3">
                            <span className="font-medium text-slate-700">{product.strain}</span>
                          </CardDescription>
                          
                          <div className="flex items-center gap-3 mb-3 text-sm">
                            {product.thcPercentage && (
                              <div>
                                <span className="text-slate-500">THC:</span>
                                <span className="ml-1 font-semibold text-green-600">
                                  {product.thcPercentage}
                                </span>
                              </div>
                            )}
                            {product.cbdPercentage && (
                              <div>
                                <span className="text-slate-500">CBD:</span>
                                <span className="ml-1 font-semibold text-blue-600">
                                  {product.cbdPercentage}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Star Rating */}
                          {product.rating && (
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < Math.floor(parseFloat(product.rating!))
                                      ? "text-yellow-400 fill-yellow-400"
                                      : i < parseFloat(product.rating!)
                                      ? "text-yellow-400 fill-yellow-400 opacity-50"
                                      : "text-slate-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-slate-500 ml-1">{product.rating}</span>
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-slate-900">
                                  ${typeof product.price === 'number' ? (product.price / 100).toFixed(2) : product.price}
                                </span>
                                <span className="text-sm text-slate-600 ml-1">/gram</span>
                              </div>
                              {product.retailPrice && (
                                <span className="text-sm text-slate-400 line-through">
                                  ${typeof product.retailPrice === 'number' ? (product.retailPrice / 100).toFixed(2) : product.retailPrice}
                                </span>
                              )}
                            </div>
                            {product.retailPrice && (
                              <div className="text-xs font-semibold text-green-600">
                                Save ${((typeof product.retailPrice === 'number' ? product.retailPrice / 100 : parseFloat(product.retailPrice) / 100) - (typeof product.price === 'number' ? product.price / 100 : parseFloat(product.price) / 100)).toFixed(2)}/gram
                              </div>
                            )}
                          </div>

                          {product.quantity < 10 && product.quantity > 0 && product.status === 'active' && (
                            <p className="text-xs text-orange-600 mt-2">
                              Only {product.quantity} left in stock!
                            </p>
                          )}
                        </CardContent>
                      </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/legal/terms-of-service"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/privacy-policy"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/refund-policy"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/age-verification-policy"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    Age Verification
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/prohibited-use-policy"
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    Prohibited Use
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: support@zappay.com</li>
                <li>Phone: 1-800-ZAPPAY-1</li>
                <li>Privacy: privacy@zappay.com</li>
                <li>Compliance: compliance@zappay.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">About ZAPPAY</h3>
              <p className="text-sm text-slate-300">
                ZAPPAY is a payment processor engineered for the cannabis industry. We facilitate legal transactions between licensed farmers, dispensaries, and consumers — we do not sell, distribute, or handle cannabis products. Just 5.2% per transaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/for-farmers">
                    <a className="text-sm hover:text-blue-400 transition-colors">
                      For Farmers
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/for-transporters">
                    <a className="text-sm hover:text-blue-400 transition-colors">
                      For Transporters
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works">
                    <a className="text-sm hover:text-blue-400 transition-colors">
                      How It Works
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>© 2026 ZAPPAY. All rights reserved.</p>
            <p className="mt-2">
              For legal adult use only in states where cannabis is legal.
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" richColors />
    </div>
  );
}
