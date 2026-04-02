import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Package, DollarSign, Truck, MapPin, ExternalLink,
  Leaf, Zap, Shield, ArrowRight, Info, Phone, Mail, Globe,
  CheckCircle2, XCircle, Building2, ChevronRight, ClipboardList,
  ChevronLeft, Send,
} from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "seeds", label: "Seeds & Genetics" },
  { value: "equipment", label: "Equipment" },
  { value: "nutrients", label: "Nutrients" },
  { value: "lighting", label: "Lighting" },
  { value: "soil", label: "Soil & Media" },
  { value: "packaging", label: "Packaging" },
  { value: "services", label: "Services" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
] as const;

type ProductRow = {
  product: {
    id: number;
    supplierId: number;
    name: string;
    description: string | null;
    category: string;
    subcategory: string | null;
    unitPrice: number;
    unitLabel: string;
    minOrderQty: number;
    inStock: string;
    localPickup: string;
    externalUrl: string | null;
  };
  supplierName: string;
  supplierSlug: string;
  supplierLogoUrl: string | null;
  supplierCity: string | null;
  supplierState: string | null;
  supplierNationwide: string;
  supplierContactEmail: string | null;
  supplierContactPhone: string | null;
  supplierWebsite: string | null;
};

const quoteSchema = z.object({
  requesterName: z.string().min(2, "Name is required"),
  requesterEmail: z.string().email("Valid email required"),
  requesterPhone: z.string().optional(),
  requesterCompany: z.string().optional(),
  deliveryState: z.string().length(2, "Select a state"),
  quantity: z.coerce.number().int().min(1, "Minimum 1"),
  notes: z.string().optional(),
});
type QuoteForm = z.infer<typeof quoteSchema>;

