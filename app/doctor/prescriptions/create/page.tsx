"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Plus, Trash2, Save, FileText } from "lucide-react"
import Link from "next/link"

// Sample patient data for dropdown
const patients = [
  { id: "PT-12345", name: "John Doe" },
  { id: "PT-23456", name: "Sarah Smith" },
  { id: "PT-34567", name: "Mike Johnson" },
  { id: "PT-45678", name: "Emily Davis" },
  { id: "PT-56789", name: "Robert Wilson" },
]

// Sample medication data for dropdown
const medications = [
  { id: "MED-001", name: "Tacrolimus", commonDosages: ["0.5mg", "1mg", "2mg", "5mg"] },
  { id: "MED-002", name: "Mycophenolate", commonDosages: ["250mg", "500mg", "750mg"] },
  { id: "MED-003", name: "Prednisone", commonDosages: ["5mg", "10mg", "20mg", "40mg"] },
  { id: "MED-004", name: "Calcium Acetate", commonDosages: ["667mg"] },
  { id: "MED-005", name: "Epoetin Alfa", commonDosages: ["2,000 units", "3,000 units", "10,000 units"] },
  { id: "MED-006", name: "Furosemide", commonDosages: ["20mg", "40mg", "80mg"] },
  { id: "MED-007", name: "Amlodipine", commonDosages: ["2.5mg", "5mg", "10mg"] },
  { id: "MED-008", name: "Sevelamer", commonDosages: ["800mg", "1600mg"] },
]

// Form schema
const prescriptionFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  medications: z
    .array(
      z.object({
        medicationId: z.string({
          required_error: "Please select a medication",
        }),
        dosage: z.string({
          required_error: "Please enter a dosage",
        }),
        frequency: z.string({
          required_error: "Please select a frequency",
        }),
        duration: z.string().optional(),
        instructions: z.string().optional(),
      }),
    )
    .min(1, {
      message: "Please add at least one medication",
    }),
  notes: z.string().optional(),
  refills: z.number().min(0).default(0),
  dispenseAsWritten: z.boolean().default(false),
})

type PrescriptionFormValues = z.input<typeof prescriptionFormSchema>

export default function CreatePrescriptionPage() {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)

  // Initialize form
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      medications: [{ medicationId: "", dosage: "", frequency: "", duration: "", instructions: "" }],
      notes: "",
      refills: 0,
      dispenseAsWritten: false,
    },
  })

  // Get medications array from form
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  })

  // Handle form submission
  function onSubmit(data: PrescriptionFormValues) {
    // In a real app, you would save the prescription to a database
    console.log("Prescription data:", data)
    alert("Prescription created successfully!")
    // Redirect to prescriptions list or patient details
  }

  // Get common dosages for selected medication
  const getCommonDosages = (medicationId: string) => {
    const medication = medications.find((med) => med.id === medicationId)
    return medication ? medication.commonDosages : []
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/doctor/prescriptions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Prescription</h1>
            <p className="text-muted-foreground">Write a new prescription for a patient</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
          <CardDescription>
            Enter the prescription details including patient, medications, and instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormDescription>Select the patient for whom you are writing this prescription</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Medications</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ medicationId: "", dosage: "", frequency: "", duration: "", instructions: "" })
                    }
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Medication
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`medications.${index}.medicationId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                setSelectedMedication(value)
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a medication" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {medications.map((medication) => (
                                  <SelectItem key={medication.id} value={medication.id}>
                                    {medication.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select or enter dosage" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {form.watch(`medications.${index}.medicationId`) &&
                                  getCommonDosages(form.watch(`medications.${index}.medicationId`)).map((dosage) => (
                                    <SelectItem key={dosage} value={dosage}>
                                      {dosage}
                                    </SelectItem>
                                  ))}
                                <SelectItem value="custom">Custom Dosage</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value === "custom" && (
                              <Input
                                className="mt-2"
                                placeholder="Enter custom dosage"
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="once_daily">Once Daily</SelectItem>
                                <SelectItem value="twice_daily">Twice Daily</SelectItem>
                                <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                                <SelectItem value="four_times_daily">Four Times Daily</SelectItem>
                                <SelectItem value="every_other_day">Every Other Day</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="as_needed">As Needed (PRN)</SelectItem>
                                <SelectItem value="custom">Custom Schedule</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value === "custom" && (
                              <Input
                                className="mt-2"
                                placeholder="Enter custom frequency"
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="7_days">7 Days</SelectItem>
                                <SelectItem value="14_days">14 Days</SelectItem>
                                <SelectItem value="30_days">30 Days</SelectItem>
                                <SelectItem value="60_days">60 Days</SelectItem>
                                <SelectItem value="90_days">90 Days</SelectItem>
                                <SelectItem value="indefinite">Indefinite/Chronic</SelectItem>
                                <SelectItem value="custom">Custom Duration</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value === "custom" && (
                              <Input
                                className="mt-2"
                                placeholder="Enter custom duration"
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`medications.${index}.instructions`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Special Instructions</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any special instructions (e.g., take with food, take on empty stomach)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="refills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Refills</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dispenseAsWritten"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Dispense As Written</FormLabel>
                        <FormDescription>Check this box to prevent generic substitution</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes for the pharmacist or patient" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/doctor/prescriptions">Cancel</Link>
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Prescription
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Save as Template
          </Button>
          <Button variant="secondary" className="gap-2">
            <FileText className="h-4 w-4" />
            Print Preview
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

