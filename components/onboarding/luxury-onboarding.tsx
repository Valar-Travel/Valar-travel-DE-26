"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronRight, Users, Calendar, MapPin, Sparkles, Check } from "lucide-react"

interface OnboardingStep {
  id: string
  question: string
  subtitle: string
  options: {
    id: string
    label: string
    description?: string
    icon?: React.ReactNode
    image?: string
  }[]
  multiSelect?: boolean
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "travel-style",
    question: "How do you envision your Caribbean escape?",
    subtitle: "Select the experience that speaks to you",
    options: [
      {
        id: "romantic",
        label: "Romantic Retreat",
        description: "Intimate moments in paradise",
        image: "/images/destinations/barbados-beach.jpg",
      },
      {
        id: "family",
        label: "Family Gathering",
        description: "Creating memories together",
        image: "/images/destinations/st-lucia-pitons.jpg",
      },
      {
        id: "celebration",
        label: "Special Celebration",
        description: "Milestone moments in luxury",
        image: "/images/destinations/jamaica-coast.webp",
      },
      {
        id: "wellness",
        label: "Wellness & Serenity",
        description: "Rejuvenate mind and soul",
        image: "/images/destinations/wellness-spa.jpg",
      },
    ],
  },
  {
    id: "group-size",
    question: "Who will be joining you?",
    subtitle: "Help us find your perfect villa",
    options: [
      {
        id: "couple",
        label: "Just Us",
        description: "2 guests",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "small",
        label: "Small Group",
        description: "3-6 guests",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "medium",
        label: "Medium Group",
        description: "7-12 guests",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "large",
        label: "Grand Gathering",
        description: "12+ guests",
        icon: <Users className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "timing",
    question: "When are you dreaming of travel?",
    subtitle: "We'll curate seasonal recommendations",
    options: [
      {
        id: "soon",
        label: "Very Soon",
        description: "Within 30 days",
        icon: <Calendar className="w-6 h-6" />,
      },
      {
        id: "planning",
        label: "Planning Ahead",
        description: "1-3 months",
        icon: <Calendar className="w-6 h-6" />,
      },
      {
        id: "future",
        label: "Future Dreams",
        description: "3-6 months",
        icon: <Calendar className="w-6 h-6" />,
      },
      {
        id: "exploring",
        label: "Just Exploring",
        description: "No dates yet",
        icon: <Calendar className="w-6 h-6" />,
      },
    ],
  },
  {
    id: "destinations",
    question: "Which islands call to you?",
    subtitle: "Select all that intrigue you",
    multiSelect: true,
    options: [
      {
        id: "barbados",
        label: "Barbados",
        description: "Refined elegance",
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: "st-lucia",
        label: "St. Lucia",
        description: "Dramatic beauty",
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: "jamaica",
        label: "Jamaica",
        description: "Vibrant spirit",
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: "antigua",
        label: "Antigua",
        description: "Beach paradise",
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: "turks",
        label: "Turks & Caicos",
        description: "Pristine waters",
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: "all",
        label: "Surprise Me",
        description: "Open to all",
        icon: <Sparkles className="w-6 h-6" />,
      },
    ],
  },
]

export function LuxuryOnboarding({ 
  userId, 
  userName 
}: { 
  userId?: string
  userName?: string 
}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isCompleting, setIsCompleting] = useState(false)

  const step = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  const handleOptionSelect = (optionId: string) => {
    if (step.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setAnswers((prev) => ({ ...prev, [step.id]: optionId }))
      // Auto-advance for single select
      setTimeout(() => {
        if (currentStep < onboardingSteps.length - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          completeOnboarding()
        }
      }, 400)
    }
  }

  const handleContinue = () => {
    if (step.multiSelect && selectedOptions.length > 0) {
      setAnswers((prev) => ({ ...prev, [step.id]: selectedOptions }))
      setSelectedOptions([])
      if (currentStep < onboardingSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        completeOnboarding()
      }
    }
  }

  const completeOnboarding = async () => {
    setIsCompleting(true)
    
    // Save preferences to database
    try {
      await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          preferences: answers,
        }),
      })
    } catch (e) {
      console.error("Failed to save preferences:", e)
    }

    // Redirect to dashboard after brief delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const firstName = userName?.split(" ")[0] || "there"

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-amber-950/10" />
      
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Skip button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-6 right-6 text-white/50 hover:text-white/80 text-sm tracking-wide transition-colors z-50"
      >
        Skip for now
      </button>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <AnimatePresence mode="wait">
          {isCompleting ? (
            <motion.div
              key="completing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8"
              >
                <Check className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
                Perfect, {firstName}
              </h2>
              <p className="text-white/60 text-lg">
                Your personalized experience awaits...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl"
            >
              {/* Welcome message on first step */}
              {currentStep === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-400/80 text-sm tracking-[0.2em] uppercase text-center mb-4"
                >
                  Welcome{userName ? `, ${firstName}` : ""}
                </motion.p>
              )}

              {/* Question */}
              <h1 className="text-3xl md:text-5xl font-light text-center tracking-tight mb-3 text-balance">
                {step.question}
              </h1>
              <p className="text-white/50 text-center mb-12 text-lg">
                {step.subtitle}
              </p>

              {/* Options */}
              <div className={`grid gap-4 ${
                step.options[0]?.image 
                  ? "grid-cols-1 sm:grid-cols-2" 
                  : "grid-cols-2 sm:grid-cols-3"
              }`}>
                {step.options.map((option, index) => {
                  const isSelected = step.multiSelect
                    ? selectedOptions.includes(option.id)
                    : answers[step.id] === option.id

                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => handleOptionSelect(option.id)}
                      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                        option.image 
                          ? "aspect-[4/3]" 
                          : "p-6 border"
                      } ${
                        isSelected
                          ? option.image
                            ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0a0a0a]"
                            : "border-emerald-400 bg-emerald-400/10"
                          : option.image
                            ? ""
                            : "border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {option.image ? (
                        <>
                          <Image
                            src={option.image}
                            alt={option.label}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-xl font-medium mb-1">{option.label}</h3>
                            <p className="text-white/70 text-sm">{option.description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center">
                              <Check className="w-5 h-5 text-black" />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-center gap-3">
                          {option.icon && (
                            <div className={`transition-colors ${
                              isSelected ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
                            }`}>
                              {option.icon}
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium mb-1">{option.label}</h3>
                            {option.description && (
                              <p className="text-white/50 text-sm">{option.description}</p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Continue button for multi-select */}
              {step.multiSelect && selectedOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center mt-10"
                >
                  <button
                    onClick={handleContinue}
                    className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-emerald-400 transition-colors"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}

              {/* Step indicator */}
              <div className="flex justify-center gap-2 mt-12">
                {onboardingSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentStep
                        ? "bg-emerald-400"
                        : i < currentStep
                          ? "bg-white/40"
                          : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
