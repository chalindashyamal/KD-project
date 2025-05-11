"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, } from "lucide-react"
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState("")

  useEffect(() => {
    const fetchName = async () => {
      const response = await request("/api/patient")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setName(`${data.firstName} ${data.lastName}`)
    }
    fetchName()
  }, [])

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hello ${name}! I'm your KidneyCare AI assistant. How can I help you today?`,
        timestamp: "10:30 AM",
      },
    ])
  }, [name])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (msg?: string) => {
    const content = (msg || input).trim()
    if (content === "") return

    // Add user message
    const userMessage = {
      role: "user",
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      // Simulate API call to get AI response
      const response = await request("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: messages.map((msg) => ({ role: msg.role, content: msg.content })) }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      const aiResponse = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    handleSendMessage(question)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">KidneyCare Assistant</h1>
          <p className="text-muted-foreground">Your AI-powered guide for kidney health information</p>
        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden border-none shadow-md h-[600px] flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <CardTitle>Chat with KidneyCare AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        } rounded-lg p-3`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] bg-muted rounded-lg p-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
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
                  placeholder="Type your question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
              <CardTitle>Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
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

