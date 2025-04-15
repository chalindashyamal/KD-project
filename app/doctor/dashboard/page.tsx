import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  ClipboardList,
  Bell,
  Clock,
  AlertCircle,
  Search,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { DoctorAppointments } from "@/components/doctor/doctor-appointments"

export default function DoctorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Wilson</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Patients
          </Button>
          
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Users className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Total Patients</h3>
          <div className="text-3xl font-bold mb-1">42</div>
          <p className="text-sm opacity-90">3 new this month</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Calendar className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Today's Appointments</h3>
          <div className="text-3xl font-bold mb-1">8</div>
          <p className="text-sm opacity-90">2 pending confirmations</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <ClipboardList className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Pending Reports</h3>
          <div className="text-3xl font-bold mb-1">5</div>
          <p className="text-sm opacity-90">2 urgent</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Bell className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Notifications</h3>
          <div className="text-3xl font-bold mb-1">12</div>
          <p className="text-sm opacity-90">4 unread</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/doctor/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <DoctorAppointments />
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Patient Alerts</CardTitle>
              <Button size="sm" variant="secondary">
                Manage Alerts
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="bg-red-100 text-red-700 rounded-full p-1.5">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-red-800">Critical Lab Result</h3>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Urgent
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    John Doe (PT-12345) has critical potassium levels (6.8 mmol/L)
                  </p>
                  <div className="flex items-center text-xs text-red-600 mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    30 minutes ago
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="bg-amber-100 text-amber-700 rounded-full p-1.5">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-amber-800">Abnormal Vital Signs</h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Attention
                    </Badge>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Sarah Smith (PT-23456) has elevated blood pressure (165/95 mmHg)
                  </p>
                  <div className="flex items-center text-xs text-amber-600 mt-2">
                    <Clock className="h-3 w-3 mr-1" />2 hours ago
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="bg-blue-100 text-blue-700 rounded-full p-1.5">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-blue-800">Medication Refill</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Request
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Mike Johnson (PT-34567) needs Tacrolimus prescription refill
                  </p>
                  <div className="flex items-center text-xs text-blue-600 mt-2">
                    <Clock className="h-3 w-3 mr-1" />5 hours ago
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      

      
    </div>
  )
}

