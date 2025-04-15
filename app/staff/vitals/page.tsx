"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Search, ArrowRight, ArrowUp, ArrowDown, Minus, Save, Clock, Activity } from "lucide-react"
import Link from "next/link"

// Sample patient data
const patients = [
  { id: "PT-12345", name: "John Doe", age: 50, gender: "Male", room: "Dialysis Room 1" },
  { id: "PT-23456", name: "Sarah Smith", age: 45, gender: "Female", room: "Dialysis Room 2" },
  { id: "PT-34567", name: "Mike Johnson", age: 62, gender: "Male", room: "Exam Room 3" },
  { id: "PT-45678", name: "Emily Davis", age: 38, gender: "Female", room: "Waiting Room" },
  { id: "PT-56789", name: "Robert Wilson", age: 55, gender: "Male", room: "Dialysis Room 3" },
]

// Form schema
const vitalsFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  temperature: z.string().optional(),
  systolic: z.string().optional(),
  diastolic: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  oxygenSaturation: z.string().optional(),
  weight: z.string().optional(),
  notes: z.string().optional(),
})

type VitalsFormValues = z.infer<typeof vitalsFormSchema>

// Sample vitals history
const vitalsHistory = [
  {
    id: 1,
    patientId: "PT-12345",
    patientName: "John Doe",
    date: "Apr 30, 2025",
    time: "10:30 AM",
    temperature: "37.2°C",
    bloodPressure: "135/85",
    heartRate: "78",
    respiratoryRate: "16",
    oxygenSaturation: "97%",
    weight: "72.5 kg",
  },
  {
    id: 2,
    patientId: "PT-23456",
    patientName: "Sarah Smith",
    date: "Apr 30, 2025",
    time: "9:45 AM",
    temperature: "36.8°C",
    bloodPressure: "142/88",
    heartRate: "82",
    respiratoryRate: "18",
    oxygenSaturation: "96%",
    weight: "65.2 kg",
  },
  {
    id: 3,
    patientId: "PT-34567",
    patientName: "Mike Johnson",
    date: "Apr 30, 2025",
    time: "9:15 AM",
    temperature: "36.5°C",
    bloodPressure: "128/76",
    heartRate: "68",
    respiratoryRate: "14",
    oxygenSaturation: "98%",
    weight: "80.1 kg",
  },
  {
    id: 4,
    patientId: "PT-45678",
    patientName: "Emily Davis",
    date: "Apr 30, 2025",
    time: "8:30 AM",
    temperature: "37.0°C",
    bloodPressure: "118/72",
    heartRate: "74",
    respiratoryRate: "16",
    oxygenSaturation: "99%",
    weight: "58.7 kg",
  },
]

export default function StaffVitalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)

  // Initialize form
  const form = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsFormSchema),
    defaultValues: {
      patientId: "",
      temperature: "",
      systolic: "",
      diastolic: "",
      heartRate: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      weight: "",
      notes: "",
    },
  })

  // Handle form submission
  function onSubmit(data: VitalsFormValues) {
    // In a real app, you would save the vitals to a database
    console.log("Vitals data:", data)
    alert("Vitals recorded successfully!")
    form.reset()
    setSelectedPatient(null)
  }

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter vitals history based on selected patient
  const filteredVitalsHistory = selectedPatient
    ? vitalsHistory.filter((record) => record.patientId === selectedPatient)
    : vitalsHistory

  // Get status badge for vital sign
  const getStatusBadge = (value: number, type: string) => {
    let status = "normal"

    if (type === "systolic") {
      if (value > 140) status = "high"
      else if (value < 90) status = "low"
    } else if (type === "diastolic") {
      if (value > 90) status = "high"
      else if (value < 60) status = "low"
    } else if (type === "heartRate") {
      if (value > 100) status = "high"
      else if (value < 60) status = "low"
    } else if (type === "temperature") {
      if (value > 37.5) status = "high"
      else if (value < 36.0) status = "low"
    }

    return (
      <Badge
        variant={status === "high" ? "destructive" : status === "low" ? "default" : "outline"}
        className="flex items-center justify-center gap-1"
      >
        {status === "high" ? (
          <>
            <ArrowUp className="h-3 w-3" /> High
          </>
        ) : status === "low" ? (
          <>
            <ArrowDown className="h-3 w-3" /> Low
          </>
        ) : (
          <>
            <Minus className="h-3 w-3" /> Normal
          </>
        )}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vital Signs</h1>
          <p className="text-muted-foreground">Record and monitor patient vital signs</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record Vital Signs</CardTitle>
            <CardDescription>Select a patient and record their vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="patient-search">Search Patient</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient-search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {searchQuery && (
                <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="p-2 text-center text-muted-foreground">No patients found</div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
                        onClick={() => {
                          form.setValue("patientId", patient.id)
                          setSelectedPatient(patient.id)
                          setSearchQuery("")
                        }}
                      >
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.id} • {patient.age} yrs • {patient.gender} • {patient.room}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selected Patient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 37.0" {...field} />
                        </FormControl>
                        <FormDescription>Normal range: 36.1-37.2°C</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <div className="mb-2">Blood Pressure (mmHg)</div>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="systolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Systolic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span className="flex items-center">/</span>
                      <FormField
                        control={form.control}
                        name="diastolic"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Diastolic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">Normal range: 90-120/60-80 mmHg</div>
                  </div>

                  <FormField
                    control={form.control}
                    name="heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 75" {...field} />
                        </FormControl>
                        <FormDescription>Normal range: 60-100 bpm</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="respiratoryRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respiratory Rate (breaths/min)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 16" {...field} />
                        </FormControl>
                        <FormDescription>Normal range: 12-20 breaths/min</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="oxygenSaturation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oxygen Saturation (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 98" {...field} />
                        </FormControl>
                        <FormDescription>Normal range: 95-100%</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 70.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Any additional observations..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Vital Signs
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Vital Signs</CardTitle>
            <CardDescription>View recently recorded vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>BP</TableHead>
                    <TableHead>Temp</TableHead>
                    <TableHead>HR</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVitalsHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No vital signs recorded
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVitalsHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="font-medium">{record.patientName}</div>
                          <div className="text-xs text-muted-foreground">{record.patientId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span>{record.time}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{record.date}</div>
                        </TableCell>
                        <TableCell>
                          <div>{record.bloodPressure}</div>
                          {getStatusBadge(Number.parseInt(record.bloodPressure.split("/")[0]), "systolic")}
                        </TableCell>
                        <TableCell>
                          <div>{record.temperature}</div>
                          {getStatusBadge(Number.parseFloat(record.temperature.replace("°C", "")), "temperature")}
                        </TableCell>
                        <TableCell>
                          <div>{record.heartRate} bpm</div>
                          {getStatusBadge(Number.parseInt(record.heartRate), "heartRate")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/staff/vitals/${record.id}`}>
                              <Activity className="mr-1 h-4 w-4" />
                              Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/staff/vitals/history">
                View Full History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

