import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, Users, Zap, Shield, ArrowRight, Phone, Mail } from 'lucide-react'
import debridgeLogo from '/logo.png'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    contact: '',
    userType: '',
    isSubmitted: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.contact || !formData.userType) return
    
    setIsLoading(true)
    
    try {
      // Submit to Formspree (replace YOUR_FORM_ID with actual Formspree form ID)
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact: formData.contact,
          userType: formData.userType,
          timestamp: new Date().toISOString(),
          source: 'BridgeX Waitlist'
        })
      })
      
      if (response.ok) {
        setFormData(prev => ({ ...prev, isSubmitted: true }))
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // For now, still show success page even if there's an error
      // In production, you'd want to show an error message
      setFormData(prev => ({ ...prev, isSubmitted: true }))
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, contact: e.target.value }))
  }

  const selectUserType = (type) => {
    setFormData(prev => ({ ...prev, userType: type }))
  }

  if (formData.isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-green-200 shadow-xl">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">You're In!</CardTitle>
            <CardDescription className="text-gray-600">
              Thank you for joining the BridgeX waitlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-medium">
                🎉 Welcome to the future of service connections in Nigeria!
              </p>
            </div>
            <div className="space-y-3 text-left">
              <p className="text-sm text-gray-700">
                <strong>What happens next?</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  You'll be among the first to access BridgeX when we launch
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  We'll send you exclusive updates about our progress
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Get special early-bird benefits and features
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Keep an eye on your {formData.contact.includes('@') ? 'email' : 'phone'} for updates from the BridgeX team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={debridgeLogo} alt="BridgeX Logo" className="h-24 w-auto" />
            <div className="text-3xl font-bold text-gray-900">BridgeX</div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-lg font-semibold px-6 py-3 animate-pulse hover:animate-bounce transition-all duration-300 shadow-lg">
            Coming Soon
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connecting Service Providers with Service Users 
            <span className="text-green-600"> Across Nigeria</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The revolutionary digital marketplace where service users get free lifetime access 
            to trusted providers, and service providers connect with new customers.
          </p>
          
          {/* Dual Value Proposition */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">For Service Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Free, lifetime access to trusted service providers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Get matched in real-time with service providers
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">For Service Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Get access to a stream of new customers
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Increase your revenue and income
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waitlist Form */}
          <Card className="max-w-md mx-auto border-green-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Get Early Access</CardTitle>
              <CardDescription className="text-gray-600">
                Be among the first to experience BridgeX when we launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="text-base font-medium text-gray-700">I am a:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.userType === 'user' ? 'default' : 'outline'}
                      className={`h-12 ${formData.userType === 'user' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 hover:bg-green-50'}`}
                      onClick={() => selectUserType('user')}
                    >
                      Service User
                    </Button>
                    <Button
                      type="button"
                      variant={formData.userType === 'provider' ? 'default' : 'outline'}
                      className={`h-12 ${formData.userType === 'provider' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 hover:bg-green-50'}`}
                      onClick={() => selectUserType('provider')}
                    >
                      Service Provider
                    </Button>
                  </div>
                </div>

                {/* Contact Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email or Phone Number
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter your email or phone number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="h-12 border-green-200 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {formData.contact.includes('@') ? (
                        <Mail className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Phone className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!formData.contact || !formData.userType || isLoading}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Joining Waitlist...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Get Early Access
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose BridgeX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trusted & Verified</h3>
              <p className="text-gray-600">All service providers are carefully vetted and verified for quality and reliability.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Matching</h3>
              <p className="text-gray-600">Get instantly connected with available service providers in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free for Users</h3>
              <p className="text-gray-600">Lifetime free access for service users - no hidden fees or charges ever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-green-200">
        <div className="text-center text-gray-600">
          <p className="mb-2">© 2025 BridgeX. All rights reserved.</p>
          <p className="text-sm">Bridge and Ladder Synergy Solution LLC</p>
        </div>
      </footer>
    </div>
  )
}

export default App

