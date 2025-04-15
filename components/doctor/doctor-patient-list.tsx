import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface DoctorPatientListProps {
  filter?: string
}

export function DoctorPatientList({ filter }: DoctorPatientListProps) {
  // Sample patient data
  const patients = [
    {
      id: "PT-12345",
      name: "John Doe",
      age: 50,
      gender: "Male",
      diagnosis: "End-Stage Renal Disease",
      status: "Critical",
      lastVisit: "Apr 30, 2025",
      nextAppointment: "May 15, 2025",
    },
    {
      id: "PT-23456",
      name: "Sarah Smith",
      age: 45,
      gender: "Female",
      diagnosis: "Chronic Kidney Disease Stage 4",
      status: "Stable",
      lastVisit: "Apr 28, 2025",
      nextAppointment: "May 20, 2025",
    },
    {
      id: "PT-34567",
      name: "Mike Johnson",
      age: 62,
      gender: "Male",
      diagnosis: "Kidney Transplant Recipient",
      status: "Stable",
      lastVisit: "Apr 25, 2025",
      nextAppointment: "May 25, 2025",
    },
    {
      id: "PT-45678",
      name: "Emily Davis",
      age: 38,
      gender: "Female",
      diagnosis: "Polycystic Kidney Disease",
      status: "Stable",
      lastVisit: "Apr 22, 2025",
      nextAppointment: "May 22, 2025",
    },
    {
      id: "PT-56789",
      name: "Robert Wilson",
      age: 55,
      gender: "Male",
      diagnosis: "Diabetic Nephropathy",
      status: "Deteriorating",
      lastVisit: "Apr 20, 2025",
      nextAppointment: "May 10, 2025",
    },
  ]

  // Filter patients based on the filter prop
  const filteredPatients = filter
    ? patients.filter((patient) => {
        if (filter === "critical") {
          return patient.status === "Critical" || patient.status === "Deteriorating"
        } else if (filter === "scheduled") {
          // In a real app, this would check if the appointment is today
          return patient.nextAppointment === "May 15, 2025"
        }
        return true
      })
    : patients

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "destructive"
      case "deteriorating":
        return "default"
      case "stable":
        return "outline"
      case "improving":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {filteredPatients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No patients found matching the selected criteria.</div>
      ) : (
        <>
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="flex items-start gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" alt={patient.name} />
                <AvatarFallback>
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <div>
                    <h3 className="font-medium">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.id} • {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(patient.status)} className="mt-1 sm:mt-0">
                    {patient.status}
                  </Badge>
                </div>
                <p className="text-sm mt-1 truncate">{patient.diagnosis}</p>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Last Visit: {patient.lastVisit}</span>
                  <span>Next Appointment: {patient.nextAppointment}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0" asChild>
                <Link href={`/doctor/patients/${patient.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
          <Button variant="outline" className="w-full" asChild>
            <Link href="/doctor/patients">View All Patients</Link>
          </Button>
        </>
      )}
    </div>
  )
}

