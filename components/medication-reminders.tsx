"use client";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock } from "lucide-react"
import { useEffect, useState } from "react"

type MedicationAPI = {
  id: number
  name: string
  dosage: string
  times: string[]
  instructions: string
  status: { time: string; taken: boolean, takenAt: Date }[]
}


type Medication = {
  id: number
  name: string
  dosage: string
  time: string
  instructions: string
  taken: boolean
}

export default function MedicationReminders() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationsVersion, updateMedicationsVersion] = useState(1)

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await fetch("/api/medication-schedule")
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
          }))
        }))
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [medicationsVersion])

  const handleMarkAsTaken = async (medicationId: number, time: string) => {
    try {
      const response = await fetch("/api/medication-schedule", {
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
    <div className="space-y-4">
      {medications.map((medication) => (
        <div key={medication.id + medication.time} className="flex justify-between items-center border-b pb-4 last:border-0">
          <div className="space-y-1">
            <div className="flex items-center">
              <span className="font-medium">{medication.name}</span>
              <Badge variant="outline" className="ml-2">
                {medication.dosage}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {medication.time}
            </div>
            <div className="text-xs text-muted-foreground">{medication.instructions}</div>
          </div>
          {medication.taken ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Taken
            </Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={() => handleMarkAsTaken(medication.id, medication.time)}>
              Mark as Taken
            </Button>
          )}
        </div>
      ))}
      <Button variant="outline" className="w-full" size="sm">
        View All Medications
      </Button>
    </div>
  )
}

