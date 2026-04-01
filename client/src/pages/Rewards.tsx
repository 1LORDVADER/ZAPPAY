import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Gift, Star, Trophy, Zap, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Rewards() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  // Fetch user's loyalty points
  const { data: loyaltyData, isLoading: pointsLoading } = trpc.loyalty.getMyPoints.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Fetch available rewards
  const { data: rewards = [], isLoading: rewardsLoading } = trpc.loyalty.getRewards.useQuery();
  
  // Redeem reward mutation
  const utils = trpc.useUtils();
  const redeemMutation = trpc.loyalty.redeemReward.useMutation({
    onSuccess: () => {
      toast.success("Reward redeemed successfully!");
      utils.loyalty.getMyPoints.invalidate();
      utils.loyalty.getMyTransactions.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (authLoading || pointsLoading || rewardsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">Please login to view your rewards</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  const userPoints = loyaltyData?.points || 0;
  const tier = loyaltyData?.tier || "Bronze";

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Platinum": return "text-amber-600 bg-amber-100";
      case "Gold": return "text-yellow-600 bg-yellow-100";
      case "Silver": return "text-slate-600 bg-slate-100";
      default: return "text-orange-600 bg-orange-100";
    }
  };

  const handleRedeem = (rewardId: number, pointsCost: number) => {
    if (userPoints < pointsCost) {
      toast.error("Not enough points to redeem this reward");
      return;
    }
    
    redeemMutation.mutate({ rewardId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="ZAPPAY Logo" 
                className="h-12 w-auto object-contain"
              />
            </a>
            
            <nav className="flex items-center gap-6">
              <a href="/" className="text-slate-700 hover:text-blue-900 font-medium transition-colors">
                Home
              </a>
              <Button variant="outline" onClick={() => window.location.href = "/"}>
                Back to Shop
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Rewards Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Loyalty Rewards</h1>
            <p className="text-slate-600 text-lg">Earn points with every purchase and redeem for exclusive rewards</p>
          </div>

          {/* Points Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Your Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">{userPoints.toLocaleString()}</p>
                <p className="text-sm text-slate-600 mt-2">Earn 1 point per $1 spent</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  Membership Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`text-lg px-4 py-2 ${getTierColor(tier)}`}>
                  {tier}
                </Badge>
                <p className="text-sm text-slate-600 mt-2">Keep earning to level up!</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Rewards Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">
                  {rewards.filter(r => r.pointsCost <= userPoints && r.isActive).length}
                </p>
                <p className="text-sm text-slate-600 mt-2">Ready to redeem now</p>
              </CardContent>
            </Card>
          </div>

          {/* Rewards Catalog */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Rewards</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.filter(r => r.isActive).map((reward) => {
                const canAfford = userPoints >= reward.pointsCost;
                
                return (
                  <Card 
                    key={reward.id} 
                    className={`border-2 transition-all ${
                      canAfford 
                        ? 'border-green-200 hover:border-green-400 hover:shadow-lg' 
                        : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Gift className={`h-8 w-8 ${canAfford ? 'text-green-600' : 'text-slate-400'}`} />
                        <Badge variant={canAfford ? "default" : "secondary"}>
                          {reward.pointsCost} pts
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {reward.discountValue && (
                        <p className="text-sm text-slate-600 mb-4">
                          {reward.discountType === 'percentage' ? `${reward.discountValue}% off` : `$${reward.discountValue} off`}
                        </p>
                      )}
                      
                      <Button
                        className="w-full"
                        disabled={!canAfford || redeemMutation.isPending}
                        onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                        variant={canAfford ? "default" : "secondary"}
                      >
                        {redeemMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Redeeming...
                          </>
                        ) : canAfford ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Redeem Now
                          </>
                        ) : (
                          `Need ${reward.pointsCost - userPoints} more points`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {rewards.filter(r => r.isActive).length === 0 && (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">No rewards available at the moment</p>
                <p className="text-slate-500">Check back soon for exciting new rewards!</p>
              </div>
            )}
          </div>

          {/* How It Works */}
          <Card className="mt-12 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle>How Loyalty Rewards Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Earn Points</h3>
                  <p className="text-slate-600">Get 1 point for every $1 you spend on ZAPPAY</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Level Up</h3>
                  <p className="text-slate-600">Reach higher tiers (Silver, Gold, Platinum) for exclusive perks</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Redeem Rewards</h3>
                  <p className="text-slate-600">Exchange points for discounts, free products, and special offers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
