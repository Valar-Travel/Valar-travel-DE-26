"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight } from "lucide-react"

interface OnboardingFlowProps {
  userId: string
  onComplete: () => void
}

export function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      title: "Welcome to Valar Travel",
      description: "Let's get you started with your luxury travel planning journey",
      content: (
        <div className="text-center py-6">
          <h3 className="text-lg font-semibold mb-4">Welcome aboard!</h3>
          <p className="text-gray-600 mb-6">
            We're excited to help you discover amazing travel deals and plan unforgettable trips.
          </p>
        </div>
      ),
    },
    {
      title: "Set Your Preferences",
      description: "Tell us about your travel style and preferences",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Destinations</label>
            <div className="grid grid-cols-2 gap-2">
              {["Europe", "Asia", "Americas", "Africa"].map((region) => (
                <Button key={region} variant="outline" size="sm">
                  {region}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Travel Style</label>
            <div className="grid grid-cols-2 gap-2">
              {["Luxury", "Budget", "Adventure", "Relaxation"].map((style) => (
                <Button key={style} variant="outline" size="sm">
                  {style}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Explore Features",
      description: "Learn about the powerful features available to you",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Price Comparison</h4>
              <p className="text-sm text-gray-600">Compare prices across multiple booking platforms</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Deal Alerts</h4>
              <p className="text-sm text-gray-600">Get notified when prices drop for your saved trips</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Trip Planning</h4>
              <p className="text-sm text-gray-600">Save and organize your favorite deals and destinations</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    setCompletedSteps([...completedSteps, currentStep])
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-600 text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {steps[currentStep].content}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
