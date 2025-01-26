"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

const benefits = [
  "Access to all break opportunities",
  "Advanced customization options for holidays",
  "Sync with your company's leave management system",
  "Track remaining paid leaves, personal leaves, and sick leaves",
  "Smart leave suggestions based on your leave balance",
  "Export break plans to your calendar",
  "Collaborative planning with team members",
  "Priority notifications for upcoming holidays",
  "Custom holiday lists and preferences",
  "Advanced analytics and insights"
]

export default function UpgradePage() {
  const router = useRouter()

  const handleUpgrade = () => {
    // Dummy upgrade function
    alert("This is a demo upgrade button. In a real app, this would process the payment.")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
            className="rounded-full -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Upgrade to Pro</h1>
            <p className="text-sm text-muted-foreground mt-1">Get access to all features and break opportunities</p>
          </div>
        </div>

        {/* Benefits Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold tracking-tight">Pro Benefits</CardTitle>
            <CardDescription>Everything you need for smarter break planning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Button */}
        <Card className="border-0 shadow-sm bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">$2</h3>
                <p className="text-sm text-muted-foreground">One-time payment</p>
              </div>
              <p className="text-sm text-green-600 font-medium">Limited Time Offer</p>
            </div>
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleUpgrade}
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
} 