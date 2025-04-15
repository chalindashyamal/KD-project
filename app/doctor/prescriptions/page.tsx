"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, FileText, Calendar, Pill } from "lucide-react"
import Link from "next/link"

export default function DoctorPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample prescription data
  const prescriptions = [
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      medication: "Tacrolimus",
      dosage: "2mg",
      frequency: "Twice daily",
      prescribedDate: "April 15, 2025",
      expiryDate: "October 15, 2025",
      refills: 3,
      status: "Active",
    },
    {
      id: 2,
      patientId: "PT-12345",
      patientName: "John Doe",
      medication: "Mycophenolate",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedDate: "April 15, 2025",
      expiryDate: "October 15, 2025",
      refills: 2,
      status: "Active",
    },
    {
      id: 3,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      medication: "Prednisone",
      dosage: "5mg",
      frequency: "Once daily",
      prescribedDate: "March 20, 2025",
      expiryDate: "September 20, 2025",
      refills: 5,
      status: "Active",
    },
    {
      id: 4,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      medication: "Tacrolimus",
      dosage: "1mg",
      frequency: "Twice daily",
      prescribedDate: "February 10, 2025",
      expiryDate: "August 10, 2025",
      refills: 0,
      status: "Needs Refill",
    },
    {
      id: 5,
      patientId: "PT-45678",
      patientName: "Emily Davis",
      medication: "Calcium Acetate",
      dosage: "667mg",
      frequency: "With meals",
      prescribedDate: "April 5, 2025",
      expiryDate: "October 5, 2025",
      refills: 4,
      status: "Active",
    },
    {
      id: 6,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      medication: "Ciprofloxacin",
      dosage: "500mg",
      frequency: "Twice daily for 7 days",
      prescribedDate: "April 10, 2025",
      expiryDate: "April 17, 2025",
      refills: 0,
      status: "Completed",
    },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="text-muted-foreground">Manage patient prescriptions and medications</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/prescriptions/create">
            <Plus className="h-4 w-4" />
            Write Prescription
          </Link>
        </Button>
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
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor/prescriptions/${prescription.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor/prescriptions/${prescription.id}/refill`}>Refill</Link>
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

