"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Check, Send } from "lucide-react"
import Link from "next/link"

export default function DoctorMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      recipient: {
        id: "PT-12345",
        name: "John Doe",
        role: "Patient",
      },
      lastMessage: "I've been experiencing increased swelling in my ankles. Is this concerning?",
      timestamp: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      recipient: {
        id: "S-001",
        name: "Nurse Emily Adams",
        role: "Staff",
      },
      lastMessage: "Patient Sarah Smith needs her medication dosage reviewed.",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      recipient: {
        id: "PT-23456",
        name: "Sarah Smith",
        role: "Patient",
      },
      lastMessage: "Thank you for adjusting my medication. I'm feeling much better now.",
      timestamp: "Yesterday",
      unread: false,
    },
    {
      id: 4,
      recipient: {
        id: "D-002",
        name: "Dr. Priya Patel",
        role: "Doctor",
      },
      lastMessage: "Could you review the transplant evaluation for Mike Johnson?",
      timestamp: "Apr 28",
      unread: false,
    },
    {
      id: 5,
      recipient: {
        id: "PT-34567",
        name: "Mike Johnson",
        role: "Patient",
      },
      lastMessage: "I've uploaded my latest blood pressure readings to the portal.",
      timestamp: "Apr 27",
      unread: false,
    },
  ]

  // Sample messages for the selected conversation
  const messages = [
    {
      id: 1,
      conversationId: 1,
      sender: {
        id: "PT-12345",
        name: "John Doe",
        role: "Patient",
      },
      content: "Hello Dr. Wilson, I've been experiencing increased swelling in my ankles. Is this concerning?",
      timestamp: "10:30 AM",
      isRead: true,
    },
    {
      id: 2,
      conversationId: 1,
      sender: {
        id: "D-001",
        name: "Dr. James Wilson",
        role: "Doctor",
      },
      content:
        "Hello John, ankle swelling can be a sign of fluid retention. Have you noticed any weight gain or changes in your urine output?",
      timestamp: "10:35 AM",
      isRead: true,
    },
    {
      id: 3,
      conversationId: 1,
      sender: {
        id: "PT-12345",
        name: "John Doe",
        role: "Patient",
      },
      content: "Yes, I've gained about 2 pounds in the last few days, and I think my urine output has decreased.",
      timestamp: "10:40 AM",
      isRead: true,
    },
    {
      id: 4,
      conversationId: 1,
      sender: {
        id: "D-001",
        name: "Dr. James Wilson",
        role: "Doctor",
      },
      content:
        "Thank you for letting me know. This could indicate fluid retention, which is common in kidney patients. I'd like you to come in for an evaluation. Can you come to the clinic tomorrow?",
      timestamp: "10:45 AM",
      isRead: true,
    },
    {
      id: 5,
      conversationId: 1,
      sender: {
        id: "PT-12345",
        name: "John Doe",
        role: "Patient",
      },
      content: "Yes, I can come in tomorrow. What time would work?",
      timestamp: "10:50 AM",
      isRead: false,
    },
  ]

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.recipient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get messages for the selected conversation
  const conversationMessages = messages.filter((message) => message.conversationId === selectedConversation)

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    // In a real app, you would send the message to the server
    console.log("Sending message:", newMessage)

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
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${
                        selectedConversation === conversation.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt={conversation.recipient.name} />
                        <AvatarFallback>
                          {conversation.recipient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{conversation.recipient.name}</div>
                          <div className="text-xs text-muted-foreground">{conversation.timestamp}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <Badge variant="outline" className="mr-1">
                            {conversation.recipient.role}
                          </Badge>
                          {conversation.recipient.id}
                        </div>
                        <div className="text-sm truncate mt-1">{conversation.lastMessage}</div>
                        {conversation.unread && <Badge className="mt-1">New</Badge>}
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
                      alt={conversations.find((c) => c.id === selectedConversation)?.recipient.name || ""}
                    />
                    <AvatarFallback>
                      {conversations
                        .find((c) => c.id === selectedConversation)
                        ?.recipient.name.split(" ")
                        .map((n) => n[0])
                        .join("") || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{conversations.find((c) => c.id === selectedConversation)?.recipient.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mr-1">
                        {conversations.find((c) => c.id === selectedConversation)?.recipient.role}
                      </Badge>
                      {conversations.find((c) => c.id === selectedConversation)?.recipient.id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.role === "Doctor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender.role === "Doctor" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {message.sender.role === "Doctor" && message.isRead && (
                            <Check className="h-3 w-3 opacity-70" />
                          )}
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

