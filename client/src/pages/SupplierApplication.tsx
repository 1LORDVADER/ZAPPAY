import { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, Package, Sprout, Zap, Wrench, FlaskConical, Box, Cpu, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPLIER_TYPES = [
  { value: 'equipment', label: 'Equipment & Machinery', icon: Wrench, description: 'Grow tents, HVAC, trimming machines, irrigation systems' },
  { value: 'seeds', label: 'Seeds & Genetics', icon: Sprout, description: 'Feminized seeds, clones, tissue culture, breeding stock' },
  { value: 'nutrients', label: 'Nutrients & Fertilizers', icon: FlaskConical, description: 'Base nutrients, supplements, pH adjusters, foliar sprays' },
  { value: 'lighting', label: 'Lighting', icon: Zap, description: 'LED grow lights, HPS, CMH, light movers, controllers' },
  { value: 'soil', label: 'Soil, Media & Growing Substrates', icon: Package, description: 'Potting mix, coco coir, rockwool, perlite, amendments' },
  { value: 'packaging', label: 'Packaging & Compliance', icon: Box, description: 'Child-resistant packaging, labels, bags, containers' },
  { value: 'services', label: 'Services', icon: Wrench, description: 'Consulting, compliance, testing labs, security, logistics' },
  { value: 'technology', label: 'Technology & Software', icon: Cpu, description: 'Seed-to-sale tracking, POS, environmental monitoring, automation' },
  { value: 'other', label: 'Other', icon: HelpCircle, description: 'Other products or services for the cannabis industry' },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
];

export default function SupplierApplication() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    supplierType: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    state: '',
    city: '',
    description: '',
    nationwide: 'yes' as 'yes' | 'no',
    message: '',
  });

  const applyMutation = trpc.suppliers.applyAsSupplier.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.supplierType || !form.contactName || !form.contactEmail || !form.state) {
      toast({ title: 'Missing required fields', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    applyMutation.mutate(form);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center shadow-xl border-0">
          <CardContent className="pt-12 pb-10 px-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Received!</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Thank you for applying to join the ZAPPAY Supplier Network. Our team will review your application and reach out within <strong>2–3 business days</strong> at <strong>{form.contactEmail}</strong>.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Once approved, you will receive access to your Supplier Dashboard where you can list products, manage orders, and build your brand page on the ZAPPAY platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/grower-marketplace">
                <Button className="bg-blue-900 text-white hover:bg-blue-800">Browse Marketplace</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200">Back to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/grower-marketplace" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Grower Marketplace
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Join the ZAPPAY Supplier Network</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            List your products and services directly on ZAPPAY — reaching thousands of licensed cannabis growers, dispensaries, and wholesalers nationwide. Automated onboarding, brand pages, and integrated payment processing.
          </p>
        </div>
      </div>

      {/* Supplier Type Selection */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">What type of supplier are you?</h2>
          <p className="text-slate-500 text-sm mb-4">Select the category that best describes your business.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SUPPLIER_TYPES.map((type) => {
              const Icon = type.icon;
              const selected = form.supplierType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, supplierType: type.value }))}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-blue-900 bg-blue-900 text-white shadow-lg'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-2 ${selected ? 'text-white' : 'text-blue-700'}`} />
                  <div className="font-semibold text-sm">{type.label}</div>
                  <div className={`text-xs mt-1 leading-snug ${selected ? 'text-blue-100' : 'text-slate-400'}`}>{type.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-blue-900 text-white rounded-t-xl">
              <CardTitle className="text-white">Supplier Application</CardTitle>
              <CardDescription className="text-blue-100">All fields marked * are required. Your information is kept confidential.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={form.businessName}
                    onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                    placeholder="e.g. GreenGrow Supplies LLC"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    value={form.websiteUrl}
                    onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={form.contactName}
                    onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))}
                    placeholder="Full name"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Business Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="contact@yourbusiness.com"
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input
                    id="contactPhone"
                    value={form.contactPhone}
                    onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="(555) 000-0000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={form.state} onValueChange={v => setForm(f => ({ ...f, state: v }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="City"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Service Area */}
              <div>
                <Label>Service Area *</Label>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, nationwide: 'yes' }))}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                      form.nationwide === 'yes'
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    Nationwide
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, nationwide: 'no' }))}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-all ${
                      form.nationwide === 'no'
                        ? 'border-blue-900 bg-blue-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400'
                    }`}
                  >
                    Local / Regional Only
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">What do you sell or offer? *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your products or services, key brands you carry, and what makes your offering unique..."
                  className="mt-1 min-h-[100px]"
                  required
                />
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="message">Additional Notes (optional)</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Any other information you'd like us to know..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              {/* Benefits Summary */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm">What you get as a ZAPPAY Supplier</h3>
                <ul className="space-y-1 text-sm text-slate-700">
                  {[
                    'Branded brand page with logo, social links, and website',
                    'Direct access to thousands of licensed growers, dispensaries, and wholesalers',
                    'Integrated ZAPPAY payment processing for all transactions',
                    'Product listings with unit pricing, local pickup, and nationwide shipping options',
                    'Advertising opportunities to reach the entire ZAPPAY network',
                    'Automated onboarding — go live within 48 hours of approval',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                disabled={applyMutation.isPending || !form.supplierType}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
              >
                {applyMutation.isPending ? 'Submitting...' : 'Submit Supplier Application'}
              </Button>

              <p className="text-xs text-center text-slate-400">
                By submitting, you agree to ZAPPAY's{' '}
                <Link href="/terms" className="text-blue-700 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-700 hover:underline">Privacy Policy</Link>.
                Questions? Email <a href="mailto:hello@zappayus.co" className="text-blue-700 hover:underline">hello@zappayus.co</a>
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
