import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Truck, Clock, MapPin, Star, CheckCircle, AlertCircle, Users, Zap } from 'lucide-react'

const AutomatedDispatch = () => {
  const [selectedRequest, setSelectedRequest] = useState('REQ-001')
  const [dispatchStatus, setDispatchStatus] = useState('matching')
  const [matchingProgress, setMatchingProgress] = useState(0)

  // Simulate automated matching process
  useEffect(() => {
    if (dispatchStatus === 'matching') {
      const interval = setInterval(() => {
        setMatchingProgress(prev => {
          if (prev >= 100) {
            setDispatchStatus('matched')
            return 100
          }
          return prev + 10
        })
      }, 300)
      
      return () => clearInterval(interval)
    }
  }, [dispatchStatus])

  const transportationRequests = [
    {
      id: 'REQ-001',
      farmer: 'Sunny Acres Farm',
      dispensary: 'Downtown Dispensary',
      product: 'Premium Flower',
      quantity: '50 lbs',
      pickupTime: '2:00 PM Today',
      distance: '25 miles',
      priority: 'High',
      status: 'Pending Assignment'
    },
    {
      id: 'REQ-002',
      farmer: 'Mountain View Cultivation',
      dispensary: 'Westside Cannabis',
      product: 'Mixed Products',
      quantity: '30 lbs',
      pickupTime: '4:00 PM Today',
      distance: '18 miles',
      priority: 'Medium',
      status: 'Assigned'
    },
    {
      id: 'REQ-003',
      farmer: 'Valley Farms',
      dispensary: 'Metro Dispensary',
      product: 'Concentrates',
      quantity: '15 lbs',
      pickupTime: '10:00 AM Tomorrow',
      distance: '35 miles',
      priority: 'Low',
      status: 'Completed'
    }
  ]

  const availableTransporters = [
    {
      id: 'TRANS-001',
      name: 'Green Valley Transport',
      driver: 'Mike Johnson',
      vehicle: 'Truck #247',
      capacity: '100 lbs',
      location: '5 miles from pickup',
      rating: 4.8,
      completedJobs: 156,
      availability: 'Available Now',
      specializations: ['Flower', 'Edibles'],
      matchScore: 95
    },
    {
      id: 'TRANS-002',
      name: 'Cannabis Logistics Co',
      driver: 'Sarah Chen',
      vehicle: 'Van #103',
      capacity: '75 lbs',
      location: '8 miles from pickup',
      rating: 4.9,
      completedJobs: 203,
      availability: 'Available in 1 hour',
      specializations: ['All Products'],
      matchScore: 88
    },
    {
      id: 'TRANS-003',
      name: 'Secure Transport LLC',
      driver: 'David Rodriguez',
      vehicle: 'Truck #189',
      capacity: '120 lbs',
      location: '12 miles from pickup',
      rating: 4.7,
      completedJobs: 134,
      availability: 'Available Now',
      specializations: ['Concentrates', 'Flower'],
      matchScore: 82
    }
  ]

  const currentRequest = transportationRequests.find(r => r.id === selectedRequest)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500'
      case 'Medium': return 'bg-yellow-500'
      case 'Low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Assignment': return 'bg-orange-500'
      case 'Assigned': return 'bg-blue-500'
      case 'Completed': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const startMatching = () => {
    setDispatchStatus('matching')
    setMatchingProgress(0)
  }

  const resetDemo = () => {
    setDispatchStatus('idle')
    setMatchingProgress(0)
  }

  return (
    <div className="space-y-6">
      {/* Request Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {transportationRequests.map((request) => (
          <Card
            key={request.id}
            className={`cursor-pointer transition-all ${
              selectedRequest === request.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedRequest(request.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{request.id}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs">
                {request.farmer} → {request.dispensary}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span>{request.product}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span>{request.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span>{request.distance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Automated Matching Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Matching Engine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Smart Matching Engine
            </CardTitle>
            <CardDescription>
              AI-powered transporter assignment for {currentRequest?.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Request Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Request Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Pickup:</span>
                  <p>{currentRequest?.farmer}</p>
                </div>
                <div>
                  <span className="text-gray-600">Delivery:</span>
                  <p>{currentRequest?.dispensary}</p>
                </div>
                <div>
                  <span className="text-gray-600">Product:</span>
                  <p>{currentRequest?.product}</p>
                </div>
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <p>{currentRequest?.quantity}</p>
                </div>
              </div>
            </div>

            {/* Matching Process */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Matching Process</h4>
                {dispatchStatus === 'idle' && (
                  <Button onClick={startMatching} size="sm">
                    Start Auto-Match
                  </Button>
                )}
                {dispatchStatus === 'matched' && (
                  <Button onClick={resetDemo} variant="outline" size="sm">
                    Reset Demo
                  </Button>
                )}
              </div>

              {dispatchStatus === 'matching' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing transporters...</span>
                    <span>{matchingProgress}%</span>
                  </div>
                  <Progress value={matchingProgress} className="h-2" />
                  <div className="text-xs text-gray-600">
                    {matchingProgress < 30 && "Checking availability..."}
                    {matchingProgress >= 30 && matchingProgress < 60 && "Calculating distances..."}
                    {matchingProgress >= 60 && matchingProgress < 90 && "Evaluating ratings..."}
                    {matchingProgress >= 90 && "Finalizing best match..."}
                  </div>
                </div>
              )}

              {dispatchStatus === 'matched' && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Best Match Found!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Green Valley Transport has been automatically assigned to this request.
                    Notification sent to driver Mike Johnson.
                  </p>
                </div>
              )}
            </div>

            {/* Matching Criteria */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Matching Criteria</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Proximity:</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span className="font-medium">25%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Transporters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Available Transporters
            </CardTitle>
            <CardDescription>
              Ranked by compatibility with current request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableTransporters.map((transporter, index) => (
                <div
                  key={transporter.id}
                  className={`p-4 border rounded-lg ${
                    index === 0 && dispatchStatus === 'matched' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{transporter.name}</h4>
                      <p className="text-xs text-gray-600">{transporter.driver} • {transporter.vehicle}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {transporter.matchScore}% Match
                      </Badge>
                      {index === 0 && dispatchStatus === 'matched' && (
                        <div className="mt-1">
                          <Badge className="bg-green-600 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Assigned
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{transporter.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span>{transporter.capacity}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{transporter.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Jobs:</span>
                        <span>{transporter.completedJobs}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Availability:</span>
                      <span className={`font-medium ${
                        transporter.availability === 'Available Now' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {transporter.availability}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-gray-600">Specializations:</span>
                      <span>{transporter.specializations.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Queue Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Dispatch Queue Management
          </CardTitle>
          <CardDescription>
            Real-time overview of all transportation requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Queue Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-800">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-green-800">In Transit</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-yellow-800">Delayed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-sm text-purple-800">Completed Today</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Recent Dispatch Activity</h4>
              <div className="space-y-2">
                {[
                  { time: '2:15 PM', action: 'REQ-001 automatically assigned to Green Valley Transport', type: 'success' },
                  { time: '2:10 PM', action: 'REQ-004 created by Valley Farms', type: 'info' },
                  { time: '2:05 PM', action: 'TRANS-002 accepted assignment for REQ-002', type: 'success' },
                  { time: '2:00 PM', action: 'REQ-003 marked as completed', type: 'success' },
                  { time: '1:55 PM', action: 'Alert: TRANS-001 reported delay on REQ-005', type: 'warning' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="text-gray-600 text-xs">{activity.time}</span>
                    <span className="flex-1">{activity.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AutomatedDispatch

