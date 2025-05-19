"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, ArrowRight, CheckCircle2, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import request from "@/lib/request"

type MedicationAPI = {
  id: number
  patientId: string
  patient: { firstName: string; lastName: string }
  name: string
  dosage: string
  times: string[]
  instructions: string
  status: { time: string; taken: boolean, AdministeredBy?: string }[]
}

type Medication = {
  id: number
  patientId: string
  patientName: string
  name: string
  dosage: string
  times: string[]
  instructions: string
  status: { time: string; taken: boolean; AdministeredBy?: string }[]
}

type MedicationHistoryItem = {
  id: number
  patientId: string
  patientName: string
  medication: string
  dosage: string
  administeredBy: string
  administeredAt: string
  status: string
  notes?: string
}

export default function StaffMedicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showAdministerForm, setShowAdministerForm] = useState(false)
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationsVersion, updateMedicationsVersion] = useState(1)

  const [medicationHistory, setMedicationHistory] = useState<MedicationHistoryItem[]>([])

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await request("/api/medication-schedule")
        if (!response.ok) {
          throw new Error("Failed to fetch medications")
        }
        const data = await response.json() as MedicationAPI[]
        setMedications(data.map((med) => ({
          ...med,
          patientName: `${med.patient.firstName} ${med.patient.lastName}`,
        })))
        setMedicationHistory(data.map((med) => ({
          id: med.id,
          patientId: med.patientId,
          patientName: `${med.patient.firstName} ${med.patient.lastName}`,
          medication: med.name,
          dosage: med.dosage,
          administeredBy: med.status[0].AdministeredBy || "",
          administeredAt: med.status[0].time,
          status: med.status[0].taken ? "Administered" : "Pending",
          notes: med.instructions,
        })))
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [medicationsVersion])

  const [newAdministration, setNewAdministration] = useState({
    patientName: "",
    patientId: "",
    medication: "",
    dosage: "",
    route: "",
    administeredBy: "",
    administeredAt: new Date(),
    notes: "",
  })

  // Filter medications based on search query
  const filteredMedications = medications.filter(
    (med) =>
      med.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter medication history based on search query
  const filteredHistory = medicationHistory.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.medication.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAdministration((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await request("/api/medication-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: newAdministration.patientId,
          medication: newAdministration.medication,
          time: newAdministration.administeredAt,
          administeredBy: newAdministration.administeredBy,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark medication as taken")
      }

      updateMedicationsVersion((prev) => prev + 1) // Trigger re-fetch

      setNewAdministration({
        patientName: "",
        patientId: "",
        medication: "",
        dosage: "",
        route: "",
        administeredBy: "",
        administeredAt: new Date(),
        notes: "",
      })
      setShowAdministerForm(false)
    } catch (error) {
      console.error("Error marking medication as taken:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">Manage and administer patient medications</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search medications, patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={showAdministerForm} onOpenChange={setShowAdministerForm}>
          <DialogTrigger asChild>
            <Button className="ml-4">Administer Medication</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Administer Medication</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newAdministration.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={newAdministration.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Select
                    name="medication"
                    value={newAdministration.medication}
                    onValueChange={(value) => setNewAdministration((prev) => ({ ...prev, medication: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tacrolimus">Tacrolimus</SelectItem>
                      <SelectItem value="Mycophenolate">Mycophenolate</SelectItem>
                      <SelectItem value="Prednisone">Prednisone</SelectItem>
                      <SelectItem value="Epoetin alfa">Epoetin alfa</SelectItem>
                      <SelectItem value="Calcium carbonate">Calcium carbonate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={newAdministration.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 2mg"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Select
                    name="route"
                    value={newAdministration.route}
                    onValueChange={(value) => setNewAdministration((prev) => ({ ...prev, route: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Oral">Oral</SelectItem>
                      <SelectItem value="Subcutaneous">Subcutaneous</SelectItem>
                      <SelectItem value="Intravenous">Intravenous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="administeredBy">Administered By</Label>
                  <Input
                    id="administeredBy"
                    name="administeredBy"
                    value={newAdministration.administeredBy}
                    onChange={handleInputChange}
                    placeholder="Enter nurse/staff name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Administered At</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newAdministration.administeredAt
                        ? format(newAdministration.administeredAt, "PPP, h:mm a")
                        : <span>Pick a date and time</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newAdministration.administeredAt}
                      onSelect={(selectedDate) =>
                        setNewAdministration((prev) => ({ ...prev, administeredAt: selectedDate || new Date() }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={newAdministration.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any notes (optional)"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowAdministerForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Administration</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Prescriptions</CardTitle>
          <CardDescription>View and manage all patient prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, ID, or medication..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage & Frequency</TableHead>
                 
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No prescriptions found for the selected criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMedications.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        <div className="font-medium">{prescription.patientName}</div>
                        <div className="text-xs text-muted-foreground">{prescription.patientId}</div>
                      </TableCell>
                      <TableCell>{prescription.name}</TableCell>
                      <TableCell>
                        <div>{prescription.dosage}</div>
                        <div className="text-xs text-muted-foreground">{prescription.instructions}</div>
                      </TableCell>
                      
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}