import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, MapPin, Clock, Package, User, Phone, Mail } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminTransportation() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: drivers, isLoading: driversLoading } = trpc.transportation.getAllDrivers.useQuery();
  const { data: shipments, isLoading: shipmentsLoading } = trpc.transportation.getAllShipments.useQuery();

  useEffect(() => {
    if (!authLoading && (!user || user.email !== "Adarium33@gmail.com")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || driversLoading || shipmentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading transportation dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "Adarium33@gmail.com") {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in_transit":
      case "pending_approval":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="ZAPPAY Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">Admin: {user.name}</span>
              <Button variant="outline" onClick={() => setLocation("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Transportation Dashboard</h1>
          <p className="text-lg text-slate-600">Manage drivers, shipments, and GPS tracking</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{drivers?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {shipments?.filter(s => s.status === "in_transit").length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Delivered Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {shipments?.filter(s => {
                  if (!s.actualDeliveryTime) return false;
                  const today = new Date();
                  const deliveredDate = new Date(s.actualDeliveryTime);
                  return deliveredDate.toDateString() === today.toDateString();
                }).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {drivers?.filter(d => d.status === "pending_approval").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Drivers
            </CardTitle>
            <CardDescription>Manage driver profiles and approvals</CardDescription>
          </CardHeader>
          <CardContent>
            {!drivers || drivers.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No drivers registered yet. Drivers can register at /transportation/driver-register
              </div>
            ) : (
              <div className="space-y-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">{driver.fullName}</h3>
                          <Badge className={getStatusColor(driver.status)}>
                            {driver.status.replace("_", " ")}
                          </Badge>
                          {driver.verified === "yes" && (
                            <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                          )}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {driver.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {driver.phone}
                          </div>
                          <div>
                            Age: {driver.age} | Gender: {driver.gender}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          <strong>License:</strong> {driver.licenseNumber} ({driver.licenseState}) | 
                          <strong className="ml-2">Vehicle:</strong> {driver.vehicleType}
                          {driver.vehicleMake && ` - ${driver.vehicleMake} ${driver.vehicleModel} ${driver.vehicleYear}`}
                        </div>
                        <div className="mt-2 text-sm text-slate-600">
                          <strong>Total Deliveries:</strong> {driver.totalDeliveries}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {driver.status === "pending_approval" && (
                          <>
                            <Button size="sm" variant="default">Approve</Button>
                            <Button size="sm" variant="destructive">Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="h-6 w-6" />
              Shipments
            </CardTitle>
            <CardDescription>Real-time shipment tracking and management</CardDescription>
          </CardHeader>
          <CardContent>
            {!shipments || shipments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No shipments yet. Shipments will appear here when orders are placed.
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Tracking: {shipment.trackingNumber}
                          </h3>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600">
                          Order ID: {shipment.orderId} | Driver ID: {shipment.driverId}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <MapPin className="h-4 w-4 mr-2" />
                        Track GPS
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Pickup</div>
                        <div className="text-slate-600">
                          {shipment.pickupAddress}<br />
                          {shipment.pickupCity}, {shipment.pickupState} {shipment.pickupZip}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-700 mb-1">Delivery</div>
                        <div className="text-slate-600">
                          {shipment.deliveryAddress}<br />
                          {shipment.deliveryCity}, {shipment.deliveryState} {shipment.deliveryZip}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Estimated: {shipment.estimatedDeliveryTime ? new Date(shipment.estimatedDeliveryTime).toLocaleString() : "TBD"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="h-4 w-4" />
                          Distance: {shipment.distanceMiles} miles
                        </div>
                      </div>
                      {shipment.actualDeliveryTime && (
                        <div className="text-green-600 font-semibold">
                          Delivered: {new Date(shipment.actualDeliveryTime).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
