import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { sendPushNotification } from "@/components/PushNotificationManager";

export function useShipmentNotifications() {
  const previousShipments = useRef<any[]>([]);

  // Poll for shipment updates every 30 seconds
  const { data: shipments } = trpc.transportation.getAllShipments.useQuery(undefined, {
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!shipments || previousShipments.current.length === 0) {
      previousShipments.current = shipments || [];
      return;
    }

    // Check for delayed shipments
    shipments.forEach((shipment: any) => {
      const previous = previousShipments.current.find((s: any) => s.id === shipment.id);
      
      if (!previous) {
        // New shipment - no notification needed
        return;
      }

      // Check if shipment became delayed (simple heuristic: in_transit for more than expected time)
      if (shipment.status === "in_transit") {
        const createdAt = new Date(shipment.createdAt).getTime();
        const now = Date.now();
        const hoursInTransit = (now - createdAt) / (1000 * 60 * 60);
        
        // If shipment has been in transit for more than 48 hours, consider it delayed
        if (hoursInTransit > 48) {
          const wasAlreadyDelayed = previous.status === "in_transit" && 
            (now - new Date(previous.updatedAt).getTime()) / (1000 * 60 * 60) > 48;
          
          if (!wasAlreadyDelayed) {
            sendPushNotification(
              "Shipment Delayed",
              `Shipment ${shipment.trackingNumber} has been in transit for over 48 hours`,
              { type: "shipment_delay", shipmentId: shipment.id, trackingNumber: shipment.trackingNumber }
            );
          }
        }
      }

      // Check if shipment was cancelled
      if (shipment.status === "cancelled" && previous.status !== "cancelled") {
        sendPushNotification(
          "Shipment Cancelled",
          `Shipment ${shipment.trackingNumber} has been cancelled`,
          { type: "shipment_cancelled", shipmentId: shipment.id, trackingNumber: shipment.trackingNumber }
        );
      }
    });

    previousShipments.current = shipments;
  }, [shipments]);
}

// Note: Driver issue reporting would require a separate feature where drivers can report issues
// For now, we'll add a placeholder that can be extended when that feature is implemented
export function useDriverIssueNotifications() {
  // This would poll for driver-reported issues from a dedicated endpoint
  // Example implementation:
  // const { data: driverIssues } = trpc.transportation.getDriverIssues.useQuery(undefined, {
  //   refetchInterval: 30000,
  // });
  
  // For now, this is a placeholder for future implementation
  useEffect(() => {
    // Placeholder for driver issue notifications
    // Would check for new issues and send notifications
  }, []);
}
