import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getLoginUrl } from "@/const";
import {
  Package, Plus, Edit2, Trash2, CheckCircle, XCircle,
  Globe, Instagram, Facebook, Twitter, Linkedin, Youtube,
  MapPin, Truck, DollarSign, BarChart3, AlertCircle
} from "lucide-react";

const CATEGORIES = [
  { value: "seeds", label: "Seeds & Genetics" },
  { value: "equipment", label: "Equipment & Hardware" },
  { value: "nutrients", label: "Nutrients & Fertilizers" },
  { value: "lighting", label: "Lighting Systems" },
  { value: "soil", label: "Soil & Growing Media" },
  { value: "packaging", label: "Packaging & Labeling" },
  { value: "services", label: "Professional Services" },
  { value: "technology", label: "Technology & Software" },
  { value: "other", label: "Other" },
] as const;

type Category = typeof CATEGORIES[number]["value"];

interface ProductForm {
  name: string;
  description: string;
  category: Category;
  subcategory: string;
  unitPrice: number;
  unitLabel: string;
  minOrderQty: number;
  inStock: boolean;
  localPickup: boolean;
  externalUrl: string;
}

const emptyProduct: ProductForm = {
  name: "", description: "", category: "other", subcategory: "",
  unitPrice: 0, unitLabel: "each", minOrderQty: 1,
  inStock: true, localPickup: false, externalUrl: "",
};

