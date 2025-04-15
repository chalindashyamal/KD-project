"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, FileText, Download } from "lucide-react"
import Link from "next/link"

export default function DoctorMedicalRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [recordTypeFilter, setRecordTypeFilter] = useState("all")

  // Sample medical records data
  const medicalRecords = [
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      recordType: "Progress Note",
      date: "April 28, 2025",
      provider: "Dr. James Wilson",
      description: "Follow-up appointment for ESRD management",
    },
    {
      id: 2,
      patientId: "PT-12345",
      patientName: "John Doe",
      recordType: "Dialysis Report",
      date: "April 25, 2025",
      provider: "Nurse Emily Adams",
      description: "Routine hemodialysis session report",
    },
    {
      id: 3,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      recordType: "Progress Note",
      date: "April 27, 2025",
      provider: "Dr. James Wilson",
      description: "Evaluation of hypertension management",
    },
    {
      id: 4,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      recordType: "Transplant Evaluation",
      date: "April 26, 2025",
      provider: "Dr. Priya Patel",
      description: "Initial transplant candidacy assessment",
    },
    {
      id: 5,
      patientId: "PT-45678",
      patientName: "Emily Davis",
      recordType: "Nutrition Consultation",
      date: "April 24, 2025",
      provider: "Dietitian Sarah Johnson",
      description: "Dietary recommendations for CKD management",
    },
    {
      id: 6,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      recordType: "Procedure Note",
      date: "April 20, 2025",
      provider: "Dr. Lisa Chen",
      description: "AV fistula creation procedure",
    },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Records</h1>
          <p className="text-muted-foreground">View and manage patient medical records</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/medical-records/create">
            <Plus className="h-4 w-4" />
            Create Record
          </Link>
        </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
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
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor/medical-records/${record.id}`}>View</Link>
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Download className="h-3 w-3" />
                            PDF
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

