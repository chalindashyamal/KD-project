"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format, subDays } from "date-fns"

// In a real app, this would come from an API or database
const generateMedicationHistory = () => {
  const today = new Date()
  const history = []

  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i)
    const dateStr = format(date, "yyyy-MM-dd")

    history.push({
      date: dateStr,
      medications: [
        {
          name: "Tacrolimus",
          dosage: "2mg",
          time: "8:00 AM",
          taken: true,
          takenAt: `${dateStr} 08:05:23`,
        },
        {
          name: "Tacrolimus",
          dosage: "2mg",
          time: "8:00 PM",
          taken: i < 28,
          takenAt: i < 28 ? `${dateStr} 20:10:45` : null,
        },
        {
          name: "Mycophenolate",
          dosage: "500mg",
          time: "8:00 AM",
          taken: true,
          takenAt: `${dateStr} 08:05:23`,
        },
        {
          name: "Mycophenolate",
          dosage: "500mg",
          time: "8:00 PM",
          taken: i < 29,
          takenAt: i < 29 ? `${dateStr} 20:10:45` : null,
        },
        {
          name: "Prednisone",
          dosage: "5mg",
          time: "8:00 AM",
          taken: true,
          takenAt: `${dateStr} 08:05:23`,
        },
      ],
    })
  }

  return history
}

const medicationHistory = generateMedicationHistory()

export default function MedicationHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<string>("day")

  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : ""
  const selectedHistory = medicationHistory.find((h) => h.date === selectedDateStr)

  const adherenceRate = selectedHistory
    ? Math.round((selectedHistory.medications.filter((m) => m.taken).length / selectedHistory.medications.length) * 100)
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
                {selectedHistory.medications.map((med, index) => (
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

