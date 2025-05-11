"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User as UserIcon } from "lucide-react"
import request from "@/lib/request"

// Sample suggested questions
const suggestedQuestions = [
  "What should I do if I feel swollen?",
  "How can I manage my fluid intake?",
  "What foods are high in potassium?",
  "What are the symptoms of high phosphorus?",
  "When should I contact my doctor?",
  "How do I prepare for my next dialysis session?",
  "What are common side effects of Tacrolimus?",
  "How can I reduce sodium in my diet?",
]

type Message = {
  role: string
  content: string
  timestamp: string
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [name, setName] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user name on mount
  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await request("/api/patient")
        if (!response.ok) {
          throw new Error("Failed to fetch patient data")
        }
        const data = await response.json()
        setName(`${data.firstName} ${data.lastName}`)
      } catch (error) {
        console.error("Error fetching patient name:", error)
        setName("Friend") // Friendly fallback name
      }
    }
    fetchName()
  }, [])

  // Set initial message once name is fetched
  useEffect(() => {
    if (name) {
      setMessages([
        {
          role: "assistant",
          content: `Hi ${name}! 😊 I'm your KidneyCare AI assistant, here to support you with kidney health questions. What’s on your mind today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    }
  }, [name])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (msg?: string) => {
    const content = (msg || input).trim()
    if (content === "") return

    // Clear any existing debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Limit history to last 5 messages to reduce API payload
      const recentHistory = messages.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Add the current user message to the history
      const historyToSend = [...recentHistory, { role: "user", content }]

      // Simulate API call to get AI response with a debounce
      debounceTimeoutRef.current = setTimeout(async () => {
        const response = await request("/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ history: historyToSend }),
        })

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }

        const data = await response.json()
        // Remove Markdown bold markers (**) and split into paragraphs
        const cleanContent = data.response.replace(/\*\*(.*?)\*\*/g, "$1").split("\n").map((line: string, index: number) => (
          line.trim() ? `<p key=${index} class="mb-2">${line.trim()}</p>` : ""
        )).join("");
        const aiResponse: Message = {
          role: "assistant",
          content: cleanContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 500) // 500ms debounce delay
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: `Oh no, ${name}! 😔 I’m having trouble responding right now. Please try again later, and feel free to reach out to your healthcare provider if you need urgent help.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    handleSendMessage(question)
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KidneyCare Assistant</h1>
          <p className="text-muted-foreground">Your friendly AI guide for kidney health</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden border-none shadow-lg h-[600px] flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <CardTitle>Chat with KidneyCare AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "500px" }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start max-w-[75%] rounded-lg p-3 ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                      } shadow-md`}
                    style={{ borderRadius: "10px 10px 10px 0" }}
                  >
                    {message.role === "assistant" ? (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder-ai.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder-user.svg?height=32&width=32" alt="You" />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">You</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="space-y-2">
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                      <div className="text-xs opacity-70 text-right">{message.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[75%] bg-muted rounded-lg p-3 shadow-md" style={{ borderRadius: "10px 10px 10px 0" }}>
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder-ai.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask me anything about kidney health..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-primary"
                />
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 text-white" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
              <CardTitle>Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-muted transition-colors"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}