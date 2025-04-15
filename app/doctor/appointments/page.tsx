"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Filter, MapPin, Plus, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import Link from "next/link"

export default function DoctorAppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample appointment data
  const appointments = [
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      type: "Nephrology Consultation",
      date: new Date(2025, 3, 30), // April 30, 2025
      time: "10:30 AM",
      duration: "30 min",
      location: "Exam Room 3",
      status: "Checked In",
    },
    {
      id: 2,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      type: "Follow-up",
      date: new Date(2025, 3, 30), // April 30, 2025
      time: "11:15 AM",
      duration: "20 min",
      location: "Exam Room 1",
      status: "Scheduled",
    },
    {
      id: 3,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      type: "Transplant Evaluation",
      date: new Date(2025, 3, 30), // April 30, 2025
      time: "1:00 PM",
      duration: "45 min",
      location: "Exam Room 2",
      status: "Scheduled",
    },
    {
      id: 4,
      patientId: "PT-45678",
      patientName: "Emily Davis",
      type: "New Patient",
      date: new Date(2025, 3, 30), // April 30, 2025
      time: "2:30 PM",
      duration: "60 min",
      location: "Exam Room 3",
      status: "Scheduled",
    },
    {
      id: 5,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      date: new Date(2025, 4, 1), // May 1, 2025
      type: "Dialysis Follow-up",
      time: "9:00 AM",
      duration: "30 min",
      location: "Exam Room 1",
      status: "Scheduled",
    },
    {
      id: 6,
      patientId: "PT-67890",
      patientName: "Jennifer Brown",
      date: new Date(2025, 4, 1), // May 1, 2025
      type: "Medication Review",
      time: "10:00 AM",
      duration: "20 min",
      location: "Exam Room 2",
      status: "Scheduled",
    },
  ]

  // Filter appointments based on selected date, search query, and status filter
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesDate = date
      ? appointment.date.getDate() === date.getDate() &&
        appointment.date.getMonth() === date.getMonth() &&
        appointment.date.getFullYear() === date.getFullYear()
      : true

    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesDate && matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "checked in":
        return "default"
      case "in progress":
        return "secondary"
      case "completed":
        return "outline"
      case "scheduled":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/appointments/schedule">
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-80">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
            <div className="mt-4 grid gap-2">
              <Button variant="outline" className="w-full justify-start text-left font-normal" asChild>
                <Link href="/doctor/appointments/today">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Today's Appointments
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal" asChild>
                <Link href="/doctor/appointments/week">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  This Week
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-left font-normal" asChild>
                <Link href="/doctor/appointments/month">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  This Month
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{date ? `Appointments for ${format(date, "MMMM d, yyyy")}` : "All Appointments"}</CardTitle>
            <CardDescription>{filteredAppointments.length} appointment(s) scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or type..."
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
                    <SelectItem value="checked in">Checked In</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No appointments found for the selected criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-xs text-muted-foreground">{appointment.patientId}</div>
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">({appointment.duration})</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>{appointment.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor/appointments/${appointment.id}`}>View</Link>
                          </Button>
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
    </div>
  )
}

