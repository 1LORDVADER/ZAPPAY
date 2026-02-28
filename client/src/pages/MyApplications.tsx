import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { NavHeader } from "@/components/NavHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Calendar, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

export default function MyApplications() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch all application types for current user
  const { data: applications, isLoading: appsLoading } = trpc.applications.getMyApplications.useQuery();

  const farmerApp = applications?.farmer;
  const driverApp = applications?.driver;
  const companyApp = applications?.company;
  const salesApp = applications?.salesRep;
  const dispensaryApp = applications?.dispensary;
  const advertiserApp = applications?.advertiser;

  const isLoading = authLoading || appsLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "pending":
      case "pending_approval":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "rejected":
      case "inactive":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="mr-1 h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const hasAnyApplication = farmerApp || driverApp || companyApp || salesApp || dispensaryApp || advertiserApp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Applications</h1>
          <p className="text-slate-600">Track the status of your applications to join ZAPPAY</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your applications...</p>
          </div>
        ) : !hasAnyApplication ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-600 mb-6">
                You haven't submitted any applications. Apply now to join ZAPPAY!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => setLocation("/farmer/register")}>
                  Apply as Farmer
                </Button>
                <Button onClick={() => setLocation("/transportation/driver-register")} variant="outline">
                  Apply as Driver
                </Button>
                <Button onClick={() => setLocation("/transportation/company-register")} variant="outline">
                  Apply as Company
                </Button>
                <Button onClick={() => setLocation("/sales/register")} variant="outline">
                  Apply as Sales Rep
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Farmer Application */}
            {farmerApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Licensed Farmer Application</CardTitle>
                      <CardDescription className="mt-1">
                        {farmerApp.businessName} • {farmerApp.state}
                      </CardDescription>
                    </div>
                    {getStatusBadge(farmerApp.verified || "pending")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(farmerApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {farmerApp.verified === "approved" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your farmer application has been approved. You can now access your{" "}
                        <button
                          onClick={() => setLocation("/farmer/dashboard")}
                          className="underline font-semibold"
                        >
                          Farmer Dashboard
                        </button>
                      </p>
                    </div>
                  )}
                  {farmerApp.verified === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Driver Application */}
            {driverApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Transportation Driver Application</CardTitle>
                      <CardDescription className="mt-1">
                        {driverApp.fullName} • License: {driverApp.licenseNumber}
                      </CardDescription>
                    </div>
                    {getStatusBadge(driverApp.status || "pending_approval")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(driverApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {driverApp.status === "active" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your driver application has been approved. Check your email for next steps.
                      </p>
                    </div>
                  )}
                  {driverApp.status === "inactive" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Company Application */}
            {companyApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Transportation Company Application</CardTitle>
                      <CardDescription className="mt-1">
                        {companyApp.companyName} • {companyApp.city}, {companyApp.state}
                      </CardDescription>
                    </div>
                    {getStatusBadge(companyApp.status || "pending_approval")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(companyApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {companyApp.status === "active" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your company application has been approved. Check your email for next steps.
                      </p>
                    </div>
                  )}
                  {companyApp.status === "inactive" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dispensary Application */}
            {dispensaryApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Dispensary Partner Application</CardTitle>
                      <CardDescription className="mt-1">
                        {dispensaryApp.businessName} • {dispensaryApp.city}, {dispensaryApp.state}
                      </CardDescription>
                    </div>
                    {getStatusBadge(dispensaryApp.status || "pending")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(dispensaryApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {dispensaryApp.status === "approved" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your dispensary application has been approved. Check your email for next steps.
                      </p>
                    </div>
                  )}
                  {dispensaryApp.status === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Advertiser Application */}
            {advertiserApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">Advertiser Application</CardTitle>
                      <CardDescription className="mt-1">
                        {advertiserApp.companyName} • {advertiserApp.tier}
                      </CardDescription>
                    </div>
                    {getStatusBadge(advertiserApp.status || "pending")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(advertiserApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {advertiserApp.status === "approved" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your advertiser application has been approved. Check your email for next steps.
                      </p>
                    </div>
                  )}
                  {advertiserApp.status === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sales Rep Application */}
            {salesApp && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">SaaS Sales Representative Application</CardTitle>
                      <CardDescription className="mt-1">
                        {salesApp.fullName} • {salesApp.experience}
                      </CardDescription>
                    </div>
                    {getStatusBadge(salesApp.status || "pending_approval")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted: {new Date(salesApp.createdAt).toLocaleDateString()}</span>
                  </div>
                  {salesApp.status === "approved" && (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        🎉 Congratulations! Your sales rep application has been approved. You can now access your{" "}
                        <button
                          onClick={() => setLocation("/sales/dashboard")}
                          className="underline font-semibold"
                        >
                          Sales Dashboard
                        </button>
                      </p>
                    </div>
                  )}
                  {salesApp.status === "rejected" && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm text-red-800">
                        Unfortunately, your application was not approved. Please contact support for more information.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
