import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Plus } from "lucide-react"
import Link from "next/link"

interface PatientAppointmentsProps {
  patientId: string
}

export function PatientAppointments({ patientId }: PatientAppointmentsProps) {
  // In a real app, this would come from an API or database based on the patientId
  const appointments = [
    {
      id: 1,
      type: "Dialysis",
      date: "April 30, 2025",
      time: "10:00 AM - 1:00 PM",
      location: "Memorial Hospital, Room 302",
      notes: "Bring updated medication list",
      status: "Completed",
    },
    {
      id: 2,
      type: "Nephrology Checkup",
      date: "May 15, 2025",
      time: "2:30 PM",
      location: "Dr. Smith's Office",
      notes: "Blood work required before visit",
      status: "Scheduled",
    },
    {
      id: 3,
      type: "Nutritionist",
      date: "May 20, 2025",
      time: "11:00 AM",
      location: "Kidney Care Center",
      notes: "Bring food diary",
      status: "Scheduled",
    },
  ]

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

