import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Store, MapPin, Users, TrendingUp, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { NavHeader } from "@/components/NavHeader";

export default function DispensaryApplication() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
    licenseState: "",
    yearsInBusiness: "",
    monthlyVolume: "",
    currentSuppliers: "",
    targetStrains: "",
  });

  const submitMutation = trpc.applications.submitDispensaryApplication.useMutation({
    onSuccess: () => {
      toast.success("Application submitted! We'll contact you within 48 hours.");
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        licenseNumber: "",
        licenseState: "",
        yearsInBusiness: "",
        monthlyVolume: "",
        currentSuppliers: "",
        targetStrains: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      ...formData,
      yearsInBusiness: parseInt(formData.yearsInBusiness) || 0,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <NavHeader />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <a className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-900 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </a>
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Partner with ZAPPAY as a Dispensary
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Partner with ZAPPAY to process cannabis transactions at your dispensary. ZAPPAY handles the payment infrastructure — you focus on serving customers. Drive more foot traffic, reduce payment friction, and offer your customers seamless checkout.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle className="text-lg">Increased Revenue</CardTitle>
                  <CardDescription>
                    Drive more foot traffic and sales through our platform's nationwide customer base
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Direct Farmer Access</CardTitle>
                  <CardDescription>
                    ZAPPAY connects your dispensary with verified licensed farmers — we process the payments between you, so you can source products efficiently without payment delays
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CheckCircle className="h-8 w-8 text-blue-700 mb-2" />
                  <CardTitle className="text-lg">Seamless Payments</CardTitle>
                  <CardDescription>
                    Instant payment processing with just 5.2% platform fees—no hidden costs
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Application Form */}
            <Card className="border-2 border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl">Dispensary Application</CardTitle>
                <CardDescription>
                  Complete this form to begin your partnership with ZAPPAY. All information is confidential and secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-slate-900">Business Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          required
                          value={formData.businessName}
                          onChange={(e) => handleChange("businessName", e.target.value)}
                          placeholder="Your Dispensary LLC"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactName">Owner/Manager Name *</Label>
                        <Input
                          id="contactName"
                          required
                          value={formData.contactName}
                          onChange={(e) => handleChange("contactName", e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Business Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          placeholder="contact@yourdispensary.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-slate-900">Location Information</h3>
                    
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Denver"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                            <SelectItem value="OR">Oregon</SelectItem>
                            <SelectItem value="NV">Nevada</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                            <SelectItem value="MA">Massachusetts</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="NJ">New Jersey</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={(e) => handleChange("zipCode", e.target.value)}
                          placeholder="80202"
                        />
                      </div>
                    </div>
                  </div>

                  {/* License & Operations */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-slate-900">License & Operations</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="licenseNumber">State License Number *</Label>
                        <Input
                          id="licenseNumber"
                          required
                          value={formData.licenseNumber}
                          onChange={(e) => handleChange("licenseNumber", e.target.value)}
                          placeholder="DISP-123456"
                        />
                      </div>

                      <div>
                        <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                        <Select value={formData.yearsInBusiness} onValueChange={(value) => handleChange("yearsInBusiness", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5+">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monthlyVolume">Estimated Monthly Sales Volume *</Label>
                        <Select value={formData.monthlyVolume} onValueChange={(value) => handleChange("monthlyVolume", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<50k">Less than $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                            <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                            <SelectItem value="500k+">$500,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="licenseState">License State *</Label>
                        <Select value={formData.licenseState} onValueChange={(value) => handleChange("licenseState", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="WA">Washington</SelectItem>
                            <SelectItem value="OR">Oregon</SelectItem>
                            <SelectItem value="NV">Nevada</SelectItem>
                            <SelectItem value="MI">Michigan</SelectItem>
                            <SelectItem value="MA">Massachusetts</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="NJ">New Jersey</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentSuppliers">Current Suppliers (Optional)</Label>
                      <Textarea
                        id="currentSuppliers"
                        value={formData.currentSuppliers}
                        onChange={(e) => handleChange("currentSuppliers", e.target.value)}
                        placeholder="List your current cannabis suppliers..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetStrains">Target Strains/Products (Optional)</Label>
                      <Textarea
                        id="targetStrains"
                        value={formData.targetStrains}
                        onChange={(e) => handleChange("targetStrains", e.target.value)}
                        placeholder="What specific strains or product types are you interested in?"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-grow bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white"
                    >
                      Submit Application
                    </Button>
                    <Link href="/">
                      <a>
                        <Button type="button" variant="outline" size="lg">
                          Cancel
                        </Button>
                      </a>
                    </Link>
                  </div>

                  <p className="text-sm text-slate-500 text-center">
                    By submitting this application, you agree to ZAPPAY's Terms of Service and confirm that all information provided is accurate and complete.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card className="mt-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
              <CardHeader>
                <CardTitle>What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <span><strong>Application Review</strong> - Our team will review your application within 48 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <span><strong>License Verification</strong> - We'll verify your state license and business credentials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <span><strong>Onboarding Call</strong> - Schedule a call with our partnership team to discuss pricing details and integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <span><strong>Platform Access</strong> - Get your dispensary dashboard and start processing transactions through ZAPPAY</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
