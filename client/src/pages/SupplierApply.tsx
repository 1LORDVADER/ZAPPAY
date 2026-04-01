import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Package, Zap, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const SUPPLIER_TYPES = [
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

const schema = z.object({
  businessName: z.string().min(2, "Business name required"),
  supplierType: z.enum(["equipment","seeds","nutrients","lighting","soil","packaging","services","technology","other"]),
  contactName: z.string().min(2, "Contact name required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  state: z.string().length(2, "Select a state"),
  city: z.string().optional(),
  description: z.string().optional(),
  nationwide: z.boolean().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SupplierApply() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nationwide: false },
  });
  const { register, handleSubmit, setValue, watch, formState: { errors } } = form;

  const submitMutation = trpc.suppliers.submitApplication.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => toast({ title: "Submission failed", description: err.message, variant: "destructive" }),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => submitMutation.mutate(data as FormData);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl border-0">
          <CardContent className="pt-12 pb-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted</h2>
            <p className="text-slate-600 mb-6">
              Thank you for applying to become a ZAPPAY supplier. Our team will review your application and reach out within 2–3 business days.
            </p>
            <Link href="/">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/">
            <button className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-red-600 hover:bg-red-600 text-white border-0">Partner Portal</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-3">Become a ZAPPAY Supplier</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Join the world's first cannabis supply network. ZAPPAY is a neutral transaction rail — we process payments and connect growers with the tools they need. No favoritism, pure infrastructure.
          </p>
        </div>
      </div>

      {/* Benefits strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Zap, label: "Instant Payments", desc: "ACH & stablecoin settlement" },
            { icon: Package, label: "National Reach", desc: "All legal cannabis states" },
            { icon: CheckCircle, label: "Zero Favoritism", desc: "Strain-first, brand-second" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="h-5 w-5 text-red-600 mb-1" />
              <div className="font-semibold text-slate-900 text-sm">{label}</div>
              <div className="text-xs text-slate-500">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Supplier Application</CardTitle>
            <CardDescription>All fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input id="businessName" {...register("businessName")} placeholder="Green Valley Seeds LLC" />
                  {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierType">Supplier Type *</Label>
                  <Select onValueChange={(v) => setValue("supplierType", v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPLIER_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierType && <p className="text-red-500 text-xs">{errors.supplierType.message}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input id="contactName" {...register("contactName")} placeholder="Jane Smith" />
                  {errors.contactName && <p className="text-red-500 text-xs">{errors.contactName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="jane@example.com" />
                  {errors.contactEmail && <p className="text-red-500 text-xs">{errors.contactEmail.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input id="contactPhone" {...register("contactPhone")} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website</Label>
                  <Input id="websiteUrl" {...register("websiteUrl")} placeholder="https://yoursite.com" />
                  {errors.websiteUrl && <p className="text-red-500 text-xs">{errors.websiteUrl.message}</p>}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} placeholder="Denver" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select onValueChange={(v) => setValue("state", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                </div>
              </div>

              {/* Nationwide */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox
                  id="nationwide"
                  checked={watch("nationwide")}
                  onCheckedChange={(v) => setValue("nationwide", !!v)}
                />
                <div>
                  <Label htmlFor="nationwide" className="font-medium cursor-pointer">Ships / Operates Nationwide</Label>
                  <p className="text-xs text-slate-500 mt-0.5">Check if you can serve growers in all legal cannabis states</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Briefly describe your products or services..."
                  rows={3}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Anything else you'd like us to know..."
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white h-12 text-base font-semibold"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
