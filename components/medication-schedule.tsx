import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Clock, Check } from "lucide-react"

// In a real app, this would come from an API or database
const medications = [
  {
    id: 1,
    name: "Tacrolimus",
    dosage: "2mg",
    times: ["08:00", "20:00"],
    instructions: "Take with food",
    status: [
      { time: "08:00", taken: true },
      { time: "20:00", taken: false },
    ],
  },
  {
    id: 2,
    name: "Mycophenolate",
    dosage: "500mg",
    times: ["08:00", "20:00"],
    instructions: "Take on an empty stomach",
    status: [
      { time: "08:00", taken: true },
      { time: "20:00", taken: false },
    ],
  },
  {
    id: 3,
    name: "Prednisone",
    dosage: "5mg",
    times: ["08:00"],
    instructions: "Take with breakfast",
    status: [{ time: "08:00", taken: true }],
  },
  {
    id: 4,
    name: "Calcium Acetate",
    dosage: "667mg",
    times: ["08:00", "12:00", "18:00"],
    instructions: "Take with meals",
    status: [
      { time: "08:00", taken: true },
      { time: "12:00", taken: true },
      { time: "18:00", taken: false },
    ],
  },
  {
    id: 5,
    name: "Epoetin Alfa",
    dosage: "10,000 units",
    times: ["Monday", "Wednesday", "Friday"],
    instructions: "Subcutaneous injection",
    status: [
      { time: "Monday", taken: true },
      { time: "Wednesday", taken: false },
      { time: "Friday", taken: false },
    ],
  },
]

export default function MedicationSchedule() {
  const formatTime = (time: string) => {
    if (time.includes(":")) {
      const [hour, minute] = time.split(":")
      const hourNum = Number.parseInt(hour)
      return `${hourNum > 12 ? hourNum - 12 : hourNum}:${minute} ${hourNum >= 12 ? "PM" : "AM"}`
    }
    return time
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
                          <Button size="sm" variant="outline" className="h-7">
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

