import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Search, Zap, Star, ArrowUpDown, TrendingDown, Shield, Clock, CreditCard, Leaf } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getGuestCartCount } from "@/lib/cartPersistence";
import { StateSelector } from "@/components/StateSelector";
import { useGeolocation } from "@/hooks/useGeolocation";
import { AgeVerification } from "@/components/AgeVerification";
import { AdvancedFilters, type FilterState } from "@/components/AdvancedFilters";
import { NavHeader } from "@/components/NavHeader";
import { Toaster } from "sonner";

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
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.18)",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Insurance Payments",
    desc: "ZAPPAY supports insurance payment processing for medical cannabis patients.",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.18)",
  },
  {
    icon: <TrendingDown className="h-5 w-5" />,
    title: "Live Broker Pricing",
    desc: "Dynamic real-time pricing direct from licensed farmers — no dispensary markup.",
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.18)",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Just 5.2% Per Transaction",
    desc: "The lowest processing fee in the cannabis industry. Farmers keep 94.8%.",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.18)",
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
    <div className="min-h-screen" style={{ background: '#080c14' }}>
      <AgeVerification />
      <NavHeader />

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0d1520 0%, #0a1628 40%, #060e1a 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Ambient glow blobs — GPU-composited, no layout impact */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-120px', left: '-80px', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            top: '60px', right: '-100px', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)',
            animation: 'pulse 8s ease-in-out infinite 2s',
          }}
        />

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          {/* Live badge */}
          <div className="flex justify-center mb-6">
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                color: '#4ade80',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              Live Broker Pricing Active — Prices Update in Real Time
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto mb-6">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-5"
              style={{ color: '#ffffff' }}
            >
              Cannabis Payments
              <br />
              <span
                style={{
                  backgroundImage: 'linear-gradient(90deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
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
          <div className="flex flex-wrap gap-3 justify-center mb-14">
            <Link href="/how-it-works">
              <Button
                size="lg"
                className="font-bold px-8 text-black"
                style={{ background: 'linear-gradient(90deg, #22c55e, #16a34a)', border: 'none' }}
              >
                How It Works
              </Button>
            </Link>
            <Link href="/apply">
              <Button
                size="lg"
                variant="outline"
                className="font-bold px-8 text-white"
                style={{ borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
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
        </div>
      </section>

      {/* ─── PRODUCT SECTION ─── */}
      <section className="py-12 px-4" style={{ background: '#080c14' }}>
        <div className="container mx-auto">

          {/* Search + Filters row */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search strains, THC%, effects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 text-sm text-white placeholder:text-gray-500"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger
                className="w-44 h-11 text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
              >
                <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-gray-400" />
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
                        background: '#22c55e',
                        color: '#000',
                        border: '1px solid #22c55e',
                        boxShadow: '0 0 16px rgba(34,197,94,0.35)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8',
                        border: '1px solid rgba(255,255,255,0.1)',
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
            <p className="text-sm" style={{ color: '#64748b' }}>
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
                  className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="aspect-square" style={{ background: '#1a2234' }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded-lg" style={{ background: '#1a2234', width: '70%' }} />
                    <div className="h-3 rounded-lg" style={{ background: '#1a2234', width: '50%' }} />
                    <div className="h-6 rounded-lg" style={{ background: '#1a2234', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <Leaf className="h-14 w-14 mx-auto mb-4" style={{ color: '#1e3a2f' }} />
              <p className="text-lg font-semibold text-white mb-1">No products found</p>
              <p className="text-sm" style={{ color: '#64748b' }}>Try adjusting your filters or search query</p>
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
                      className="group rounded-2xl overflow-hidden cursor-pointer"
                      style={{
                        background: '#111827',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
                        transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                        animation: `fadeSlideUp 0.4s ease both`,
                        animationDelay: `${Math.min(idx * 40, 400)}ms`,
                      }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(-4px)';
                        el.style.borderColor = 'rgba(34,197,94,0.4)';
                        el.style.boxShadow = '0 12px 40px rgba(34,197,94,0.12)';
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement;
                        el.style.transform = 'translateY(0)';
                        el.style.borderColor = 'rgba(255,255,255,0.08)';
                        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden" style={{ background: '#1a2234' }}>
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
                            <Leaf className="h-16 w-16 opacity-20" style={{ color: '#22c55e' }} />
                          </div>
                        )}

                        {/* Top-left badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                            style={{ background: 'rgba(0,0,0,0.72)', color: '#cbd5e1', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
                          >
                            {product.category}
                          </span>
                          {product.isPreOrder && product.status !== 'sold_out' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(234,88,12,0.92)', color: 'white' }}>
                              Pre-Order
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.92)', color: 'white' }}>
                              Ready to Ship
                            </span>
                          )}
                          {product.status === 'growing' && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(217,119,6,0.92)', color: 'white' }}>
                              Being Cultivated
                            </span>
                          )}
                        </div>

                        {/* Savings badge */}
                        {savings && (
                          <div className="absolute top-3 right-3">
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                              style={{ background: 'rgba(22,163,74,0.92)', color: 'white' }}
                            >
                              <TrendingDown className="h-3 w-3" />
                              -{savings}/g
                            </span>
                          </div>
                        )}

                        {/* Sold out overlay */}
                        {product.status === 'sold_out' && (
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
                            <span className="text-white font-black text-xl tracking-widest rotate-[-12deg] px-4 py-2 rounded border-2 border-white/60">SOLD OUT</span>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <h3 className="font-bold text-white text-base mb-0.5 truncate">{product.name}</h3>
                        <p className="text-sm mb-2.5 truncate" style={{ color: '#64748b' }}>{product.strain}</p>

                        {/* THC / CBD */}
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          {product.thcPercentage && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}
                            >
                              THC {product.thcPercentage}
                            </span>
                          )}
                          {product.cbdPercentage && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded"
                              style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}
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
                                className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`}
                              />
                            ))}
                            <span className="text-xs ml-1" style={{ color: '#94a3b8' }}>{product.rating}</span>
                          </div>
                        )}

                        <div className="mb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

                        {/* Price */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-2xl font-black text-white">${price.toFixed(2)}</span>
                              <span className="text-sm" style={{ color: '#64748b' }}>/gram</span>
                            </div>
                            {retailPrice && (
                              <span className="text-xs line-through" style={{ color: '#374151' }}>
                                ${retailPrice.toFixed(2)}/g
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div
                              className="text-xs font-bold px-2 py-1 rounded-lg"
                              style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.2)' }}
                            >
                              4g min
                            </div>
                            <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                              From ${(price * 4).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {product.quantity < 10 && product.quantity > 0 && product.status === 'active' && (
                          <p className="text-xs mt-2 font-semibold" style={{ color: '#f97316' }}>
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
      <footer className="py-14 mt-6" style={{ background: '#060a10', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
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
                    <a href={link.href} className="text-sm transition-colors hover:text-blue-400" style={{ color: '#64748b' }}>
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
                      <span className="text-sm cursor-pointer transition-colors hover:text-blue-400" style={{ color: '#64748b' }}>
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#374151' }}>
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