export default function GrowerMarketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selected, setSelected] = useState<ProductRow | null>(null);

  const { data: products = [], isLoading } = trpc.suppliers.browseProducts.useQuery({
    category: category !== "all" ? (category as any) : undefined,
    search: search || undefined,
    inStockOnly: inStockOnly || undefined,
    limit: 48,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/10 text-white border-white/20 text-sm">Grower Marketplace</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Everything Growers Need</h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-8">
            ZAPPAY is the neutral transaction rail connecting licensed growers with verified suppliers.
            Browse seeds, equipment, nutrients, and services — all processed through ZAPPAY's instant payment network.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-lg">
            {[
              { icon: Zap, label: "Instant ACH", desc: "Same-day settlement" },
              { icon: Shield, label: "Verified Suppliers", desc: "Admin-reviewed" },
              { icon: Truck, label: "Nationwide", desc: "All legal states" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center">
                <Icon className="h-5 w-5 text-red-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-blue-300">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, suppliers..."
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={inStockOnly ? "default" : "outline"}
              onClick={() => setInStockOnly((v) => !v)}
              className={inStockOnly ? "bg-blue-900 text-white" : ""}
            >
              In Stock Only
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-400 mb-6">
              {search || category !== "all" || inStockOnly
                ? "Try adjusting your filters."
                : "No suppliers have listed products yet. Be the first!"}
            </p>
            <Link href="/supplier/apply">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                Become a Supplier <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                {products.length} product{products.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((r) => (
                <ProductCard
                  key={r.product.id}
                  row={r as ProductRow}
                  onSelect={() => setSelected(r as ProductRow)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA for suppliers */}
      <div className="bg-blue-900 text-white py-16 mt-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Supplier?</h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join the ZAPPAY supplier network and reach licensed growers nationwide.
            ZAPPAY shows no favoritism — your products are listed by category and specs, not by brand.
          </p>
          <Link href="/supplier/apply">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
              Apply to Become a Supplier
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && <ProductDetail row={selected} onClose={() => setSelected(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ row, onSelect }: { row: ProductRow; onSelect: () => void }) {
  const { product, supplierName, supplierLogoUrl } = row;
  const categoryLabel = CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category;

  return (
    <Card
      className="shadow-sm border hover:shadow-md transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">{categoryLabel}</Badge>
          <Badge
            variant={product.inStock === "yes" ? "default" : "secondary"}
            className="text-xs shrink-0"
          >
            {product.inStock === "yes" ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        <CardTitle className="text-base leading-tight group-hover:text-blue-900 transition-colors">
          {product.name}
        </CardTitle>
        {product.subcategory && (
          <CardDescription className="text-xs">{product.subcategory}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {product.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 font-bold text-slate-900">
            <DollarSign className="h-4 w-4" />
            <span>{(product.unitPrice / 100).toFixed(2)}</span>
            <span className="text-xs text-slate-400 font-normal">/ {product.unitLabel}</span>
          </div>
          <span className="text-xs text-slate-400">Min {product.minOrderQty}</span>
        </div>
        <div className="flex gap-3 mb-3">
          {product.localPickup === "yes" && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" /> Pickup
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Truck className="h-3 w-3" /> Ships
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {supplierLogoUrl ? (
              <img src={supplierLogoUrl} alt={supplierName} className="h-5 w-5 rounded object-cover" />
            ) : (
              <div className="h-5 w-5 bg-slate-200 rounded flex items-center justify-center">
                <Package className="h-3 w-3 text-slate-400" />
              </div>
            )}
            <span className="text-xs text-slate-500 truncate">{supplierName}</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Product Detail Sheet Content ─────────────────────────────────────────────
function ProductDetail({ row, onClose }: { row: ProductRow; onClose: () => void }) {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const { product, supplierName, supplierSlug, supplierLogoUrl,
    supplierCity, supplierState, supplierNationwide,
    supplierContactEmail, supplierContactPhone, supplierWebsite } = row;

  const categoryLabel = CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category;
  const inStock = product.inStock === "yes";

  if (showQuoteForm) {
    return (
      <QuoteRequestForm
        row={row}
        onBack={() => setShowQuoteForm(false)}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col gap-0 h-full">
      <SheetHeader className="pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary" className="text-xs">{categoryLabel}</Badge>
          {product.subcategory && (
            <Badge variant="outline" className="text-xs">{product.subcategory}</Badge>
          )}
        </div>
        <SheetTitle className="text-xl leading-tight">{product.name}</SheetTitle>
        <SheetDescription className="text-sm">
          {product.description ?? "No description provided."}
        </SheetDescription>
      </SheetHeader>

      {/* Availability */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-sm font-medium ${
        inStock ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
      }`}>
        {inStock
          ? <><CheckCircle2 className="h-4 w-4" /> In Stock — Ready to ship</>
          : <><XCircle className="h-4 w-4" /> Currently out of stock</>
        }
      </div>

      {/* Pricing & Order Info */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Pricing & Order Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400">Unit Price</div>
            <div className="text-2xl font-bold text-slate-900">
              ${(product.unitPrice / 100).toFixed(2)}
              <span className="text-sm font-normal text-slate-400 ml-1">/ {product.unitLabel}</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Minimum Order</div>
            <div className="text-2xl font-bold text-slate-900">
              {product.minOrderQty}
              <span className="text-sm font-normal text-slate-400 ml-1">{product.unitLabel}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 text-sm text-slate-600">
          <span className="font-medium">Minimum order value: </span>
          ${((product.unitPrice * product.minOrderQty) / 100).toFixed(2)}
        </div>
      </div>

      {/* Logistics */}
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Fulfillment</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Truck className={`h-4 w-4 ${inStock ? "text-blue-500" : "text-slate-300"}`} />
            <span className="text-slate-700">Ships to all legal states</span>
          </div>
          {product.localPickup === "yes" && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-green-500" />
              <span className="text-slate-700">Local pickup available</span>
            </div>
          )}
        </div>
        {supplierNationwide === "yes" && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
            <Shield className="h-4 w-4" />
            Supplier ships/operates nationwide
          </div>
        )}
        {(supplierCity || supplierState) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            Based in {[supplierCity, supplierState].filter(Boolean).join(", ")}
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Supplier Info — secondary section */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Supplier</h3>
        <Link href={`/supplier/${supplierSlug}`} onClick={onClose}>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer group">
            {supplierLogoUrl ? (
              <img src={supplierLogoUrl} alt={supplierName} className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="h-10 w-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 text-sm">{supplierName}</div>
              <div className="text-xs text-slate-400">View brand page & all products</div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Contact links */}
      {(supplierContactEmail || supplierContactPhone || supplierWebsite) && (
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Direct Contact</h3>
          <div className="space-y-2">
            {supplierContactEmail && (
              <a
                href={`mailto:${supplierContactEmail}?subject=Inquiry: ${encodeURIComponent(product.name)}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Mail className="h-4 w-4" /> {supplierContactEmail}
              </a>
            )}
            {supplierContactPhone && (
              <a
                href={`tel:${supplierContactPhone}`}
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Phone className="h-4 w-4" /> {supplierContactPhone}
              </a>
            )}
            {supplierWebsite && (
              <a
                href={supplierWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Globe className="h-4 w-4" /> Supplier Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2 space-y-2">
        {product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white" size="lg">
              <ExternalLink className="mr-2 h-4 w-4" />
              Order on Supplier Site
            </Button>
          </a>
        ) : (
          <Button
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            size="lg"
            onClick={() => setShowQuoteForm(true)}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Request a Quote
          </Button>
        )}
        <p className="text-center text-xs text-slate-400">
          Payments processed securely through ZAPPAY's instant ACH network
        </p>
      </div>
    </div>
  );
}

// ─── Quote Request Form ───────────────────────────────────────────────────────
function QuoteRequestForm({ row, onBack, onClose }: {
  row: ProductRow;
  onBack: () => void;
  onClose: () => void;
}) {
  const { product, supplierName } = row;
  const [submitted, setSubmitted] = useState(false);

  const { toast } = useToast();
  const submitQuote = trpc.suppliers.submitQuote.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema) as any,
    defaultValues: { quantity: product.minOrderQty },
  });

  const deliveryState = watch("deliveryState");

  const onSubmitFn = (data: QuoteForm) => {
    submitQuote.mutate({
      supplierId: row.product.supplierId,
      productId: product.id,
      productName: product.name,
      requesterName: data.requesterName,
      requesterEmail: data.requesterEmail,
      requesterPhone: data.requesterPhone,
      requesterCompany: data.requesterCompany,
      deliveryState: data.deliveryState,
      quantity: Number(data.quantity),
      notes: data.notes,
    });
  };


  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Quote Request Sent</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            Your request for <strong>{product.name}</strong> has been submitted to <strong>{supplierName}</strong>.
            They will contact you directly to confirm pricing and availability.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button onClick={onBack} variant="outline" className="w-full">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Product
          </Button>
          <Button onClick={onClose} className="w-full bg-blue-900 hover:bg-blue-800 text-white">
            Browse More Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-2 -ml-1 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to product details
        </button>
        <SheetTitle className="text-lg">Request a Quote</SheetTitle>
        <SheetDescription className="text-sm">
          <span className="font-medium text-slate-700">{product.name}</span>
          {" "}from {supplierName} · ${(product.unitPrice / 100).toFixed(2)}/{product.unitLabel}
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit(onSubmitFn as any)} className="flex flex-col gap-4 flex-1 overflow-y-auto pb-4">
        {/* Contact info */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Contact Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="requesterName">Full Name *</Label>
              <Input id="requesterName" {...register("requesterName")} placeholder="Jane Smith" />
              {errors.requesterName && <p className="text-xs text-red-500 mt-1">{errors.requesterName.message}</p>}
            </div>
            <div>
              <Label htmlFor="requesterEmail">Email Address *</Label>
              <Input id="requesterEmail" type="email" {...register("requesterEmail")} placeholder="jane@farm.com" />
              {errors.requesterEmail && <p className="text-xs text-red-500 mt-1">{errors.requesterEmail.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="requesterPhone">Phone (optional)</Label>
                <Input id="requesterPhone" type="tel" {...register("requesterPhone")} placeholder="+1 555 000 0000" />
              </div>
              <div>
                <Label htmlFor="requesterCompany">Company (optional)</Label>
                <Input id="requesterCompany" {...register("requesterCompany")} placeholder="Green Acres LLC" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Order details */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Order Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="quantity">Quantity * (min {product.minOrderQty})</Label>
              <Input
                id="quantity"
                type="number"
                min={product.minOrderQty}
                {...register("quantity")}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <Label>Delivery State *</Label>
              <Select value={deliveryState} onValueChange={(v) => setValue("deliveryState", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.deliveryState && <p className="text-xs text-red-500 mt-1">{errors.deliveryState.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Specific requirements, delivery timeline, bulk pricing questions..."
              rows={3}
            />
          </div>
        </div>

        {/* Estimated value */}
        <div className="bg-blue-50 rounded-xl p-3 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Estimated order value</span>
            <span className="font-bold text-slate-900">
              ${((product.unitPrice * (Number(watch("quantity")) || product.minOrderQty)) / 100).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Final price confirmed by supplier · Processed via ZAPPAY ACH</p>
        </div>

        <div className="mt-auto">
          <Button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            size="lg"
            disabled={submitQuote.isPending}
          >
            <Send className="mr-2 h-4 w-4" />
            {submitQuote.isPending ? "Sending..." : "Submit Quote Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
