import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MapPin, Navigation, Clock, AlertTriangle, CheckCircle, Truck, Route } from 'lucide-react'

const GPSTracking = () => {
  const [selectedShipment, setSelectedShipment] = useState('SHIP-001')
  const [currentPosition, setCurrentPosition] = useState(0)
  
  // Simulate real-time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prev => (prev + 1) % 100)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])

  const shipments = [
    {
      id: 'SHIP-001',
      transporter: 'Green Valley Transport',
      from: 'Sunny Acres Farm',
      to: 'Downtown Dispensary',
      status: 'In Transit',
      progress: 65,
      eta: '2:30 PM',
      driver: 'Mike Johnson',
      vehicle: 'Truck #247',
      product: 'Premium Flower - 50 lbs'
    },
    {
      id: 'SHIP-002',
      transporter: 'Cannabis Logistics Co',
      from: 'Mountain View Cultivation',
      to: 'Westside Cannabis',
      status: 'Delivered',
      progress: 100,
      eta: 'Completed',
      driver: 'Sarah Chen',
      vehicle: 'Van #103',
      product: 'Mixed Products - 25 lbs'
    },
    {
      id: 'SHIP-003',
      transporter: 'Secure Transport LLC',
      from: 'Valley Farms',
      to: 'Metro Dispensary',
      status: 'Delayed',
      progress: 30,
      eta: '4:15 PM',
      driver: 'David Rodriguez',
      vehicle: 'Truck #189',
      product: 'Concentrates - 15 lbs'
    }
  ]

  const currentShipment = shipments.find(s => s.id === selectedShipment)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit': return 'bg-blue-500'
      case 'Delivered': return 'bg-green-500'
      case 'Delayed': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Transit': return <Navigation className="h-4 w-4" />
      case 'Delivered': return <CheckCircle className="h-4 w-4" />
      case 'Delayed': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const routePoints = [
    { name: 'Pickup Location', lat: 37.7749, lng: -122.4194, status: 'completed' },
    { name: 'Highway Checkpoint', lat: 37.7849, lng: -122.4094, status: 'completed' },
    { name: 'Current Location', lat: 37.7949, lng: -122.3994, status: 'current' },
    { name: 'Final Checkpoint', lat: 37.8049, lng: -122.3894, status: 'pending' },
    { name: 'Delivery Location', lat: 37.8149, lng: -122.3794, status: 'pending' }
  ]

  return (
    <div className="space-y-6">
      {/* Shipment Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {shipments.map((shipment) => (
          <Card
            key={shipment.id}
            className={`cursor-pointer transition-all ${
              selectedShipment === shipment.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedShipment(shipment.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{shipment.id}</CardTitle>
                <Badge className={getStatusColor(shipment.status)}>
                  {getStatusIcon(shipment.status)}
                  <span className="ml-1">{shipment.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {shipment.from} → {shipment.to}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{shipment.progress}%</span>
                </div>
                <Progress value={shipment.progress} className="h-1" />
                <div className="text-xs text-gray-600">
                  ETA: {shipment.eta}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tracking Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live Map View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Live Tracking - {currentShipment?.id}
            </CardTitle>
            <CardDescription>
              Real-time location and route monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Simulated Map */}
            <div className="bg-gray-100 rounded-lg h-64 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 20 200 Q 100 150 180 120 Q 260 90 340 80"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                </svg>
                
                {/* Route Points */}
                {routePoints.map((point, index) => (
                  <div
                    key={index}
                    className={`absolute w-4 h-4 rounded-full border-2 border-white ${
                      point.status === 'completed' ? 'bg-green-500' :
                      point.status === 'current' ? 'bg-blue-500 animate-pulse' :
                      'bg-gray-300'
                    }`}
                    style={{
                      left: `${20 + index * 80}px`,
                      top: `${200 - index * 30}px`
                    }}
                  >
                    {point.status === 'current' && (
                      <div className="absolute -top-8 -left-6 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        <Truck className="h-3 w-3 inline mr-1" />
                        Live
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Moving Vehicle Icon */}
                <div
                  className="absolute transition-all duration-2000 ease-linear"
                  style={{
                    left: `${20 + (currentPosition * 3.2)}px`,
                    top: `${200 - (currentPosition * 1.2)}px`
                  }}
                >
                  <div className="bg-blue-600 text-white p-2 rounded-full">
                    <Truck className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Current Speed:</span>
                <span className="ml-2">55 mph</span>
              </div>
              <div>
                <span className="font-medium">Distance Remaining:</span>
                <span className="ml-2">12.5 miles</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-green-600" />
              Shipment Details
            </CardTitle>
            <CardDescription>
              Complete information for {currentShipment?.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Transporter:</span>
                <p>{currentShipment?.transporter}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Driver:</span>
                <p>{currentShipment?.driver}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Vehicle:</span>
                <p>{currentShipment?.vehicle}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Product:</span>
                <p>{currentShipment?.product}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Route Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Pickup: {currentShipment?.from}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Current: Highway 101 North</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <span>Delivery: {currentShipment?.to}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Geofencing Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Entered pickup zone - 10:15 AM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Exited pickup zone - 10:45 AM</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Navigation className="h-4 w-4" />
                  <span>On designated route - Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Journey Timeline
          </CardTitle>
          <CardDescription>
            Complete history of this shipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '10:00 AM', event: 'Shipment created', status: 'completed' },
              { time: '10:15 AM', event: 'Driver arrived at pickup location', status: 'completed' },
              { time: '10:45 AM', event: 'Pickup completed, en route to delivery', status: 'completed' },
              { time: '12:30 PM', event: 'Passed Highway Checkpoint', status: 'completed' },
              { time: '1:45 PM', event: 'Currently on Highway 101 North', status: 'current' },
              { time: '2:30 PM', event: 'Expected arrival at delivery location', status: 'pending' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'current' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.event}</span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GPSTracking

