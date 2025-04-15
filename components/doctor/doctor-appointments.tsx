import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export function DoctorAppointments() {
  // Sample appointment data
  const appointments = [
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      type: "Nephrology Consultation",
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
      time: "2:30 PM",
      duration: "60 min",
      location: "Exam Room 3",
      status: "Scheduled",
    },
  ]

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

