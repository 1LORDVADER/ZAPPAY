import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Leaf, Package, Zap, Star, ArrowUpDown, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

import { getGuestCartCount } from "@/lib/cartPersistence";
import { StateSelector } from "@/components/StateSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { AgeVerification } from "@/components/AgeVerification";
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { NavHeader } from "@/components/NavHeader";
import { Toaster } from "sonner";

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
  
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { data: cartItems = [] } = trpc.cart.getItems.useQuery();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setGuestCartCount(getGuestCartCount());
    }
  }, [isAuthenticated, cartItems]);
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.strain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesState = !userState || isLegal;
    const thcValue = parseFloat(product.thcPercentage || "0") || 0;
    const matchesTHC = thcValue >= filters.thcMin && thcValue <= filters.thcMax;
    const cbdValue = parseFloat(product.cbdPercentage || "0") || 0;
    const matchesCBD = cbdValue >= filters.cbdMin && cbdValue <= filters.cbdMax;
    const matchesStrainType = filters.strainTypes.length === 0 || 
      filters.strainTypes.some(type => product.strain.toLowerCase().includes(type.toLowerCase()));
    const matchesEffects = filters.effects.length === 0;
    const matchesFilterCategory = filters.categories.length === 0 || 
      filters.categories.includes(product.category);
    return matchesSearch && matchesCategory && matchesState && matchesTHC && matchesCBD && matchesStrainType && matchesEffects && matchesFilterCategory;
  }).sort((a, b) => {
    const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price);
    const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price);
    const thcA = parseFloat(a.thcPercentage || '0') || 0;
    const thcB = parseFloat(b.thcPercentage || '0') || 0;
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'thc-desc') return thcB - thcA;
    if (sortBy === 'rating-desc') return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
    return 0;
  });

  const cartItemCount = isAuthenticated 
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : guestCartCount;

  const getProductImage = (product: typeof products[0]) => {
    if (!product.photos) return null;
    try {
      const photos = typeof product.photos === 'string' ? JSON.parse(product.photos) : product.photos;
      return Array.isArray(photos) ? photos[0] : product.photos;
    } catch {
      return product.photos as string;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>
      <AgeVerification />
      <NavHeader />

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b2e 50%, #0a1628 100%)' }} className="py-16 px-4 border-b border-white/5">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Live Broker Pricing Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Cannabis Payments,{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #16a34a)' }}>
                Done Right
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              ZAPPAY processes payments between licensed farmers, dispensaries, and consumers — legally, instantly, at just 5.2%. We don't sell products; we power the transactions.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            {[
              { icon: <Leaf className="h-5 w-5 text-green-400" />, value: `${products.length}+`, label: "Listed Products", color: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
              { icon: <Zap className="h-5 w-5 text-blue-400" />, value: "5.2%", label: "Processing Fee", color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
              { icon: <Package className="h-5 w-5 text-purple-400" />, value: "24/7", label: "Always Open", color: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ background: stat.color, border: `1px solid ${stat.border}` }}>
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search strains, THC%, effects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-sm border-white/10 text-white placeholder:text-gray-500"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
              </div>
              <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 h-12 border-white/10 text-gray-300" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-gray-500" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="thc-desc">THC: Highest First</SelectItem>
                  <SelectItem value="rating-desc">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 px-4" style={{ background: '#0a0e1a' }}>
        <div className="container mx-auto">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
            {/* Category Tabs */}
            <div className="mb-8 overflow-x-auto">
              <TabsList className="inline-flex gap-1 p-1 rounded-xl h-auto" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { value: "all", label: "All Products" },
                  { value: "flower", label: "🌿 Flower" },
                  { value: "edibles", label: "🍬 Edibles" },
                  { value: "concentrates", label: "💎 Concentrates" },
                  { value: "pre-rolls", label: "🚬 Pre-Rolls" },
                  { value: "vapes", label: "💨 Vapes" },
                ].map(tab => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-gray-400 data-[state=active]:text-white data-[state=active]:bg-green-600 data-[state=active]:shadow-lg transition-all"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeCategory} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#141824', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="aspect-square" style={{ background: '#1a2030' }} />
                      <div className="p-4 space-y-3">
                        <div className="h-4 rounded" style={{ background: '#1a2030', width: '70%' }} />
                        <div className="h-3 rounded" style={{ background: '#1a2030', width: '50%' }} />
                        <div className="h-6 rounded" style={{ background: '#1a2030', width: '40%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Leaf className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No products found</p>
                  <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredProducts.map((product) => {
                    const imgSrc = getProductImage(product);
                    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price as string);
                    const retailPrice = product.retailPrice ? (typeof product.retailPrice === 'number' ? product.retailPrice : parseFloat(product.retailPrice as string)) : null;
                    const savings = retailPrice ? (retailPrice - price).toFixed(2) : null;
                    const rating = product.rating ? parseFloat(product.rating) : null;

                    return (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <div
                          className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                          style={{
                            background: '#141824',
                            border: '1px solid rgba(255,255,255,0.07)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(34,197,94,0.35)';
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(34,197,94,0.12)';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLDivElement).style.border = '1px solid rgba(255,255,255,0.07)';
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
                          }}
                        >
                          {/* Image Container */}
                          <div className="relative aspect-square overflow-hidden" style={{ background: '#1e2535' }}>
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Leaf className="h-16 w-16 text-green-800 opacity-40" />
                              </div>
                            )}
                            
                            {/* Top badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: 'rgba(0,0,0,0.7)', color: '#d1d5db', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {product.category}
                              </span>
                              {product.isPreOrder && product.status !== 'sold_out' && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(234,88,12,0.9)', color: 'white' }}>
                                  Pre-Order
                                </span>
                              )}
                              {product.isFeatured && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.9)', color: 'white' }}>
                                  Ready to Ship
                                </span>
                              )}
                              {product.status === 'growing' && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(217,119,6,0.9)', color: 'white' }}>
                                  Being Cultivated
                                </span>
                              )}
                            </div>

                            {/* Savings badge top-right */}
                            {savings && (
                              <div className="absolute top-3 right-3">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(22,163,74,0.9)', color: 'white' }}>
                                  <TrendingDown className="h-3 w-3" />
                                  -{savings}/g
                                </span>
                              </div>
                            )}

                            {/* Sold out overlay */}
                            {product.status === 'sold_out' && (
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                <span className="text-white font-black text-xl tracking-widest rotate-[-12deg] px-4 py-2 rounded border-2 border-white/60">SOLD OUT</span>
                              </div>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-4">
                            {/* Product name */}
                            <h3 className="font-bold text-white text-base mb-0.5 truncate">{product.name}</h3>
                            <p className="text-sm mb-2.5 truncate" style={{ color: '#6b7280' }}>{product.strain}</p>

                            {/* THC / CBD row */}
                            <div className="flex items-center gap-3 mb-2.5">
                              {product.thcPercentage && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                                  THC {product.thcPercentage}
                                </span>
                              )}
                              {product.cbdPercentage && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                                  CBD {product.cbdPercentage}
                                </span>
                              )}
                            </div>

                            {/* Star rating */}
                            {rating && (
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : i < rating ? "fill-yellow-400 text-yellow-400 opacity-40" : "text-gray-600"}`}
                                  />
                                ))}
                                <span className="text-xs ml-1" style={{ color: '#9ca3af' }}>{product.rating}</span>
                              </div>
                            )}

                            {/* Divider */}
                            <div className="mb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                            {/* Price block */}
                            <div className="flex items-end justify-between">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-2xl font-black text-white">${price.toFixed(2)}</span>
                                  <span className="text-sm" style={{ color: '#6b7280' }}>/gram</span>
                                </div>
                                {retailPrice && (
                                  <span className="text-xs line-through" style={{ color: '#4b5563' }}>${retailPrice.toFixed(2)}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                                  4g min
                                </div>
                                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>From ${(price * 4).toFixed(2)}</p>
                              </div>
                            </div>

                            {/* Low stock warning */}
                            {product.quantity < 10 && product.quantity > 0 && product.status === 'active' && (
                              <p className="text-xs mt-2 font-medium" style={{ color: '#f97316' }}>
                                ⚠ Only {product.quantity} left
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 mt-8" style={{ background: '#080c16', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  { href: "/legal/terms-of-service", label: "Terms of Service" },
                  { href: "/legal/privacy-policy", label: "Privacy Policy" },
                  { href: "/legal/refund-policy", label: "Refund Policy" },
                  { href: "/legal/age-verification-policy", label: "Age Verification" },
                  { href: "/legal/prohibited-use-policy", label: "Prohibited Use" },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm transition-colors" style={{ color: '#6b7280' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                    >{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Contact</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                <li>support@zappay.com</li>
                <li>1-800-ZAPPAY-1</li>
                <li>privacy@zappay.com</li>
                <li>compliance@zappay.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">About ZAPPAY</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                ZAPPAY is a payment processor engineered for the cannabis industry. We facilitate legal transactions between licensed farmers, dispensaries, and consumers — we do not sell, distribute, or handle cannabis products. Just 5.2% per transaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-2">
                {[
                  { href: "/for-farmers", label: "For Farmers" },
                  { href: "/for-transporters", label: "For Transporters" },
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/pricing", label: "Pricing" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-sm cursor-pointer transition-colors" style={{ color: '#6b7280' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#60a5fa')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                      >{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#4b5563' }}>
            <p>© 2026 ZAPPAY. All rights reserved. For legal adult use only in states where cannabis is legal.</p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" richColors />
    </div>
  );
}
