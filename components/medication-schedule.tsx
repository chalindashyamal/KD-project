"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Clock, Check } from "lucide-react"
import { useEffect, useState } from "react"
import request from "@/lib/request"

type Medication = {
  id: number
  name: string
  dosage: string
  times: string[]
  instructions: string
  status: { time: string; taken: boolean }[]
}

export default function MedicationSchedule() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationsVersion, updateMedicationsVersion] = useState(1)

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await request("/api/medication-schedule")
        if (!response.ok) {
          throw new Error("Failed to fetch medications")
        }
        const data = await response.json()
        setMedications(data)
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [medicationsVersion])

  const formatTime = (time: string) => {
    if (time.includes(":")) {
      const [hour, minute] = time.split(":")
      const hourNum = Number.parseInt(hour)
      return `${hourNum > 12 ? hourNum - 12 : hourNum}:${minute} ${hourNum >= 12 ? "PM" : "AM"}`
    }
    return time
  }

  const handleMarkAsTaken = async (medicationId: number, time: string) => {
    try {
      const response = await request("/api/medication-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicationId, time }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark medication as taken")
      }

      updateMedicationsVersion((prev) => prev + 1) // Trigger re-fetch
    } catch (error) {
      console.error("Error marking medication as taken:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Medication Schedule</CardTitle>
        <CardDescription>Track your medication schedule and adherence</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Instructions</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">{medication.name}</TableCell>
                <TableCell>{medication.dosage}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {medication.times.map((time, index) => (
                      <div key={index} className="flex items-center">
                        <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{formatTime(time)}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{medication.instructions}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {medication.status.map((status, index) => (
                      <div key={index} className="flex items-center">
                        {status.taken ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="mr-1 h-3 w-3" />
                            Taken
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => handleMarkAsTaken(medication.id, status.time)}
                            size="sm"
                            variant="outline"
                            className="h-7">
                            Mark as Taken
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

