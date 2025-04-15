import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isSameDay } from "date-fns"
import { Clock, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// In a real app, this would come from an API or database
const appointments = [
  {
    id: 1,
    type: "Dialysis",
    date: new Date(2025, 3, 30), // April 30, 2025
    time: "10:00 AM - 1:00 PM",
    location: "Memorial Hospital, Room 302",
    notes: "Bring updated medication list",
  },
  {
    id: 2,
    type: "Nephrology Checkup",
    date: new Date(2025, 4, 15), // May 15, 2025
    time: "2:30 PM",
    location: "Dr. Smith's Office",
    notes: "Blood work required before visit",
  },
  {
    id: 3,
    type: "Nutritionist",
    date: new Date(2025, 4, 20), // May 20, 2025
    time: "11:00 AM",
    location: "Kidney Care Center",
    notes: "Bring food diary",
  },
  {
    id: 4,
    type: "Dialysis",
    date: new Date(2025, 4, 2), // May 2, 2025
    time: "10:00 AM - 1:00 PM",
    location: "Memorial Hospital, Room 302",
    notes: "",
  },
  {
    id: 5,
    type: "Dialysis",
    date: new Date(2025, 4, 5), // May 5, 2025
    time: "10:00 AM - 1:00 PM",
    location: "Memorial Hospital, Room 302",
    notes: "",
  },
]

interface AppointmentListProps {
  selectedDate?: Date
}

export default function AppointmentList({ selectedDate }: AppointmentListProps) {
  // Filter appointments based on selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((appointment) => isSameDay(appointment.date, selectedDate))
    : appointments.sort((a, b) => a.date.getTime() - b.date.getTime())

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

