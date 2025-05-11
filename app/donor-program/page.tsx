"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, Users, CheckCircle, MessageSquare } from "lucide-react"
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

export default function DonorProgramPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")

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
      </div>

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
                                    className={`flex ${msg.sender === "Patient" ? "justify-end" : "justify-start"
                                      }`}
                                  >
                                    <div
                                      className={`p-2 rounded-lg text-sm ${msg.sender === "Patient"
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}