import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"

interface PatientMedicalHistoryProps {
  patientId: string
}

export function PatientMedicalHistory({ patientId }: PatientMedicalHistoryProps) {
  // In a real app, this would come from an API or database based on the patientId
  const medicalHistory = {
    diagnosis: {
      primary: "End-Stage Renal Disease (ESRD)",
      date: "January 5, 2023",
      cause: "Diabetic Nephropathy",
      stage: "Stage 5",
      notes: "Progressive kidney failure due to long-standing diabetes mellitus type 2.",
    },
    conditions: [
      { name: "Diabetes Mellitus Type 2", diagnosedYear: 2010, status: "Active" },
      { name: "Hypertension", diagnosedYear: 2012, status: "Controlled" },
      { name: "Anemia", diagnosedYear: 2023, status: "Active" },
    ],
    surgeries: [
      {
        procedure: "AV Fistula Creation",
        date: "February 15, 2023",
        surgeon: "Dr. James Wilson",
        location: "Memorial Hospital",
      },
      { procedure: "Appendectomy", date: "May 10, 2005", surgeon: "Dr. Lisa Chen", location: "City General Hospital" },
    ],
    hospitalizations: [
      {
        reason: "Fluid Overload",
        dateRange: "March 18-22, 2023",
        hospital: "Memorial Hospital",
        notes: "Required emergency dialysis",
      },
      {
        reason: "Hyperkalemia",
        dateRange: "July 5-8, 2023",
        hospital: "Memorial Hospital",
        notes: "Potassium level 6.8 mEq/L",
      },
    ],
    allergies: [
      { allergen: "Penicillin", reaction: "Rash, Difficulty Breathing", severity: "Severe" },
      { allergen: "Sulfa Drugs", reaction: "Skin Rash", severity: "Moderate" },
      { allergen: "Shellfish", reaction: "Hives", severity: "Mild" },
    ],
    familyHistory: [
      { condition: "Diabetes", relation: "Father" },
      { condition: "Hypertension", relation: "Mother" },
      { condition: "Kidney Disease", relation: "Paternal Uncle" },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Medical History</h3>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/doctor/patients/${patientId}/medical-records/add`}>
            <Plus className="h-4 w-4" />
            Add Record
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{medicalHistory.diagnosis.primary}</h3>
              <Badge variant="outline">{medicalHistory.diagnosis.stage}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Diagnosed Date</p>
                <p className="text-muted-foreground">{medicalHistory.diagnosis.date}</p>
              </div>
              <div>
                <p className="font-medium">Underlying Cause</p>
                <p className="text-muted-foreground">{medicalHistory.diagnosis.cause}</p>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-medium">Clinical Notes</p>
              <p className="text-muted-foreground">{medicalHistory.diagnosis.notes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="conditions">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Other Medical Conditions</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.conditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{condition.name}</p>
                    <p className="text-sm text-muted-foreground">Diagnosed in {condition.diagnosedYear}</p>
                  </div>
                  <Badge variant={condition.status === "Active" ? "default" : "secondary"}>{condition.status}</Badge>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="surgeries">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Surgical History</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.surgeries.map((surgery, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{surgery.procedure}</p>
                    <p className="text-sm text-muted-foreground">{surgery.date}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {surgery.surgeon} at {surgery.location}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hospitalizations">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Hospitalizations</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.hospitalizations.map((hospitalization, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{hospitalization.reason}</p>
                    <p className="text-sm text-muted-foreground">{hospitalization.dateRange}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{hospitalization.hospital}</p>
                  {hospitalization.notes && (
                    <p className="text-sm text-muted-foreground mt-1">Note: {hospitalization.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="allergies">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Allergies</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.allergies.map((allergy, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{allergy.allergen}</p>
                    <p className="text-sm text-muted-foreground">{allergy.reaction}</p>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="family">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Family History</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {medicalHistory.familyHistory.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <p className="font-medium">{item.condition}</p>
                  <p className="text-sm text-muted-foreground">{item.relation}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href={`/doctor/patients/${patientId}/medical-records`}>
          <FileText className="h-4 w-4" />
          View Complete Medical Records
        </Link>
      </Button>
    </div>
  )
}

