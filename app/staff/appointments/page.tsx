"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Filter, MapPin, Plus, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import request from "@/lib/request"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  type: string
  date: Date
  time: string
  duration: string
  location: string
  status: string
}

export default function DoctorAppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentsVersion,setAppointmentsVersion] = useState(1)

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientId: "",
    type: "",
    date: new Date(),
    time: "",
    duration: "",
    location: "",
  })

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await request("/api/appointments")
        const data = await response.json()
        setAppointments(data.map((appointment: any) => ({
          ...appointment,
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          date: new Date(appointment.date), // Convert string date to Date object
          status: appointment.status || "scheduled", // Default to "scheduled" if status is not provided
        })))
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [appointmentsVersion])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAppointment((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await request("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAppointment,
          date: newAppointment.date, // Convert date to ISO string
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create appointment")
      }

      const createdAppointment = await response.json()
      //setAppointments((prev) => [...prev, createdAppointment]) // Add the new appointment to the list
      setNewAppointment({
        patientName: "",
        patientId: "",
        type: "",
        date: new Date(),
        time: "",
        duration: "",
        location: "",
      })
      setShowScheduleForm(false)
      setAppointmentsVersion(appointmentsVersion+1)
    } catch (error) {
      console.error("Error creating appointment:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newAppointment.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={newAppointment.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    name="type"
                    value={newAppointment.type}
                    onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nephrology Consultation">Nephrology Consultation</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Transplant Evaluation">Transplant Evaluation</SelectItem>
                      <SelectItem value="New Patient">New Patient</SelectItem>
                      <SelectItem value="Dialysis Follow-up">Dialysis Follow-up</SelectItem>
                      <SelectItem value="Medication Review">Medication Review</SelectItem>
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newAppointment.date ? format(newAppointment.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newAppointment.date}
                        onSelect={(selectedDate) =>
                          setNewAppointment((prev) => ({ ...prev, date: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      name="time"
                      value={newAppointment.time}
                      onChange={handleInputChange}
                      placeholder="e.g., 10:30 AM"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={newAppointment.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 min"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={newAppointment.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Exam Room 1"
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowScheduleForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-80">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
            
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
                          <div className="text-xs text-muted-foreground">{appointment.duration ?? ''}</div>
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
                          <Button variant="outline" size="sm">
                            View
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