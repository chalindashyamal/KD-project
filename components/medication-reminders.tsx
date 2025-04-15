import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock } from "lucide-react"

// In a real app, this would come from an API or database
const medications = [
  {
    id: 1,
    name: "Tacrolimus",
    dosage: "2mg",
    time: "2:00 PM",
    status: "upcoming",
    instructions: "Take with food",
  },
  {
    id: 2,
    name: "Mycophenolate",
    dosage: "500mg",
    time: "8:00 PM",
    status: "upcoming",
    instructions: "Take on an empty stomach",
  },
  {
    id: 3,
    name: "Prednisone",
    dosage: "5mg",
    time: "8:00 AM",
    status: "completed",
    instructions: "Take with breakfast",
  },
]

export default function MedicationReminders() {
  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <div key={medication.id} className="flex justify-between items-center border-b pb-4 last:border-0">
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
          {medication.status === "completed" ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Taken
            </Badge>
          ) : (
            <Button size="sm" variant="outline">
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

