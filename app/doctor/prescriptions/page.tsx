"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, FileText, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"


type Prescription = {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  expiryDate: string;
  refills: number;
  status: string;
};


export default function DoctorPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    prescribedDate: new Date(),
    expiryDate: new Date(),
    refills: "0",
  })

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        setLoading(true);
        const response = await fetch("/api/prescriptions");
        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions.");
        }
        const data = await response.json();
        setPrescriptions(data.map((prescription: any) => ({
          ...prescription,
          patientName: `${prescription.patient.firstName} ${prescription.patient.lastName}`,
        })));
      } catch (err: any) {
        console.error("Error fetching prescriptions:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPrescriptions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter prescriptions based on search query and status filter
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || prescription.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "needs refill":
        return "destructive"
      case "completed":
        return "outline"
      case "discontinued":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPrescription((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: newPrescription.patientId,
          patientName: newPrescription.patientName,
          medication: newPrescription.medication,
          dosage: newPrescription.dosage,
          frequency: newPrescription.frequency,
          prescribedDate: newPrescription.prescribedDate.toISOString(),
          expiryDate: newPrescription.expiryDate.toISOString(),
          refills: newPrescription.refills,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create prescription.");
      }

      const createdPrescription = await response.json();
      createdPrescription.patientName = `${createdPrescription.patient.firstName} ${createdPrescription.patient.lastName}`;

      // Update the local state with the new prescription
      setPrescriptions([...prescriptions, createdPrescription]);

      // Reset the form
      setNewPrescription({
        patientName: "",
        patientId: "",
        medication: "",
        dosage: "",
        frequency: "",
        prescribedDate: new Date(),
        expiryDate: new Date(),
        refills: "0",
      });
      setShowPrescriptionForm(false);
    } catch (error) {
      console.error("Error creating prescription:", error);
      alert("Failed to create prescription.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">Manage patient prescriptions and medications</p>
        </div>
        <Dialog open={showPrescriptionForm} onOpenChange={setShowPrescriptionForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Write Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Write New Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newPrescription.patientName}
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
                    value={newPrescription.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Input
                    id="medication"
                    name="medication"
                    value={newPrescription.medication}
                    onChange={handleInputChange}
                    placeholder="Enter medication name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={newPrescription.dosage}
                    onChange={handleInputChange}
                    placeholder="e.g., 5mg"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={newPrescription.frequency}
                    onChange={handleInputChange}
                    placeholder="e.g., Twice daily"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refills">Refills</Label>
                  <Input
                    id="refills"
                    name="refills"
                    type="number"
                    value={newPrescription.refills}
                    onChange={handleInputChange}
                    placeholder="e.g., 0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prescribed Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newPrescription.prescribedDate
                          ? format(newPrescription.prescribedDate, "PPP")
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newPrescription.prescribedDate}
                        onSelect={(selectedDate) =>
                          setNewPrescription((prev) => ({ ...prev, prescribedDate: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newPrescription.expiryDate
                          ? format(newPrescription.expiryDate, "PPP")
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newPrescription.expiryDate}
                        onSelect={(selectedDate) =>
                          setNewPrescription((prev) => ({ ...prev, expiryDate: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowPrescriptionForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Write Prescription</Button>
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
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="needs refill">Needs Refill</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage & Frequency</TableHead>
                  <TableHead>Prescribed</TableHead>
                  <TableHead>Refills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No prescriptions found for the selected criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        <div className="font-medium">{prescription.patientName}</div>
                        <div className="text-xs text-muted-foreground">{prescription.patientId}</div>
                      </TableCell>
                      <TableCell>{prescription.medication}</TableCell>
                      <TableCell>
                        <div>{prescription.dosage}</div>
                        <div className="text-xs text-muted-foreground">{prescription.frequency}</div>
                      </TableCell>
                      <TableCell>
                        <div>{prescription.prescribedDate}</div>
                        <div className="text-xs text-muted-foreground">Expires: {prescription.expiryDate}</div>
                      </TableCell>
                      <TableCell>
                        {prescription.refills > 0 ? (
                          <Badge variant="outline">{prescription.refills} remaining</Badge>
                        ) : (
                          <Badge variant="destructive">No refills</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(prescription.status)}>{prescription.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Refill
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
    </div>
  )
}