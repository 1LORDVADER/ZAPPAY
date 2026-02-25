import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, XCircle, User, Truck, Building2, Briefcase, Mail, Phone, MapPin, Calendar, Store } from "lucide-react";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { useApplicationNotifications } from "@/hooks/useApplicationNotifications";

export default function AdminApplications() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Enable push notifications for new applications
  useApplicationNotifications();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.email !== "Adariusm33@gmail.com")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  // Fetch all applications
  const { data: farmerApps = [], refetch: refetchFarmers } = trpc.farmers.getPendingApplications.useQuery();
  const { data: driverApps = [], refetch: refetchDrivers } = trpc.transportation.getAllDrivers.useQuery();
  const { data: companyApps = [], refetch: refetchCompanies } = trpc.transportation.getAllCompanies.useQuery();
  const { data: salesApps = [], refetch: refetchSales } = trpc.sales.getAllApplications.useQuery();
  const { data: dispensaryApps = [], refetch: refetchDispensaries } = trpc.applications.getAllDispensaryApplications.useQuery();
  const { data: advertiserApps = [], refetch: refetchAdvertisers } = trpc.applications.getAllAdvertiserApplications.useQuery();

  // Approve/Reject mutations
  const approveFarmer = trpc.farmers.approveApplication.useMutation({
    onSuccess: () => {
      toast.success("Farmer application approved!");
      refetchFarmers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve application");
    }
  });

  const rejectFarmer = trpc.farmers.rejectApplication.useMutation({
    onSuccess: () => {
      toast.success("Farmer application rejected");
      refetchFarmers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject application");
    }
  });

  const approveDriver = trpc.transportation.approveDriver.useMutation({
    onSuccess: () => {
      toast.success("Driver application approved!");
      refetchDrivers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve driver");
    }
  });

  const rejectDriver = trpc.transportation.rejectDriver.useMutation({
    onSuccess: () => {
      toast.success("Driver application rejected");
      refetchDrivers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject driver");
    }
  });

  const approveCompany = trpc.transportation.approveCompany.useMutation({
    onSuccess: () => {
      toast.success("Company application approved!");
      refetchCompanies();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve company");
    }
  });

  const rejectCompany = trpc.transportation.rejectCompany.useMutation({
    onSuccess: () => {
      toast.success("Company application rejected");
      refetchCompanies();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject company");
    }
  });

  const approveSales = trpc.sales.approveApplication.useMutation({
    onSuccess: () => {
      toast.success("Sales rep application approved!");
      refetchSales();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve application");
    }
  });

  const rejectSales = trpc.sales.rejectApplication.useMutation({
    onSuccess: () => {
      toast.success("Sales rep application rejected");
      refetchSales();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject application");
    }
  });

  const approveDispensary = trpc.applications.approveDispensaryApplication.useMutation({
    onSuccess: () => {
      toast.success("Dispensary application approved!");
      refetchDispensaries();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve dispensary");
    }
  });

  const rejectDispensary = trpc.applications.rejectDispensaryApplication.useMutation({
    onSuccess: () => {
      toast.success("Dispensary application rejected");
      refetchDispensaries();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject dispensary");
    }
  });

  const approveAdvertiser = trpc.applications.approveAdvertiserApplication.useMutation({
    onSuccess: () => {
      toast.success("Advertiser application approved!");
      refetchAdvertisers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve advertiser");
    }
  });

  const rejectAdvertiser = trpc.applications.rejectAdvertiserApplication.useMutation({
    onSuccess: () => {
      toast.success("Advertiser application rejected");
      refetchAdvertisers();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject advertiser");
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "Adariusm33@gmail.com") {
    return null;
  }

  const pendingFarmers = farmerApps.filter((app: any) => app.verified === "pending");
  const pendingDrivers = driverApps.filter((driver: any) => driver.status === "pending_approval");
  const pendingCompanies = companyApps.filter((company: any) => company.status === "pending_approval");
  const pendingSales = salesApps.filter((app: any) => app.status === "pending_approval");
  const pendingDispensaries = dispensaryApps.filter((app: any) => app.status === "pending");
  const pendingAdvertisers = advertiserApps.filter((app: any) => app.status === "pending");

  const totalPending = pendingFarmers.length + pendingDrivers.length + pendingCompanies.length + pendingSales.length + pendingDispensaries.length + pendingAdvertisers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => setLocation("/")} className="mb-4">
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Application Review Dashboard</h1>
          <p className="text-slate-600">Review and manage pending applications</p>
          {totalPending > 0 && (
            <Badge variant="destructive" className="mt-2">
              {totalPending} Pending Applications
            </Badge>
          )}
        </div>

        {/* Push Notification Manager */}
        <div className="mb-6">
          <PushNotificationManager />
        </div>

        <Tabs defaultValue="farmers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Farmers ({pendingFarmers.length})
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Drivers ({pendingDrivers.length})
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Companies ({pendingCompanies.length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Sales Reps ({pendingSales.length})
            </TabsTrigger>
            <TabsTrigger value="dispensaries" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Dispensaries ({pendingDispensaries.length})
            </TabsTrigger>
            <TabsTrigger value="advertisers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Advertisers ({pendingAdvertisers.length})
            </TabsTrigger>
          </TabsList>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-4">
            {pendingFarmers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending farmer applications
                </CardContent>
              </Card>
            ) : (
              pendingFarmers.map((app: any) => (
                <Card key={app.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{app.businessName}</CardTitle>
                        <CardDescription className="mt-1">
                          License: {app.licenseNumber} • {app.state}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{app.city}, {app.state} {app.zipCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {app.bio && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm text-slate-700">{app.bio}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveFarmer.mutate({ id: app.id })}
                        disabled={approveFarmer.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectFarmer.mutate({ id: app.id })}
                        disabled={rejectFarmer.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            {pendingDrivers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending driver applications
                </CardContent>
              </Card>
            ) : (
              pendingDrivers.map((driver: any) => (
                <Card key={driver.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{driver.fullName}</CardTitle>
                        <CardDescription className="mt-1">
                          License: {driver.licenseNumber} • {driver.licenseState}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Age: {driver.age} • {driver.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(driver.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-sm">
                      <p><strong>Vehicle:</strong> {driver.vehicleYear} {driver.vehicleMake} {driver.vehicleModel}</p>
                      <p><strong>License Plate:</strong> {driver.vehicleLicensePlate}</p>
                      <p><strong>Insurance:</strong> {driver.insuranceProvider} - {driver.insurancePolicyNumber}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveDriver.mutate({ id: driver.id })}
                        disabled={approveDriver.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectDriver.mutate({ id: driver.id })}
                        disabled={rejectDriver.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies" className="space-y-4">
            {pendingCompanies.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending company applications
                </CardContent>
              </Card>
            ) : (
              pendingCompanies.map((company: any) => (
                <Card key={company.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{company.companyName}</CardTitle>
                        <CardDescription className="mt-1">
                          {company.businessLicenseNumber && `License: ${company.businessLicenseNumber}`}
                          {company.dotNumber && ` • DOT: ${company.dotNumber}`}
                          {company.mcNumber && ` • MC: ${company.mcNumber}`}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{company.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{company.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>{company.city}, {company.state} {company.zipCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(company.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-sm">
                      <p><strong>Address:</strong> {company.address}</p>
                      <p><strong>Insurance:</strong> {company.insuranceProvider} - {company.insurancePolicyNumber}</p>
                      <p><strong>Coverage:</strong> ${(company.insuranceCoverage / 100).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveCompany.mutate({ id: company.id })}
                        disabled={approveCompany.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectCompany.mutate({ id: company.id })}
                        disabled={rejectCompany.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Sales Reps Tab */}
          <TabsContent value="sales" className="space-y-4">
            {pendingSales.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending sales rep applications
                </CardContent>
              </Card>
            ) : (
              pendingSales.map((app: any) => (
                <Card key={app.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{app.fullName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.experience} experience • {app.location}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {app.linkedinUrl && (
                      <div className="text-sm">
                        <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View LinkedIn Profile →
                        </a>
                      </div>
                    )}
                    {app.resume && (
                      <div className="text-sm">
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Resume →
                        </a>
                      </div>
                    )}
                    {app.whyJoin && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Why they want to join:</p>
                        <p className="text-sm text-slate-700">{app.whyJoin}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveSales.mutate({ id: app.id })}
                        disabled={approveSales.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectSales.mutate({ id: app.id })}
                        disabled={rejectSales.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Dispensaries Tab */}
          <TabsContent value="dispensaries" className="space-y-4">
            {pendingDispensaries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending dispensary applications
                </CardContent>
              </Card>
            ) : (
              pendingDispensaries.map((app: any) => (
                <Card key={app.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{app.businessName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.city}, {app.state} • License: {app.licenseNumber}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{app.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm">
                      <p><strong>Address:</strong> {app.address}, {app.city}, {app.state} {app.zipCode}</p>
                      <p><strong>Years in Business:</strong> {app.yearsInBusiness}</p>
                      <p><strong>Monthly Volume:</strong> {app.monthlyVolume || 'N/A'}</p>
                    </div>
                    {app.currentSuppliers && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Current Suppliers:</p>
                        <p className="text-sm text-slate-700">{app.currentSuppliers}</p>
                      </div>
                    )}
                    {app.targetStrains && (
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Target Strains:</p>
                        <p className="text-sm text-slate-700">{app.targetStrains}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveDispensary.mutate({ id: app.id })}
                        disabled={approveDispensary.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectDispensary.mutate({ id: app.id })}
                        disabled={rejectDispensary.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Advertisers Tab */}
          <TabsContent value="advertisers" className="space-y-4">
            {pendingAdvertisers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  No pending advertiser applications
                </CardContent>
              </Card>
            ) : (
              pendingAdvertisers.map((app: any) => (
                <Card key={app.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{app.companyName}</CardTitle>
                        <CardDescription className="mt-1">
                          {app.industry} • {app.tier} tier
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>{app.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{app.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm">
                      <p><strong>Budget:</strong> ${app.budget.toLocaleString()}</p>
                      {app.website && <p><strong>Website:</strong> <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{app.website}</a></p>}
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Target Audience:</p>
                      <p className="text-sm text-slate-700">{app.targetAudience}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm font-semibold mb-1">Campaign Goals:</p>
                      <p className="text-sm text-slate-700">{app.campaignGoals}</p>
                    </div>
                    {app.adCreativeUrl && (
                      <div className="text-sm">
                        <a href={app.adCreativeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Ad Creative →
                        </a>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => approveAdvertiser.mutate({ id: app.id })}
                        disabled={approveAdvertiser.isPending}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => rejectAdvertiser.mutate({ id: app.id })}
                        disabled={rejectAdvertiser.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
