"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { 
  Shield, 
  Sparkles, 
  Mail, 
  Share2, 
  ChevronRight, 
  Check,
  Loader2,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsentOptions {
  basic_personalization: boolean
  ai_recommendations: boolean
  marketing_communications: boolean
  social_data_analysis: boolean
}

interface PrivacyConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onConsentSaved?: (consent: ConsentOptions) => void
  initialConsent?: ConsentOptions | null
}

const consentFeatures = [
  {
    id: "basic_personalization" as const,
    icon: Shield,
    title: "Basic Personalization",
    description: "Remember your preferences, search history, and favorite villas to enhance your browsing experience.",
    recommended: true,
  },
  {
    id: "ai_recommendations" as const,
    icon: Sparkles,
    title: "AI-Powered Recommendations",
    description: "Receive curated villa suggestions based on your travel style, past bookings, and browsing patterns.",
    recommended: true,
  },
  {
    id: "marketing_communications" as const,
    icon: Mail,
    title: "Personalized Communications",
    description: "Get tailored emails about exclusive deals, new villas, and travel inspiration matching your interests.",
    recommended: false,
  },
  {
    id: "social_data_analysis" as const,
    icon: Share2,
    title: "Social Profile Analysis",
    description: "Allow us to enhance recommendations by analyzing your linked social profiles (with your explicit consent).",
    recommended: false,
  },
]

export function PrivacyConsentModal({ 
  isOpen, 
  onClose, 
  onConsentSaved,
  initialConsent 
}: PrivacyConsentModalProps) {
  const [consent, setConsent] = useState<ConsentOptions>({
    basic_personalization: initialConsent?.basic_personalization ?? false,
    ai_recommendations: initialConsent?.ai_recommendations ?? false,
    marketing_communications: initialConsent?.marketing_communications ?? false,
    social_data_analysis: initialConsent?.social_data_analysis ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (initialConsent) {
      setConsent(initialConsent)
    }
  }, [initialConsent])

  const handleToggle = (key: keyof ConsentOptions) => {
    setConsent(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleAcceptAll = () => {
    setConsent({
      basic_personalization: true,
      ai_recommendations: true,
      marketing_communications: true,
      social_data_analysis: true,
    })
    setSaved(false)
  }

  const handleRejectAll = () => {
    setConsent({
      basic_personalization: false,
      ai_recommendations: false,
      marketing_communications: false,
      social_data_analysis: false,
    })
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("Not authenticated")
      }

      const { error } = await supabase
        .from("user_privacy_consent")
        .upsert({
          user_id: user.id,
          ...consent,
          consent_version: "1.0",
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id"
        })

      if (error) throw error

      setSaved(true)
      onConsentSaved?.(consent)
      
      // Close after a brief success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      // Error handling - could show toast
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl">Your Privacy Matters</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Choose how we personalize your Valar Travel experience. You can change these settings anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {consentFeatures.map((feature) => {
            const Icon = feature.icon
            const isEnabled = consent[feature.id]
            
            return (
              <motion.div
                key={feature.id}
                layout
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  isEnabled 
                    ? "border-emerald-200 bg-emerald-50/50" 
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isEnabled ? "bg-emerald-100" : "bg-neutral-100"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isEnabled ? "text-emerald-600" : "text-neutral-500"
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900">{feature.title}</h4>
                      {feature.recommended && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleToggle(feature.id)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-neutral-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRejectAll}
            className="text-neutral-500 hover:text-neutral-700"
          >
            Reject All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAcceptAll}
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            Accept All
          </Button>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "w-full h-12 font-semibold transition-all",
              saved 
                ? "bg-emerald-600 hover:bg-emerald-600" 
                : "bg-neutral-900 hover:bg-neutral-800"
            )}
          >
            <AnimatePresence mode="wait">
              {saving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving...
                </motion.div>
              ) : saved ? (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Preferences Saved
                </motion.div>
              ) : (
                <motion.div
                  key="save"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  Save Preferences
                  <ChevronRight className="w-4 h-4 ml-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-neutral-400 text-center pt-2">
          Your data is encrypted and never sold. Read our{" "}
          <a href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</a>
          {" "}for more details.
        </p>
      </DialogContent>
    </Dialog>
  )
}

// Hook to check and prompt for consent
export function usePrivacyConsent() {
  const [consent, setConsent] = useState<ConsentOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchConsent = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("user_privacy_consent")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setConsent({
          basic_personalization: data.basic_personalization,
          ai_recommendations: data.ai_recommendations,
          marketing_communications: data.marketing_communications,
          social_data_analysis: data.social_data_analysis,
        })
      } else {
        // No consent record - should prompt
        setShowModal(true)
      }
      
      setLoading(false)
    }

    fetchConsent()
  }, [])

  return {
    consent,
    loading,
    showModal,
    setShowModal,
    hasAIConsent: consent?.ai_recommendations ?? false,
    hasBasicConsent: consent?.basic_personalization ?? false,
  }
}
