import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { Clock, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

interface Appointment {
  id: number
  type: string
  date: string
  time: string
  location: string
  notes: string
}

interface AppointmentListProps {
  selectedDate?: Date
}

interface AppointmentListProps {
  selectedDate?: Date
}

export default function AppointmentList({ selectedDate }: AppointmentListProps) {
  const [filteredAppointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const query = selectedDate
          ? `?date=${format(selectedDate, "yyyy-MM-dd")}`
          : ""
        const response = await fetch(`/api/appointments${query}`)
        if (!response.ok) {
          console.error("Failed to fetch appointments")
          return
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [selectedDate])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDate ? `Appointments on ${format(selectedDate, "MMMM d, yyyy")}` : "Upcoming Appointments"}
        </CardTitle>
        <CardDescription>
          {filteredAppointments.length === 0
            ? "No appointments scheduled for this date"
            : `${filteredAppointments.length} appointment(s) scheduled`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No appointments found for the selected date.</div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Badge variant={appointment.type === "Dialysis" ? "destructive" : "secondary"} className="mr-2">
                      {appointment.type}
                    </Badge>
                    <span className="text-sm font-medium">{format(appointment.date, "MMMM d, yyyy")}</span>
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

