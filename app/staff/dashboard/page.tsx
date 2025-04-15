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

     

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-none shadow-md md:col-span-2">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <CardTitle>Dialysis Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="morning">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="morning">Morning (8AM-12PM)</TabsTrigger>
                <TabsTrigger value="afternoon">Afternoon (1PM-5PM)</TabsTrigger>
                <TabsTrigger value="evening">Evening (6PM-10PM)</TabsTrigger>
              </TabsList>
              <TabsContent value="morning">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                    <div>Patient</div>
                    <div>Station</div>
                    <div>Start Time</div>
                    <div>Duration</div>
                    <div>Status</div>
                  </div>
                  {[
                    {
                      name: "John Doe",
                      station: "Station 1",
                      time: "8:00 AM",
                      duration: "4 hours",
                      status: "In Progress",
                    },
                    {
                      name: "Sarah Smith",
                      station: "Station 2",
                      time: "8:30 AM",
                      duration: "3.5 hours",
                      status: "In Progress",
                    },
                    {
                      name: "Robert Wilson",
                      station: "Station 3",
                      time: "9:00 AM",
                      duration: "3 hours",
                      status: "Waiting",
                    },
                    {
                      name: "David Lee",
                      station: "Station 4",
                      time: "9:30 AM",
                      duration: "4 hours",
                      status: "Waiting",
                    },
                  ].map((session, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 text-sm border-t">
                      <div>{session.name}</div>
                      <div>{session.station}</div>
                      <div>{session.time}</div>
                      <div>{session.duration}</div>
                      <div>
                        <Badge
                          variant={
                            session.status === "In Progress"
                              ? "default"
                              : session.status === "Waiting"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="afternoon">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                    <div>Patient</div>
                    <div>Station</div>
                    <div>Start Time</div>
                    <div>Duration</div>
                    <div>Status</div>
                  </div>
                  {[
                    {
                      name: "Mike Johnson",
                      station: "Station 1",
                      time: "1:00 PM",
                      duration: "4 hours",
                      status: "Scheduled",
                    },
                    {
                      name: "Emily Davis",
                      station: "Station 2",
                      time: "1:30 PM",
                      duration: "3.5 hours",
                      status: "Scheduled",
                    },
                    {
                      name: "Jennifer Brown",
                      station: "Station 3",
                      time: "2:00 PM",
                      duration: "3 hours",
                      status: "Scheduled",
                    },
                    {
                      name: "James Taylor",
                      station: "Station 4",
                      time: "2:30 PM",
                      duration: "4 hours",
                      status: "Scheduled",
                    },
                  ].map((session, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 text-sm border-t">
                      <div>{session.name}</div>
                      <div>{session.station}</div>
                      <div>{session.time}</div>
                      <div>{session.duration}</div>
                      <div>
                        <Badge variant="secondary">{session.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="evening">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                    <div>Patient</div>
                    <div>Station</div>
                    <div>Start Time</div>
                    <div>Duration</div>
                    <div>Status</div>
                  </div>
                  {[
                    {
                      name: "Lisa Martinez",
                      station: "Station 1",
                      time: "6:00 PM",
                      duration: "4 hours",
                      status: "Scheduled",
                    },
                    {
                      name: "Maria Garcia",
                      station: "Station 2",
                      time: "6:30 PM",
                      duration: "3.5 hours",
                      status: "Scheduled",
                    },
                    {
                      name: "Thomas Anderson",
                      station: "Station 3",
                      time: "7:00 PM",
                      duration: "3 hours",
                      status: "Scheduled",
                    },
                  ].map((session, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 text-sm border-t">
                      <div>{session.name}</div>
                      <div>{session.station}</div>
                      <div>{session.time}</div>
                      <div>{session.duration}</div>
                      <div>
                        <Badge variant="secondary">{session.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/staff/dialysis">
                Manage Dialysis Schedule
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}

