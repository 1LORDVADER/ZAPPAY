import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import {
  Package, DollarSign, Truck, MapPin, Globe, Instagram,
  Facebook, Twitter, Linkedin, Youtube, ExternalLink, ArrowLeft,
  Loader2, AlertCircle
} from "lucide-react";

const CATEGORIES: Record<string, string> = {
  seeds: "Seeds & Genetics",
  equipment: "Equipment",
  nutrients: "Nutrients",
  lighting: "Lighting",
  soil: "Soil & Media",
  packaging: "Packaging",
  services: "Services",
  technology: "Technology",
  other: "Other",
};

export default function SupplierBrandPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = trpc.suppliers.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardContent className="pt-10 pb-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Supplier Not Found</h2>
            <p className="text-slate-500 mb-6">This supplier page does not exist or is not currently active.</p>
            <Link href="/grower-marketplace">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { supplier, products } = data;

  const socialLinks = [
    { key: "instagramUrl", icon: Instagram, label: "Instagram", url: supplier.instagramUrl },
    { key: "facebookUrl", icon: Facebook, label: "Facebook", url: supplier.facebookUrl },
    { key: "twitterUrl", icon: Twitter, label: "Twitter", url: supplier.twitterUrl },
    { key: "linkedinUrl", icon: Linkedin, label: "LinkedIn", url: supplier.linkedinUrl },
    { key: "youtubeUrl", icon: Youtube, label: "YouTube", url: supplier.youtubeUrl },
  ].filter((s) => s.url);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Link href="/grower-marketplace">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Grower Marketplace
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-blue-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-5">
            {supplier.logoUrl ? (
              <img
                src={supplier.logoUrl}
                alt={supplier.businessName}
                className="h-16 w-16 rounded-xl object-cover border-2 border-white/20 shadow-lg"
              />
            ) : (
              <div className="h-16 w-16 bg-white/10 rounded-xl flex items-center justify-center">
                <Package className="h-8 w-8 text-white/60" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold">{supplier.businessName}</h1>
                {supplier.featured === "yes" && (
                  <Badge className="bg-yellow-400 text-yellow-900 text-xs border-0">Featured</Badge>
                )}
              </div>
              <p className="text-blue-200 text-sm capitalize">{supplier.supplierType}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {(supplier.city || supplier.state) && (
                  <span className="flex items-center gap-1 text-xs text-blue-300">
                    <MapPin className="h-3 w-3" />
                    {[supplier.city, supplier.state].filter(Boolean).join(", ")}
                  </span>
                )}
                {supplier.nationwide === "yes" && (
                  <span className="flex items-center gap-1 text-xs text-blue-300">
                    <Truck className="h-3 w-3" /> Ships Nationwide
                  </span>
                )}
                {supplier.websiteUrl && (
                  <a
                    href={supplier.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-white transition-colors"
                  >
                    <Globe className="h-3 w-3" /> Website
                  </a>
                )}
                {socialLinks.map(({ key, icon: Icon, label, url }) => (
                  <a
                    key={key}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {supplier.description && (
            <p className="text-blue-200 text-sm mt-4 max-w-3xl">{supplier.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Products ({products.length})</h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>This supplier has not listed any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((p) => (
              <Card key={p.id} className="shadow-sm border hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {CATEGORIES[p.category] ?? p.category}
                    </Badge>
                    <Badge
                      variant={p.inStock === "yes" ? "default" : "secondary"}
                      className="text-xs shrink-0"
                    >
                      {p.inStock === "yes" ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                  {p.subcategory && (
                    <CardDescription className="text-xs">{p.subcategory}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <DollarSign className="h-4 w-4" />
                      <span>{(p.unitPrice / 100).toFixed(2)}</span>
                      <span className="text-xs text-slate-400 font-normal">/ {p.unitLabel}</span>
                    </div>
                    <span className="text-xs text-slate-400">Min {p.minOrderQty}</span>
                  </div>
                  <div className="flex gap-3 mb-2">
                    {p.localPickup === "yes" && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" /> Pickup
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Truck className="h-3 w-3" /> Ships
                    </div>
                  </div>
                  {p.externalUrl && (
                    <a
                      href={p.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View on supplier site
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
