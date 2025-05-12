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
import { Heart, Mail } from "lucide-react"
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

export default function StaffDonorPage() {
  const { toast } = useToast()
  const [showDonorForm, setShowDonorForm] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([])
  const [selectedDonorId, setSelectedDonorId] = useState<number | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
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
        if (!response.ok) throw new Error('Failed to fetch donors');
        setDonors(await response.json());
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newDonor.name,
          bloodType: newDonor.bloodType,
          contact: newDonor.contact,
          relationship: newDonor.relationship,
          healthStatus: newDonor.healthStatus,
          status: "Initial Screening",
        }),
      });
      if (!response.ok) throw new Error('Failed to create donor');
      const createdDonor = await response.json();
      setDonors((prev) => [...prev, createdDonor]);
      setNewDonor({ name: '', bloodType: '', contact: '', relationship: '', healthStatus: '' });
      setShowDonorForm(false);
    } catch (error) {
      console.error('Error creating donor:', error);
    }
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Staff Donor Management</h1>
          <p className="text-muted-foreground">Manage and register potential donors</p>
        </div>
        <Dialog open={showDonorForm} onOpenChange={setShowDonorForm}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Heart className="h-4 w-4" /> Register Donor</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Register New Donor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDonorSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={newDonor.name} onChange={handleDonorInputChange} placeholder="Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select name="bloodType" value={newDonor.bloodType} onValueChange={(value) => setNewDonor((prev) => ({ ...prev, bloodType: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input id="contact" name="contact" value={newDonor.contact} onChange={handleDonorInputChange} placeholder="Email or phone" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select name="relationship" value={newDonor.relationship} onValueChange={(value) => setNewDonor((prev) => ({ ...prev, relationship: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                <Textarea id="healthStatus" name="healthStatus" value={newDonor.healthStatus} onChange={handleDonorInputChange} placeholder="Status" required />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowDonorForm(false)}>Cancel</Button>
                <Button type="submit">Register</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Donors</CardTitle>
          <CardDescription>Manage and communicate with donors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  )
}