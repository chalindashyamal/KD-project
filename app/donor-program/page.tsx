
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Users, Calendar, FileText, Clock, CheckCircle, HelpCircle, ArrowRight, MessageSquare } from "lucide-react"

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

export default function DonorProgramPage() {
  const [showDonorForm, setShowDonorForm] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([
    {
      id: 1,
      name: "Sarah Doe",
      bloodType: "A+",
      contact: "sarah.doe@example.com",
      relationship: "Sister",
      healthStatus: "Good",
      status: "Testing Phase",
      messages: [],
    },
    {
      id: 2,
      name: "Michael Smith",
      bloodType: "O+",
      contact: "michael.smith@example.com",
      relationship: "Friend",
      healthStatus: "Good",
      status: "Initial Screening",
      messages: [],
    },
  ])
  const [newDonor, setNewDonor] = useState({
    name: "",
    bloodType: "",
    contact: "",
    relationship: "",
    healthStatus: "",
  })
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const handleDonorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDonor((prev) => ({ ...prev, [name]: value }))
  }

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...donors.map((d) => d.id), 0) + 1
    setDonors([
      ...donors,
      {
        id: newId,
        name: newDonor.name,
        bloodType: newDonor.bloodType,
        contact: newDonor.contact,
        relationship: newDonor.relationship,
        healthStatus: newDonor.healthStatus,
        status: "Initial Screening",
        messages: [],
      },
    ])
    setNewDonor({
      name: "",
      bloodType: "",
      contact: "",
      relationship: "",
      healthStatus: "",
    })
    setShowDonorForm(false)
  }

  const handleMessageSubmit = (donorId: number) => {
    if (!newMessage.trim()) return
    const updatedDonors = donors.map((donor) => {
      if (donor.id === donorId) {
        return {
          ...donor,
          messages: [
            ...donor.messages,
            {
              sender: "Patient",
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
          <h1 className="text-3xl font-bold tracking-tight">Kidney Donor Program</h1>
          <p className="text-muted-foreground">Information and resources for kidney transplantation</p>
        </div>
        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Heart className="h-4 w-4" />
              Register as Donor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register as Donor</DialogTitle>
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

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Users className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Transplant Status</h3>
          <div className="text-3xl font-bold mb-1">Waiting List</div>
          <p className="text-sm opacity-90">Position: 143 of 287</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Calendar className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Next Evaluation</h3>
          <div className="text-3xl font-bold mb-1">May 15, 2025</div>
          <p className="text-sm opacity-90">Transplant Center</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Clock className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Waiting Time</h3>
          <div className="text-3xl font-bold mb-1">8 Months</div>
          <p className="text-sm opacity-90">Est. wait: 2-3 years</p>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
          <CardTitle>Transplant Journey Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Overall Progress</h3>
                <span className="text-sm font-medium">35%</span>
              </div>
              <Progress value={35} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-700 rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Initial Evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    Medical history review, blood tests, and initial compatibility assessment completed.
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-700 rounded-full p-1">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Transplant Waitlist Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Successfully added to the national transplant waiting list on September 15, 2024.
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 text-amber-700 rounded-full p-1">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Potential Living Donor Evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    {donors.length} potential donors are currently undergoing evaluation for compatibility.
                  </p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  In Progress
                </Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-1">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Pre-Transplant Education</h3>
                  <p className="text-sm text-muted-foreground">
                    Educational sessions about the transplant process, medications, and post-transplant care.
                  </p>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-1">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Transplant Surgery</h3>
                  <p className="text-sm text-muted-foreground">
                    The actual kidney transplant procedure and immediate recovery.
                  </p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-muted rounded-full p-1">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Post-Transplant Care</h3>
                  <p className="text-sm text-muted-foreground">
                    Follow-up care, medication management, and long-term monitoring.
                  </p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">
            <Heart className="mr-2 h-4 w-4" />
            About Donation
          </TabsTrigger>
          <TabsTrigger value="living">
            <Users className="mr-2 h-4 w-4" />
            Living Donors
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="mr-2 h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Kidney Transplantation</CardTitle>
              <CardDescription>Understanding the kidney transplant process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Kidney transplantation is a surgical procedure to place a healthy kidney from a living or deceased donor
                into a person whose kidneys no longer function properly. It's the preferred treatment for kidney failure
                compared to a lifetime on dialysis.
              </p>

              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Benefits of Transplantation</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Better quality of life compared to dialysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Fewer dietary and fluid restrictions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lower risk of death compared to remaining on dialysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>More energy and ability to return to normal activities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No more dialysis sessions (in most cases)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Types of Kidney Donation</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Living Donor:</span> A kidney from a living person, usually a
                        family member, friend, or altruistic donor.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Deceased Donor:</span> A kidney from someone who has recently died
                        and chosen to donate their organs.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Paired Exchange:</span> When a willing donor isn't compatible with
                        their intended recipient, they can be matched with another donor-recipient pair.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">The Transplant Process</h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Evaluation and Waitlist</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive medical evaluation to determine if you're a good candidate for transplant,
                        followed by placement on the national waiting list.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Waiting Period</h4>
                      <p className="text-sm text-muted-foreground">
                        The waiting time varies based on blood type, tissue matching, time on the waitlist, and medical
                        urgency. Living donation can significantly reduce this time.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Transplant Surgery</h4>
                      <p className="text-sm text-muted-foreground">
                        When a kidney becomes available, you'll undergo surgery to place the new kidney in your lower
                        abdomen. The surgery typically takes 3-4 hours.
                      </p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Recovery and Follow-up</h4>
                      <p className="text-sm text-muted-foreground">
                        Hospital stay of 4-7 days, followed by close monitoring and regular check-ups. You'll need to
                        take immunosuppressant medications for the life of the transplant.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="mt-4 flex justify-center">
                <Button>
                  Learn More About Transplantation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="living" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Living Kidney Donation</CardTitle>
              <CardDescription>Information for potential living donors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Living kidney donation offers the best outcomes for recipients and can significantly reduce waiting
                time. A healthy person can donate one kidney and live a normal, healthy life with the remaining kidney.
              </p>

              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Benefits of Living Donation</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Better long-term outcomes for the recipient</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Scheduled surgery at a convenient time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Shorter waiting time for the recipient</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Kidney begins functioning immediately in most cases</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Who Can Be a Living Donor?</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Adults in good physical and mental health</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Compatible blood type (or participation in paired exchange)</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No history of kidney disease, diabetes, or certain other conditions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Willing to undergo comprehensive evaluation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-2">Current Potential Donors</h3>
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
                                    className={`flex ${
                                      msg.sender === "Patient" ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    <div
                                      className={`p-2 rounded-lg text-sm ${
                                        msg.sender === "Patient"
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
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button>
                  Become a Living Donor
                  <Heart className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transplant Resources</CardTitle>
              <CardDescription>Helpful information and support for transplant patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Financial Assistance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Information about programs that can help with transplant-related expenses, including medication
                      costs, travel, and lodging.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      View Financial Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Support Groups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with others who are going through the transplant process or have received a kidney
                      transplant.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Find Support Groups
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Transplant Centers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Information about transplant centers, their outcomes, and how to choose the right center for you.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Find Transplant Centers
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Educational Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Brochures, videos, and other resources to help you understand the transplant process and
                      post-transplant care.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Access Materials
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-medium mb-2">Transplant Team Contacts</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Dr. Jennifer Wilson</p>
                      <p className="text-sm text-muted-foreground">Transplant Nephrologist</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sarah Johnson, RN</p>
                      <p className="text-sm text-muted-foreground">Transplant Coordinator</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Michael Brown</p>
                      <p className="text-sm text-muted-foreground">Social Worker</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about kidney transplantation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">How long is the waiting list for a kidney transplant?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The average waiting time for a deceased donor kidney is 3-5 years, but it can vary based on blood
                    type, tissue matching, time on the waitlist, and medical urgency. Living donation can significantly
                    reduce this time.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium">What are the risks of kidney transplant surgery?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    As with any surgery, there are risks including bleeding, infection, and reaction to anesthesia.
                    Specific to transplant are risks of rejection, side effects from anti-rejection medications, and the
                    possibility that the new kidney might not work immediately.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium">Will I need to take medications after a transplant?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Yes, you will need to take immunosuppressant medications for as long as your transplanted kidney is
                    functioning. These medications prevent your body from rejecting the new kidney. You may also need
                    other medications to prevent infection or manage side effects.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium">Can I live a normal life after a kidney transplant?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Most people return to a normal, active life after recovery from transplant surgery. You'll need to
                    take medications, have regular check-ups, maintain a healthy lifestyle, and be vigilant about signs
                    of infection or rejection, but many recipients report a significantly improved quality of life
                    compared to dialysis.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium">What if my body rejects the new kidney?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rejection can occur at any time, but is most common in the first few months after transplant. Many
                    episodes of rejection can be successfully treated with additional medications. If the kidney fails
                    completely, you would need to return to dialysis and could be re-evaluated for another transplant.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button>
                  View More FAQs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
