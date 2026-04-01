import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search, MapPin, Globe, Package, Sprout, Zap, Wrench,
  FlaskConical, Box, Cpu, HelpCircle, ExternalLink, ChevronRight, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: Package },
  { value: 'equipment', label: 'Equipment', icon: Wrench },
  { value: 'seeds', label: 'Seeds & Genetics', icon: Sprout },
  { value: 'nutrients', label: 'Nutrients', icon: FlaskConical },
  { value: 'lighting', label: 'Lighting', icon: Zap },
  { value: 'soil', label: 'Soil & Media', icon: Package },
  { value: 'packaging', label: 'Packaging', icon: Box },
  { value: 'services', label: 'Services', icon: Wrench },
  { value: 'technology', label: 'Technology', icon: Cpu },
  { value: 'other', label: 'Other', icon: HelpCircle },
];

const CATEGORY_COLORS: Record<string, string> = {
  equipment: 'bg-orange-100 text-orange-800',
  seeds: 'bg-green-100 text-green-800',
  nutrients: 'bg-teal-100 text-teal-800',
  lighting: 'bg-yellow-100 text-yellow-800',
  soil: 'bg-amber-100 text-amber-800',
  packaging: 'bg-slate-100 text-slate-700',
  services: 'bg-blue-100 text-blue-800',
  technology: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-700',
};

function formatPrice(cents: number, unitLabel: string) {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars} / ${unitLabel}`;
}

export default function GrowerMarketplace() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [localPickupOnly, setLocalPickupOnly] = useState(false);

  const { data: products = [], isLoading } = trpc.suppliers.browseProducts.useQuery(
    { category: activeCategory === 'all' ? undefined : activeCategory },
    { staleTime: 3 * 60 * 1000 }
  );

  const filtered = useMemo(() => {
    let list = products;
    if (localPickupOnly) list = list.filter(p => p.localPickup === 'yes');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q) ||
          (p.supplierName ?? '').toLowerCase().includes(q) ||
          (p.subcategory ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, search, localPickupOnly]);

  const handleExternalLink = (url: string | null, productName: string) => {
    if (!url) {
      toast({ title: 'Contact Supplier', description: `Contact the supplier directly to order ${productName}.` });
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Grower Marketplace</h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                Equipment, seeds, nutrients, lighting, soil, services, and more — sourced from verified suppliers nationwide. All transactions processed by ZAPPAY.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/supplier-application">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold whitespace-nowrap">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products, services, or suppliers..."
              className="pl-10 bg-white text-slate-900 border-0 h-12 text-base shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const count = cat.value === 'all'
                ? products.length
                : products.filter(p => p.category === cat.value).length;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat.value
                      ? 'bg-blue-900 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                      activeCategory === cat.value ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => setLocalPickupOnly(!localPickupOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
            localPickupOnly
              ? 'border-blue-900 bg-blue-900 text-white'
              : 'border-slate-300 bg-white text-slate-600 hover:border-blue-400'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Local Pickup Available
        </button>
        <span className="text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        </span>
      </div>

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              {search ? `No results for "${search}". Try a different search term.` : 'No suppliers have listed products in this category yet.'}
            </p>
            <Link href="/supplier-application">
              <Button className="bg-blue-900 text-white hover:bg-blue-800">
                Be the First to List Products
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(product => (
              <Card key={product.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group">
                {/* Product Image */}
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {product.photos ? (
                    <img
                      src={(() => {
                        try {
                          const parsed = JSON.parse(product.photos);
                          return Array.isArray(parsed) ? parsed[0] : product.photos;
                        } catch {
                          return product.photos;
                        }
                      })()}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-slate-300" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${CATEGORY_COLORS[product.category] ?? 'bg-slate-100 text-slate-700'}`}>
                      {product.category}
                    </span>
                  </div>
                  {/* Local Pickup Badge */}
                  {product.localPickup === 'yes' && (
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-600 text-white flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Local
                      </span>
                    </div>
                  )}
                  {/* Out of Stock Overlay */}
                  {product.inStock === 'no' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* Supplier */}
                  <div className="flex items-center gap-1.5 mb-1">
                    {product.supplierLogoUrl ? (
                      <img src={product.supplierLogoUrl} alt={product.supplierName ?? ''} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-blue-900 flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">{(product.supplierName ?? 'S')[0]}</span>
                      </div>
                    )}
                    <span className="text-xs text-slate-500 font-medium truncate">{product.supplierName ?? 'Supplier'}</span>
                    {product.supplierNationwide === 'yes' ? (
                      <Globe className="h-3 w-3 text-slate-400 ml-auto flex-shrink-0" />
                    ) : (
                      <MapPin className="h-3 w-3 text-slate-400 ml-auto flex-shrink-0" />
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>

                  {/* Subcategory */}
                  {product.subcategory && (
                    <p className="text-xs text-slate-400 mb-2">{product.subcategory}</p>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-blue-900 text-base">{formatPrice(product.unitPrice, product.unitLabel)}</span>
                      {product.minOrderQty > 1 && (
                        <span className="text-xs text-slate-400 block">Min. {product.minOrderQty} {product.unitLabel}s</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleExternalLink(product.externalUrl, product.name)}
                      disabled={product.inStock === 'no'}
                      className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3"
                    >
                      {product.externalUrl ? (
                        <>Order <ExternalLink className="h-3 w-3 ml-1" /></>
                      ) : (
                        'Inquire'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA for Suppliers */}
        {!isLoading && filtered.length > 0 && (
          <div className="mt-12 bg-blue-900 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Are you a supplier or manufacturer?</h3>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              List your products and services on ZAPPAY and reach thousands of licensed cannabis growers, dispensaries, and wholesalers nationwide. Integrated payment processing included.
            </p>
            <Link href="/supplier-application">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 text-base">
                Apply to List Your Products
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
