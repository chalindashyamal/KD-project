"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Send,
  Search,
  User,
  Plus,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import request from "@/lib/request"

type Message = {
  id: string
  sender: string
  senderId: string
  recipient: string
  recipientId: string
  content: string
  timestamp: Date
}

type Conversation = {
  id: string
  participant: string
  participantId: string
  role: string
  lastMessage: string
  timestamp: Date
  messages: Message[]
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState({ id: "", name: "" })
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await request("/api/user")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setCurrentUser({
          id: data.id || "",
          name: data.name || "Unknown",
        })
      } catch (error) {
        console.error("Error fetching user:", error)
        setCurrentUser({ id: "", name: "Unknown" })
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await request("/api/messages")
        if (!response.ok) {
          throw new Error("Failed to fetch conversations")
        }
        const data = await response.json()
        setConversations(data.map((conv: any) => ({
          ...conv,
          participant: conv.participant || "Unknown",
          participantId: conv.participantId || "",
          role: conv.role || "unknown",
          lastMessage: conv.lastMessage || "",
          timestamp: new Date(conv.timestamp || Date.now()),
          messages: conv.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp || Date.now()),
          })) || [],
        })))
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversations. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchConversations()

    // Poll every 10 seconds
    const intervalId = setInterval(fetchConversations, 10000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversation = conversations.find(c => c.id === selectedConversation)
      if (conversation && conversation.messages) {
        setMessages(conversation.messages)
      } else {
        setMessages([])
      }
    } else {
      setMessages([])
    }
  }, [selectedConversation, conversations])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const conversation = conversations.find(c => c.id === selectedConversation)
    if (!conversation || !conversation.participantId) return

    try {
      const response = await request("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: conversation.participantId,
          content: newMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const message = await response.json()

      // Update messages in the current conversation
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: new Date(message.timestamp || Date.now()),
        },
      ])

      // Update the conversation list with the new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    ...message,
                    timestamp: new Date(message.timestamp || Date.now()),
                  },
                ],
                lastMessage: message.content,
                timestamp: new Date(message.timestamp || Date.now()),
              }
            : conv
        ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      )

      setNewMessage("")

      toast({
        title: "Message sent",
        description: `Your message to ${conversation.participant} has been sent.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      (conv.participant?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (conv.lastMessage?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || (conv.role?.toLowerCase() || "") === filterRole.toLowerCase()
    return matchesSearch && matchesRole
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
      {/* Conversations sidebar */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Communicate with patients and staff</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-18rem)]">
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-accent ${selectedConversation === conversation.id ? "bg-accent" : ""}`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{conversation.participant || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.role || "Unknown"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Message area */}
      <Card className="md:col-span-3 flex flex-col">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>
                    {conversations.find(c => c.id === selectedConversation)?.participant || "Unknown"}
                  </CardTitle>
                  <CardDescription>
                    {conversations.find(c => c.id === selectedConversation)?.role || "Unknown"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[calc(100vh-22rem)] p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${message.senderId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-accent"}`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.senderId === currentUser.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[60px]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon" className="h-[60px] w-[60px]">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
            <p className="text-muted-foreground">
              Select a conversation from the list or start a new one to begin messaging.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}