"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, } from "lucide-react"

// Sample conversation history
const initialMessages = [
  {
    role: "assistant",
    content: "Hello John! I'm your KidneyCare AI assistant. How can I help you today?",
    timestamp: "10:30 AM",
  },
]

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



export default function ChatbotPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateResponse(input)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestedQuestion = (question: string) => {
    // Add user message
    const userMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateResponse(question)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  // Simple response generator based on keywords
  const generateResponse = (query: string) => {
    const lowerQuery = query.toLowerCase()
    let response = ""

    if (lowerQuery.includes("swollen") || lowerQuery.includes("swelling")) {
      response =
        "Swelling can be a sign of fluid retention, which is common in kidney disease. If you notice sudden or severe swelling, especially in your ankles, feet, or around your eyes, you should contact your healthcare provider right away. They may need to adjust your medications or dialysis schedule."
    } else if (lowerQuery.includes("fluid") || lowerQuery.includes("water") || lowerQuery.includes("drink")) {
      response =
        "Managing fluid intake is important for kidney patients. Your recommended daily fluid limit is 2 liters. Try using smaller cups, sucking on ice chips instead of drinking water, and spreading your fluid intake throughout the day. Remember to count soups, ice cream, and other foods that become liquid at room temperature as part of your fluid intake."
    } else if (lowerQuery.includes("potassium") || lowerQuery.includes("high potassium")) {
      response =
        "Foods high in potassium include bananas, oranges, potatoes, tomatoes, avocados, and spinach. These should be limited in your diet. Lower potassium alternatives include apples, berries, green beans, carrots, and white rice. Always consult with your dietitian for personalized advice."
    } else if (lowerQuery.includes("phosphorus") || lowerQuery.includes("high phosphorus")) {
      response =
        "Symptoms of high phosphorus can include itchy skin, bone and joint pain, and muscle cramps. To manage phosphorus levels, limit intake of dairy products, nuts, whole grains, and processed foods. Take your phosphate binders as prescribed with meals and snacks."
    } else if (lowerQuery.includes("contact doctor") || lowerQuery.includes("emergency")) {
      response =
        "You should contact your doctor immediately if you experience: shortness of breath, chest pain, severe vomiting or diarrhea, fever above 101°F, significant decrease in urination, severe swelling, or unusual bleeding. For life-threatening emergencies, call 911 or go to the nearest emergency room."
    } else if (lowerQuery.includes("dialysis") || lowerQuery.includes("prepare")) {
      response =
        "To prepare for your next dialysis session: take all medications as prescribed, follow your fluid and dietary restrictions, wear comfortable clothing with easy access to your access site, bring activities to pass the time, and make sure to arrive on time. Let your care team know if you've experienced any new symptoms since your last session."
    } else if (lowerQuery.includes("tacrolimus") || lowerQuery.includes("side effects")) {
      response =
        "Common side effects of Tacrolimus include tremors, headache, high blood pressure, kidney problems, high potassium levels, and increased risk of infection. If you experience severe side effects, contact your transplant team immediately. Never stop taking Tacrolimus without consulting your doctor."
    } else if (lowerQuery.includes("sodium") || lowerQuery.includes("salt")) {
      response =
        "To reduce sodium in your diet: cook at home using fresh ingredients, avoid processed foods, read food labels (aim for products with less than 140mg sodium per serving), use herbs and spices instead of salt, rinse canned foods, and limit eating out. Your daily sodium limit is 2,000mg."
    } else {
      response =
        "I understand you're asking about " +
        query +
        ". This is an important topic for kidney patients. I recommend discussing this with your healthcare team during your next appointment for personalized advice."
    }

    return {
      role: "assistant",
      content: response,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
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
                      className={`flex max-w-[80%] ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
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

