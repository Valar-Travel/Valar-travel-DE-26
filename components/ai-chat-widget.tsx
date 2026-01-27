"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

function getSmartResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  // Greetings
  if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return "Hello! I'm Sofia, your Caribbean travel assistant. I'd love to help you discover the perfect luxury villa experience. What destination interests you: Barbados, St. Lucia, Jamaica, or St. Barthélemy?"
  }

  // Barbados
  if (message.includes("barbados")) {
    return "Barbados is where British elegance meets Caribbean soul! Known for pristine beaches, world-class dining, and elegant colonial architecture. Our Barbados villas offer the perfect blend of sophistication and island charm. Would you like to know about specific beaches, dining, or villa options?"
  }

  // St. Lucia
  if (message.includes("st lucia") || message.includes("st. lucia") || message.includes("lucia")) {
    return "St. Lucia is pure romance and adventure! Home to the iconic Pitons, luxury resorts, and stunning natural beauty. Perfect for couples and adventure seekers. Our St. Lucia villas offer breathtaking views and exclusive experiences. Interested in hiking the Pitons, diving, or romantic getaways?"
  }

  // Jamaica
  if (message.includes("jamaica")) {
    return "Jamaica brings the rhythm, culture, and vibrant island energy! From reggae music to jerk cuisine, lush mountains to beautiful beaches. Our Jamaica villas capture the authentic spirit of the island with luxury amenities. Want to know about beaches, culture, or villa features?"
  }

  // St. Barthélemy / St. Barts
  if (
    message.includes("barth") ||
    message.includes("barts") ||
    message.includes("st barth") ||
    message.includes("st. barth")
  ) {
    return "St. Barthélemy (St. Barts) is French sophistication meets Caribbean paradise! Ultra-luxury villas, pristine beaches, designer shopping, and gourmet dining. The crown jewel of Caribbean luxury. Our St. Barts properties offer the ultimate in refinement and privacy. Interested in learning more?"
  }

  // Villas / Properties
  if (message.match(/villa|property|properties|accommodation|stay|rent/)) {
    return "All our luxury villas feature private pools, ocean views, premium amenities, and personalized concierge services. Many include private chefs, spa services, and exclusive beach access. For availability and detailed information about specific properties, I recommend contacting Sarah directly at +49 160 92527436 (WhatsApp) or hello@valartravel.de."
  }

  // Booking / Availability
  if (message.match(/book|booking|available|availability|reserve|reservation|price|cost|rate/)) {
    return "I'd love to help you book your Caribbean escape! For current availability, pricing, and reservations, please contact Sarah Kuhmichel directly:\n\n📱 WhatsApp: +49 160 92527436\n📧 Email: hello@valartravel.de\n\nShe'll provide personalized recommendations and handle all booking details for you!"
  }

  // Beaches
  if (message.includes("beach")) {
    return "The Caribbean has some of the world's most stunning beaches! Each destination offers unique experiences: Barbados has Crane Beach and Accra Beach, St. Lucia has Anse Chastanet and Reduit Beach, Jamaica features Seven Mile Beach and Frenchman's Cove, while St. Barts boasts Colombier and Gouverneur Beach. Which destination's beaches interest you most?"
  }

  // Food / Dining / Restaurants
  if (message.match(/food|dining|restaurant|cuisine|eat|chef/)) {
    return "Caribbean cuisine is incredible! From fresh seafood and tropical fruits to local specialties like flying fish (Barbados), jerk chicken (Jamaica), and French-Caribbean fusion (St. Barts). Many of our villas include private chef services. Would you like recommendations for specific destinations?"
  }

  // Activities / Things to do
  if (message.match(/activity|activities|do|things|experience|adventure/)) {
    return "There's so much to experience! Popular activities include snorkeling and diving, hiking (especially the Pitons in St. Lucia), catamaran cruises, rum distillery tours, beach hopping, spa treatments, and water sports. Each island has unique offerings. Which destination or activity type interests you?"
  }

  // Travel Tips
  if (message.match(/tip|advice|recommend|suggest|best time|when to/)) {
    return "Great question! The Caribbean is beautiful year-round, with peak season from December to April (dry, perfect weather) and summer offering lower rates and fewer crowds. Pack light, breathable clothing, reef-safe sunscreen, and don't forget resort casual attire for dining. Any specific aspect of planning I can help with?"
  }

  // Contact / Sarah
  if (message.match(/contact|reach|call|email|phone|whatsapp|sarah/)) {
    return "You can reach Sarah Kuhmichel, our Caribbean travel specialist:\n\n📱 WhatsApp: +49 160 92527436\n📧 Email: hello@valartravel.de\n\nShe's wonderful to work with and will personally help plan your perfect Caribbean getaway!"
  }

  // Thanks / Goodbye
  if (message.match(/thank|thanks|appreciate|bye|goodbye/)) {
    return "You're very welcome! If you have any other questions about Caribbean luxury travel, I'm here to help. For bookings and detailed planning, don't hesitate to reach out to Sarah. Enjoy planning your Caribbean escape! 🌴"
  }

  // Default response
  return "I'd be happy to help you plan your Caribbean luxury villa experience! I can share information about:\n\n• Destinations (Barbados, St. Lucia, Jamaica, St. Barthélemy)\n• Villa features and amenities\n• Beaches and activities\n• Dining and local culture\n• Travel tips\n\nFor bookings and availability, contact Sarah at +49 160 92527436 or hello@valartravel.de. What would you like to know?"
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const response = getSmartResponse(userMessage.content)

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
        },
      ])
      setIsLoading(false)
    }, 800)
  }

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed right-6 bottom-6 z-50 w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-neutral-200">
          {/* Header */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center">
                  <span className="text-emerald-800 font-serif text-xl font-semibold">S</span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-white text-lg">Sofia</h3>
                <p className="text-emerald-100 text-xs">Your Caribbean Travel Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
            {messages.length === 0 && (
              <div className="text-center text-neutral-500 mt-8">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center">
                  <span className="text-emerald-800 font-serif text-2xl font-semibold">S</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">Hi! I'm Sofia</p>
                <p className="text-xs mt-1">Ask me about Caribbean destinations, villa rentals, or travel tips.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-800 font-serif text-sm font-semibold">S</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-neutral-200 text-neutral-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-800 font-serif text-sm font-semibold">S</span>
                </div>
                <div className="bg-white border border-neutral-200 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-neutral-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sofia about villas, destinations..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center p-0"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
