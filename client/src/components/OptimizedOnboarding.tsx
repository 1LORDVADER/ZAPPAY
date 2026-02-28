import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Upload, AlertCircle, User, Building, Truck } from 'lucide-react'

interface OptimizedOnboardingProps {
  initialType?: string;
  onBack?: () => void;
}

interface FormData {
  businessName: string;
  email: string;
  phone: string;
  license: string;
  address: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const OptimizedOnboarding = ({ initialType = '', onBack }: OptimizedOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(initialType ? 2 : 1)
  const [userType, setUserType] = useState(initialType)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    email: '',
    phone: '',
    license: '',
    address: ''
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^\(\d{3}\) \d{3}-\d{4}$/
    return re.test(phone)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation
    const errors = { ...validationErrors }
    
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        errors.email = 'Please enter a valid email address'
      } else {
        delete errors.email
      }
    }
    
    if (field === 'phone' && value) {
      if (!validatePhone(value)) {
        errors.phone = 'Please use format: (555) 123-4567'
      } else {
        delete errors.phone
      }
    }
    
    if (field === 'businessName' && value.length < 2) {
      errors.businessName = 'Business name must be at least 2 characters'
    } else if (field === 'businessName') {
      delete errors.businessName
    }
    
    setValidationErrors(errors)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const userTypes = [
    { value: 'farmer', label: 'Cannabis Farmer', icon: User, description: 'Licensed cannabis cultivator' },
    { value: 'dispensary', label: 'Dispensary', icon: Building, description: 'Licensed cannabis retailer' },
    { value: 'transporter', label: 'Transporter', icon: Truck, description: 'Licensed cannabis transporter' }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            Streamlined Registration Process
          </CardTitle>
          <CardDescription>
            Complete your registration in just a few simple steps
          </CardDescription>
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Step 1: User Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Your Business Type</h3>
              <div className="grid gap-4">
                {userTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        userType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setUserType(type.value)}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                        {userType === type.value && (
                          <CheckCircle className="h-5 w-5 text-[#0D1B2A] ml-auto" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  className={validationErrors.businessName ? 'border-red-500' : ''}
                />
                {validationErrors.businessName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.businessName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="business@example.com"
                  className={validationErrors.email ? 'border-red-500' : ''}
                />
                {validationErrors.email && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
                {validationErrors.phone && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.phone}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: License Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">License Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="license">License Number *</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => handleInputChange('license', e.target.value)}
                  placeholder="Enter your cannabis license number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete business address"
                  rows={3}
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <Label>License Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your license documents here, or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Business Type:</span>
                  <Badge variant="secondary">
                    {userTypes.find(t => t.value === userType)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Business Name:</span>
                  <span>{formData.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">License:</span>
                  <span>{formData.license}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your application will be reviewed within 24-48 hours</li>
                  <li>• You'll receive email updates on your verification status</li>
                  <li>• Once approved, you can start using ZAPPAY services immediately</li>
                  <li>• Our support team will help you get started</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !userType) ||
                  (currentStep === 2 && Object.keys(validationErrors).length > 0) ||
                  (currentStep === 2 && (!formData.businessName || !formData.email || !formData.phone))
                }
              >
                Next Step
              </Button>
            ) : (
              <Button className="bg-[#E8231A] hover:bg-[#c41d15]">
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OptimizedOnboarding

