"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import request from "@/lib/request"
import { format, isSameDay } from "date-fns"

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

export function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await request(`/api/appointments?date=${format(new Date(), "yyyy-MM-dd")}`)
        const data = await response.json()
        setAppointments(data.map((appointment: any) => ({
          ...appointment,
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          date: new Date(appointment.date), // Convert string date to Date object
          status: appointment.status || "scheduled", // Default status if not provided
        })))
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [])


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
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt={appointment.patientName} />
            <AvatarFallback>
              {appointment.patientName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.patientId}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(appointment.status)} className="mt-1 sm:mt-0">
                {appointment.status}
              </Badge>
            </div>
            <p className="text-sm mt-1">{appointment.type}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>
                  {appointment.time} ({appointment.duration})
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                <span>{appointment.location}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link href={`/doctor/appointments/${appointment.id}`}>Start</Link>
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/doctor/appointments">
          <Calendar className="mr-2 h-4 w-4" />
          View Full Schedule
        </Link>
      </Button>
    </div>
  )
}

