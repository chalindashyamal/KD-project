"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import request from "@/lib/request"

type Appointment = {
  id: number;
  patientId: string;
  patientName: string;
  type: string;
  date: string; // ISO date string
  time: string;
  location: string;
  notes?: string;
};

type AppointmentListProps = {
  selectedDate: Date | undefined;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  refreshKey: number; // Add refreshKey to props
};

export default function AppointmentList({ selectedDate, onEdit, onDelete, refreshKey }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true)
        const response = await request("/api/appointments")
        if (!response.ok) {
          throw new Error("Failed to fetch appointments.")
        }
        const data = await response.json()
        setAppointments(data.map((appt: any) => ({
          ...appt,
          patientName: `${appt.patient.firstName} ${appt.patient.lastName}`,
        })))
      } catch (err: any) {
        console.error("Error fetching appointments:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [refreshKey]) // Add refreshKey to dependencies to trigger re-fetch

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const filteredAppointments = selectedDate
    ? appointments.filter((appt) => {
        const apptDate = new Date(appt.date)
        return (
          apptDate.getFullYear() === selectedDate.getFullYear() &&
          apptDate.getMonth() === selectedDate.getMonth() &&
          apptDate.getDate() === selectedDate.getDate()
        )
      })
    : appointments

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No appointments found for the selected date
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <Badge variant="outline">{appt.type}</Badge>
                    </TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.location}</TableCell>
                    <TableCell className="max-w-xs truncate">{appt.notes || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(appt)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(appt.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}