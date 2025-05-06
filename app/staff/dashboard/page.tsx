import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Bell, ArrowRight, Search, Activity, Droplets, Pill } from "lucide-react"
import Link from "next/link"
import { StaffAppointmentList } from "@/components/staff/staff-appointment-list"
import { StaffTaskList } from "@/components/staff/staff-task-list"

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Nurse Adams</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Patients
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Today's Schedule
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Calendar className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Today's Appointments</h3>
          <div className="text-3xl font-bold mb-1">15</div>
          <p className="text-sm opacity-90">3 checked in</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Activity className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Pending Vitals</h3>
          <div className="text-3xl font-bold mb-1">8</div>
          <p className="text-sm opacity-90">2 high priority</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Pill className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Medication Tasks</h3>
          <div className="text-3xl font-bold mb-1">12</div>
          <p className="text-sm opacity-90">4 due in next hour</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Bell className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Alerts</h3>
          <div className="text-3xl font-bold mb-1">5</div>
          <p className="text-sm opacity-90">1 critical</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/staff/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <StaffAppointmentList />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/staff/tasks">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <StaffTaskList />
          </CardContent>
        </Card>
      </div>

     

      
    </div>
  )
}

