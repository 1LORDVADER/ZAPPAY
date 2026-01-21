import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { MapPin, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock order tracking data - in production this would come from tRPC
const mockTrackingData = {
  orderId: "ORD-2025-001",
  status: "in_transit",
  estimatedDelivery: "Today, 3:00 PM - 5:00 PM",
  currentLocation: {
    lat: 34.0522,
    lng: -118.2437,
    address: "Downtown Los Angeles, CA"
  },
  destination: {
    lat: 34.0689,
    lng: -118.4452,
    address: "West Hollywood, CA 90069"
  },
  driver: {
    name: "Michael Rodriguez",
    phone: "(310) 555-0123",
    vehicle: "Toyota Prius - License ABC123"
  },
  timeline: [
    {
      status: "order_placed",
      timestamp: "2025-01-20 10:30 AM",
      location: "Order Confirmed",
      completed: true
    },
    {
      status: "processing",
      timestamp: "2025-01-20 11:00 AM",
      location: "Glass House Farms, Los Angeles",
      completed: true
    },
    {
      status: "picked_up",
      timestamp: "2025-01-20 12:15 PM",
      location: "Driver picked up package",
      completed: true
    },
    {
      status: "in_transit",
      timestamp: "2025-01-20 1:30 PM",
      location: "En route to destination",
      completed: true
    },
    {
      status: "delivered",
      timestamp: "Estimated 3:00 PM - 5:00 PM",
      location: "West Hollywood, CA",
      completed: false
    }
  ]
};

export default function TrackOrder() {
  const params = useParams();
  const orderId = params.id || "ORD-2025-001";
  const [tracking, setTracking] = useState(mockTrackingData);

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTracking(prev => ({
        ...prev,
        currentLocation: {
          ...prev.currentLocation,
          lat: prev.currentLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.currentLocation.lng + (Math.random() - 0.5) * 0.001,
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <Clock className="h-5 w-5 text-gray-400" />;
    
    switch (status) {
      case "order_placed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-green-600" />;
      case "picked_up":
      case "in_transit":
        return <Truck className="h-5 w-5 text-green-600" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Track Your Order</h1>
          <p className="text-slate-600">Order #{orderId}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live GPS Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Map Container */}
                <div className="relative h-[500px] bg-gradient-to-br from-blue-50 to-slate-100">
                  {/* Simulated Map with Route */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Route Line */}
                      <svg className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 100 400 Q 300 200 500 300"
                          stroke="url(#routeGradient)"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray="10,5"
                        />
                      </svg>

                      {/* Current Location Marker (animated) */}
                      <motion.div
                        animate={{
                          x: [300, 320, 300],
                          y: [200, 190, 200],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute"
                        style={{ left: '300px', top: '200px' }}
                      >
                        <div className="relative">
                          {/* Pulsing circle */}
                          <motion.div
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="absolute -inset-4 bg-blue-500 rounded-full"
                          />
                          {/* Truck icon */}
                          <div className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg">
                            <Truck className="h-6 w-6" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Destination Marker */}
                      <div className="absolute" style={{ left: '500px', top: '300px' }}>
                        <div className="bg-green-600 text-white p-3 rounded-full shadow-lg">
                          <MapPin className="h-6 w-6" />
                        </div>
                      </div>

                      {/* Location Labels */}
                      <div className="absolute bg-white px-4 py-2 rounded-lg shadow-md" style={{ left: '320px', top: '160px' }}>
                        <p className="text-sm font-semibold text-slate-900">Current Location</p>
                        <p className="text-xs text-slate-600">{tracking.currentLocation.address}</p>
                      </div>

                      <div className="absolute bg-white px-4 py-2 rounded-lg shadow-md" style={{ left: '520px', top: '280px' }}>
                        <p className="text-sm font-semibold text-slate-900">Destination</p>
                        <p className="text-xs text-slate-600">{tracking.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Status Badge */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <span className="text-sm font-semibold">LIVE</span>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tracking Details Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className={getStatusColor(tracking.status)}>
                    {tracking.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-slate-900">{tracking.estimatedDelivery}</p>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-semibold text-slate-900">{tracking.driver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-semibold text-slate-900">{tracking.driver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Vehicle</p>
                  <p className="font-semibold text-slate-900">{tracking.driver.vehicle}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card>
              <CardHeader>
                <CardTitle>Tracking Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tracking.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(event.status, event.completed)}
                        {index < tracking.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${event.completed ? 'bg-green-600' : 'bg-gray-300'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-semibold ${event.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {event.location}
                        </p>
                        <p className="text-sm text-slate-600">{event.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
