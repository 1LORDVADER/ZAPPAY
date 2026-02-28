import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Star, ArrowUpDown, TrendingDown, Shield, Clock, CreditCard, Leaf, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getGuestCartCount } from "@/lib/cartPersistence";
import { StateSelector } from "@/components/StateSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { AgeVerification } from "@/components/AgeVerification";
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { NavHeader } from "@/components/NavHeader";
import { Toaster } from "sonner";

// ZAPPAY Brand Colors
// Primary Red: #E8231A
// Navy Blue: #0D1B2A (dark) / #1e3a5f (mid)
// White: #FFFFFF

// Category icon CDN URLs
const CATEGORY_ICONS: Record<string, string> = {
  flower: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028620876/jWmfVYBaikHBYpPLbpiijG/icon-flower_b3c4344f.png",
  "pre-rolls": "https://d2xsxph8kpxj0f.cloudfront.net/310419663028620876/jWmfVYBaikHBYpPLbpiijG/icon-preroll_228e1e59.png",
  vapes: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028620876/jWmfVYBaikHBYpPLbpiijG/icon-vape_6f61752e.png",
  edibles: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028620876/jWmfVYBaikHBYpPLbpiijG/icon-edibles_54fc3a4e.png",
  concentrates: "https://d2xsxph8kpxj0f.cloudfront.net/310419663028620876/jWmfVYBaikHBYpPLbpiijG/icon-concentrates_aa52cac8.png",
};

