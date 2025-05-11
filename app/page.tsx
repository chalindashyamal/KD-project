"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Pill,  } from "lucide-react"
import UpcomingAppointments from "@/components/upcoming-appointments"
import MedicationReminders from "@/components/medication-reminders"
import EmergencyButton from "@/components/emergency-button"
import HealthMetrics from "@/components/health-metrics"
import FluidTracker from "@/components/fluid-tracker"
import { useEffect, useState } from "react"
import request from "@/lib/request"

export default function Dashboard() {
  const [name, setName] = useState("")

  useEffect(() => {
    const fetchName = async () => {
      const response = await request("/api/patient")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setName(`${data.firstName} ${data.lastName}`)
    }
    fetchName()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}</h1>
          <p className="text-muted-foreground">Here's an overview of your health status</p>
        </div>
        <EmergencyButton />
      </div>

      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-primary text-primary-foreground px-6 py-4">
            <h2 className="text-xl font-semibold">Health Status</h2>
          </div>
          <div className="p-6">
            <HealthMetrics />
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-primary text-primary-foreground px-6 py-4">
            <h2 className="text-xl font-semibold">Fluid Tracker</h2>
          </div>
          <div className="p-6">
            <FluidTracker />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-primary text-primary-foreground px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
            <Button size="sm" variant="secondary" asChild>
              <Link href="/appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Link>
            </Button>
          </div>
          <div className="p-6">
            <UpcomingAppointments />
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-primary text-primary-foreground px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medication Reminders</h2>
            <Button size="sm" variant="secondary" asChild>
              <Link href="/medications">
                <Pill className="h-4 w-4 mr-2" />
                Manage
              </Link>
            </Button>
          </div>
          <div className="p-6">
            <MedicationReminders />
          </div>
        </Card>
      </div>

      
    </div>
  )
}