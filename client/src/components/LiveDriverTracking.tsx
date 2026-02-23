import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";

interface DriverLocation {
  driverId: number;
  driverName: string;
  latitude: number;
  longitude: number;
  lastUpdate: Date;
  status: string;
}

export function LiveDriverTracking() {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
  
  // Fetch active drivers and their current locations
  const { data: drivers } = trpc.transportation.getAllDrivers.useQuery();
  const { data: shipments } = trpc.transportation.getAllShipments.useQuery();
  
  // Poll for driver location updates every 30 seconds
  useEffect(() => {
    const updateDriverLocations = () => {
      if (!drivers || !shipments) return;
      
      const activeDrivers = drivers.filter((d: any) => d.status === "active");
      const inTransitShipments = shipments.filter((s: any) => s.status === "in_transit");
      
      // Simulate driver locations based on shipment routes
      const locations: DriverLocation[] = activeDrivers.slice(0, 5).map((driver: any, index: number) => {
        const shipment = inTransitShipments[index % inTransitShipments.length];
        if (!shipment) return null;
        
        // Simulate position between pickup and delivery (interpolate)
        const progress = 0.3 + (Math.random() * 0.4); // 30-70% of route
        const pickupLat = parseFloat(shipment.pickupLatitude);
        const pickupLng = parseFloat(shipment.pickupLongitude);
        const deliveryLat = parseFloat(shipment.deliveryLatitude);
        const deliveryLng = parseFloat(shipment.deliveryLongitude);
        
        const lat = pickupLat + (deliveryLat - pickupLat) * progress;
        const lng = pickupLng + (deliveryLng - pickupLng) * progress;
        
        return {
          driverId: driver.id,
          driverName: driver.fullName,
          latitude: lat,
          longitude: lng,
          lastUpdate: new Date(),
          status: driver.status
        };
      }).filter(Boolean) as DriverLocation[];
      
      setDriverLocations(locations);
    };
    
    updateDriverLocations();
    const interval = setInterval(updateDriverLocations, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [drivers, shipments]);
  
  const handleMapReady = (map: google.maps.Map) => {
    // Clear existing markers
    const markers: google.maps.Marker[] = [];
    
    // Add driver location markers (blue truck icons)
    driverLocations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        title: location.driverName,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#3B82F6", // Blue color for active drivers
          fillOpacity: 1,
          strokeColor: "#1E40AF",
          strokeWeight: 2,
          scale: 10,
        },
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${location.driverName}</h3>
            <p style="font-size: 12px; color: #666;">Status: ${location.status}</p>
            <p style="font-size: 12px; color: #666;">Last update: ${location.lastUpdate.toLocaleTimeString()}</p>
          </div>
        `,
      });
      
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
      
      markers.push(marker);
    });
    
    // Fit map to show all driver locations
    if (driverLocations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      driverLocations.forEach((location) => {
        bounds.extend({ lat: location.latitude, lng: location.longitude });
      });
      map.fitBounds(bounds);
    }
  };
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border-2 border-slate-200">
      <MapView onMapReady={handleMapReady} />
    </div>
  );
}
