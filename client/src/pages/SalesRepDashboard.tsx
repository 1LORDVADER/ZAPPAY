import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, CheckCircle2, Clock, DollarSign, Users, TrendingUp, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function SalesRepDashboard() {
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = trpc.salesReps.getMyProfile.useQuery();
  const { data: dashboard, isLoading: dashboardLoading, refetch } = trpc.salesReps.getDashboard.useQuery(undefined, {
    enabled: !!profile,
  });
  const registerMutation = trpc.salesReps.register.useMutation({
    onSuccess: () => {
      toast({ title: "Success!", description: "You are now registered as a sales rep" });
      refetch();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const copyReferralCode = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      toast({ title: "Copied!", description: "Referral code copied to clipboard" });
    }
  };

  const copyReferralLink = () => {
    if (profile?.referralCode) {
      const link = `${window.location.origin}/farmer/register?ref=${profile.referralCode}`;
      navigator.clipboard.writeText(link);
      toast({ title: "Copied!", description: "Referral link copied to clipboard" });
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Join ZAPPAY Sales Force</CardTitle>
            <CardDescription>
              Earn commissions by onboarding cannabis farmers to the ZAPPAY platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Lucrative Commissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn $500-$1,000 signup bonus + 20% recurring commission for 12 months
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Build Your Network</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with licensed cannabis farmers across all legal states
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Track Your Success</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time dashboard with pipeline tracking and commission calculator
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-semibold">Commission Structure:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Standard Tier ($250/month): $500 signup + $50/month for 12 months = $1,100 total</li>
                <li>• Premium Tier ($1,100/month): $1,000 signup + $220/month for 12 months = $3,640 total</li>
              </ul>
            </div>

            <Button
              onClick={() => registerMutation.mutate()}
              disabled={registerMutation.isPending}
              size="lg"
              className="w-full"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register as Sales Rep"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = {
    totalReferrals: dashboard?.rep.totalReferrals || 0,
    activeReferrals: dashboard?.rep.activeReferrals || 0,
    pendingCommissions: (dashboard?.rep.pendingCommissions || 0) / 100,
    paidCommissions: (dashboard?.rep.paidCommissions || 0) / 100,
    totalEarned: (dashboard?.rep.totalCommissionsEarned || 0) / 100,
  };

  const pendingReferrals = dashboard?.referrals.filter((r) => r.status === "pending") || [];
  const convertedReferrals = dashboard?.referrals.filter((r) => r.status === "converted") || [];
  const pendingCommissions = dashboard?.commissions.filter((c) => c.status === "pending") || [];
  const approvedCommissions = dashboard?.commissions.filter((c) => c.status === "approved") || [];
  const paidCommissions = dashboard?.commissions.filter((c) => c.status === "paid") || [];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Rep Dashboard</h1>
          <p className="text-muted-foreground">Track your referrals and commissions</p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {/* Referral Code Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>Share this code with farmers to earn commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white p-4 rounded-lg border-2 border-dashed">
              <code className="text-2xl font-bold tracking-wider">{profile.referralCode}</code>
            </div>
            <Button onClick={copyReferralCode} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </Button>
          </div>
          <Button onClick={copyReferralLink} variant="secondary" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy Referral Link
          </Button>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-3xl font-bold">{stats.totalReferrals}</span>
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
              <span className="text-3xl font-bold">{stats.activeReferrals}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-3xl font-bold">${stats.pendingCommissions.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="text-3xl font-bold">${stats.totalEarned.toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>Track farmers you've onboarded</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard?.referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No referrals yet. Start sharing your referral code!
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard?.referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-semibold">{referral.farmerName || "Unknown Farmer"}</p>
                    <p className="text-sm text-muted-foreground">{referral.farmerEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Referred on {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {referral.subscriptionTier && (
                      <Badge variant={referral.subscriptionTier === "premium" ? "default" : "secondary"}>
                        {referral.subscriptionTier}
                      </Badge>
                    )}
                    <Badge
                      variant={
                        referral.status === "converted"
                          ? "default"
                          : referral.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>Track your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard?.commissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No commissions yet. Commissions are generated when farmers subscribe.
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard?.commissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {commission.type === "signup_bonus" ? "Signup Bonus" : `Month ${commission.subscriptionMonth} Commission`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(commission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">${(commission.amount / 100).toFixed(2)}</span>
                    <Badge
                      variant={
                        commission.status === "paid"
                          ? "default"
                          : commission.status === "approved"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {commission.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
