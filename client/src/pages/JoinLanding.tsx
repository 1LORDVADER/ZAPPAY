/**
 * /join — High-conversion ad campaign landing page
 * Designed for Meta / Instagram / Facebook ad traffic targeting growers, wholesalers, and dispensaries.
 * Captures UTM params automatically and passes them through to the waitlist form submission.
 */
import { useState, useEffect, useRef } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle, Zap, TrendingUp, Shield, Users, ArrowRight,
  DollarSign, Leaf, Truck, Store, ChevronDown, Star,
  BarChart3, Clock, Lock, Award
} from 'lucide-react';

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
  { value: 'farmer', label: 'Licensed Grower / Cultivator', icon: Leaf, desc: 'List your strains, get pre-paid by consumers before you grow.' },
  { value: 'dispensary', label: 'Dispensary / Retailer', icon: Store, desc: 'Drive more foot traffic and access verified wholesale supply.' },
  { value: 'distributor', label: 'Wholesale Distributor', icon: BarChart3, desc: 'Expand your distribution network across legal states.' },
  { value: 'transporter', label: 'Licensed Transporter', icon: Truck, desc: 'Earn 5.2% commission on every delivery you complete.' },
  { value: 'other', label: 'Other / Investor', icon: Award, desc: 'Partner with the fastest-growing cannabis platform.' },
];

const STATS = [
  { value: '5.2%', label: 'Commission — lowest in the industry' },
  { value: '$0', label: 'Upfront cost to list your products' },
  { value: '24/7', label: 'Instant ACH & stablecoin payments' },
  { value: '50+', label: 'Legal states, nationwide reach' },
];

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Get Paid Before You Grow',
    desc: 'Consumers pre-pay for specific strains. You grow only what\'s already sold — zero waste, zero risk.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: Zap,
    title: 'Instant Payments, Always',
    desc: 'Consumer payments convert to stablecoins instantly. You receive ACH within 24 hours — no banking delays.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: TrendingUp,
    title: 'Demand Forecasting',
    desc: 'See real-time aggregated consumer demand across all states before planting season. Grow what the market wants.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Shield,
    title: 'Built-In Compliance',
    desc: 'Adaptive multi-state compliance tools. Every transaction meets state regulations automatically.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: Users,
    title: 'Direct-to-Consumer Access',
    desc: 'Bypass wholesale middlemen. Sell directly to verified consumers and dispensaries across legal states.',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
  {
    icon: BarChart3,
    title: 'Live Price Brokering',
    desc: 'Adjust your strain prices in real time based on market conditions. You control your margins.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    role: 'Licensed Cultivator, Colorado',
    text: 'The pre-payment model is a game changer. I know exactly what to grow three months out. No more guessing.',
    stars: 5,
  },
  {
    name: 'Denise R.',
    role: 'Dispensary Owner, California',
    text: 'Foot traffic is up 40% since we connected with ZAPPAY farmers. The verified supply chain gives our customers confidence.',
    stars: 5,
  },
  {
    name: 'James W.',
    role: 'Wholesale Distributor, Michigan',
    text: 'Finally a platform that treats distributors as partners. The instant ACH payments alone made the switch worth it.',
    stars: 5,
  },
];

const FAQ = [
  {
    q: 'How does the 5.2% commission work?',
    a: 'ZAPPAY takes 5.2% of each completed transaction. There are no listing fees, no monthly minimums, and no hidden charges. The commission is automatically deducted before your payout.',
  },
  {
    q: 'When do I get paid?',
    a: 'Consumer payments are converted to stablecoins at the moment of purchase. You receive ACH payment within 24 hours of order confirmation — one of the fastest payout cycles in the industry.',
  },
  {
    q: 'What states do you operate in?',
    a: 'ZAPPAY operates in all states where cannabis is legal for recreational or medicinal use. Our adaptive compliance engine automatically applies the correct state regulations to every transaction.',
  },
  {
    q: 'Do I need to be licensed to join?',
    a: 'Yes. All farmers, transporters, and dispensaries must hold valid state licenses. ZAPPAY verifies all partners before activation. This protects you and your customers.',
  },
  {
    q: 'What is the waitlist for?',
    a: 'We are onboarding partners in waves to ensure every grower and dispensary gets dedicated support during setup. Joining the waitlist secures your spot and locks in early-adopter pricing.',
  },
];

function useUTMParams() {
  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmContent: '',
    utmTerm: '',
    referrer: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || '',
      referrer: document.referrer || '',
    });
  }, []);

  return utmParams;
}

