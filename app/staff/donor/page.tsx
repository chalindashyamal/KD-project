"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare } from "lucide-react"
import request from "@/lib/request"

interface Donor {
  id: number
  name: string
  bloodType: string
  contact: string
  relationship: string
  healthStatus: string
  status: string
  messages: { sender: string; content: string; timestamp: string }[]
}

export default function StaffDonorPage() {
  const [showDonorForm, setShowDonorForm] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([])
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [newDonor, setNewDonor] = useState({
    name: "",
    bloodType: "",
    contact: "",
    relationship: "",
    healthStatus: "",
  })

  useEffect(() => {
    async function fetchDonors() {
      try {
        const response = await request('/api/donors');
        if (!response.ok) {
          throw new Error('Failed to fetch donors');
        }
        const data: Donor[] = await response.json();
        setDonors(data.map((donor) => ({
          ...donor,
          messages: donor.messages || [],
        })));
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    }

    fetchDonors();
  }, []);

  const handleDonorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDonor((prev) => ({ ...prev, [name]: value }))
  }

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await request('/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDonor.name,
          bloodType: newDonor.bloodType,
          contact: newDonor.contact,
          relationship: newDonor.relationship,
          healthStatus: newDonor.healthStatus,
          status: "Initial Screening",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create a new donor');
      }

      const createdDonor = await response.json();

      createdDonor.messages = createdDonor.messages || [];
      // Update the local state with the newly created donor
      setDonors((prevDonors) => [...prevDonors, createdDonor]);

      // Reset the form
      setNewDonor({
        name: '',
        bloodType: '',
        contact: '',
        relationship: '',
        healthStatus: '',
      });
      setShowDonorForm(false);
    } catch (error) {
      console.error('Error creating donor:', error);
    }
  };

  const handleMessageSubmit = (donorId: number) => {
    if (!newMessage.trim()) return
    const updatedDonors = donors.map((donor) => {
      if (donor.id === donorId) {
        return {
          ...donor,
          messages: [
            ...donor.messages,
            {
              sender: "Staff",
              content: newMessage,
              timestamp: new Date().toLocaleString(),
            },
          ],
        }
      }
      return donor
    })
    setDonors(updatedDonors)
    setNewMessage("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Donor Management</h1>
          <p className="text-muted-foreground">Manage and register potential kidney donors</p>
        </div>
        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Heart className="h-4 w-4" />
              Register New Donor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Donor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDonorSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newDonor.name}
                  onChange={handleDonorInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select
                  name="bloodType"
                  value={newDonor.bloodType}
                  onValueChange={(value) => setNewDonor((prev) => ({ ...prev, bloodType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact (Email or Phone)</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={newDonor.contact}
                  onChange={handleDonorInputChange}
                  placeholder="Enter email or phone"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship to Patient</Label>
                <Select
                  name="relationship"
                  value={newDonor.relationship}
                  onValueChange={(value) => setNewDonor((prev) => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Family">Family</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Altruistic">Altruistic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthStatus">Health Status</Label>
                <Textarea
                  id="healthStatus"
                  name="healthStatus"
                  value={newDonor.healthStatus}
                  onChange={handleDonorInputChange}
                  placeholder="Briefly describe your health status"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowDonorForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Potential Donors</CardTitle>
          <CardDescription>Manage and communicate with potential kidney donors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {donors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No potential donors registered yet.</p>
            ) : (
              donors.map((donor) => (
                <div key={donor.id}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{donor.name} ({donor.relationship})</p>
                      <p className="text-sm text-muted-foreground">Blood Type: {donor.bloodType}</p>
                      <p className="text-sm text-muted-foreground">Contact: {donor.contact}</p>
                      <p className="text-sm text-muted-foreground">Health Status: {donor.healthStatus}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {donor.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDonorId(donor.id)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </div>
                  {selectedDonorId === donor.id && (
                    <div className="mt-4 p-4 bg-white rounded-lg border">
                      <h4 className="text-sm font-medium mb-2">Conversation with {donor.name}</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                        {donor.messages.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No messages yet.</p>
                        ) : (
                          donor.messages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${msg.sender === "Staff" ? "justify-end" : "justify-start"
                                }`}
                            >
                              <div
                                className={`p-2 rounded-lg text-sm ${msg.sender === "Staff"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                                  }`}
                              >
                                <p>{msg.content}</p>
                                <p className="text-xs opacity-70">{msg.timestamp}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                        />
                        <Button
                          onClick={() => handleMessageSubmit(donor.id)}
                          disabled={!newMessage.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                  <Separator className="my-3" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}