import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NavHeader } from "@/components/NavHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";
import { Link } from "wouter";
import {
  MessageSquare, Clock, CheckCircle2, XCircle,
  Building2, Mail, Phone, MapPin, Package, User, Calendar, ArrowLeft
} from "lucide-react";
import { getLoginUrl } from "@/const";

type QuoteStatus = "pending" | "responded" | "closed";

const STATUS_CONFIG: Record<QuoteStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  responded: {
    label: "Responded",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  closed: {
    label: "Closed",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export default function AdminQuotes() {
  const { user, isAuthenticated, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");

  const { data: quotes = [], isLoading, refetch } = trpc.suppliers.adminListQuotes.useQuery(
    statusFilter === "all" ? {} : { status: statusFilter },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const updateStatus = trpc.suppliers.adminUpdateQuoteStatus.useMutation({
    onSuccess: () => {
      toast.success("Quote status updated");
      refetch();
    },
    onError: () => toast.error("Failed to update status"),
  });

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <MessageSquare className="h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-800">Sign in required</h2>
        <p className="text-slate-500 text-center max-w-sm">
          You need to be signed in as an admin to view quote requests.
        </p>
        <Button
          className="bg-blue-900 hover:bg-blue-800 text-white"
          onClick={() => { window.location.href = getLoginUrl(); }}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <XCircle className="h-12 w-12 text-red-300" />
        <h2 className="text-xl font-semibold text-slate-800">Access Denied</h2>
        <p className="text-slate-500 text-center max-w-sm">
          This page is restricted to ZAPPAY administrators.
        </p>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const pendingCount = quotes.filter((q) => q.status === "pending").length;
  const respondedCount = quotes.filter((q) => q.status === "responded").length;
  const closedCount = quotes.filter((q) => q.status === "closed").length;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavHeader />
      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/suppliers">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" /> Supplier Review
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-900" />
              Quote Requests
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Incoming B2B quote requests from the Grower Marketplace
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="text-2xl font-bold text-amber-800">{pendingCount}</div>
                  <div className="text-xs text-amber-600">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-800">{respondedCount}</div>
                  <div className="text-xs text-blue-600">Responded</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-slate-100">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="text-2xl font-bold text-slate-700">{closedCount}</div>
                  <div className="text-xs text-slate-500">Closed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-slate-500 font-medium">Filter by status:</span>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as QuoteStatus | "all")}>
            <SelectTrigger className="w-40 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({quotes.length})</SelectItem>
              <SelectItem value="pending">Pending ({pendingCount})</SelectItem>
              <SelectItem value="responded">Responded ({respondedCount})</SelectItem>
              <SelectItem value="closed">Closed ({closedCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotes list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <Card className="border-dashed border-slate-300">
            <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500 font-medium">No quote requests yet</p>
              <p className="text-slate-400 text-sm max-w-xs">
                When buyers submit quote requests from the Grower Marketplace, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {quotes.map((q) => {
              const cfg = STATUS_CONFIG[q.status as QuoteStatus];
              return (
                <Card key={q.id} className="border-slate-200 hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Left: requester info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${cfg.color} border flex items-center gap-1 text-xs`}>
                            {cfg.icon} {cfg.label}
                          </Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-start gap-4 flex-wrap">
                          {/* Requester */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                              <User className="h-4 w-4 text-slate-400 shrink-0" />
                              {q.requesterName}
                              {q.requesterCompany && (
                                <span className="text-slate-400 font-normal">· {q.requesterCompany}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <a
                                href={`mailto:${q.requesterEmail}`}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                              >
                                <Mail className="h-3 w-3" /> {q.requesterEmail}
                              </a>
                              {q.requesterPhone && (
                                <a
                                  href={`tel:${q.requesterPhone}`}
                                  className="flex items-center gap-1 text-xs text-slate-500 hover:underline"
                                >
                                  <Phone className="h-3 w-3" /> {q.requesterPhone}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Product */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-sm text-slate-700">
                              <Package className="h-4 w-4 text-slate-400 shrink-0" />
                              <span className="font-medium">{q.productName}</span>
                              <span className="text-slate-400">× {q.quantity} units</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" /> Deliver to: {q.deliveryState}
                              {q.supplierName && (
                                <>
                                  <span className="mx-1">·</span>
                                  <Building2 className="h-3 w-3" />
                                  <Link href={`/supplier/${q.supplierSlug}`}>
                                    <span className="text-blue-600 hover:underline cursor-pointer">{q.supplierName}</span>
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {q.notes && (
                          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 italic">
                            "{q.notes}"
                          </p>
                        )}
                      </div>

                      {/* Right: status actions */}
                      <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        {q.status !== "responded" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-700 border-blue-200 hover:bg-blue-50 text-xs"
                            disabled={updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ quoteId: q.id, status: "responded" })}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Responded
                          </Button>
                        )}
                        {q.status !== "closed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-slate-600 border-slate-200 hover:bg-slate-100 text-xs"
                            disabled={updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ quoteId: q.id, status: "closed" })}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Close
                          </Button>
                        )}
                        {q.status !== "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:bg-amber-50 text-xs"
                            disabled={updateStatus.isPending}
                            onClick={() => updateStatus.mutate({ quoteId: q.id, status: "pending" })}
                          >
                            <Clock className="h-3.5 w-3.5 mr-1" /> Reopen
                          </Button>
                        )}
                        <a href={`mailto:${q.requesterEmail}?subject=Re: Quote for ${encodeURIComponent(q.productName)}`}>
                          <Button size="sm" className="bg-blue-900 hover:bg-blue-800 text-white text-xs w-full">
                            <Mail className="h-3.5 w-3.5 mr-1" /> Reply
                          </Button>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
