"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import request from "@/lib/request"
import { format } from "date-fns"

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

export function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        console.log("Fetching appointments for date:", today);
        const response = await request(`/api/appointments?date=${today}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Fetch appointments error response:", errorData);
          let errorMessage = errorData.error || "Failed to fetch appointments";
          if (errorData.error.includes("patientId") || errorData.error.includes("role")) {
            errorMessage = "Authentication error: Please log in as a doctor or staff member";
          }
          throw new Error(errorMessage);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("Invalid response data:", data);
          throw new Error("Invalid response: Expected an array of appointments");
        }
        setAppointments(data.map((appointment: any) => ({
          ...appointment,
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          date: new Date(appointment.date),
          status: appointment.status || "scheduled",
        })));
        setError(null);
      } catch (error: any) {
        console.error("Error fetching appointments:", error.message, error.stack);
        setError(error.message || "Failed to fetch appointments. Please try again.");
        setAppointments([]);
      }
    }

    fetchAppointments();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "checked in":
        return "default";
      case "in progress":
        return "secondary";
      case "completed":
        return "outline";
      case "scheduled":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
      )}
      {appointments.length === 0 && !error ? (
        <div className="p-4 text-center text-muted-foreground">
          No appointments scheduled for today.
        </div>
      ) : (
        appointments.map((appointment) => (
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
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-1 h-3 w-3" />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </div>
            
          </div>
        ))
      )}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/doctor/appointments">
          <Calendar className="mr-2 h-4 w-4" />
          View Full Schedule
        </Link>
      </Button>
    </div>
  );
}