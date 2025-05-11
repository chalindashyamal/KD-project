"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, FileText, Activity, Pill, Calendar, Phone, Mail, MapPin, Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PatientMedicalHistory } from "@/components/doctor/patient-medical-history"
import { PatientLabResults } from "@/components/doctor/patient-lab-results"
import { PatientPrescriptions } from "@/components/doctor/patient-prescriptions"
import { PatientAppointments } from "@/components/doctor/patient-appointments"
import { PatientVitalSigns } from "@/components/doctor/patient-vital-signs"
import { useEffect, useState } from "react"
import request from "@/lib/request"

interface Contact {
  phone: string
  email: string
  address: string
}

interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

interface Insurance {
  provider: string
  policyNumber: string
  groupNumber: string
  expirationDate: string
}

interface Allergy {
  allergen: string
  reaction: string
  severity: string
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  diagnosis: string
  diagnosisDate: string
  status: string
  transplantStatus: string
  dialysisStart: string
  contact: Contact
  emergencyContact: EmergencyContact
  insurance: Insurance
  allergies: Allergy[]
}

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const patientId = params.id
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    async function fetchPatient() {
      const response = await request(`/api/patient/${patientId}`)
      if (!response.ok) {
        console.error("Failed to fetch patient data")
        return
      }
      const data = await response.json()
      setPatient(data)
    }

    fetchPatient()
  }, [patientId])

  if (!patient) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/doctor/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
            <p className="text-muted-foreground">View and manage patient information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <Link href={`/doctor/patients/${patientId}/edit`}>
              <Edit className="h-4 w-4" />
              Edit Patient
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href={`/doctor/patients/${patientId}/prescriptions/create`}>
              <Pill className="h-4 w-4" />
              Write Prescription
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={patient.name} />
                <AvatarFallback className="text-xl">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
              <div className="flex items-center mt-2 gap-2">
                <Badge variant="outline">{patient.bloodType}</Badge>
                <Badge
                  variant={
                    patient.status === "Critical"
                      ? "destructive"
                      : patient.status === "Stable"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {patient.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Primary Diagnosis</h3>
                <p className="font-medium">{patient.diagnosis}</p>
                <p className="text-sm">Diagnosed: {patient.diagnosisDate}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Treatment Status</h3>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <p>Transplant Status: {patient.transplantStatus}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4 text-primary" />
                  <p>Dialysis Since: {patient.dialysisStart}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{patient.contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p>{patient.contact.email}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p>{patient.contact.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Emergency Contact</h3>
                <p>
                  {patient.emergencyContact.name} ({patient.emergencyContact.relation})
                </p>
                <p className="text-sm">{patient.emergencyContact.phone}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Insurance</h3>
                <p>{patient.insurance.provider}</p>
                <p className="text-sm">Policy: {patient.insurance.policyNumber}</p>
                <p className="text-sm">Expires: {patient.insurance.expirationDate}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Allergies</h3>
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{allergy.allergen}</p>
                        <p className="text-xs text-muted-foreground">{allergy.reaction}</p>
                      </div>
                      <Badge
                        variant={
                          allergy.severity === "Severe"
                            ? "destructive"
                            : allergy.severity === "Moderate"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>View and manage patient's medical information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Medical History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
                <TabsTrigger value="vitals" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Vital Signs</span>
                  <span className="sm:hidden">Vitals</span>
                </TabsTrigger>
                <TabsTrigger value="labs" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Lab Results</span>
                  <span className="sm:hidden">Labs</span>
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Prescriptions</span>
                  <span className="sm:hidden">Meds</span>
                </TabsTrigger>
                <TabsTrigger value="appointments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Appointments</span>
                  <span className="sm:hidden">Appts</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <PatientMedicalHistory patientId={patientId} />
              </TabsContent>

              <TabsContent value="vitals" className="mt-6">
                <PatientVitalSigns patientId={patientId} />
              </TabsContent>

              <TabsContent value="labs" className="mt-6">
                <PatientLabResults patientId={patientId} />
              </TabsContent>

              <TabsContent value="prescriptions" className="mt-6">
                <PatientPrescriptions patientId={patientId} />
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <PatientAppointments patientId={patientId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

