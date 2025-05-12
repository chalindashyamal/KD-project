"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, Download, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import request from "@/lib/request"

type PatientRecord = {
  id: number;
  patientId: string;
  patientName: string;
  recordType: string;
  date: string; // ISO date string
  provider: string;
  description: string;
};

export default function DoctorMedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recordTypeFilter, setRecordTypeFilter] = useState("all")
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [medicalRecords, setMedicalRecords] = useState<PatientRecord[]>([])

  const [newRecord, setNewRecord] = useState({
    patientName: "",
    patientId: "",
    recordType: "",
    date: new Date(),
    provider: "",
    description: "",
  })

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
        setLoading(true);
        const response = await request("/api/medical-records");
        if (!response.ok) {
          throw new Error("Failed to fetch medical records.");
        }
        const data = await response.json();
        setMedicalRecords(data.map((record: any) => ({
          ...record,
          patientName: `${record.patient.firstName} ${record.patient.lastName}`,
        })));
      } catch (err: any) {
        console.error("Error fetching medical records:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicalRecords();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter medical records based on search query and record type filter
  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.provider.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = recordTypeFilter === "all" || record.recordType.toLowerCase() === recordTypeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRecord((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await request("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: newRecord.patientId,
          patientName: newRecord.patientName,
          recordType: newRecord.recordType,
          date: newRecord.date.toISOString(),
          provider: newRecord.provider,
          description: newRecord.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create medical record.");
      }

      const createdRecord = await response.json();
      createdRecord.patientName = `${createdRecord.patient.firstName} ${createdRecord.patient.lastName}`;

      // Update the local state with the new medical record
      setMedicalRecords([...medicalRecords, createdRecord]);

      // Reset the form
      setNewRecord({
        patientName: "",
        patientId: "",
        recordType: "",
        date: new Date(),
        provider: "",
        description: "",
      });
      setShowRecordForm(false);
    } catch (error) {
      console.error("Error creating medical record:", error);
      alert("Failed to create medical record.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">View and manage patient medical records</p>
        </div>
        <Dialog open={showRecordForm} onOpenChange={setShowRecordForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Medical Record</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newRecord.patientName}
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
                    value={newRecord.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type</Label>
                <Select
                  name="recordType"
                  value={newRecord.recordType}
                  onValueChange={(value) => setNewRecord((prev) => ({ ...prev, recordType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Progress Note">Progress Note</SelectItem>
                    <SelectItem value="Dialysis Report">Dialysis Report</SelectItem>
                    <SelectItem value="Transplant Evaluation">Transplant Evaluation</SelectItem>
                    <SelectItem value="Nutrition Consultation">Nutrition Consultation</SelectItem>
                    <SelectItem value="Procedure Note">Procedure Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newRecord.date ? format(newRecord.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={newRecord.date}
                      onSelect={(selectedDate) =>
                        setNewRecord((prev) => ({ ...prev, date: selectedDate || new Date() }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  name="provider"
                  value={newRecord.provider}
                  onChange={handleInputChange}
                  placeholder="Enter provider name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newRecord.description}
                  onChange={handleInputChange}
                  placeholder="Enter record description"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowRecordForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Record</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Medical Records</CardTitle>
          <CardDescription>Browse and search through patient medical records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, ID, provider, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[220px]">
              <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Record Types</SelectItem>
                  <SelectItem value="progress note">Progress Notes</SelectItem>
                  <SelectItem value="dialysis report">Dialysis Reports</SelectItem>
                  <SelectItem value="transplant evaluation">Transplant Evaluations</SelectItem>
                  <SelectItem value="nutrition consultation">Nutrition Consultations</SelectItem>
                  <SelectItem value="procedure note">Procedure Notes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Description</TableHead>
                
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No medical records found for the selected criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.patientName}</div>
                        <div className="text-xs text-muted-foreground">{record.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.recordType}</Badge>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                      <TableCell className="text-right">
                        
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