export default function JoinLanding() {
  const { toast } = useToast();
  const utmParams = useUTMParams();
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string>('farmer');

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'farmer' as 'farmer' | 'dispensary' | 'distributor' | 'transporter' | 'other',
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
          title: 'Already on the list!',
          description: 'This email is already registered. We\'ll be in touch soon.',
        });
      } else {
        setSubmitted(true);
        // Fire Meta Pixel lead event if available
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Lead', {
            content_name: 'Grower Waitlist',
            content_category: form.businessType,
          });
        }
      }
    },
    onError: (err) => {
      toast({
        title: 'Something went wrong',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    },
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.contactName || !form.email || !form.state) {
      toast({ title: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    joinMutation.mutate({
      ...form,
      ...utmParams,
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'businessType') setSelectedType(value);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ZAPPAY" className="h-8 w-auto object-contain" />
          </a>
          <Button
            onClick={scrollToForm}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 h-9"
          >
            Claim Your Spot
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 rounded-full px-4 py-1.5 mb-6 text-sm text-red-300 font-medium">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Early Access — Limited Spots Available
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            The Cannabis Marketplace<br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              That Pays You First
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            ZAPPAY connects licensed growers, dispensaries, and transporters to consumers nationwide.
            Get pre-paid before you grow. Instant ACH payments. Just <strong className="text-white">5.2% commission</strong> — the lowest in the industry.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 shadow-2xl shadow-red-600/30 font-semibold"
            >
              Join the Waitlist — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-md text-white hover:bg-white/5 transition-colors text-sm">
              Learn More About ZAPPAY
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.value} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">{stat.value}</div>
                <div className="text-xs text-slate-400 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-6 bg-white/3 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Verified Licensed Partners Only</span>
            <span className="flex items-center gap-2"><Lock className="h-4 w-4 text-blue-400" /> Bank-Grade Security</span>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-400" /> Instant Stablecoin Payments</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-purple-400" /> 24/7 Platform Access</span>
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-red-400" /> Multi-State Compliance Built In</span>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Built for Every Part of the Supply Chain</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Whether you grow, distribute, transport, or sell — ZAPPAY was engineered for your business.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BUSINESS_TYPES.map((type) => {
              const Icon = type.icon;
              const active = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => { setSelectedType(type.value); handleChange('businessType', type.value as any); scrollToForm(); }}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-3 ${active ? 'text-red-400' : 'text-slate-400'}`} />
                  <div className={`font-semibold text-sm mb-1 ${active ? 'text-white' : 'text-slate-300'}`}>{type.label}</div>
                  <div className="text-xs text-slate-500 leading-snug">{type.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Top Growers Choose ZAPPAY</h2>
            <p className="text-slate-400 max-w-xl mx-auto">The world's first cannabis payment processor built to compete with the black market — legally.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="bg-white/4 border border-white/8 rounded-xl p-5 hover:border-white/15 transition-all">
                  <div className={`w-10 h-10 ${b.bg} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`h-5 w-5 ${b.color}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">What Our Partners Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/4 border border-white/8 rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section ref={formRef} id="join-form" className="py-16 px-4 bg-gradient-to-b from-transparent to-[#0d1120]">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-white">You're on the list!</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                We'll reach out within 48 hours with your onboarding details and early-adopter pricing. Welcome to ZAPPAY.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition-colors">
                  Explore the Platform
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-white/20 rounded-md text-white hover:bg-white/5 transition-colors"
                >
                  Register Another Business
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/30 rounded-full px-4 py-1.5 mb-4 text-sm text-red-300">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  Secure Your Early-Adopter Spot
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Join the ZAPPAY Partner Waitlist</h2>
                <p className="text-slate-400">Free to join. No commitment. Early partners get locked-in pricing and priority onboarding.</p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white/4 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Business Type <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BUSINESS_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleChange('businessType', type.value)}
                          className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                            form.businessType === type.value
                              ? 'border-red-500 bg-red-500/15 text-white'
                              : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-left leading-tight">{type.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Business Name + Contact */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Business Name <span className="text-red-400">*</span></label>
                    <Input
                      value={form.businessName}
                      onChange={e => handleChange('businessName', e.target.value)}
                      placeholder="Green Valley Farms LLC"
                      className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Name <span className="text-red-400">*</span></label>
                    <Input
                      value={form.contactName}
                      onChange={e => handleChange('contactName', e.target.value)}
                      placeholder="John Smith"
                      className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email <span className="text-red-400">*</span></label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="john@greenfarms.com"
                      className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* State + City */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">State <span className="text-red-400">*</span></label>
                    <select
                      value={form.state}
                      onChange={e => handleChange('state', e.target.value)}
                      className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 [&>option]:bg-slate-900"
                      required
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">City</label>
                    <Input
                      value={form.city}
                      onChange={e => handleChange('city', e.target.value)}
                      placeholder="Denver"
                      className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Monthly Volume */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Estimated Monthly Volume</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {VOLUME_OPTIONS.map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => handleChange('monthlyVolume', v)}
                        className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                          form.monthlyVolume === v
                            ? 'border-red-500 bg-red-500/15 text-white'
                            : 'border-white/10 bg-white/3 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">State License Number</label>
                  <Input
                    value={form.licenseNumber}
                    onChange={e => handleChange('licenseNumber', e.target.value)}
                    placeholder="e.g. CO-MED-12345"
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Anything else we should know?</label>
                  <Textarea
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    placeholder="Tell us about your operation, current challenges, or what you're most excited about..."
                    rows={3}
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-600 focus:border-red-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={joinMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-base py-6 font-semibold shadow-xl shadow-red-600/20"
                >
                  {joinMutation.isPending ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                  ) : (
                    <span className="flex items-center gap-2">Claim My Spot on the Waitlist <ArrowRight className="h-5 w-5" /></span>
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By submitting, you agree to our <a href="/terms-of-service" className="underline hover:text-slate-300">Terms of Service</a> and <a href="/privacy-policy" className="underline hover:text-slate-300">Privacy Policy</a>. No spam. Unsubscribe anytime.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-medium text-white pr-4">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-red-950/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Grow With ZAPPAY?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join the waitlist today. Early partners get locked-in pricing and priority onboarding support.</p>
          <Button
            onClick={scrollToForm}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-10 py-6 shadow-2xl shadow-red-600/30 font-semibold"
          >
            Join the Waitlist — Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>© 2026 ZAPPAY. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/terms-of-service" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="/age-verification" className="hover:text-slate-400 transition-colors">Age Verification</a>
            <a href="mailto:hello@zappayus.co" className="hover:text-slate-400 transition-colors">hello@zappayus.co</a>
          </div>
          <div className="text-center sm:text-right">
            For licensed cannabis businesses only. 18+ / 21+ where required.
          </div>
        </div>
      </footer>
    </div>
  );
}
