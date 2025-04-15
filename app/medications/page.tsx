"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Bell, Calendar, Clock, Plus } from "lucide-react"
import MedicationSchedule from "@/components/medication-schedule"
import MedicationHistory from "@/components/medication-history"
import MedicationReminders from "@/components/medication-reminders"

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Medication name is required.",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required.",
  }),
  frequency: z.string({
    required_error: "Please select a frequency.",
  }),
  time: z.array(z.string()).min(1, {
    message: "At least one time is required.",
  }),
  instructions: z.string().optional(),
})

export default function MedicationsPage() {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      instructions: "",
      time: ["08:00"],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save the medication to a database
    console.log(values)
    setOpen(false)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>Add a new medication to your schedule and set reminders.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter medication name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 10mg, 1 tablet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
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
                          <SelectItem value="as_needed">As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time(s)</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {["08:00", "12:00", "18:00", "22:00"].map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={field.value.includes(time) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              const newValue = field.value.includes(time)
                                ? field.value.filter((t) => t !== time)
                                : [...field.value, time]
                              field.onChange(newValue)
                            }}
                          >
                            <Clock className="mr-1 h-3 w-3" />
                            {time.split(":")[0] > "12"
                              ? `${Number.parseInt(time.split(":")[0]) - 12}:${time.split(":")[1]} PM`
                              : `${time} AM`}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Take with food" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Medication</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="schedule">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="reminders">
            <Bell className="mr-2 h-4 w-4" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <MedicationSchedule />
        </TabsContent>

        <TabsContent value="reminders" className="mt-6">
          <MedicationReminders fullView={true} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <MedicationHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

