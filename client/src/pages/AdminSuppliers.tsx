import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle, XCircle, Star, StarOff, ExternalLink, Package,
  MapPin, Truck, AlertCircle, Loader2
} from "lucide-react";
import { Link } from "wouter";

export default function AdminSuppliers() {
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    applicationId?: number;
    action?: "approve" | "reject";
  }>({ open: false });
  const [reviewNote, setReviewNote] = useState("");

  const { data: applications = [], isLoading: appsLoading } = trpc.suppliers.adminListApplications.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: suppliers = [], isLoading: suppliersLoading } = trpc.suppliers.adminListSuppliers.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const reviewMutation = trpc.suppliers.adminReviewApplication.useMutation({
    onSuccess: () => {
      toast({ title: "Application updated" });
      utils.suppliers.adminListApplications.invalidate();
      utils.suppliers.adminListSuppliers.invalidate();
      setReviewDialog({ open: false });
      setReviewNote("");
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Map app rows to include reviewNote for AppCard
  type AppRow = (typeof applications)[0] & { reviewNote: string | null };

  const toggleFeaturedMutation = trpc.suppliers.adminToggleFeatured.useMutation({
    onSuccess: () => { toast({ title: "Featured status updated" }); utils.suppliers.adminListSuppliers.invalidate(); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const setStatusMutation = trpc.suppliers.adminSetStatus.useMutation({
    onSuccess: () => { toast({ title: "Status updated" }); utils.suppliers.adminListSuppliers.invalidate(); },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-lg border-0">
          <CardContent className="pt-10 pb-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-slate-500 mb-6">This page is restricted to ZAPPAY administrators.</p>
            <Link href="/"><Button className="bg-blue-900 hover:bg-blue-800 text-white">Go Home</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingApps = applications.filter((a) => a.status === "pending");
  const reviewedApps = applications.filter((a) => a.status !== "pending");
  const featuredCount = suppliers.filter((s) => s.featured === "yes").length;

  const openReview = (applicationId: number, action: "approve" | "reject") => {
    setReviewNote("");
    setReviewDialog({ open: true, applicationId, action });
  };

  const submitReview = () => {
    if (!reviewDialog.applicationId || !reviewDialog.action) return;
    reviewMutation.mutate({
      applicationId: reviewDialog.applicationId,
      decision: reviewDialog.action === "approve" ? "approved" : "rejected",
      reviewNotes: reviewNote || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-1">Supplier Review</h1>
          <p className="text-blue-200">Manage supplier applications and approved partners.</p>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{pendingApps.length}</div>
              <div className="text-xs text-blue-300">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <div className="text-xs text-blue-300">Active Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{featuredCount}</div>
              <div className="text-xs text-blue-300">Featured</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="applications">
          <TabsList className="mb-6">
            <TabsTrigger value="applications">
              Applications{" "}
              {pendingApps.length > 0 && (
                <Badge className="ml-2 bg-red-600 text-white text-xs">{pendingApps.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers ({suppliers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            {appsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No applications yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingApps.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Pending Review ({pendingApps.length})</h3>
                    <div className="space-y-3">
                      {pendingApps.map((app) => (
                        <AppCard key={app.id} app={{ ...app, reviewNote: null }} onApprove={() => openReview(app.id, "approve")} onReject={() => openReview(app.id, "reject")} />
                      ))}
                    </div>
                  </div>
                )}
                {reviewedApps.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-700 mb-3">Reviewed ({reviewedApps.length})</h3>
                    <div className="space-y-3">
                      {reviewedApps.map((app) => (
                        <AppCard key={app.id} app={{ ...app, reviewNote: null }} onApprove={() => openReview(app.id, "approve")} onReject={() => openReview(app.id, "reject")} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suppliers">
            {suppliersLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
              </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No approved suppliers yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map((s) => (
                  <Card key={s.id} className="shadow-sm border hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {s.logoUrl ? (
                            <img src={s.logoUrl} alt={s.businessName} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <div className="h-10 w-10 bg-slate-200 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-base">{s.businessName}</CardTitle>
                            <p className="text-xs text-slate-500">{s.supplierType}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-wrap justify-end">
                          <Badge className={`text-xs border-0 ${s.status === "approved" ? "bg-green-100 text-green-800" : s.status === "suspended" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                            {s.status}
                          </Badge>
                          {s.featured === "yes" && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800 border-0">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {s.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{s.description}</p>
                      )}
                      <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
                        {(s.city || s.state) && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[s.city, s.state].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {s.nationwide === "yes" && (
                          <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Nationwide</span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toggleFeaturedMutation.mutate({ supplierId: s.id, featured: s.featured !== "yes" })}
                          disabled={toggleFeaturedMutation.isPending}
                        >
                          {s.featured === "yes"
                            ? <><StarOff className="h-3 w-3 mr-1" /> Unfeature</>
                            : <><Star className="h-3 w-3 mr-1" /> Feature</>}
                        </Button>
                        {s.status === "approved" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-red-600 hover:text-red-700"
                            onClick={() => setStatusMutation.mutate({ supplierId: s.id, status: "suspended" })}
                            disabled={setStatusMutation.isPending}
                          >
                            <XCircle className="h-3 w-3 mr-1" /> Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-green-600 hover:text-green-700"
                            onClick={() => setStatusMutation.mutate({ supplierId: s.id, status: "approved" })}
                            disabled={setStatusMutation.isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" /> Re-approve
                          </Button>
                        )}
                        <Link href={`/supplier/${s.slug}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" /> View Page
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={reviewDialog.open} onOpenChange={(o) => setReviewDialog({ open: o })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === "approve" ? "Approve Application" : "Reject Application"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-500">
              {reviewDialog.action === "approve"
                ? "This will create a supplier profile and grant dashboard access."
                : "The applicant will be notified that their application was not approved."}
            </p>
            <div>
              <label className="text-sm font-medium text-slate-700">Note (optional)</label>
              <Textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Internal note or message to applicant..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog({ open: false })}>Cancel</Button>
            <Button
              onClick={submitReview}
              disabled={reviewMutation.isPending}
              className={reviewDialog.action === "approve"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {reviewMutation.isPending ? "Processing..." : reviewDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AppCard({ app, onApprove, onReject }: {
  app: {
    id: number; businessName: string; supplierType: string;
    contactName: string; contactEmail: string; contactPhone: string | null;
    state: string | null; city: string | null; nationwide: string;
    description: string | null; websiteUrl: string | null;
    status: string; reviewNote: string | null; createdAt: Date;
  };
  onApprove: () => void;
  onReject: () => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card className="shadow-sm border">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-slate-900">{app.businessName}</h4>
              <Badge className={`text-xs border-0 ${statusColors[app.status] ?? "bg-slate-100 text-slate-700"}`}>
                {app.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mb-1">
              {app.supplierType} · {app.contactName} · {app.contactEmail}
            </p>
            {(app.city || app.state) && (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {[app.city, app.state].filter(Boolean).join(", ")}
                {app.nationwide === "yes" && " · Nationwide"}
              </p>
            )}
            {app.description && (
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{app.description}</p>
            )}
            {app.reviewNote && (
              <p className="text-xs text-blue-600 mt-1 italic">Note: {app.reviewNote}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              Applied {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
            {app.status !== "approved" && (
              <Button size="sm" onClick={onApprove} className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs">
                <CheckCircle className="h-3 w-3 mr-1" /> Approve
              </Button>
            )}
            {app.status !== "rejected" && (
              <Button size="sm" variant="outline" onClick={onReject} className="text-red-600 hover:text-red-700 h-8 text-xs">
                <XCircle className="h-3 w-3 mr-1" /> {app.status === "approved" ? "Revoke" : "Reject"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
