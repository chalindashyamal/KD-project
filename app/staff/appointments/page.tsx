"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Filter, MapPin, Plus, Search, Pencil, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import request from "@/lib/request"

interface Appointment {
  id: string
  patientName: string
  patientId: string
  type: string
  date: Date
  time: string
  location: string
  status: string
  notes?: string
}

const formSchema = z.object({
  patientId: z.string().min(1, { message: "Please select a patient ID." }),
  type: z.string({ required_error: "Please select an appointment type." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time." }),
  location: z.string().min(1, { message: "Please select a location." }),
  notes: z.string().optional(),
})

export default function DoctorAppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentsVersion, setAppointmentsVersion] = useState(1)
  const [editOpen, setEditOpen] = useState(false)
  const [editAppointment, setEditAppointment] = useState<Appointment | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      type: "",
      date: new Date(),
      time: "",
      location: "",
      notes: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      type: "",
      date: new Date(),
      time: "",
      location: "",
      notes: "",
    },
  })

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await request("/api/appointments")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch appointments")
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Invalid response: Expected an array of appointments")
        }
        setAppointments(data.map((appointment: any) => ({
          ...appointment,
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          date: new Date(appointment.date),
          status: appointment.status || "scheduled",
        })))
      } catch (error: any) {
        console.error("Error fetching appointments:", error)
        setMessage({ type: "error", text: error.message || "Failed to fetch appointments. Please try again." })
        setAppointments([])
      }
    }

    fetchAppointments()
  }, [appointmentsVersion])

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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await request("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: values.date,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create appointment")
      }

      setMessage({ type: "success", text: "Appointment scheduled successfully!" })
      setAppointmentsVersion((prev) => prev + 1)
      setTimeout(() => {
        form.reset()
        setMessage(null)
      }, 2000)
    } catch (error: any) {
      console.error("Error creating appointment:", error)
      setMessage({ type: "error", text: error.message || "Failed to create appointment. Please try again." })
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditAppointment(appointment)
    editForm.reset({
      patientId: appointment.patientId,
      type: appointment.type,
      date: new Date(appointment.date),
      time: appointment.time,
      location: appointment.location,
      notes: appointment.notes || "",
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!editAppointment) return

    try {
      const response = await request("/api/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editAppointment.id,
          ...values,
          date: values.date,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update appointment")
      }

      setMessage({ type: "success", text: "Appointment updated successfully!" })
      setAppointmentsVersion((prev) => prev + 1)
      setTimeout(() => {
        setEditOpen(false)
        setEditAppointment(null)
        setMessage(null)
        editForm.reset()
      }, 2000)
    } catch (error: any) {
      console.error("Error updating appointment:", error)
      setMessage({ type: "error", text: error.message || "Failed to update appointment. Please try again." })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return

    try {
      const response = await request("/api/appointments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete appointment")
      }

      setMessage({ type: "success", text: "Appointment deleted successfully!" })
      setAppointmentsVersion((prev) => prev + 1)
      setTimeout(() => setMessage(null), 2000)
    } catch (error: any) {
      console.error("Error deleting appointment:", error)
      setMessage({ type: "error", text: error.message || "Failed to delete appointment. Please try again." })
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Book a new appointment for a patient.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter patient ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dialysis">Dialysis Session</SelectItem>
                          <SelectItem value="nephrology">Nephrology Consultation</SelectItem>
                          <SelectItem value="nutrition">Nutritionist Consultation</SelectItem>
                          <SelectItem value="social">Social Worker</SelectItem>
                          <SelectItem value="transplant">Transplant Evaluation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return date < today || date.getDay() === 0
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Memorial Hospital Dialysis Unit">Memorial Hospital Dialysis Unit</SelectItem>
                          <SelectItem value="Kidney Care Center">Kidney Care Center</SelectItem>
                          <SelectItem value="City Nephrology Clinic">City Nephrology Clinic</SelectItem>
                          <SelectItem value="Telehealth Appointment">Telehealth Appointment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requests or information for this appointment"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Schedule Appointment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(isOpen) => {
        setEditOpen(isOpen)
        if (!isOpen) {
          setEditAppointment(null)
          setMessage(null)
          editForm.reset()
        }
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update the details of the appointment.</DialogDescription>
          </DialogHeader>
          {message && (
            <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4 py-4">
              <FormField
                control={editForm.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter patient ID"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dialysis">Dialysis Session</SelectItem>
                        <SelectItem value="nephrology">Nephrology Consultation</SelectItem>
                        <SelectItem value="nutrition">Nutritionist Consultation</SelectItem>
                        <SelectItem value="social">Social Worker</SelectItem>
                        <SelectItem value="transplant">Transplant Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            return date < today || date.getDay() === 0
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Memorial Hospital Dialysis Unit">Memorial Hospital Dialysis Unit</SelectItem>
                        <SelectItem value="Kidney Care Center">Kidney Care Center</SelectItem>
                        <SelectItem value="City Nephrology Clinic">City Nephrology Clinic</SelectItem>
                        <SelectItem value="Telehealth Appointment">Telehealth Appointment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or information for this appointment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
                    <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(appointment)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  )
}