export default function SupplierDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const [productDialog, setProductDialog] = useState<{ open: boolean; editing?: number }>({ open: false });
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: profile, isLoading: profileLoading } = trpc.suppliers.myProfile.useQuery(undefined, { enabled: isAuthenticated });
  const { data: products = [], isLoading: productsLoading } = trpc.suppliers.myProducts.useQuery(undefined, { enabled: isAuthenticated && !!profile });

  const updateProfileMutation = trpc.suppliers.updateProfile.useMutation({
    onSuccess: () => { toast({ title: "Profile updated" }); utils.suppliers.myProfile.invalidate(); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const createProductMutation = trpc.suppliers.createProduct.useMutation({
    onSuccess: () => { toast({ title: "Product added" }); utils.suppliers.myProducts.invalidate(); setProductDialog({ open: false }); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateProductMutation = trpc.suppliers.updateProduct.useMutation({
    onSuccess: () => { toast({ title: "Product updated" }); utils.suppliers.myProducts.invalidate(); setProductDialog({ open: false }); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteProductMutation = trpc.suppliers.deleteProduct.useMutation({
    onSuccess: () => { toast({ title: "Product deleted" }); utils.suppliers.myProducts.invalidate(); setDeleteConfirm(null); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleStockMutation = trpc.suppliers.updateProduct.useMutation({
    onSuccess: () => utils.suppliers.myProducts.invalidate(),
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardContent className="pt-10 pb-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-slate-500 mb-6">Sign in to access your supplier dashboard.</p>
            <Button onClick={() => window.location.href = getLoginUrl()} className="bg-blue-900 hover:bg-blue-800 text-white">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardContent className="pt-10 pb-8">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Supplier Profile</h2>
            <p className="text-slate-500 mb-6">
              Your supplier application is pending review, or you haven't applied yet.
            </p>
            <Button onClick={() => window.location.href = "/supplier/apply"} className="bg-blue-900 hover:bg-blue-800 text-white">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openNewProduct = () => {
    setProductForm(emptyProduct);
    setProductDialog({ open: true });
  };

  const openEditProduct = (p: typeof products[0]) => {
    setProductForm({
      name: p.name,
      description: p.description ?? "",
      category: p.category as Category,
      subcategory: p.subcategory ?? "",
      unitPrice: p.unitPrice,
      unitLabel: p.unitLabel,
      minOrderQty: p.minOrderQty,
      inStock: p.inStock === "yes",
      localPickup: p.localPickup === "yes",
      externalUrl: p.externalUrl ?? "",
    });
    setProductDialog({ open: true, editing: p.id });
  };

  const saveProduct = () => {
    if (!productForm.name || !productForm.unitPrice) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    if (productDialog.editing) {
      updateProductMutation.mutate({ id: productDialog.editing, ...productForm });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const activeProducts = products.filter((p) => p.status === "active");
  const inactiveProducts = products.filter((p) => p.status !== "active");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt={profile.businessName} className="h-12 w-12 rounded-lg object-cover bg-white" />
              ) : (
                <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white/60" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{profile.businessName}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs border-0 ${profile.status === "approved" ? "bg-green-600" : profile.status === "suspended" ? "bg-red-600" : "bg-amber-600"}`}>
                    {profile.status}
                  </Badge>
                  {profile.featured === "yes" && (
                    <Badge className="text-xs bg-yellow-500 border-0 text-yellow-900">Featured</Badge>
                  )}
                  <span className="text-blue-200 text-sm">{profile.supplierType}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-center">
              <div>
                <div className="text-2xl font-bold">{activeProducts.length}</div>
                <div className="text-xs text-blue-200">Active Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{products.length}</div>
                <div className="text-xs text-blue-200">Total Products</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="profile">Brand Profile</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Your Listings</h2>
              <Button onClick={openNewProduct} className="bg-blue-900 hover:bg-blue-800 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-300 bg-transparent shadow-none">
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-600 mb-2">No products yet</h3>
                  <p className="text-slate-400 text-sm mb-4">Add your first product to start appearing in the Grower Marketplace.</p>
                  <Button onClick={openNewProduct} variant="outline" className="border-blue-900 text-blue-900">
                    <Plus className="h-4 w-4 mr-2" /> Add First Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <Card key={p.id} className={`shadow-sm border transition-all hover:shadow-md ${p.status !== "active" ? "opacity-60" : ""}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{p.name}</CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {CATEGORIES.find((c) => c.value === p.category)?.label}
                            {p.subcategory && ` · ${p.subcategory}`}
                          </CardDescription>
                        </div>
                        <Badge variant={p.inStock === "yes" ? "default" : "secondary"} className="text-xs shrink-0">
                          {p.inStock === "yes" ? "In Stock" : "Out"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {p.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-slate-900 font-semibold">
                          <DollarSign className="h-4 w-4" />
                          <span>{(p.unitPrice / 100).toFixed(2)}</span>
                          <span className="text-xs text-slate-400 font-normal">/ {p.unitLabel}</span>
                        </div>
                        <span className="text-xs text-slate-400">Min: {p.minOrderQty}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs h-8"
                          onClick={() => toggleStockMutation.mutate({ id: p.id, inStock: p.inStock !== "yes" })}
                        >
                          {p.inStock === "yes" ? <XCircle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                          {p.inStock === "yes" ? "Mark Out" : "Mark In"}
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openEditProduct(p)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={() => setDeleteConfirm(p.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="shadow-sm border-0">
              <CardHeader>
                <CardTitle>Brand Profile</CardTitle>
                <CardDescription>This information appears on your public supplier page.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileEditor profile={profile} onSave={(data) => updateProfileMutation.mutate(data)} saving={updateProfileMutation.isPending} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Dialog */}
      <Dialog open={productDialog.open} onOpenChange={(o) => setProductDialog({ open: o })}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productDialog.editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Product Name *</Label>
                <Input value={productForm.name} onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))} placeholder="Product name" />
              </div>
              <div className="space-y-1">
                <Label>Category *</Label>
                <Select value={productForm.category} onValueChange={(v) => setProductForm((f) => ({ ...f, category: v as Category }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Subcategory</Label>
                <Input value={productForm.subcategory} onChange={(e) => setProductForm((f) => ({ ...f, subcategory: e.target.value }))} placeholder="e.g. Feminized" />
              </div>
              <div className="space-y-1">
                <Label>Price (cents) *</Label>
                <Input type="number" min={1} value={productForm.unitPrice} onChange={(e) => setProductForm((f) => ({ ...f, unitPrice: parseInt(e.target.value) || 0 }))} placeholder="e.g. 1500 = $15.00" />
                <p className="text-xs text-slate-400">Enter in cents: 1500 = $15.00</p>
              </div>
              <div className="space-y-1">
                <Label>Unit Label</Label>
                <Input value={productForm.unitLabel} onChange={(e) => setProductForm((f) => ({ ...f, unitLabel: e.target.value }))} placeholder="each, pack, lb, oz" />
              </div>
              <div className="space-y-1">
                <Label>Min Order Qty</Label>
                <Input type="number" min={1} value={productForm.minOrderQty} onChange={(e) => setProductForm((f) => ({ ...f, minOrderQty: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Description</Label>
                <Textarea value={productForm.description} onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))} rows={2} placeholder="Describe your product..." />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>External URL</Label>
                <Input value={productForm.externalUrl} onChange={(e) => setProductForm((f) => ({ ...f, externalUrl: e.target.value }))} placeholder="https://your-store.com/product" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="inStock" checked={productForm.inStock} onChange={(e) => setProductForm((f) => ({ ...f, inStock: e.target.checked }))} className="h-4 w-4" />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="localPickup" checked={productForm.localPickup} onChange={(e) => setProductForm((f) => ({ ...f, localPickup: e.target.checked }))} className="h-4 w-4" />
                <Label htmlFor="localPickup">Local Pickup Available</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialog({ open: false })}>Cancel</Button>
            <Button onClick={saveProduct} disabled={createProductMutation.isPending || updateProductMutation.isPending} className="bg-blue-900 hover:bg-blue-800 text-white">
              {createProductMutation.isPending || updateProductMutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirm !== null} onOpenChange={(o) => !o && setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 text-sm">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteProductMutation.mutate({ id: deleteConfirm })} disabled={deleteProductMutation.isPending}>
              {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Profile Editor sub-component ────────────────────────────────────────────
type SupplierRow = {
  id: number; userId: number; businessName: string; slug: string;
  supplierType: string; description: string | null; logoUrl: string | null;
  websiteUrl: string | null; instagramUrl: string | null; facebookUrl: string | null;
  twitterUrl: string | null; linkedinUrl: string | null; youtubeUrl: string | null;
  contactName: string | null; contactEmail: string | null; contactPhone: string | null;
  state: string | null; city: string | null; zipCode: string | null;
  nationwide: string; status: string; featured: string;
  createdAt: Date; updatedAt: Date;
};
function ProfileEditor({ profile, onSave, saving }: {
  profile: SupplierRow;
  onSave: (data: Record<string, unknown>) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    businessName: profile.businessName,
    description: profile.description ?? "",
    logoUrl: profile.logoUrl ?? "",
    websiteUrl: profile.websiteUrl ?? "",
    instagramUrl: profile.instagramUrl ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    twitterUrl: profile.twitterUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    youtubeUrl: profile.youtubeUrl ?? "",
    contactName: profile.contactName ?? "",
    contactEmail: profile.contactEmail ?? "",
    contactPhone: profile.contactPhone ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    zipCode: profile.zipCode ?? "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Business Name</Label>
          <Input value={form.businessName} onChange={set("businessName")} />
        </div>
        <div className="space-y-1">
          <Label>Logo URL</Label>
          <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://..." />
        </div>
        <div className="md:col-span-2 space-y-1">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={set("description")} rows={3} />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><Globe className="h-4 w-4" /> Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "websiteUrl", icon: Globe, placeholder: "https://yoursite.com" },
            { key: "instagramUrl", icon: Instagram, placeholder: "https://instagram.com/..." },
            { key: "facebookUrl", icon: Facebook, placeholder: "https://facebook.com/..." },
            { key: "twitterUrl", icon: Twitter, placeholder: "https://twitter.com/..." },
            { key: "linkedinUrl", icon: Linkedin, placeholder: "https://linkedin.com/..." },
            { key: "youtubeUrl", icon: Youtube, placeholder: "https://youtube.com/..." },
          ].map(({ key, icon: Icon, placeholder }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-slate-400 shrink-0" />
              <Input value={(form as any)[key]} onChange={set(key)} placeholder={placeholder} className="text-sm" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-slate-700 mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Location & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input value={form.city} onChange={set("city")} placeholder="City" />
          <Input value={form.state} onChange={set("state")} placeholder="State (2-letter)" maxLength={2} />
          <Input value={form.zipCode} onChange={set("zipCode")} placeholder="ZIP Code" />
          <Input value={form.contactName} onChange={set("contactName")} placeholder="Contact Name" />
          <Input value={form.contactEmail} onChange={set("contactEmail")} placeholder="Contact Email" />
          <Input value={form.contactPhone} onChange={set("contactPhone")} placeholder="Phone" />
        </div>
      </div>

      <Button onClick={() => onSave(form)} disabled={saving} className="bg-blue-900 hover:bg-blue-800 text-white">
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
