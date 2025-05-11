"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"
import request from "@/lib/request"

type Medication = {
  id: number
  name: string
  dosage: string
  time: string
  instructions: string
  taken: boolean
  takenAt?: Date
}

type MedicationAPI = {
  id: number
  name: string
  dosage: string
  times: string[]
  instructions: string
  status: { time: string; taken: boolean, takenAt?: Date }[]
}

export default function MedicationHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<string>("day")
  const [selectedHistory, setMedications] = useState<Medication[]>([])

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : ""

  useEffect(() => {
    async function fetchMedications() {
      try {
        const formattedDate = format(date || new Date(), "yyyy-MM-dd")
        const response = await request(`/api/medication-schedule?date=${formattedDate}`)
        if (!response.ok) {
          throw new Error("Failed to fetch medications")
        }
        const data = await response.json() as MedicationAPI[]
        setMedications(data.flatMap((medication) => {
          return medication.times.map((time) => ({
            id: medication.id,
            name: medication.name,
            dosage: medication.dosage,
            time,
            instructions: medication.instructions,
            taken: medication.status.find((status) => status.time === time)?.taken || false,
            takenAt: medication.status.find((status) => status.time === time)?.takenAt || undefined,
          }))
        }))
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [selectedDateStr])

  const adherenceRate = selectedHistory
    ? Math.round((selectedHistory.filter((m) => m.taken).length / selectedHistory.length) * 100)
    : 0

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Medication Calendar</CardTitle>
          <CardDescription>Select a date to view medication history</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="border rounded-md" />
          <div className="mt-4 text-center">
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-[180px] mx-auto">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily View</SelectItem>
                <SelectItem value="week">Weekly Summary</SelectItem>
                <SelectItem value="month">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medication History</CardTitle>
              <CardDescription>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</CardDescription>
            </div>
            {selectedHistory && (
              <Badge className={adherenceRate === 100 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                {adherenceRate}% Adherence
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!selectedHistory ? (
            <div className="text-center py-6 text-muted-foreground">
              No medication history available for the selected date.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedHistory.map((med, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.time}</TableCell>
                    <TableCell>
                      {med.taken ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Taken at {med.takenAt ? format(new Date(med.takenAt), "h:mm a") : ""}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Missed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

