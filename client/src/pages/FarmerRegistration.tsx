import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { NavHeader } from "@/components/NavHeader";

export default function FarmerRegistration() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [verifiedRep, setVerifiedRep] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<"standard" | "premium">("standard");
  const [formData, setFormData] = useState({
    businessName: "",
    licenseNumber: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // Get referral code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const { data: verifyResult, isLoading: verifying } = trpc.salesReps.verifyReferralCode.useQuery(
    { code: referralCode },
    { enabled: referralCode.length > 0 }
  );

  useEffect(() => {
    if (verifyResult?.valid) {
      setVerifiedRep(verifyResult.salesRep);
    } else if (verifyResult && !verifyResult.valid) {
      setVerifiedRep(null);
    }
  }, [verifyResult]);

  const createProfileMutation = trpc.profile.createFarmerProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your farmer profile has been created. Redirecting to dashboard...",
      });
      setTimeout(() => setLocation("/farmer/dashboard"), 2000);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProfileMutation.mutate({
      ...formData,
      subscriptionTier: selectedTier,
      referralCode: verifiedRep ? referralCode : undefined,
    });
  };

  const tierPricing = {
    standard: {
      name: "Standard",
      price: 250,
      features: [
        "Platform access for 1 year FREE",
        "$250/month after trial",
        "List unlimited products",
        "5.2% transaction fee",
        "Basic analytics",
        "Email support",
      ],
    },
    premium: {
      name: "Premium",
      price: 1100,
      features: [
        "Platform access for 1 year FREE",
        "$1,100/month after trial",
        "List unlimited products",
        "5.2% transaction fee",
        "Advanced analytics & insights",
        "Priority support",
        "Featured farmer badge",
        "Marketing tools",
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavHeader />
      <div className="container max-w-4xl mx-auto py-12">
      <Link href="/">
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back to Home</span>
        </button>
      </Link>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Join ZAPPAY as a Farmer</h1>
        <p className="text-muted-foreground">
          List your products on ZAPPAY and get paid instantly via ACH for every transaction — we handle the payment processing
        </p>
      </div>

      {/* Referral Code Verification */}
      {referralCode && (
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {verifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying referral code...</span>
                </>
              ) : verifiedRep ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">
                    Valid referral code! You were referred by a ZAPPAY sales representative.
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>Invalid referral code. You can still register without one.</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Tier Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Choose Your Subscription Tier</CardTitle>
          <CardDescription>First year FREE for all tiers - select what works best for your business</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as "standard" | "premium")}>
            <div className="grid md:grid-cols-2 gap-4">
              {(["standard", "premium"] as const).map((tier) => (
                <label
                  key={tier}
                  className={`relative flex cursor-pointer rounded-lg border-2 p-6 hover:border-primary transition-colors ${
                    selectedTier === tier ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-4 w-full">
                    <RadioGroupItem value={tier} id={tier} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{tierPricing[tier].name}</h3>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${tierPricing[tier].price}</div>
                          <div className="text-xs text-muted-foreground">per month after trial</div>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {tierPricing[tier].features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Tell us about your cannabis farming operation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Cannabis License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Farm Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                />
              </div>

              {!referralCode && (
                <div className="space-y-2">
                  <Label htmlFor="manualReferralCode">Referral Code (Optional)</Label>
                  <Input
                    id="manualReferralCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="Enter code if you have one"
                  />
                </div>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What happens next?</h4>
              <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
                <li>Your application will be reviewed within 24-48 hours</li>
                <li>We'll verify your cannabis license with state authorities</li>
                <li>Once approved, you can start listing products immediately</li>
                <li>Your first year is completely FREE - no subscription charges</li>
              </ol>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={createProfileMutation.isPending}>
              {createProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
