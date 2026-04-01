import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getLoginUrl } from '@/const';
import {
  Package, Globe, MapPin, Instagram, Facebook,
  Twitter, Linkedin, Youtube, Plus, Edit, Trash2,
  ToggleLeft, ToggleRight, BarChart3, Users,
  ShoppingCart, TrendingUp, CheckCircle, AlertCircle,
  Building2, Loader2, Star, Phone, Mail, ExternalLink,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'seeds', label: 'Seeds' },
  { value: 'nutrients', label: 'Nutrients & Fertilizers' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'soil', label: 'Soil & Growing Media' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'services', label: 'Services' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

const UNIT_LABELS = ['unit', 'bag', 'lb', 'oz', 'gram', 'gallon', 'liter', 'box', 'pallet', 'hour', 'month', 'year', 'sq ft', 'each'];

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  unitPrice: string;
  unitLabel: string;
  minOrderQty: string;
  inStock: string;
  localPickup: string;
  externalUrl: string;
}

const emptyProduct: ProductFormData = {
  name: '',
  description: '',
  category: 'equipment',
  subcategory: '',
  unitPrice: '',
  unitLabel: 'unit',
  minOrderQty: '1',
  inStock: 'yes',
  localPickup: 'no',
  externalUrl: '',
};

export default function SupplierDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'profile'>('overview');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(emptyProduct);
  const [profileForm, setProfileForm] = useState<Record<string, string>>({});
  const [editingProfile, setEditingProfile] = useState(false);

  const { data: profile, isLoading: profileLoading } = trpc.suppliers.getMyProfile.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const { data: products, isLoading: productsLoading } = trpc.suppliers.getMyProducts.useQuery(undefined, {
    enabled: isAuthenticated && !!profile,
    staleTime: 30_000,
  });

  const createProduct = trpc.suppliers.createProduct.useMutation({
    onSuccess: () => {
      utils.suppliers.getMyProducts.invalidate();
      setShowProductDialog(false);
      setProductForm(emptyProduct);
      toast({ title: 'Product listed', description: 'Your product is now live on the Grower Marketplace.' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const updateProduct = trpc.suppliers.updateProduct.useMutation({
    onSuccess: () => {
      utils.suppliers.getMyProducts.invalidate();
      setShowProductDialog(false);
      setEditingProductId(null);
      setProductForm(emptyProduct);
      toast({ title: 'Product updated' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteProduct = trpc.suppliers.deleteProduct.useMutation({
    onSuccess: () => {
      utils.suppliers.getMyProducts.invalidate();
      toast({ title: 'Product removed' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleStock = trpc.suppliers.toggleProductStock.useMutation({
    onMutate: async ({ id, inStock }) => {
      await utils.suppliers.getMyProducts.cancel();
      const prev = utils.suppliers.getMyProducts.getData();
      utils.suppliers.getMyProducts.setData(undefined, (old) =>
        old?.map(p => p.id === id ? { ...p, inStock: inStock as any } : p) ?? []
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) utils.suppliers.getMyProducts.setData(undefined, ctx.prev);
    },
    onSettled: () => utils.suppliers.getMyProducts.invalidate(),
  });

  const updateProfileMutation = trpc.suppliers.updateMyProfile.useMutation({
    onSuccess: () => {
      utils.suppliers.getMyProfile.invalidate();
      setEditingProfile(false);
      toast({ title: 'Brand profile updated' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center shadow-xl border-0">
          <CardContent className="pt-10 pb-8 px-8">
            <Building2 className="h-12 w-12 text-blue-900 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Supplier Dashboard</h2>
            <p className="text-slate-500 mb-6">Sign in to manage your brand and product listings on ZAPPAY.</p>
            <Button className="bg-blue-900 text-white w-full" onClick={() => window.location.href = getLoginUrl()}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-lg w-full shadow-xl border-0">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Approved Supplier Profile</h2>
            <p className="text-slate-600 mb-2">
              Your account ({user?.email}) does not have an approved supplier profile yet.
            </p>
            <p className="text-slate-500 text-sm mb-6">
              If you have already applied, your application is under review. You will receive an email once approved.
            </p>
            <Link href="/supplier-application">
              <Button className="bg-blue-900 text-white">Apply as Supplier / Manufacturer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openCreateDialog = () => {
    setEditingProductId(null);
    setProductForm(emptyProduct);
    setShowProductDialog(true);
  };

  const openEditDialog = (p: any) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      description: p.description ?? '',
      category: p.category,
      subcategory: p.subcategory ?? '',
      unitPrice: (p.unitPrice / 100).toFixed(2),
      unitLabel: p.unitLabel,
      minOrderQty: String(p.minOrderQty),
      inStock: p.inStock,
      localPickup: p.localPickup,
      externalUrl: p.externalUrl ?? '',
    });
    setShowProductDialog(true);
  };

  const handleProductSubmit = () => {
    const priceInCents = Math.round(parseFloat(productForm.unitPrice) * 100);
    if (!productForm.name || isNaN(priceInCents) || priceInCents <= 0) {
      toast({ title: 'Validation Error', description: 'Product name and a valid price are required.', variant: 'destructive' });
      return;
    }
    const payload = {
      name: productForm.name,
      description: productForm.description || undefined,
      category: productForm.category,
      subcategory: productForm.subcategory || undefined,
      unitPrice: priceInCents,
      unitLabel: productForm.unitLabel,
      minOrderQty: parseInt(productForm.minOrderQty) || 1,
      inStock: productForm.inStock,
      localPickup: productForm.localPickup,
      externalUrl: productForm.externalUrl || undefined,
    };
    if (editingProductId) {
      updateProduct.mutate({ id: editingProductId, ...payload });
    } else {
      createProduct.mutate(payload);
    }
  };

  const inStockCount = products?.filter(p => p.inStock === 'yes').length ?? 0;
  const totalProducts = products?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt={profile.businessName} className="h-14 w-14 rounded-xl object-cover bg-white" />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-blue-800 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-blue-200" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{profile.businessName}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <Badge className="bg-green-600 text-white text-xs capitalize">{profile.status}</Badge>
                <span className="text-blue-200 text-sm capitalize">{profile.supplierType}</span>
                {profile.city && (
                  <span className="text-blue-200 text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{profile.city}{profile.state ? `, ${profile.state}` : ''}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto">
              <Link href="/grower-marketplace">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 text-sm">View Marketplace</Button>
              </Link>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {(['overview', 'products', 'profile'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'bg-white text-blue-900' : 'text-blue-200 hover:text-white'
                }`}
              >
                {tab === 'products' ? `Products (${totalProducts})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Listings', value: totalProducts, icon: Package, color: 'bg-blue-100 text-blue-900' },
                { label: 'In Stock', value: inStockCount, icon: BarChart3, color: 'bg-green-100 text-green-700' },
                { label: 'Out of Stock', value: totalProducts - inStockCount, icon: AlertCircle, color: 'bg-amber-100 text-amber-700' },
                { label: 'Featured', value: profile.featured === 'yes' ? 'Yes' : 'No', icon: Star, color: 'bg-red-100 text-red-700' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Card key={i} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-slate-500">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader><CardTitle>Brand Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><Mail className="h-4 w-4 shrink-0" />{profile.contactEmail}</div>
                  {profile.contactPhone && <div className="flex items-center gap-2 text-slate-600"><Phone className="h-4 w-4 shrink-0" />{profile.contactPhone}</div>}
                  {profile.websiteUrl && (
                    <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline">
                      <Globe className="h-4 w-4 shrink-0" />{profile.websiteUrl}
                    </a>
                  )}
                  {profile.nationwide === 'yes' && <div className="flex items-center gap-2 text-green-700"><MapPin className="h-4 w-4 shrink-0" />Ships Nationwide</div>}
                </div>
                {profile.description && <p className="text-slate-600 text-sm">{profile.description}</p>}
                <div className="flex gap-3 pt-1">
                  {profile.instagramUrl && <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-900"><Instagram className="h-5 w-5" /></a>}
                  {profile.facebookUrl && <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-900"><Facebook className="h-5 w-5" /></a>}
                  {profile.twitterUrl && <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-900"><Twitter className="h-5 w-5" /></a>}
                  {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-900"><Linkedin className="h-5 w-5" /></a>}
                  {profile.youtubeUrl && <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-900"><Youtube className="h-5 w-5" /></a>}
                </div>
              </CardContent>
            </Card>

            {/* ZAPPAY Payment Processing info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-blue-900" />
                  <CardTitle>ZAPPAY Payment Processing</CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-0 ml-auto">Included</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 mb-4">
                  All transactions on the ZAPPAY platform are processed through the ZAPPAY payment railway — giving your customers a seamless, secure checkout experience and giving you instant settlement.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Instant Settlement', 'Fraud Protection', 'Compliance Built-In', 'Multi-State Support'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 flex-wrap">
              <Button className="bg-blue-900 text-white" onClick={() => setActiveTab('products')}>
                <Plus className="h-4 w-4 mr-2" />Manage Products
              </Button>
              <Button className="bg-slate-700 text-white" onClick={() => setActiveTab('profile')}>
                <Edit className="h-4 w-4 mr-2" />Edit Brand Profile
              </Button>
              <Link href="/advertise">
                <Button className="bg-red-600 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />Advertise on ZAPPAY
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Product Listings</h2>
              <Button className="bg-blue-900 text-white" onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />Add Product
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-900" /></div>
            ) : !products || products.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="py-16 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">No Products Listed Yet</h3>
                  <p className="text-slate-500 text-sm mb-6">Add your first product or service to start appearing in the Grower Marketplace.</p>
                  <Button className="bg-blue-900 text-white" onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />Add First Product
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {products.map((p: any) => (
                  <Card key={p.id} className="border border-slate-200 shadow-sm">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900">{p.name}</h3>
                            <Badge className={`text-xs ${p.inStock === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {p.inStock === 'yes' ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 text-xs capitalize">{p.category}</Badge>
                            {p.localPickup === 'yes' && <Badge className="bg-amber-100 text-amber-800 text-xs">Local Pickup</Badge>}
                          </div>
                          {p.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{p.description}</p>}
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                            <span className="font-semibold text-blue-900">${(p.unitPrice / 100).toFixed(2)} / {p.unitLabel}</span>
                            <span>Min order: {p.minOrderQty} {p.unitLabel}</span>
                            {p.externalUrl && (
                              <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline">
                                <ExternalLink className="h-3 w-3" />View on site
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleStock.mutate({ id: p.id, inStock: p.inStock === 'yes' ? 'no' : 'yes' })}
                            className="text-slate-400 hover:text-blue-900 transition-colors"
                            title={p.inStock === 'yes' ? 'Mark Out of Stock' : 'Mark In Stock'}
                          >
                            {p.inStock === 'yes'
                              ? <ToggleRight className="h-6 w-6 text-green-600" />
                              : <ToggleLeft className="h-6 w-6" />}
                          </button>
                          <button onClick={() => openEditDialog(p)} className="text-slate-400 hover:text-blue-900 transition-colors">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${p.name}" from your listings?`)) deleteProduct.mutate({ id: p.id });
                            }}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Brand Profile</h2>
              {!editingProfile ? (
                <Button className="bg-blue-900 text-white" onClick={() => {
                  setProfileForm({
                    description: profile.description ?? '',
                    websiteUrl: profile.websiteUrl ?? '',
                    logoUrl: profile.logoUrl ?? '',
                    instagramUrl: profile.instagramUrl ?? '',
                    facebookUrl: profile.facebookUrl ?? '',
                    twitterUrl: profile.twitterUrl ?? '',
                    linkedinUrl: profile.linkedinUrl ?? '',
                    youtubeUrl: profile.youtubeUrl ?? '',
                    city: profile.city ?? '',
                    state: profile.state ?? '',
                    nationwide: profile.nationwide ?? 'yes',
                  });
                  setEditingProfile(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" className="bg-slate-100 text-slate-700" onClick={() => setEditingProfile(false)}>Cancel</Button>
                  <Button className="bg-blue-900 text-white" onClick={() => updateProfileMutation.mutate({ id: profile.id, ...profileForm })} disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Business Description</label>
                  {editingProfile ? (
                    <Textarea
                      value={profileForm.description}
                      onChange={e => setProfileForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Tell growers about your products, experience, and what makes you unique..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-slate-600 text-sm">{profile.description || 'No description added yet.'}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Logo URL</label>
                    {editingProfile ? (
                      <Input value={profileForm.logoUrl} onChange={e => setProfileForm(f => ({ ...f, logoUrl: e.target.value }))} placeholder="https://..." />
                    ) : (
                      <p className="text-slate-600 text-sm">{profile.logoUrl || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Website</label>
                    {editingProfile ? (
                      <Input value={profileForm.websiteUrl} onChange={e => setProfileForm(f => ({ ...f, websiteUrl: e.target.value }))} placeholder="https://..." />
                    ) : (
                      <p className="text-slate-600 text-sm">{profile.websiteUrl || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Social Media Links</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'instagramUrl', Icon: Instagram, label: 'Instagram' },
                      { key: 'facebookUrl', Icon: Facebook, label: 'Facebook' },
                      { key: 'twitterUrl', Icon: Twitter, label: 'Twitter / X' },
                      { key: 'linkedinUrl', Icon: Linkedin, label: 'LinkedIn' },
                      { key: 'youtubeUrl', Icon: Youtube, label: 'YouTube' },
                    ].map(({ key, Icon, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                        {editingProfile ? (
                          <Input
                            value={profileForm[key] ?? ''}
                            onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={`${label} URL`}
                            className="text-sm"
                          />
                        ) : (
                          <span className="text-slate-600 text-sm truncate">{(profile as any)[key] || 'Not set'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
                    {editingProfile ? (
                      <Input value={profileForm.city} onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))} />
                    ) : (
                      <p className="text-slate-600 text-sm">{profile.city || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Ships Nationwide</label>
                    {editingProfile ? (
                      <Select value={profileForm.nationwide} onValueChange={v => setProfileForm(f => ({ ...f, nationwide: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes — Ships Nationwide</SelectItem>
                          <SelectItem value="no">No — Local / Regional Only</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-slate-600 text-sm">{profile.nationwide === 'yes' ? 'Yes — Nationwide' : 'No — Local/Regional'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Product Create/Edit Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium block mb-1">Product / Service Name *</label>
              <Input
                value={productForm.name}
                onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. 1000W LED Grow Light, Organic Soil Mix, Consultation Service"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Description</label>
              <Textarea
                value={productForm.description}
                onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe your product or service in detail..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Category *</label>
                <Select value={productForm.category} onValueChange={v => setProductForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Subcategory</label>
                <Input
                  value={productForm.subcategory}
                  onChange={e => setProductForm(f => ({ ...f, subcategory: e.target.value }))}
                  placeholder="e.g. LED Grow Lights"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Price (USD) *</label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={productForm.unitPrice}
                  onChange={e => setProductForm(f => ({ ...f, unitPrice: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Price Unit</label>
                <Select value={productForm.unitLabel} onValueChange={v => setProductForm(f => ({ ...f, unitLabel: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNIT_LABELS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Min Order Qty</label>
                <Input
                  type="number"
                  min="1"
                  value={productForm.minOrderQty}
                  onChange={e => setProductForm(f => ({ ...f, minOrderQty: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Availability</label>
                <Select value={productForm.inStock} onValueChange={v => setProductForm(f => ({ ...f, inStock: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">In Stock</SelectItem>
                    <SelectItem value="no">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1">Local Pickup Available</label>
                <Select value={productForm.localPickup} onValueChange={v => setProductForm(f => ({ ...f, localPickup: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Product URL (optional)</label>
                <Input
                  value={productForm.externalUrl}
                  onChange={e => setProductForm(f => ({ ...f, externalUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="bg-slate-100 text-slate-700" onClick={() => setShowProductDialog(false)}>Cancel</Button>
            <Button
              className="bg-blue-900 text-white"
              onClick={handleProductSubmit}
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {editingProductId ? 'Save Changes' : 'List Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
