"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarPlus, Clock } from "lucide-react"
import AppointmentList from "@/components/appointment-list"
import request from "@/lib/request"

const formSchema = z.object({
  type: z.string({
    required_error: "Please select an appointment type.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  location: z.string().min(1, {
    message: "Please select a location.",
  }),
  notes: z.string().optional(),
})

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editAppointment, setEditAppointment] = useState<any | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  })

  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      date: new Date(),
      time: "",
      location: "",
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues = {
        ...values,
        date: new Date(values.date),
      }

      const response = await request("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error saving appointment:", errorData)
        setMessage({ type: "error", text: errorData.error || "Failed to schedule appointment. Please try again." })
        return
      }

      setMessage({ type: "success", text: "Appointment scheduled successfully!" })
      setRefreshKey((prev) => prev + 1)
      setTimeout(() => {
        setOpen(false)
        setMessage(null)
        form.reset()
      }, 2000)
    } catch (error) {
      console.error("An error occurred:", error)
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    }
  }

  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    if (!editAppointment) return

    try {
      const formattedValues = {
        id: editAppointment.id,
        ...values,
        date: new Date(values.date),
      }

      const response = await request("/api/appointments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedValues),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error updating appointment:", errorData)
        setMessage({ type: "error", text: errorData.error || "Failed to update appointment. Please try again." })
        return
      }

      setMessage({ type: "success", text: "Appointment updated successfully!" })
      setRefreshKey((prev) => prev + 1)
      setTimeout(() => {
        setEditOpen(false)
        setMessage(null)
        setEditAppointment(null)
        editForm.reset()
      }, 2000)
    } catch (error) {
      console.error("An error occurred:", error)
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    }
  }

  const handleEdit = (appointment: any) => {
    setEditAppointment(appointment)
    editForm.reset({
      type: appointment.type,
      date: new Date(appointment.date),
      time: appointment.time,
      location: appointment.location,
      notes: appointment.notes || "",
    })
    setEditOpen(true)
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
        console.error("Error deleting appointment:", errorData)
        setMessage({ type: "error", text: errorData.error || "Failed to delete appointment. Please try again." })
        return
      }

      setMessage({ type: "success", text: "Appointment deleted successfully!" })
      setRefreshKey((prev) => prev + 1)
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      console.error("An error occurred:", error)
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setMessage(null)
        }}>
          <DialogTrigger asChild>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Book a new appointment for dialysis or consultation.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || date.getDay() === 0
                        }}
                        className="border rounded-md"
                      />
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
          setMessage(null)
          setEditAppointment(null)
          editForm.reset()
        }
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update the details of your appointment.</DialogDescription>
          </DialogHeader>
          {message && (
            <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
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
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0
                      }}
                      className="border rounded-md"
                    />
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Select a date to view appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <Clock className="inline-block mr-1 h-4 w-4" />
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </div>
          </CardContent>
        </Card>

        <AppointmentList selectedDate={date} onEdit={handleEdit} onDelete={handleDelete} refreshKey={refreshKey} />
      </div>
    </div>
  )
}