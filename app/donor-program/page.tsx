"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Heart, Users, CheckCircle, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import request from "@/lib/request"

interface Donor {
  id: number
  name: string
  bloodType: string
  contact: string
  relationship: string
  healthStatus: string
  status: string
}

export default function DonorProgramPage() {
  const { toast } = useToast()
  const [donors, setDonors] = useState<Donor[]>([])
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")

  useEffect(() => {
    async function fetchDonors() {
      try {
        const response = await request('/api/donors');
        if (!response.ok) throw new Error('Failed to fetch donors');
        setDonors(await response.json());
      } catch (error) {
        console.error('Error fetching donors:', error);
      }
    }
    fetchDonors();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleSendEmail = async (donorId: number) => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({ title: "Error", description: "Please provide both a subject and message.", variant: "destructive" });
      return;
    }

    const donor = donors.find(d => d.id === donorId);
    if (!donor || !validateEmail(donor.contact)) {
      toast({ title: "Error", description: "Invalid donor or email.", variant: "destructive" });
      return;
    }

    try {
      const response = await request('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: donor.contact, subject: emailSubject, body: emailBody }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      toast({ title: "Success", description: `Email sent to ${donor.name}.` });
      setEmailSubject(""); setEmailBody(""); setSelectedDonorId(null);
    } catch (error) {
      console.error('Email error:', error.message);
      toast({ title: "Error", description: `Failed to send email: ${error.message}`, variant: "destructive" });
    }
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
              <p>Kidney transplantation is a surgical procedure to place a healthy kidney from a living or deceased donor into a person whose kidneys no longer function properly. It's preferred over dialysis.</p>
              <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Benefits</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Better quality of life</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Fewer restrictions</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Lower death risk</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Donation Types</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Living Donor</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Deceased Donor</li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />Paired Exchange</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="living" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Living Kidney Donation</CardTitle>
              <CardDescription>Information for potential donors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Living donation improves outcomes and reduces wait time. A healthy person can live with one kidney.</p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <h3 className="text-lg font-medium mb-2">Potential Donors</h3>
                <div className="space-y-4">
                  {donors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No donors yet.</p>
                  ) : (
                    donors.map((donor) => (
                      <div key={donor.id}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{donor.name} ({donor.relationship})</p>
                            <p className="text-sm text-muted-foreground">Blood: {donor.bloodType}</p>
                            <p className="text-sm text-muted-foreground">Contact: {donor.contact}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{donor.status}</Badge>
                            <Button variant="outline" size="sm" onClick={() => setSelectedDonorId(donor.id)}>
                              <Mail className="mr-2 h-4 w-4" /> Send Email
                            </Button>
                          </div>
                        </div>
                        {selectedDonorId === donor.id && (
                          <div className="mt-4 p-4 bg-white rounded-lg border">
                            <h4 className="text-sm font-medium mb-2">Email {donor.name}</h4>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject" />
                              </div>
                              <div className="space-y-2">
                                <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Message" rows={4} />
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => { setSelectedDonorId(null); setEmailSubject(""); setEmailBody(""); }}>Cancel</Button>
                                <Button onClick={() => handleSendEmail(donor.id)} disabled={!emailSubject.trim() || !emailBody.trim()}>Send</Button>
                              </div>
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