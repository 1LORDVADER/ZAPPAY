import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, TrendingUp, DollarSign, Package, Star, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

export default function FarmerDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const utils = trpc.useUtils();
  
  // Fetch farmer's products
  const { data: products = [], isLoading } = trpc.products.myProducts.useQuery();
  
  // Fetch farmer profile
  const { data: farmerProfile } = trpc.profile.getFarmerProfile.useQuery();
  
  // Delete product mutation
  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.myProducts.invalidate();
      toast.success("Product deleted");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">Please login to access farmer dashboard</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3 cursor-pointer">
                <img 
                  src="/zappay-logo.jpeg" 
                  alt="ZAPPAY Logo" 
                  className="h-12 w-auto object-contain"
                />
              </a>
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link href="/">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Marketplace
                </a>
              </Link>
              <Link href="/farmer/dashboard">
                <a className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                  Dashboard
                </a>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  {user?.name || user?.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Farmer Dashboard</h1>
              <p className="text-slate-600">Manage your products and track your sales</p>
            </div>
            
            {farmerProfile && (
              <Badge className={`text-lg px-4 py-2 ${
                farmerProfile.subscriptionTier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                farmerProfile.subscriptionTier === 'premium' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {farmerProfile.subscriptionTier.toUpperCase()} TIER
              </Badge>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-slate-900">
                    ${(totalRevenue / 100).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-3xl font-bold text-slate-900">{activeProducts}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-3xl font-bold text-slate-900">{totalViews}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="text-3xl font-bold text-slate-900">4.5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Products</h2>
            <Button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          {/* Add Product Form */}
          {showAddProduct && (
            <Card className="mb-8 border-2 border-green-200">
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>List a new product on the marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <AddProductForm onSuccess={() => {
                  setShowAddProduct(false);
                  utils.products.myProducts.invalidate();
                }} />
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-4">No products listed yet</p>
                <Button onClick={() => setShowAddProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="border-2 border-slate-200">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={`${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'sold_out' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </Badge>
                      {product.isFeatured === 'yes' && (
                        <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.strain}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Price:</span>
                        <span className="font-semibold text-slate-900">
                          ${(product.price / 100).toFixed(2)}/{product.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Stock:</span>
                        <span className="font-semibold">{product.quantity} {product.unit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Views:</span>
                        <span className="font-semibold">{product.views || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Clicks:</span>
                        <span className="font-semibold">{product.clicks || 0}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this product?")) {
                              deleteProductMutation.mutate({ id: product.id });
                            }
                          }}
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Add Product Form Component
function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    strain: "",
    category: "flower" as const,
    thcPercentage: "",
    cbdPercentage: "",
    price: "",
    quantity: "",
    unit: "gram",
    description: "",
  });

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProductMutation.mutate({
      ...formData,
      price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
      quantity: parseInt(formData.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="strain">Strain *</Label>
          <Input
            id="strain"
            value={formData.strain}
            onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value: any) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flower">Flower</SelectItem>
              <SelectItem value="edibles">Edibles</SelectItem>
              <SelectItem value="concentrates">Concentrates</SelectItem>
              <SelectItem value="pre-rolls">Pre-Rolls</SelectItem>
              <SelectItem value="vapes">Vapes</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="thc">THC %</Label>
          <Input
            id="thc"
            value={formData.thcPercentage}
            onChange={(e) => setFormData({ ...formData, thcPercentage: e.target.value })}
            placeholder="e.g., 24%"
          />
        </div>

        <div>
          <Label htmlFor="cbd">CBD %</Label>
          <Input
            id="cbd"
            value={formData.cbdPercentage}
            onChange={(e) => setFormData({ ...formData, cbdPercentage: e.target.value })}
            placeholder="e.g., 0.5%"
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => setFormData({ ...formData, unit: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gram">Gram</SelectItem>
              <SelectItem value="ounce">Ounce</SelectItem>
              <SelectItem value="pound">Pound</SelectItem>
              <SelectItem value="piece">Piece</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending ? "Creating..." : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
