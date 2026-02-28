import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminAnalytics() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.email !== "Adariusm33@gmail.com")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  const { data: analytics, isLoading } = trpc.admin.getAnalytics.useQuery();

  if (loading || isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#1e3a5f', '#dc2626', '#c41d15', '#ea580c'];

  const applicationsByType = [
    { name: 'Farmers', value: analytics.totalFarmers },
    { name: 'Drivers', value: analytics.totalDrivers },
    { name: 'Companies', value: analytics.totalCompanies },
    { name: 'Sales Reps', value: analytics.totalSalesReps },
  ];

  const statusData = [
    { name: 'Pending', value: analytics.pendingApplications },
    { name: 'Approved', value: analytics.approvedApplications },
    { name: 'Rejected', value: analytics.rejectedApplications },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a5f] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>
          <p className="text-blue-100 mt-2">Application metrics and insights</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics.pendingApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-[#0D1B2A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0D1B2A]">{analytics.approvedApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Approval Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgApprovalTime}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Hours to approve
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Type</CardTitle>
              <CardDescription>Distribution of application types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1e3a5f" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Current status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Demographics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Top States by Applications</CardTitle>
            <CardDescription>Geographic distribution of applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topStates.map((state: { state: string; count: number }, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="font-medium">{state.state}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#1e3a5f] h-2 rounded-full"
                        style={{ width: `${(state.count / analytics.totalApplications) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{state.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
