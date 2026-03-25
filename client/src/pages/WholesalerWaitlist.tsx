import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle, Building2, Zap, TrendingUp, Shield, Users,
  ArrowRight, Star, Package, DollarSign
} from 'lucide-react';
import { Link } from 'wouter';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC'
];

const VOLUME_OPTIONS = [
  'Under $10K/month',
  '$10K – $50K/month',
  '$50K – $100K/month',
  '$100K – $500K/month',
  '$500K – $1M/month',
  '$1M+/month',
];

const BUSINESS_TYPES = [
  { value: 'farmer', label: 'Licensed Farmer / Cultivator' },
  { value: 'dispensary', label: 'Dispensary / Retailer' },
  { value: 'distributor', label: 'Wholesale Distributor' },
  { value: 'transporter', label: 'Licensed Transporter' },
  { value: 'other', label: 'Other' },
];

export default function WholesalerWaitlist() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '' as 'farmer' | 'dispensary' | 'distributor' | 'transporter' | 'other' | '',
    state: '',
    city: '',
    licenseNumber: '',
    monthlyVolume: '',
    message: '',
  });

  const joinMutation = trpc.wholesalerWaitlist.join.useMutation({
    onSuccess: (data) => {
      if (data.alreadyRegistered) {
        toast({
          title: 'Already Registered',
          description: 'This email is already on our wholesaler waitlist. We\'ll be in touch soon.',
        });
      } else {
        setSubmitted(true);
      }
    },
    onError: (err) => {
      toast({
        title: 'Submission Failed',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessType) {
      toast({ title: 'Please select a business type', variant: 'destructive' });
      return;
    }
    joinMutation.mutate({
      businessName: form.businessName,
      contactName: form.contactName,
      email: form.email,
      phone: form.phone || undefined,
      businessType: form.businessType as 'farmer' | 'dispensary' | 'distributor' | 'transporter' | 'other',
      state: form.state,
      city: form.city || undefined,
      licenseNumber: form.licenseNumber || undefined,
      monthlyVolume: form.monthlyVolume || undefined,
      message: form.message || undefined,
    });
  };

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You're on the List</h1>
          <p className="text-blue-200 text-lg mb-8">
            Welcome to the ZAPPAY wholesaler network. Our team will reach out within 24–48 hours to discuss onboarding and get your business live on the platform.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left space-y-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wide mb-4">What Happens Next</p>
            {[
              'Our team reviews your application and verifies your license',
              'You receive a personalized onboarding call within 48 hours',
              'Your products or services go live on ZAPPAY',
              'Start processing transactions at just 5.2% commission',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-blue-100 text-sm">{step}</p>
              </div>
            ))}
          </div>
          <Link href="/">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Return to Marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/zappay-logo.jpeg" alt="ZAPPAY" className="h-10 w-auto" />
            </div>
          </Link>
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            Wholesaler Partner Program
          </Badge>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Value Proposition */}
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 text-red-400" />
              <span className="text-red-300 text-sm font-medium">Limited Early Partner Spots</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Join the ZAPPAY
              <span className="block text-red-400">Wholesaler Network</span>
            </h1>

            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              ZAPPAY is America's transaction infrastructure for cannabis, hemp, and insurance. Join our wholesaler waitlist and be among the first partners to access a national network of verified buyers and sellers — at just 5.2% commission.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {[
                { icon: DollarSign, title: '5.2%', desc: 'Flat commission rate' },
                { icon: Shield, title: 'Verified', desc: 'License-checked network' },
                { icon: TrendingUp, title: '$47B+', desc: 'Market opportunity' },
                { icon: Users, title: '24/7', desc: 'Instant ACH payments' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Icon className="h-5 w-5 text-red-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{title}</div>
                  <div className="text-blue-300 text-sm">{desc}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-white font-semibold text-sm uppercase tracking-wide">Who This Is For</p>
              {[
                { icon: Package, text: 'Licensed cannabis and hemp farmers seeking national distribution' },
                { icon: Building2, text: 'Dispensaries and retailers expanding their supplier network' },
                { icon: Star, text: 'Wholesale distributors processing $10K+ per month' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-200 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <Card className="bg-white/5 border border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Apply for Early Access</CardTitle>
              <CardDescription className="text-blue-300">
                Complete the form below. Our team will contact you within 24–48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Business Name *</label>
                    <Input
                      required
                      value={form.businessName}
                      onChange={e => update('businessName', e.target.value)}
                      placeholder="Green Valley Farms LLC"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Contact Name *</label>
                    <Input
                      required
                      value={form.contactName}
                      onChange={e => update('contactName', e.target.value)}
                      placeholder="John Smith"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Phone</label>
                    <Input
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Business Email *</label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      placeholder="contact@yourbusiness.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Business Type *</label>
                    <select
                      required
                      value={form.businessType}
                      onChange={e => update('businessType', e.target.value)}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/5 text-white px-3 text-sm focus:outline-none focus:border-red-500"
                    >
                      <option value="" className="bg-slate-800">Select type...</option>
                      {BUSINESS_TYPES.map(t => (
                        <option key={t.value} value={t.value} className="bg-slate-800">{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">State *</label>
                    <select
                      required
                      value={form.state}
                      onChange={e => update('state', e.target.value)}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/5 text-white px-3 text-sm focus:outline-none focus:border-red-500"
                    >
                      <option value="" className="bg-slate-800">Select state...</option>
                      {US_STATES.map(s => (
                        <option key={s} value={s} className="bg-slate-800">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">City</label>
                    <Input
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      placeholder="Denver"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">License Number</label>
                    <Input
                      value={form.licenseNumber}
                      onChange={e => update('licenseNumber', e.target.value)}
                      placeholder="CO-MED-2024-XXXXX"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Estimated Monthly Transaction Volume</label>
                    <select
                      value={form.monthlyVolume}
                      onChange={e => update('monthlyVolume', e.target.value)}
                      className="w-full h-10 rounded-md border border-white/20 bg-white/5 text-white px-3 text-sm focus:outline-none focus:border-red-500"
                    >
                      <option value="" className="bg-slate-800">Select volume range...</option>
                      {VOLUME_OPTIONS.map(v => (
                        <option key={v} value={v} className="bg-slate-800">{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-blue-200 text-sm font-medium mb-1.5 block">Tell Us About Your Business</label>
                    <Textarea
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      placeholder="Describe your products, current distribution channels, and what you're looking for in a payment processing partner..."
                      rows={4}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-red-500 resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={joinMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-base"
                >
                  {joinMutation.isPending ? 'Submitting...' : 'Join the Wholesaler Waitlist'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-center text-blue-400 text-xs">
                  By submitting, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-white">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
