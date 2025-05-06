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
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: string
  sender: string
  senderId: string
  recipient: string
  recipientId: string
  content: string
  timestamp: Date
  read: boolean
  urgent: boolean
}

type Conversation = {
  id: string
  participant: string
  participantId: string
  role: string
  lastMessage: string
  timestamp: Date
  unread: number
  avatar: string
}

export default function MessagesPage() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  
  // Mock current user data
  const currentUser = {
    id: "doctor-1",
    name: "Dr. Smith"
  }

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate loading conversations
    setTimeout(() => {
      setConversations([
        {
          id: "1",
          participant: "John Doe",
          participantId: "patient-1",
          role: "Patient",
          lastMessage: "About my recent lab results...",
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          unread: 2,
          avatar: "/avatars/patient-1.jpg",
        },
        {
          id: "2",
          participant: "Dr. Johnson",
          participantId: "doctor-2",
          role: "Doctor",
          lastMessage: "The prescription has been updated",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          unread: 0,
          avatar: "/avatars/doctor-1.jpg",
        },
        {
          id: "3",
          participant: "Nurse Williams",
          participantId: "nurse-1",
          role: "Nurse",
          lastMessage: "Your appointment has been confirmed",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          unread: 1,
          avatar: "/avatars/nurse-1.jpg",
        },
        {
          id: "4",
          participant: "Lab Technician",
          participantId: "lab-1",
          role: "Lab",
          lastMessage: "Your test results are ready",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          unread: 0,
          avatar: "/avatars/lab-1.jpg",
        },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Simulate loading messages
      setIsLoading(true)
      setTimeout(() => {
        setMessages([
          {
            id: "1",
            sender: "John Doe",
            senderId: "patient-1",
            recipient: currentUser.name,
            recipientId: currentUser.id,
            content: "Hello Doctor, I have a question about my recent lab results.",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            read: true,
            urgent: false,
          },
          {
            id: "2",
            sender: currentUser.name,
            senderId: currentUser.id,
            recipient: "John Doe",
            recipientId: "patient-1",
            content: "Hello John, what would you like to know?",
            timestamp: new Date(Date.now() - 1000 * 60 * 8),
            read: true,
            urgent: false,
          },
          {
            id: "3",
            sender: "John Doe",
            senderId: "patient-1",
            recipient: currentUser.name,
            recipientId: currentUser.id,
            content: "The potassium levels seem high. Should I be concerned?",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            read: false,
            urgent: true,
          },
        ])
        setIsLoading(false)
      }, 300)
    }
  }, [selectedConversation, currentUser.id, currentUser.name])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const conversation = conversations.find(c => c.id === selectedConversation)
    if (!conversation) return

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderId: currentUser.id,
      recipient: conversation.participant,
      recipientId: conversation.participantId,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      urgent: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Update last message in conversation
    setConversations(conversations.map(c => 
      c.id === selectedConversation 
        ? { ...c, lastMessage: newMessage, timestamp: new Date(), unread: 0 }
        : c
    ))

    toast({
      title: "Message sent",
      description: `Your message to ${conversation.participant} has been sent.`,
    })
  }

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || conv.role.toLowerCase() === filterRole.toLowerCase()
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
                <SelectItem value="nurse">Staff</SelectItem>
                
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
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium truncate">{conversation.participant}</p>
                        <p className="text-xs text-muted-foreground">
                          {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="h-5 w-5 flex items-center justify-center p-0">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.role}</p>
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
                  <AvatarImage src={conversations.find(c => c.id === selectedConversation)?.avatar} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>
                    {conversations.find(c => c.id === selectedConversation)?.participant}
                  </CardTitle>
                  <CardDescription>
                    {conversations.find(c => c.id === selectedConversation)?.role}
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
                          {message.urgent && message.senderId !== currentUser.id && (
                            <div className="flex items-center text-xs font-bold mb-1 text-red-500">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              URGENT
                            </div>
                          )}
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