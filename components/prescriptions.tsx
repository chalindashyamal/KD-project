import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function Prescriptions() {
  // In a real app, this would come from an API or database
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
    {
      name: "Ciprofloxacin",
      dosage: "500mg",
      frequency: "Twice daily for 7 days",
      purpose: "Infection",
      prescribedBy: "Dr. Johnson",
      startDate: "April 10, 2023",
      endDate: "April 17, 2023",
      refills: 0,
      status: "completed",
    },
  ]

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
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>
                      {med.startDate} to {med.endDate || "Present"}
                    </TableCell>
                    <TableCell>{med.purpose}</TableCell>
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

