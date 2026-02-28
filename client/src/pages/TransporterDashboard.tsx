import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, Package, MapPin, Clock, DollarSign, TrendingUp, Navigation, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "wouter";

export default function TransporterDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);

  const { data: driverProfile, isLoading: profileLoading } = trpc.transportation.getMyDriverProfile.useQuery();
  const { data: availableDeliveries, isLoading: deliveriesLoading } = trpc.transportation.getAvailableDeliveries.useQuery();
  const { data: myDeliveries, isLoading: myDeliveriesLoading } = trpc.transportation.getMyDeliveries.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.transportation.getDriverStats.useQuery();

  const acceptDelivery = trpc.transportation.acceptDelivery.useMutation({
    onSuccess: () => {
      toast.success("Delivery accepted successfully!");
      setSelectedShipment(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to accept delivery");
    },
  });

  const updateDeliveryStatus = trpc.transportation.updateDeliveryStatus.useMutation({
    onSuccess: () => {
      toast.success("Delivery status updated!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
        <Link href="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  if (!driverProfile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Driver Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          You need to complete driver registration to access this dashboard.
        </p>
        <Link href="/transportation/driver-register">
          <Button>Register as Driver</Button>
        </Link>
      </div>
    );
  }

  if (driverProfile.status === "pending_approval") {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Clock className="h-16 w-16 mx-auto text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Application Under Review</h1>
          <p className="text-muted-foreground mb-6">
            Your driver application is currently being reviewed by our team. You'll receive an email once approved.
          </p>
          <Link href="/">
            <Button variant="outline">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transporter Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {driverProfile.fullName}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDeliveries || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Navigation className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeDeliveries || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${((stats?.totalEarnings || 0) / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driverProfile.rating || "N/A"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Deliveries</TabsTrigger>
            <TabsTrigger value="active">My Deliveries</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Available Deliveries */}
          <TabsContent value="available" className="space-y-4">
            {deliveriesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : availableDeliveries && availableDeliveries.length > 0 ? (
              availableDeliveries.map((delivery: any) => (
                <Card key={delivery.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Delivery #{delivery.trackingNumber}</CardTitle>
                        <CardDescription>
                          {delivery.pickupCity}, {delivery.pickupState} → {delivery.deliveryCity}, {delivery.deliveryState}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{delivery.distanceMiles} miles</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup</p>
                        <p className="font-medium">{delivery.pickupAddress}</p>
                        <p className="text-sm">{delivery.pickupCity}, {delivery.pickupState} {delivery.pickupZip}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery</p>
                        <p className="font-medium">{delivery.deliveryAddress}</p>
                        <p className="text-sm">{delivery.deliveryCity}, {delivery.deliveryState} {delivery.deliveryZip}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Payout</p>
                        <p className="text-2xl font-bold text-[#0D1B2A]">
                          ${(delivery.driverPayout / 100).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        onClick={() => acceptDelivery.mutate({ shipmentId: delivery.id })}
                        disabled={acceptDelivery.isPending}
                      >
                        {acceptDelivery.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          "Accept Delivery"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No available deliveries at the moment</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Deliveries */}
          <TabsContent value="active" className="space-y-4">
            {myDeliveriesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : myDeliveries && myDeliveries.length > 0 ? (
              myDeliveries.map((delivery: any) => (
                <Card key={delivery.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Delivery #{delivery.trackingNumber}</CardTitle>
                        <CardDescription>
                          {delivery.pickupCity}, {delivery.pickupState} → {delivery.deliveryCity}, {delivery.deliveryState}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          delivery.status === "delivered"
                            ? "default"
                            : delivery.status === "in_transit"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {delivery.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Pickup</p>
                        <p className="font-medium">{delivery.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery</p>
                        <p className="font-medium">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Payout</p>
                        <p className="text-xl font-bold">${(delivery.driverPayout / 100).toFixed(2)}</p>
                      </div>
                      {delivery.status !== "delivered" && (
                        <div className="flex gap-2">
                          {delivery.status === "assigned" && (
                            <Button
                              onClick={() =>
                                updateDeliveryStatus.mutate({
                                  shipmentId: delivery.id,
                                  status: "picked_up",
                                })
                              }
                              disabled={updateDeliveryStatus.isPending}
                            >
                              Mark as Picked Up
                            </Button>
                          )}
                          {delivery.status === "picked_up" && (
                            <Button
                              onClick={() =>
                                updateDeliveryStatus.mutate({
                                  shipmentId: delivery.id,
                                  status: "in_transit",
                                })
                              }
                              disabled={updateDeliveryStatus.isPending}
                            >
                              Start Transit
                            </Button>
                          )}
                          {delivery.status === "in_transit" && (
                            <Button
                              onClick={() =>
                                updateDeliveryStatus.mutate({
                                  shipmentId: delivery.id,
                                  status: "delivered",
                                })
                              }
                              disabled={updateDeliveryStatus.isPending}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Navigation className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active deliveries</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Delivery History */}
          <TabsContent value="history">
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Delivery history coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
