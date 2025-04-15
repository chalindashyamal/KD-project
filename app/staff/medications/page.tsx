"use client"

import { useState } from "react"
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

export default function StaffMedicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showAdministerForm, setShowAdministerForm] = useState(false)
  const [medications] = useState([
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      medication: "Tacrolimus",
      dosage: "2mg",
      frequency: "Twice daily",
      route: "Oral",
      startDate: "Apr 15, 2025",
      endDate: "Ongoing",
      status: "Active",
      nextDue: "11:00 AM",
      lastAdministered: "Apr 30, 2025, 7:00 AM",
    },
    {
      id: 2,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      medication: "Mycophenolate",
      dosage: "500mg",
      frequency: "Twice daily",
      route: "Oral",
      startDate: "Apr 10, 2025",
      endDate: "Ongoing",
      status: "Active",
      nextDue: "11:30 AM",
      lastAdministered: "Apr 30, 2025, 7:30 AM",
    },
    {
      id: 3,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      medication: "Prednisone",
      dosage: "10mg",
      frequency: "Once daily",
      route: "Oral",
      startDate: "Apr 5, 2025",
      endDate: "May 5, 2025",
      status: "Active",
      nextDue: "8:00 AM (Tomorrow)",
      lastAdministered: "Apr 30, 2025, 8:00 AM",
    },
    {
      id: 4,
      patientId: "PT-45678",
      patientName: "Emily Davis",
      medication: "Epoetin alfa",
      dosage: "4000 units",
      frequency: "Three times weekly",
      route: "Subcutaneous",
      startDate: "Apr 1, 2025",
      endDate: "Ongoing",
      status: "Active",
      nextDue: "2:00 PM",
      lastAdministered: "Apr 28, 2025, 2:00 PM",
    },
    {
      id: 5,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      medication: "Calcium carbonate",
      dosage: "500mg",
      frequency: "Three times daily with meals",
      route: "Oral",
      startDate: "Mar 15, 2025",
      endDate: "Ongoing",
      status: "Active",
      nextDue: "12:00 PM",
      lastAdministered: "Apr 30, 2025, 8:00 AM",
    },
  ])
  const [medicationHistory, setMedicationHistory] = useState([
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      medication: "Tacrolimus",
      dosage: "2mg",
      administeredBy: "Nurse Emily Adams",
      administeredAt: "Apr 30, 2025, 7:00 AM",
      status: "Administered",
      notes: "Patient tolerated well",
    },
    {
      id: 2,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      medication: "Mycophenolate",
      dosage: "500mg",
      administeredBy: "Nurse Emily Adams",
      administeredAt: "Apr 30, 2025, 7:30 AM",
      status: "Administered",
      notes: "",
    },
    {
      id: 3,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      medication: "Prednisone",
      dosage: "10mg",
      administeredBy: "Nurse Emily Adams",
      administeredAt: "Apr 30, 2025, 8:00 AM",
      status: "Administered",
      notes: "Patient reported mild stomach discomfort",
    },
    {
      id: 4,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      medication: "Calcium carbonate",
      dosage: "500mg",
      administeredBy: "Nurse Emily Adams",
      administeredAt: "Apr 30, 2025, 8:00 AM",
      status: "Administered",
      notes: "",
    },
    {
      id: 5,
      patientId: "PT-12345",
      patientName: "John Doe",
      medication: "Tacrolimus",
      dosage: "2mg",
      administeredBy: "Nurse David Wilson",
      administeredAt: "Apr 29, 2025, 7:00 PM",
      status: "Administered",
      notes: "",
    },
  ])

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
      med.medication.toLowerCase().includes(searchQuery.toLowerCase()),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...medicationHistory.map((h) => h.id)) + 1
    setMedicationHistory([
      ...medicationHistory,
      {
        id: newId,
        patientId: newAdministration.patientId,
        patientName: newAdministration.patientName,
        medication: newAdministration.medication,
        dosage: newAdministration.dosage,
        administeredBy: newAdministration.administeredBy,
        administeredAt: format(newAdministration.administeredAt, "MMM d, yyyy, h:mm a"),
        status: "Administered",
        notes: newAdministration.notes,
      },
    ])
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

      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Doses</TabsTrigger>
          <TabsTrigger value="history">Administration History</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Medication Doses</CardTitle>
              <CardDescription>View and administer scheduled medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No medications found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMedications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell>
                            <div className="font-medium">{med.patientName}</div>
                            <div className="text-xs text-muted-foreground">{med.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{med.medication}</div>
                            <div className="text-xs text-muted-foreground">{med.route}</div>
                          </TableCell>
                          <TableCell>
                            <div>{med.dosage}</div>
                            <div className="text-xs text-muted-foreground">{med.frequency}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{med.nextDue}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Last: {med.lastAdministered}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={med.status === "Active" ? "default" : "secondary"}>{med.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                              <Button size="sm">
                                Administer
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Administration History</CardTitle>
              <CardDescription>View previously administered medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Administered By</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No administration history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.patientName}</div>
                            <div className="text-xs text-muted-foreground">{record.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{record.medication}</div>
                            <div className="text-xs text-muted-foreground">{record.dosage}</div>
                          </TableCell>
                          <TableCell>{record.administeredBy}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{record.administeredAt}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}