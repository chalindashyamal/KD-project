"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

type Medication = {
  id: number
  patientId: string
  patient: {
    firstName: string
    lastName: string
  }
  name: string
  dosage: string
  time: string
  instructions: string
  taken: boolean
}

type Prescription = {
  id: string;
  patientName: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  expiryDate: string;
  refills: number;
  status: string;
};

export default function Prescriptions() {
  const [medications, setMedications] = useState<Prescription[]>([])

  useEffect(() => {
    async function fetchMedications() {
      try {
        const response = await fetch("/api/medications")
        if (!response.ok) {
          throw new Error("Failed to fetch medications")
        }
        const data = await response.json() as Medication[]
        setMedications(data.map((medication) => {
          return {
            id: medication.id.toString(),
            patientName: `${medication.patient.firstName} ${medication.patient.lastName}`,
            patientId: medication.patientId,
            medication: medication.name,
            dosage: medication.dosage,
            frequency: medication.time,
            prescribedDate: new Date().toISOString(),
            expiryDate: '',
            refills: 0,
            status: medication.taken ? "active" : "inactive",
          } as Prescription
        }))
      } catch (error) {
        console.error("Error fetching medications:", error)
      }
    }

    fetchMedications()
  }, [])

  const activeMedications = medications.filter((med) => med.status === "active")
  const pastMedications = medications.filter((med) => med.status !== "active")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Your active prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Refills</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMedications.map((med, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{med.medication}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell>{med.status}</TableCell>
                  <TableCell>
                    <Badge variant={med.refills > 0 ? "outline" : "destructive"}>
                      {med.refills > 0 ? `${med.refills} remaining` : "Needs refill"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pastMedications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Medication History</CardTitle>
            <CardDescription>Your past prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastMedications.map((med, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{med.medication}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      {med.prescribedDate} to {med.expiryDate || "Present"}
                    </TableCell>
                    <TableCell>{med.status}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Completed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

