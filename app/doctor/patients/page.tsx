"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, FileText, Calendar, Pill, Eye, Edit, Trash2, Plus } from "lucide-react"
import Link from "next/link"

// Sample patient data
const patients = [
  {
    id: "PT-12345",
    name: "John Doe",
    age: 50,
    gender: "Male",
    diagnosis: "End-Stage Renal Disease",
    status: "Critical",
    lastVisit: "Apr 30, 2025",
    nextAppointment: "May 15, 2025",
  },
  {
    id: "PT-23456",
    name: "Sarah Smith",
    age: 45,
    gender: "Female",
    diagnosis: "Chronic Kidney Disease Stage 4",
    status: "Stable",
    lastVisit: "Apr 28, 2025",
    nextAppointment: "May 20, 2025",
  },
  {
    id: "PT-34567",
    name: "Mike Johnson",
    age: 62,
    gender: "Male",
    diagnosis: "Kidney Transplant Recipient",
    status: "Stable",
    lastVisit: "Apr 25, 2025",
    nextAppointment: "May 25, 2025",
  },
  {
    id: "PT-45678",
    name: "Emily Davis",
    age: 38,
    gender: "Female",
    diagnosis: "Polycystic Kidney Disease",
    status: "Stable",
    lastVisit: "Apr 22, 2025",
    nextAppointment: "May 22, 2025",
  },
  {
    id: "PT-56789",
    name: "Robert Wilson",
    age: 55,
    gender: "Male",
    diagnosis: "Diabetic Nephropathy",
    status: "Deteriorating",
    lastVisit: "Apr 20, 2025",
    nextAppointment: "May 10, 2025",
  },
  {
    id: "PT-67890",
    name: "Jennifer Brown",
    age: 42,
    gender: "Female",
    diagnosis: "Lupus Nephritis",
    status: "Improving",
    lastVisit: "Apr 18, 2025",
    nextAppointment: "May 18, 2025",
  },
  {
    id: "PT-78901",
    name: "David Lee",
    age: 70,
    gender: "Male",
    diagnosis: "Glomerulonephritis",
    status: "Critical",
    lastVisit: "Apr 15, 2025",
    nextAppointment: "May 5, 2025",
  },
  {
    id: "PT-89012",
    name: "Lisa Martinez",
    age: 48,
    gender: "Female",
    diagnosis: "Chronic Kidney Disease Stage 3",
    status: "Stable",
    lastVisit: "Apr 12, 2025",
    nextAppointment: "May 12, 2025",
  },
  {
    id: "PT-90123",
    name: "James Taylor",
    age: 58,
    gender: "Male",
    diagnosis: "Hypertensive Nephropathy",
    status: "Stable",
    lastVisit: "Apr 10, 2025",
    nextAppointment: "May 10, 2025",
  },
  {
    id: "PT-01234",
    name: "Maria Garcia",
    age: 52,
    gender: "Female",
    diagnosis: "IgA Nephropathy",
    status: "Improving",
    lastVisit: "Apr 8, 2025",
    nextAppointment: "May 8, 2025",
  },
]

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Filter and sort patients
  const filteredPatients = patients
    .filter((patient) => {
      // Apply search filter
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())

      // Apply status filter
      const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Apply sorting
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
      case "critical":
        return "destructive"
      case "deteriorating":
        return "default"
      case "stable":
        return "outline"
      case "improving":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-muted-foreground">View and manage your patients</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/patients/add">
            <Plus className="h-4 w-4" />
            Add New Patient
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Manage and view detailed information about your patients</CardDescription>
        </CardHeader>
        <CardContent>
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
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="deteriorating">Deteriorating</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="improving">Improving</SelectItem>
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
                    <SelectItem value="lastVisit">Last Visit</SelectItem>
                    <SelectItem value="nextAppointment">Next Appointment</SelectItem>
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
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No patients found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{`${patient.age} / ${patient.gender}`}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>{patient.lastVisit}</TableCell>
                      <TableCell>{patient.nextAppointment}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/patients/${patient.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/patients/${patient.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Patient
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/patients/${patient.id}/medical-records`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Medical Records
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/patients/${patient.id}/appointments`}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Appointments
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/patients/${patient.id}/prescriptions`}>
                                <Pill className="mr-2 h-4 w-4" />
                                Prescriptions
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
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
    </div>
  )
}

