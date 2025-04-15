import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

interface PatientPrescriptionsProps {
  patientId: string
}

export function PatientPrescriptions({ patientId }: PatientPrescriptionsProps) {
  // In a real app, this would come from an API or database based on the patientId
  const medications = [
    {
      name: "Tacrolimus",
      dosage: "2mg",
      frequency: "Twice daily",
      purpose: "Anti-rejection",
      prescribedBy: "Dr. Smith",
      startDate: "January 15, 2023",
      endDate: null,
      refills: 3,
      status: "active",
    },
    {
      name: "Mycophenolate",
      dosage: "500mg",
      frequency: "Twice daily",
      purpose: "Anti-rejection",
      prescribedBy: "Dr. Smith",
      startDate: "January 15, 2023",
      endDate: null,
      refills: 2,
      status: "active",
    },
    {
      name: "Prednisone",
      dosage: "5mg",
      frequency: "Once daily",
      purpose: "Anti-inflammatory",
      prescribedBy: "Dr. Smith",
      startDate: "January 15, 2023",
      endDate: null,
      refills: 3,
      status: "active",
    },
    {
      name: "Calcium Acetate",
      dosage: "667mg",
      frequency: "With meals",
      purpose: "Phosphate binder",
      prescribedBy: "Dr. Smith",
      startDate: "February 10, 2023",
      endDate: null,
      refills: 5,
      status: "active",
    },
    {
      name: "Epoetin Alfa",
      dosage: "10,000 units",
      frequency: "Three times weekly",
      purpose: "Anemia",
      prescribedBy: "Dr. Smith",
      startDate: "March 5, 2023",
      endDate: null,
      refills: 1,
      status: "active",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Current Medications</h3>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/doctor/prescriptions/create?patientId=${patientId}`}>
            <Plus className="h-4 w-4" />
            Write Prescription
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
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
              {medications.map((med, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell>{med.purpose}</TableCell>
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

      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href={`/doctor/patients/${patientId}/prescriptions`}>
          <FileText className="h-4 w-4" />
          View Medication History
        </Link>
      </Button>
    </div>
  )
}

