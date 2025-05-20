"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, FileText, Calendar, Activity, Eye, UserCog, Plus, Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import request from "@/lib/request"
import Link from "next/link"

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  age: number;
  gender: string;
  primaryDiagnosis: string;
  status: string;
  lastVisit: string;
  nextAppointment: string;
  address?: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

export default function StaffPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientsVersion, updatePatientsVersion] = useState(1);
  const [editPatient, setEditPatient] = useState<Patient | null>(null)
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null)
  const [editMessage, setEditMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Fetch patients from the API
  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const response = await request("/api/patients");
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data.map((patient: any) => ({
          ...patient,
          name: `${patient.firstName} ${patient.lastName}`,
          age: new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear(),
          primaryDiagnosis: patient.primaryDiagnosis,
        })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, [patientsVersion]);

  const [newCheckIn, setNewCheckIn] = useState({
    patientName: "",
    patientId: "",
    visitReason: "",
    checkInDate: new Date(),
  })

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "id") {
        return a.id.localeCompare(b.id)
      } else if (sortBy === "lastVisit") {
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
      } else if (sortBy === "nextAppointment") {
        return new Date(a.nextAppointment).getTime() - new Date(b.nextAppointment).getTime()
      }
      return 0
    })

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "hospitalized":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCheckIn((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditPatient((prev) => prev ? ({ ...prev, [name]: value }) : prev)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await request(`/api/patient/${newCheckIn.patientId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json()
        console.error(errorData)
        alert(errorData)
        return
      }

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === newCheckIn.patientId
            ? {
                ...patient,
                status: "Active",
              }
            : patient
        )
      )
      setNewCheckIn({
        patientName: "",
        patientId: "",
        visitReason: "",
        checkInDate: new Date(),
      })
      setShowCheckInForm(false)
    } catch (error) {
      console.error("An error occurred:", error)
      alert("An unexpected error occurred. Please try again.")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPatient) return

    try {
      const response = await request('/api/patients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editPatient.id,
          firstName: editPatient.firstName,
          lastName: editPatient.lastName,
          address: editPatient.address,
          phone: editPatient.phone,
          email: editPatient.email,
          emergencyContactName: editPatient.emergencyContactName,
          emergencyContactRelation: editPatient.emergencyContactRelation,
          emergencyContactPhone: editPatient.emergencyContactPhone,
        }),
      });

      if (!response.ok) throw new Error('Failed to update patient');
      const updatedPatient = await response.json();
      setPatients((prev) =>
        prev.map((p) =>
          p.id === updatedPatient.id
            ? {
                ...p,
                firstName: updatedPatient.firstName,
                lastName: updatedPatient.lastName,
                name: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
                address: updatedPatient.address,
                phone: updatedPatient.phone,
                email: updatedPatient.email,
                emergencyContactName: updatedPatient.emergencyContactName,
                emergencyContactRelation: updatedPatient.emergencyContactRelation,
                emergencyContactPhone: updatedPatient.emergencyContactPhone,
              }
            : p
        )
      );
      setEditMessage({ type: "success", text: "Patient updated successfully!" });
      setTimeout(() => {
        setShowEditForm(false);
        setEditPatient(null);
        setEditMessage(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error updating patient:', error);
      setEditMessage({ type: "error", text: `Failed to update patient: ${error.message}` });
    }
  };

  const handleDeletePatient = async () => {
    if (!deletePatientId) return;

    try {
      const response = await request('/api/patients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletePatientId }),
      });
      if (!response.ok) throw new Error('Failed to delete patient');
      setPatients((prev) => prev.filter((p) => p.id !== deletePatientId));
      setDeleteMessage({ type: "success", text: "Patient deleted successfully!" });
      setTimeout(() => {
        setDeleteMessage(null);
      }, 2000);
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      setDeleteMessage({ type: "error", text: `Failed to delete patient: ${error.message}` });
    } finally {
      setShowDeleteConfirm(false);
      setDeletePatientId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">View and manage patient information</p>
        </div>
        <div className="flex gap-4">
          <Button className="gap-2" asChild>
            <Link href="/staff/patients/add">
              <Plus className="h-4 w-4" />
              Add New Patient
            </Link>
          </Button>
          <Dialog open={showCheckInForm} onOpenChange={setShowCheckInForm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserCog className="h-4 w-4" />
                Check-in Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Check-in Patient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      name="patientName"
                      value={newCheckIn.patientName}
                      onChange={handleInputChange}
                      placeholder="Enter patient name"
                    />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      name="patientId"
                      value={newCheckIn.patientId}
                      onChange={handleInputChange}
                      placeholder="Enter patient ID"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitReason">Visit Reason</Label>
                  <Input
                    id="visitReason"
                    name="visitReason"
                    value={newCheckIn.visitReason}
                    onChange={handleInputChange}
                    placeholder="Enter reason for visit"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => setShowCheckInForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Check-in Patient</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>View and manage all registered patients</CardDescription>
        </CardHeader>
        <CardContent>
          {deleteMessage && (
            <div className={`p-4 rounded-md mb-4 ${deleteMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {deleteMessage.text}
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or diagnosis..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="hospitalized">Hospitalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="id">Patient ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No patients found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{`${patient.age} / ${patient.gender}`}</TableCell>
                      <TableCell>{patient.primaryDiagnosis}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setEditPatient(patient);
                              setShowEditForm(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setDeletePatientId(patient.id);
                              setShowDeleteConfirm(true);
                            }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Patient
                            </DropdownMenuItem>
                            
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditForm} onOpenChange={(open) => {
        setShowEditForm(open);
        if (!open) {
          setEditPatient(null);
          setEditMessage(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editMessage && (
            <div className={`p-4 rounded-md ${editMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {editMessage.text}
            </div>
          )}
          {editPatient && (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={editPatient.firstName}
                    onChange={handleEditInputChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={editPatient.lastName}
                    onChange={handleEditInputChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={editPatient.address || ""}
                  onChange={handleEditInputChange}
                  placeholder="Enter address"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editPatient.phone || ""}
                    onChange={handleEditInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={editPatient.email || ""}
                    onChange={handleEditInputChange}
                    placeholder="Enter email"
                    type="email"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={editPatient.emergencyContactName || ""}
                    onChange={handleEditInputChange}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation">Emergency Contact Relation</Label>
                  <Input
                    id="emergencyContactRelation"
                    name="emergencyContactRelation"
                    value={editPatient.emergencyContactRelation || ""}
                    onChange={handleEditInputChange}
                    placeholder="Enter contact relation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={editPatient.emergencyContactPhone || ""}
                  onChange={handleEditInputChange}
                  placeholder="Enter contact phone"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowEditForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Patient</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={(open) => {
        setShowDeleteConfirm(open);
        if (!open) setDeletePatientId(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this patient? This action cannot be undone.</p>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePatient}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}