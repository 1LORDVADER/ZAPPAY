import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error("Your browser doesn't support notifications");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        toast.success("Push notifications enabled!");
        // Send a test notification
        new Notification("ZAPPAY Notifications Enabled", {
          body: "You'll now receive instant alerts for new applications and shipment updates",
          icon: "/logo.png",
          badge: "/logo.png",
        });
      } else if (result === "denied") {
        toast.error("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
    }
  };

  if (!isSupported) {
    return null;
  }

  if (permission === "granted") {
    return (
      <Card className="border-[#c5d0dc] bg-[#f0f4f8]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#0D1B2A]" />
            <CardTitle className="text-[#0D1B2A]">Push Notifications Enabled</CardTitle>
          </div>
          <CardDescription className="text-[#1e3a5f]">
            You'll receive instant alerts for new applications, shipment delays, and driver issues
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BellOff className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-blue-900">Enable Push Notifications</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Get instant alerts when new applications are submitted or shipments need attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={requestPermission} className="w-full">
          <Bell className="mr-2 h-4 w-4" />
          Enable Notifications
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper function to send push notifications
export function sendPushNotification(title: string, body: string, data?: any) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: "/logo.png",
        badge: "/logo.png",
        data,
        requireInteraction: true, // Keep notification visible until user interacts
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
}
