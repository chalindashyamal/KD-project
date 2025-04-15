import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Activity, Calendar, Clock, Droplet, Heart, PieChart, Pill, ArrowRight } from "lucide-react"
import UpcomingAppointments from "@/components/upcoming-appointments"
import MedicationReminders from "@/components/medication-reminders"
import EmergencyButton from "@/components/emergency-button"
import HealthMetrics from "@/components/health-metrics"
import FluidTracker from "@/components/fluid-tracker"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's an overview of your health status</p>
        </div>
        <EmergencyButton />
      </div>

      <div className="dashboard-grid">
        <Card className="stat-card gradient-card text-white card-hover">
          <div className="card-gradient-overlay" />
          <Activity className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Next Dialysis</h3>
          <div className="text-3xl font-bold mb-1">Tomorrow</div>
          <p className="text-sm opacity-90">10:00 AM - Memorial Hospital</p>
          <Button variant="link" size="sm" className="px-0 mt-2 text-white" asChild>
            <Link href="/appointments" className="flex items-center">
              View Schedule <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="stat-card gradient-card text-white card-hover">
          <div className="card-gradient-overlay" />
          <Pill className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Medications</h3>
          <div className="text-3xl font-bold mb-1">3 Today</div>
          <p className="text-sm opacity-90">Next: Tacrolimus at 2:00 PM</p>
          <Button variant="link" size="sm" className="px-0 mt-2 text-white" asChild>
            <Link href="/medications" className="flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="stat-card gradient-card-secondary card-hover">
          <div className="card-gradient-overlay" />
          <Droplet className="stat-card-icon h-24 w-24 text-secondary-foreground/20" />
          <h3 className="text-sm font-medium text-secondary-foreground mb-1">Fluid Intake</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-secondary-foreground mb-1">1.2L / 2L</div>
          </div>
          <div className="w-full bg-secondary-foreground/20 rounded-full h-2 mb-2">
            <div className="bg-secondary-foreground h-2 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="text-sm text-secondary-foreground/80">60% of daily target</p>
          <Button variant="link" size="sm" className="px-0 mt-2 text-secondary-foreground" asChild>
            <Link href="/diet" className="flex items-center">
              Diet Plan <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Card>

        <Card className="stat-card gradient-card-secondary card-hover">
          <div className="card-gradient-overlay" />
          <Clock className="stat-card-icon h-24 w-24 text-secondary-foreground/20" />
          <h3 className="text-sm font-medium text-secondary-foreground mb-1">Doctor Visit</h3>
          <div className="text-3xl font-bold text-secondary-foreground mb-1">In 5 Days</div>
          <p className="text-sm text-secondary-foreground/80">Dr. Smith - Nephrology</p>
          <Button variant="link" size="sm" className="px-0 mt-2 text-secondary-foreground" asChild>
            <Link href="/appointments" className="flex items-center">
              Schedule <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Card>
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