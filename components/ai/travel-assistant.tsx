"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, MapPin, Calendar, DollarSign, Sparkles } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  actionable?: {
    type: "search" | "book" | "save"
    data: any
  }
}

interface TravelAssistantProps {
  userPreferences?: {
    budget?: number
    travelStyle?: string
    destinations?: string[]
  }
}

export function TravelAssistant({ userPreferences }: TravelAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI travel assistant. I can help you plan trips, find deals, and answer travel questions. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: [
        "Plan a weekend getaway",
        "Find luxury hotels in Paris",
        "Budget travel tips for Europe",
        "Best time to visit Tokyo",
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/travel-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context: {
            previousMessages: messages.slice(-5),
            userPreferences,
          },
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
        actionable: data.actionable,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleAction = (action: Message["actionable"]) => {
    if (!action) return

    switch (action.type) {
      case "search":
        window.location.href = `/search?${new URLSearchParams(action.data).toString()}`
        break
      case "book":
        // Open booking modal or redirect
        console.log("Book:", action.data)
        break
      case "save":
        // Save to wishlist or trip
        console.log("Save:", action.data)
        break
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-500" />
          AI Travel Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* Actionable buttons */}
                  {message.actionable && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant={message.type === "user" ? "secondary" : "default"}
                        onClick={() => handleAction(message.actionable)}
                        className="text-xs"
                      >
                        {message.actionable.type === "search" && <MapPin className="h-3 w-3 mr-1" />}
                        {message.actionable.type === "book" && <Calendar className="h-3 w-3 mr-1" />}
                        {message.actionable.type === "save" && <DollarSign className="h-3 w-3 mr-1" />}
                        {message.actionable.type.charAt(0).toUpperCase() + message.actionable.type.slice(1)}
                      </Button>
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs opacity-75">Try asking:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestion(suggestion)}
                          className="block w-full text-left text-xs p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about travel..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
              disabled={isLoading}
            />
            <Button onClick={() => sendMessage(input)} disabled={isLoading || !input.trim()} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
