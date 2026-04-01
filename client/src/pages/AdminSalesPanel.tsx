import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, DollarSign, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSalesPanel() {
  const { toast } = useToast();
  const { data: stats, isLoading: statsLoading } = trpc.salesReps.getAdminStats.useQuery();
  const { data: pendingCommissions, isLoading: commissionsLoading, refetch: refetchCommissions } = trpc.salesReps.getPendingCommissions.useQuery();
  
  const approveCommissionMutation = trpc.salesReps.approveCommission.useMutation({
    onSuccess: () => {
      toast({ title: "Success!", description: "Commission approved" });
      refetchCommissions();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });



  const markPaidMutation = trpc.salesReps.markCommissionPaid.useMutation({
    onSuccess: () => {
      toast({ title: "Success!", description: "Commission marked as paid" });
      refetchCommissions();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (statsLoading || commissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sales Force Admin Panel</h1>
        <p className="text-muted-foreground">Manage sales reps and commissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales Reps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{stats?.totalReps || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-3xl font-bold">{stats?.totalFarmers || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="text-3xl font-bold">${((stats?.pendingCommissions || 0) / 100).toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-700" />
              <span className="text-3xl font-bold">${((stats?.paidCommissions || 0) / 100).toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Commissions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Commission Approvals</CardTitle>
          <CardDescription>Review and approve commission payments</CardDescription>
        </CardHeader>
        <CardContent>
          {!pendingCommissions || pendingCommissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending commissions to review
            </div>
          ) : (
            <div className="space-y-4">
              {pendingCommissions.map((commission: any) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{commission.salesRep?.name || "Unknown Rep"}</p>
                      <Badge variant="secondary">{commission.salesRep?.referralCode}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {commission.type === "signup_bonus" ? "Signup Bonus" : `Month ${commission.subscriptionMonth} Commission`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Farmer: {commission.farmer?.businessName || "Unknown"} ({commission.farmer?.subscriptionTier})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(commission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">${(commission.amount / 100).toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => approveCommissionMutation.mutate({ commissionId: commission.id })}
                        disabled={approveCommissionMutation.isPending}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Commissions (Ready for Payout) */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Commissions (Ready for Payout)</CardTitle>
          <CardDescription>Mark commissions as paid after processing payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingCommissions?.filter((c: any) => c.status === "approved").map((commission: any) => (
              <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="space-y-1 flex-1">
                  <p className="font-semibold">{commission.salesRep?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {commission.type === "signup_bonus" ? "Signup Bonus" : `Month ${commission.subscriptionMonth}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-green-600">${(commission.amount / 100).toFixed(2)}</span>
                  <Button
                    size="sm"
                    onClick={() => markPaidMutation.mutate({ commissionId: commission.id })}
                    disabled={markPaidMutation.isPending}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Mark Paid
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