const ADVANTAGES = [
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Sub-1 Second Settlement",
    desc: "Transactions confirmed and settled in under one second — faster than any bank.",
    color: "#E8231A",
    bg: "rgba(232,35,26,0.08)",
    border: "rgba(232,35,26,0.2)",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Insurance Payments",
    desc: "ZAPPAY supports insurance payment processing for medical cannabis patients.",
    color: "#4a9eff",
    bg: "rgba(74,158,255,0.08)",
    border: "rgba(74,158,255,0.2)",
  },
  {
    icon: <TrendingDown className="h-5 w-5" />,
    title: "Live Broker Pricing",
    desc: "Dynamic real-time pricing direct from licensed farmers — no dispensary markup.",
    color: "#ffffff",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.15)",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Just 5.2% Per Transaction",
    desc: "The lowest processing fee in the cannabis industry. Farmers keep 94.8%.",
    color: "#E8231A",
    bg: "rgba(232,35,26,0.08)",
    border: "rgba(232,35,26,0.2)",
  },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { userState, isLegal } = useGeolocation();
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
    const thcValue = parseFloat(product.thcPercentage || "0") || 0;
    const matchesTHC = thcValue >= filters.thcMin && thcValue <= filters.thcMax;
    const cbdValue = parseFloat(product.cbdPercentage || "0") || 0;
    const matchesCBD = cbdValue >= filters.cbdMin && cbdValue <= filters.cbdMax;
    const matchesStrainType = filters.strainTypes.length === 0 ||
      filters.strainTypes.some(type => product.strain.toLowerCase().includes(type.toLowerCase()));
    const matchesFilterCategory = filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    return matchesSearch && matchesCategory && matchesTHC && matchesCBD && matchesStrainType && matchesFilterCategory;
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

  const CATEGORIES = [
    { value: "all", label: "All Products", icon: null },
    { value: "flower", label: "Flower", icon: CATEGORY_ICONS.flower },
    { value: "edibles", label: "Edibles", icon: CATEGORY_ICONS.edibles },
    { value: "concentrates", label: "Concentrates", icon: CATEGORY_ICONS.concentrates },
    { value: "pre-rolls", label: "Pre-Rolls", icon: CATEGORY_ICONS["pre-rolls"] },
    { value: "vapes", label: "Vapes", icon: CATEGORY_ICONS.vapes },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <AgeVerification />
      <NavHeader />

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0D1B2A 0%, #0f2035 45%, #0a1628 100%)',
          borderBottom: '3px solid #E8231A',
        }}
      >
        {/* Subtle red glow top-left */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-80px', left: '-60px', width: '480px', height: '480px',
            background: 'radial-gradient(circle, rgba(232,35,26,0.12) 0%, transparent 65%)',
          }}
        />
        {/* Subtle blue glow top-right */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '40px', right: '-80px', width: '380px', height: '380px',
            background: 'radial-gradient(circle, rgba(74,158,255,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Diagonal red accent stripe */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(232,35,26,0.04) 0%, transparent 50%)',
          }}
        />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          {/* Live badge — ZAPPAY red */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm font-semibold tracking-wide"
              style={{
                background: 'rgba(232,35,26,0.12)',
                border: '1px solid rgba(232,35,26,0.4)',
                color: '#ff6b63',
              }}
            >
              <Zap className="h-3.5 w-3.5" style={{ color: '#E8231A' }} />
              Live Broker Pricing Active — Prices Update in Real Time
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-5xl mx-auto mb-8">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
              style={{ color: '#ffffff' }}
            >
              Cannabis Payments
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(90deg, #E8231A 0%, #ff4d46 40%, #c41a12 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Settled in &lt;1 Second
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
              ZAPPAY is the payment processor built for the cannabis industry — connecting licensed farmers, dispensaries, and consumers with instant ACH settlement, insurance payment support, and just a 5.2% processing fee.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/how-it-works">
              <Button
                size="lg"
                className="font-bold px-10 text-white text-base"
                style={{ background: '#E8231A', border: 'none', boxShadow: '0 4px 20px rgba(232,35,26,0.4)' }}
              >
                How It Works
              </Button>
            </Link>
            <Link href="/farmer/register">
              <Button
                size="lg"
                variant="outline"
                className="font-bold px-10 text-white text-base"
                style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)' }}
              >
                Apply as Farmer / Dispensary
              </Button>
            </Link>
          </div>

          {/* Advantage cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {ADVANTAGES.map((adv, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                style={{ background: adv.bg, border: `1px solid ${adv.border}` }}
              >
                <div className="mb-3" style={{ color: adv.color }}>{adv.icon}</div>
                <p className="font-bold text-white text-sm mb-1">{adv.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{adv.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div
            className="mt-14 rounded-2xl py-6 px-8 grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div>
              <div className="text-3xl font-black" style={{ color: '#E8231A' }}>5.2%</div>
              <div className="text-xs mt-1" style={{ color: '#64748b' }}>Commission Rate</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-3xl font-black text-white">50+</div>
              <div className="text-xs mt-1" style={{ color: '#64748b' }}>Legal States</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">&lt;1s</div>
              <div className="text-xs mt-1" style={{ color: '#64748b' }}>Settlement Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT SECTION ─── */}
      <section className="py-12 px-4" style={{ background: '#f8fafc' }}>
        <div className="container mx-auto">

          {/* Search + Filters row */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search strains, THC%, effects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-sm text-slate-800 placeholder:text-slate-400 bg-white border-slate-200 focus:border-[#1e3a5f] shadow-sm"
              />
            </div>
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-11 text-sm font-medium bg-white border-slate-200 text-slate-700 shadow-sm">
                <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-slate-400" />
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

          {/* Category tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={
                  activeCategory === cat.value
                    ? {
                        background: '#0D1B2A',
                        color: '#ffffff',
                        border: '1.5px solid #0D1B2A',
                        boxShadow: '0 2px 10px rgba(13,27,42,0.3)',
                      }
                    : {
                        background: '#ffffff',
                        color: '#475569',
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }
                }
              >
                {cat.icon ? (
                  <img src={cat.icon} alt={cat.label} className="w-5 h-5 object-contain" />
                ) : (
                  <Leaf className="h-4 w-4" />
                )}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500">
              {isLoading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} available`}
            </p>
            {userState && (
              <div className="flex items-center gap-2">
                <StateSelector />
              </div>
            )}
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden animate-pulse bg-white border border-slate-200 shadow-sm"
                >
                  <div className="aspect-square bg-slate-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded-lg bg-slate-100" style={{ width: '70%' }} />
                    <div className="h-3 rounded-lg bg-slate-100" style={{ width: '50%' }} />
                    <div className="h-6 rounded-lg bg-slate-100" style={{ width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <Leaf className="h-14 w-14 mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-semibold text-slate-700 mb-1">No products found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product, idx) => {
                const imgSrc = getProductImage(product);
                const price = typeof product.price === 'number' ? product.price : parseFloat(product.price as string);
                const retailPrice = product.retailPrice
                  ? (typeof product.retailPrice === 'number' ? product.retailPrice : parseFloat(product.retailPrice as string))
                  : null;
                const savings = retailPrice ? (retailPrice - price).toFixed(2) : null;
                const rating = product.rating ? parseFloat(product.rating) : null;

                return (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div
                      className="group rounded-2xl overflow-hidden cursor-pointer bg-white"
                      style={{
                        border: '1.5px solid #e2e8f0',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                        animation: `fadeSlideUp 0.4s ease both`,
                        animationDelay: `${Math.min(idx * 40, 400)}ms`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(-4px)';
                        el.style.borderColor = '#E8231A';
                        el.style.boxShadow = '0 8px 30px rgba(232,35,26,0.12), 0 0 0 1px #E8231A';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(0)';
                        el.style.borderColor = '#e2e8f0';
                        el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            style={{ transition: 'transform 0.5s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Leaf className="h-16 w-16 text-slate-200" />
                          </div>
                        )}

                        {/* Top-left badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                            style={{ background: 'rgba(255,255,255,0.92)', color: '#0D1B2A', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,0,0,0.08)' }}
                          >
                            {product.category}
                          </span>
                          {product.isPreOrder && product.status !== 'sold_out' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#E8231A', color: 'white' }}>
                              Pre-Order
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#0D1B2A', color: 'white' }}>
                              Ready to Ship
                            </span>
                          )}
                          {product.status === 'growing' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white">
                              Being Cultivated
                            </span>
                          )}
                        </div>

                        {/* Savings badge */}
                        {savings && (
                          <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: '#E8231A', color: 'white' }}>
                              <TrendingDown className="h-3 w-3" />
                              -{savings}/g
                            </span>
                          </div>
                        )}

                        {/* Sold out overlay */}
                        {product.status === 'sold_out' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                            <span className="font-black text-xl tracking-widest rotate-[-12deg] px-4 py-2 rounded border-2" style={{ color: '#0D1B2A', borderColor: '#0D1B2A' }}>SOLD OUT</span>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 text-base mb-0.5 truncate">{product.name}</h3>
                        <p className="text-sm mb-2.5 truncate text-slate-500">{product.strain}</p>

                        {/* THC / CBD */}
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          {product.thcPercentage && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'rgba(232,35,26,0.08)', color: '#c41a12', border: '1px solid rgba(232,35,26,0.2)' }}
                            >
                              THC {product.thcPercentage}
                            </span>
                          )}
                          {product.cbdPercentage && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'rgba(13,27,42,0.07)', color: '#1e3a5f', border: '1px solid rgba(13,27,42,0.15)' }}
                            >
                              CBD {product.cbdPercentage}
                            </span>
                          )}
                        </div>

                        {/* Rating */}
                        {rating && (
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                              />
                            ))}
                            <span className="text-xs ml-1 text-slate-400">{product.rating}</span>
                          </div>
                        )}

                        <div className="mb-3 border-t border-slate-100" />

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-slate-900">${price.toFixed(2)}</span>
                              <span className="text-sm text-slate-400">/gram</span>
                            </div>
                            {retailPrice && (
                              <span className="text-xs line-through text-slate-300">
                                ${retailPrice.toFixed(2)}/g
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className="text-xs font-bold px-2 py-1 rounded-lg"
                              style={{ background: 'rgba(13,27,42,0.07)', color: '#1e3a5f', border: '1px solid rgba(13,27,42,0.15)' }}
                            >
                              4g min
                            </div>
                            <p className="text-xs mt-1 text-slate-400">
                              From ${(price * 4).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {product.quantity < 10 && product.quantity > 0 && product.status === 'active' && (
                          <p className="text-xs mt-2 font-semibold" style={{ color: '#E8231A' }}>
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
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-14 mt-6" style={{ background: '#0D1B2A', borderTop: '3px solid #E8231A' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  { href: "/legal/terms-of-service", label: "Terms of Service" },
                  { href: "/legal/privacy-policy", label: "Privacy Policy" },
                  { href: "/legal/refund-policy", label: "Refund Policy" },
                  { href: "/legal/age-verification-policy", label: "Age Verification" },
                  { href: "/legal/prohibited-use-policy", label: "Prohibited Use" },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm transition-colors" style={{ color: '#64748b' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E8231A')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Contact</h3>
              <ul className="space-y-2 text-sm" style={{ color: '#64748b' }}>
                <li>support@zappay.com</li>
                <li>1-800-ZAPPAY-1</li>
                <li>privacy@zappay.com</li>
                <li>compliance@zappay.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">About ZAPPAY</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                ZAPPAY is a payment processor engineered for the cannabis industry. We facilitate legal transactions between licensed farmers, dispensaries, and consumers — we do not sell, distribute, or handle cannabis products. Just 5.2% per transaction.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Platform</h3>
              <ul className="space-y-2">
                {[
                  { href: "/for-farmers", label: "For Farmers" },
                  { href: "/for-transporters", label: "For Transporters" },
                  { href: "/how-it-works", label: "How It Works" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/advertise", label: "Advertise" },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <span className="text-sm cursor-pointer transition-colors" style={{ color: '#64748b' }}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', color: '#374151' }}>
            <p>© 2026 ZAPPAY. All rights reserved. For legal adult use only in states where cannabis is legal.</p>
          </div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Toaster position="top-right" richColors />
    </div>
  );
}
