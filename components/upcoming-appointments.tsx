'use client';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import request from "@/lib/request"

interface Appointment {
  id: number
  type: string
  date: string
  time: string
  location: string
  notes: string
}

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await request("/api/appointments")
        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [])

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center">
                <Badge variant={appointment.type === "Dialysis" ? "destructive" : "secondary"} className="mr-2">
                  {appointment.type}
                </Badge>
                <span className="text-sm font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {appointment.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {appointment.location}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Appointment
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Cancel Appointment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {appointment.notes && (
            <div className="text-xs bg-muted p-2 rounded-md">
              <span className="font-semibold">Note:</span> {appointment.notes}
            </div>
          )}
        </div>
      ))}
      <Button variant="outline" className="w-full" size="sm">
        View All Appointments
      </Button>
    </div>
  )
}

