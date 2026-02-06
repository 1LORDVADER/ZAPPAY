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
import { motion } from "framer-motion";
import { APP_LOGO, APP_TITLE } from "@/const";

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
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring" as const, stiffness: 100 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <img 
                  src="/logo.png"
                  alt="ZAPPAY Logo"
                  className="h-14 w-auto object-contain cursor-pointer"
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/">
                  <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                    Browse
                  </a>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/orders">
                  <a className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                    My Orders
                  </a>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/cart">
                  <a className="relative">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                      {cartItemCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {cartItemCount}
                        </motion.span>
                      )}
                    </Button>
                  </a>
                </Link>
              </motion.div>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user?.email}</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="sm">
                    <a href={getLoginUrl()}>Login</a>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-12 px-4"
      >
        <div className="container mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Premium Cannabis Marketplace
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Direct from verified farmers. 5.2% fees. Sub-1s payments.
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
                      <p className="text-sm text-slate-600">Premium Products</p>
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
                      <p className="text-sm text-slate-600">Platform Fee</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by strain, THC%, or price..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="flower">Flower</TabsTrigger>
                <TabsTrigger value="edibles">Edibles</TabsTrigger>
                <TabsTrigger value="concentrates">Concentrates</TabsTrigger>
                <TabsTrigger value="pre-rolls">Pre-Rolls</TabsTrigger>
                <TabsTrigger value="vapes">Vapes</TabsTrigger>
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
                      <Card className="overflow-hidden h-full hover:shadow-xl transition-all">
                        <CardHeader className="p-0">
                          <div className="relative h-48 bg-white overflow-hidden">
                            {product.photos ? (
                              <img 
                                src={product.photos} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
                                <Leaf className="h-20 w-20 text-green-600 opacity-20" />
                              </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge variant="secondary" className="capitalize bg-white/90">
                                {product.category}
                              </Badge>
                              {product.isPreOrder && (
                                <Badge variant="outline" className="bg-yellow-50">
                                  Pre-Order
                                </Badge>
                              )}
                            </div>
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

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-slate-900">
                              ${product.price}
                            </span>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Link href={`/product/${product.id}`}>
                                <Button size="sm">View Details</Button>
                              </Link>
                            </motion.div>
                          </div>

                          {product.quantity < 10 && product.quantity > 0 && (
                            <p className="text-xs text-orange-600 mt-2">
                              Only {product.quantity} left in stock!
                            </p>
                          )}
                          {product.quantity === 0 && (
                            <p className="text-xs text-red-600 mt-2">Out of stock</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
