"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { 
  Shield, 
  Sparkles, 
  Mail, 
  Eye,
  Check,
  Loader2,
  ChevronRight,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsentSettings {
  basic_personalization: boolean
  ai_recommendations: boolean
  marketing_communications: boolean
  social_data_analysis: boolean
}

interface PrivacyConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (settings: ConsentSettings) => void
  isNewUser?: boolean
}

const consentOptions = [
  {
    key: "basic_personalization" as const,
    icon: Eye,
    title: "Browsing Personalization",
    description: "Remember your preferences and recently viewed properties for a better experience",
    recommended: true,
  },
  {
    key: "ai_recommendations" as const,
    icon: Sparkles,
    title: "AI Villa Recommendations",
    description: "Receive personalized villa suggestions based on your taste and travel style",
    recommended: true,
  },
  {
    key: "marketing_communications" as const,
    icon: Mail,
    title: "Exclusive Offers",
    description: "Get early access to special deals, seasonal promotions, and new properties",
    recommended: false,
  },
  {
    key: "social_data_analysis" as const,
    icon: Lock,
    title: "Enhanced Personalization",
    description: "Allow analysis of your linked social profile for deeper travel style insights",
    recommended: false,
  },
]

export function PrivacyConsentModal({ 
  isOpen, 
  onClose, 
  onComplete, 
  isNewUser = false 
}: PrivacyConsentModalProps) {
  const [settings, setSettings] = useState<ConsentSettings>({
    basic_personalization: true,
    ai_recommendations: true,
    marketing_communications: false,
    social_data_analysis: false,
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"intro" | "settings" | "complete">(isNewUser ? "intro" : "settings")

  const handleToggle = (key: keyof ConsentSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAcceptAll = () => {
    setSettings({
      basic_personalization: true,
      ai_recommendations: true,
      marketing_communications: true,
      social_data_analysis: true,
    })
  }

  const handleSave = async () => {
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase.from("user_privacy_consent").upsert({
          user_id: user.id,
          ...settings,
          consent_version: "1.0",
          consent_ip: null, // Would need server-side to get IP
          consent_user_agent: navigator.userAgent,
          consented_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        })
      }

      setStep("complete")
      setTimeout(() => {
        onComplete(settings)
      }, 1500)
    } catch (error) {
      // Continue anyway - consent is best effort
      onComplete(settings)
    } finally {
      setLoading(false)
    }
  }

  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Your Privacy Matters</h2>
              <p className="text-sm text-neutral-500">Choose how we personalize your experience</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div
                key="intro"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-center py-4">
                  <Sparkles className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Personalized Luxury Travel</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mx-auto">
                    Let us learn your preferences to curate the perfect villa experiences 
                    tailored just for you. You're always in control.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleAcceptAll}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Enable All Personalization
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep("settings")}
                    className="w-full h-12"
                  >
                    Customize My Settings
                  </Button>
                </div>

                <p className="text-xs text-neutral-400 text-center">
                  You can change these settings anytime in your account preferences
                </p>
              </motion.div>
            )}

            {step === "settings" && (
              <motion.div
                key="settings"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {consentOptions.map((option) => {
                  const Icon = option.icon
                  const isEnabled = settings[option.key]

                  return (
                    <div
                      key={option.key}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer",
                        isEnabled 
                          ? "border-emerald-200 bg-emerald-50/50" 
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      )}
                      onClick={() => handleToggle(option.key)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          isEnabled ? "bg-emerald-100" : "bg-neutral-100"
                        )}>
                          <Icon className={cn(
                            "w-5 h-5",
                            isEnabled ? "text-emerald-600" : "text-neutral-500"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{option.title}</h4>
                            {option.recommended && (
                              <span className="text-[10px] uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => handleToggle(option.key)}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>
                  )
                })}

                <div className="pt-4 space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Save My Preferences
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {isNewUser && (
                    <Button
                      variant="ghost"
                      onClick={() => setStep("intro")}
                      className="w-full text-sm text-neutral-500"
                    >
                      Back
                    </Button>
                  )}
                </div>

                <p className="text-xs text-neutral-400 text-center pt-2">
                  We never sell your data. View our{" "}
                  <a href="/privacy" className="underline hover:text-neutral-600">Privacy Policy</a>
                </p>
              </motion.div>
            )}

            {step === "complete" && (
              <motion.div
                key="complete"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Preferences Saved</h3>
                <p className="text-sm text-neutral-500">
                  Your personalized experience awaits...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook to check if user needs to see consent modal
export function usePrivacyConsent() {
  const [needsConsent, setNeedsConsent] = useState(false)
  const [consentSettings, setConsentSettings] = useState<ConsentSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkConsent() {
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

      if (!data) {
        setNeedsConsent(true)
      } else {
        setConsentSettings({
          basic_personalization: data.basic_personalization,
          ai_recommendations: data.ai_recommendations,
          marketing_communications: data.marketing_communications,
          social_data_analysis: data.social_data_analysis,
        })
      }
      setLoading(false)
    }

    checkConsent()
  }, [])

  return { needsConsent, consentSettings, loading, setNeedsConsent, setConsentSettings }
}
