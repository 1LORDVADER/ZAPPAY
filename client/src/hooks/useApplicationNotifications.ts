import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { sendPushNotification } from "@/components/PushNotificationManager";

export function useApplicationNotifications() {
  const previousCounts = useRef({
    farmers: 0,
    drivers: 0,
    companies: 0,
    salesReps: 0,
  });

  // Poll for new applications every 30 seconds
  const { data: farmerApps } = trpc.farmers.getPendingApplications.useQuery(undefined, {
    refetchInterval: 30000,
  });
  
  const { data: driverApps } = trpc.transportation.getAllDrivers.useQuery(undefined, {
    refetchInterval: 30000,
  });
  
  const { data: companyApps } = trpc.transportation.getAllCompanies.useQuery(undefined, {
    refetchInterval: 30000,
  });
  
  const { data: salesApps } = trpc.sales.getAllApplications.useQuery(undefined, {
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!farmerApps) return;
    
    const pendingFarmers = farmerApps.filter((app: any) => app.verified === "pending");
    const currentCount = pendingFarmers.length;
    
    if (previousCounts.current.farmers > 0 && currentCount > previousCounts.current.farmers) {
      const newCount = currentCount - previousCounts.current.farmers;
      sendPushNotification(
        "New Farmer Application",
        `${newCount} new farmer application${newCount > 1 ? "s" : ""} submitted`,
        { type: "farmer_application", count: newCount }
      );
    }
    
    previousCounts.current.farmers = currentCount;
  }, [farmerApps]);

  useEffect(() => {
    if (!driverApps) return;
    
    const pendingDrivers = driverApps.filter((app: any) => app.status === "pending_approval");
    const currentCount = pendingDrivers.length;
    
    if (previousCounts.current.drivers > 0 && currentCount > previousCounts.current.drivers) {
      const newCount = currentCount - previousCounts.current.drivers;
      sendPushNotification(
        "New Driver Application",
        `${newCount} new driver application${newCount > 1 ? "s" : ""} submitted`,
        { type: "driver_application", count: newCount }
      );
    }
    
    previousCounts.current.drivers = currentCount;
  }, [driverApps]);

  useEffect(() => {
    if (!companyApps) return;
    
    const pendingCompanies = companyApps.filter((app: any) => app.status === "pending_approval");
    const currentCount = pendingCompanies.length;
    
    if (previousCounts.current.companies > 0 && currentCount > previousCounts.current.companies) {
      const newCount = currentCount - previousCounts.current.companies;
      sendPushNotification(
        "New Company Application",
        `${newCount} new transportation company application${newCount > 1 ? "s" : ""} submitted`,
        { type: "company_application", count: newCount }
      );
    }
    
    previousCounts.current.companies = currentCount;
  }, [companyApps]);

  useEffect(() => {
    if (!salesApps) return;
    
    const pendingSales = salesApps.filter((app: any) => app.status === "pending_approval");
    const currentCount = pendingSales.length;
    
    if (previousCounts.current.salesReps > 0 && currentCount > previousCounts.current.salesReps) {
      const newCount = currentCount - previousCounts.current.salesReps;
      sendPushNotification(
        "New Sales Rep Application",
        `${newCount} new sales rep application${newCount > 1 ? "s" : ""} submitted`,
        { type: "sales_application", count: newCount }
      );
    }
    
    previousCounts.current.salesReps = currentCount;
  }, [salesApps]);
}
