import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle, XCircle, Star, StarOff, Loader2, Building2,
  Mail, Phone, Globe, MapPin, Clock, Users, Package,
  AlertCircle,
} from 'lucide-react';

type Tab = 'applications' | 'suppliers';

export default function AdminSuppliers() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState<Tab>('applications');

  const { data: applications, isLoading: appsLoading } = trpc.suppliers.getAllApplications.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
    staleTime: 30_000,
  });

  const { data: suppliers, isLoading: suppliersLoading } = trpc.suppliers.getAllSuppliers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
    staleTime: 30_000,
  });

  const approveApp = trpc.suppliers.approveApplication.useMutation({
    onSuccess: () => {
      utils.suppliers.getAllApplications.invalidate();
      utils.suppliers.getAllSuppliers.invalidate();
      toast({ title: 'Application approved', description: 'Supplier profile has been created and is now live.' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const rejectApp = trpc.suppliers.rejectApplication.useMutation({
    onSuccess: () => {
      utils.suppliers.getAllApplications.invalidate();
      toast({ title: 'Application rejected' });
    },
    onError: (e) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const toggleFeatured = trpc.suppliers.toggleFeatured.useMutation({
    onMutate: async ({ id, featured }) => {
      await utils.suppliers.getAllSuppliers.cancel();
      const prev = utils.suppliers.getAllSuppliers.getData();
      utils.suppliers.getAllSuppliers.setData(undefined, (old) =>
        old?.map(s => s.id === id ? { ...s, featured } : s) ?? []
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) utils.suppliers.getAllSuppliers.setData(undefined, ctx.prev);
    },
    onSettled: () => utils.suppliers.getAllSuppliers.invalidate(),
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full text-center shadow-xl border-0">
          <CardContent className="pt-10 pb-8 px-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-slate-500">This page is restricted to ZAPPAY administrators.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApps = applications?.filter(a => a.status === 'pending') ?? [];
  const reviewedApps = applications?.filter(a => a.status !== 'pending') ?? [];

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Admin — Supplier Management</h1>
          <p className="text-blue-200 text-sm mt-1">Review applications and manage approved supplier listings</p>
          <div className="flex gap-1 mt-5">
            {(['applications', 'suppliers'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab ? 'bg-white text-blue-900' : 'text-blue-200 hover:text-white'
                }`}
              >
                {tab === 'applications'
                  ? `Applications (${applications?.length ?? 0})`
                  : `Approved Suppliers (${suppliers?.length ?? 0})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Pending */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Review ({pendingApps.length})
              </h2>
              {appsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-900" /></div>
              ) : pendingApps.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-8 text-center text-slate-500">No pending applications.</CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingApps.map(app => (
                    <Card key={app.id} className="border-0 shadow-md">
                      <CardContent className="py-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-slate-900">{app.businessName}</h3>
                              <Badge className={`text-xs capitalize ${statusColor[app.status] ?? 'bg-slate-100 text-slate-700'}`}>{app.status}</Badge>
                              <Badge className="bg-blue-100 text-blue-800 text-xs capitalize">{app.supplierType}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-slate-600 mt-2">
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{app.contactName}</span>
                              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{app.contactEmail}</span>
                              {app.contactPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{app.contactPhone}</span>}
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.city ? `${app.city}, ` : ''}{app.state}</span>
                              {app.websiteUrl && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{app.websiteUrl}</span>}
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Ships nationwide: {app.nationwide}</span>
                            </div>
                            {app.description && (
                              <p className="text-sm text-slate-500 mt-2 line-clamp-3">{app.description}</p>
                            )}
                            {app.message && (
                              <p className="text-sm text-slate-500 mt-1 italic">"{app.message}"</p>
                            )}
                            <p className="text-xs text-slate-400 mt-2">
                              Submitted: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button
                              className="bg-green-700 text-white hover:bg-green-800 text-sm"
                              onClick={() => approveApp.mutate({ id: app.id })}
                              disabled={approveApp.isPending}
                            >
                              {approveApp.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                              Approve
                            </Button>
                            <Button
                              className="bg-red-600 text-white hover:bg-red-700 text-sm"
                              onClick={() => {
                                if (confirm(`Reject application from ${app.businessName}?`)) {
                                  rejectApp.mutate({ id: app.id });
                                }
                              }}
                              disabled={rejectApp.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Reviewed */}
            {reviewedApps.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-3">Previously Reviewed ({reviewedApps.length})</h2>
                <div className="grid gap-3">
                  {reviewedApps.map(app => (
                    <Card key={app.id} className="border-0 shadow-sm opacity-75">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{app.businessName}</span>
                              <Badge className={`text-xs capitalize ${statusColor[app.status] ?? 'bg-slate-100 text-slate-700'}`}>{app.status}</Badge>
                              <Badge className="bg-blue-100 text-blue-800 text-xs capitalize">{app.supplierType}</Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{app.contactEmail} — {app.city ? `${app.city}, ` : ''}{app.state}</p>
                          </div>
                          {app.status === 'rejected' && (
                            <Button
                              className="bg-green-700 text-white text-sm"
                              onClick={() => approveApp.mutate({ id: app.id })}
                              disabled={approveApp.isPending}
                            >
                              Re-Approve
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-900" />
              Approved Suppliers ({suppliers?.length ?? 0})
            </h2>
            {suppliersLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-900" /></div>
            ) : !suppliers || suppliers.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-8 text-center text-slate-500">No approved suppliers yet.</CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {suppliers.map(s => (
                  <Card key={s.id} className="border-0 shadow-md">
                    <CardContent className="py-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {s.logoUrl ? (
                            <img src={s.logoUrl} alt={s.businessName} className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-6 w-6 text-blue-900" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-slate-900">{s.businessName}</h3>
                              {s.featured === 'yes' && (
                                <Badge className="bg-amber-100 text-amber-800 text-xs">Featured</Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-800 text-xs capitalize">{s.supplierType}</Badge>
                            </div>
                            <div className="text-sm text-slate-500 space-y-0.5">
                              <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.contactEmail}</div>
                              {s.city && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.city}, {s.state}</div>}
                              {s.websiteUrl && <div className="flex items-center gap-1"><Globe className="h-3 w-3" />{s.websiteUrl}</div>}
                            </div>
                            {s.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{s.description}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            className={s.featured === 'yes' ? 'bg-amber-500 text-white hover:bg-amber-600 text-sm' : 'bg-slate-700 text-white hover:bg-slate-800 text-sm'}
                            onClick={() => toggleFeatured.mutate({ id: s.id, featured: s.featured === 'yes' ? 'no' : 'yes' })}
                          >
                            {s.featured === 'yes'
                              ? <><StarOff className="h-4 w-4 mr-1" />Unfeature</>
                              : <><Star className="h-4 w-4 mr-1" />Feature</>}
                          </Button>
                          <a href={`/grower-marketplace`} target="_blank" rel="noopener noreferrer">
                            <Button className="bg-blue-900 text-white text-sm w-full">
                              <Package className="h-4 w-4 mr-1" />View Listings
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
