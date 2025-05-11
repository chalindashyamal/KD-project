"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Check, Send } from "lucide-react"
import Link from "next/link"
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

export default function DoctorMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<string | null>()
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState({ id: "", name: "" })

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.participantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    const fetchUser = async () => {
      const response = await request("/api/user")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setCurrentUser({
        id: data.id,
        name: data.name,
      })
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
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })))
      } catch (error) {
        console.error("Error fetching conversations:", error)
      }
    }

    fetchConversations()
  }, [])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const conversation = conversations.find(c => c.id === selectedConversation)
      if (conversation) {
        setMessages(conversation.messages)
      } else {
        setMessages([])
      }
    }
  }, [selectedConversation, currentUser.id, currentUser.name])


  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

    const conversation = conversations.find(c => c.id === selectedConversation)
    if (!conversation) return

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

      setMessages([...messages, {
        ...message,
        timestamp: new Date(message.timestamp),
      }])
      setNewMessage("")

      console.log("Message sent successfully:", message)
    } catch (error) {
      console.error("Error sending message:", error)
    }

    // Clear the input
    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with patients and staff</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/messages/new">
            <Plus className="h-4 w-4" />
            New Message
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
              </TabsList>
              <div className="mt-4 space-y-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No conversations found</div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${selectedConversation === conversation.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={conversation.participant} />
                        <AvatarFallback>
                          {conversation.participant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{conversation.participant}</div>
                          <div className="text-xs text-muted-foreground">{conversation.timestamp.toISOString()}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-1">
                            {conversation.role}
                          </Badge>
                          {conversation.participantId}
                        </div>
                        <div className="text-sm truncate mt-1">{conversation.lastMessage}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=40&width=40"
                      alt={conversations.find((c) => c.id === selectedConversation)?.participant || ""}
                    />
                    <AvatarFallback>
                      {conversations
                        .find((c) => c.id === selectedConversation)
                        ?.participant.split(" ")
                        .map((n) => n[0])
                        .join("") || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{conversations.find((c) => c.id === selectedConversation)?.participant}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mr-1">
                        {conversations.find((c) => c.id === selectedConversation)?.role}
                      </Badge>
                      {conversations.find((c) => c.id === selectedConversation)?.participantId}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${message.senderId === currentUser.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{message.timestamp.toISOString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

