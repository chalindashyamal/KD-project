import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// In a real app, this would come from an API or database
const appointments = [
  {
    id: 1,
    type: "Dialysis",
    date: "Tomorrow",
    time: "10:00 AM - 1:00 PM",
    location: "Memorial Hospital, Room 302",
    notes: "Bring updated medication list",
  },
  {
    id: 2,
    type: "Nephrology Checkup",
    date: "May 15, 2025",
    time: "2:30 PM",
    location: "Dr. Smith's Office",
    notes: "Blood work required before visit",
  },
  {
    id: 3,
    type: "Nutritionist",
    date: "May 20, 2025",
    time: "11:00 AM",
    location: "Kidney Care Center",
    notes: "Bring food diary",
  },
]

export default function UpcomingAppointments() {
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

