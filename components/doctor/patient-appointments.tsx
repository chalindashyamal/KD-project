import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Appointment {
  id: number
  type: string
  date: string
  time: string
  location: string
  notes: string
  status: string
}

interface PatientAppointmentsProps {
  patientId: string
}

export function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(`/api/appointments?patientId=${patientId}`)
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [patientId])

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "outline"
      case "scheduled":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upcoming Appointments</h3>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/doctor/appointments/schedule?patientId=${patientId}`}>
            <Plus className="h-4 w-4" />
            Schedule Appointment
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-start border-b pb-4 last:border-0">
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
                  {appointment.notes && (
                    <div className="text-xs bg-muted p-2 rounded-md mt-2">
                      <span className="font-semibold">Note:</span> {appointment.notes}
                    </div>
                  )}
                </div>
                <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href={`/doctor/patients/${patientId}/appointments`}>
          <Calendar className="h-4 w-4" />
          View All Appointments
        </Link>
      </Button>
    </div>
  )
}

