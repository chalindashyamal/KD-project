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
import request from "@/lib/request"

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
    async function saveMedication() {
      try {
        const response = await request("/api/medications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to save medication.");
        }

        const savedMedication = await response.json();
        console.log("Medication saved:", savedMedication);

        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Error saving medication:", error);
        alert("Failed to save medication.");
      }
    }

    saveMedication();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
        
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
          <MedicationReminders />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <MedicationHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

