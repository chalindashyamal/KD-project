"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowRight, Clock, Calendar, Activity, Droplets } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StaffDialysisPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("today")
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [dialysisSessions, setDialysisSessions] = useState([
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      room: "Dialysis Room 1",
      machine: "Fresenius 5008",
      scheduledStart: "10:00 AM",
      scheduledEnd: "2:00 PM",
      status: "In Progress",
      startedAt: "10:05 AM",
      duration: "4 hours",
      assignedTo: "Nurse Emily Adams",
    },
    {
      id: 2,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      room: "Dialysis Room 2",
      machine: "Fresenius 5008",
      scheduledStart: "11:00 AM",
      scheduledEnd: "3:00 PM",
      status: "Scheduled",
      startedAt: "-",
      duration: "4 hours",
      assignedTo: "Nurse Emily Adams",
    },
    {
      id: 3,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      room: "Dialysis Room 3",
      machine: "Fresenius 5008",
      scheduledStart: "2:00 PM",
      scheduledEnd: "6:00 PM",
      status: "Scheduled",
      startedAt: "-",
      duration: "4 hours",
      assignedTo: "Nurse David Wilson",
    },
    {
      id: 4,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      room: "Dialysis Room 4",
      machine: "Fresenius 5008",
      scheduledStart: "3:00 PM",
      scheduledEnd: "7:00 PM",
      status: "Scheduled",
      startedAt: "-",
      duration: "4 hours",
      assignedTo: "Nurse David Wilson",
    },
  ])
  const [completedSessions] = useState([
    {
      id: 101,
      patientId: "PT-12345",
      patientName: "John Doe",
      room: "Dialysis Room 1",
      machine: "Fresenius 5008",
      date: "Apr 29, 2025",
      startTime: "10:00 AM",
      endTime: "2:05 PM",
      duration: "4h 5m",
      conductedBy: "Nurse Emily Adams",
      status: "Completed",
      notes: "Patient tolerated procedure well. No complications.",
    },
    {
      id: 102,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      room: "Dialysis Room 2",
      machine: "Fresenius 5008",
      date: "Apr 29, 2025",
      startTime: "11:00 AM",
      endTime: "3:10 PM",
      duration: "4h 10m",
      conductedBy: "Nurse Emily Adams",
      status: "Completed",
      notes: "Patient experienced mild cramping during last hour. Resolved with position change.",
    },
    {
      id: 103,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      room: "Dialysis Room 3",
      machine: "Fresenius 5008",
      date: "Apr 29, 2025",
      startTime: "2:00 PM",
      endTime: "6:00 PM",
      duration: "4h",
      conductedBy: "Nurse David Wilson",
      status: "Completed",
      notes: "Uneventful session.",
    },
    {
      id: 104,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      room: "Dialysis Room 4",
      machine: "Fresenius 5008",
      date: "Apr 29, 2025",
      startTime: "3:00 PM",
      endTime: "7:05 PM",
      duration: "4h 5m",
      conductedBy: "Nurse David Wilson",
      status: "Completed",
      notes: "Patient's blood pressure dropped slightly at 2-hour mark. Stabilized after fluid adjustment.",
    },
  ])

  const [newSession, setNewSession] = useState({
    patientName: "",
    patientId: "",
    room: "",
    machine: "",
    scheduledStart: "",
    scheduledEnd: "",
    duration: "",
    assignedTo: "",
  })

  // Filter dialysis sessions based on search query
  const filteredSessions = dialysisSessions.filter(
    (session) =>
      session.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.room.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter completed sessions based on search query
  const filteredCompletedSessions = completedSessions.filter(
    (session) =>
      session.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.room.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSession((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...dialysisSessions.map((s) => s.id)) + 1
    setDialysisSessions([
      ...dialysisSessions,
      {
        id: newId,
        patientId: newSession.patientId,
        patientName: newSession.patientName,
        room: newSession.room,
        machine: newSession.machine,
        scheduledStart: newSession.scheduledStart,
        scheduledEnd: newSession.scheduledEnd,
        status: "Scheduled",
        startedAt: "-",
        duration: newSession.duration,
        assignedTo: newSession.assignedTo,
      },
    ])
    setNewSession({
      patientName: "",
      patientId: "",
      room: "",
      machine: "",
      scheduledStart: "",
      scheduledEnd: "",
      duration: "",
      assignedTo: "",
    })
    setShowScheduleForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dialysis Management</h1>
          <p className="text-muted-foreground">Monitor and manage patient dialysis sessions</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients, rooms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
          <DialogTrigger asChild>
            <Button className="ml-4">Schedule Session</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule Dialysis Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newSession.patientName}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    value={newSession.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <Select
                    name="room"
                    value={newSession.room}
                    onValueChange={(value) => setNewSession((prev) => ({ ...prev, room: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dialysis Room 1">Dialysis Room 1</SelectItem>
                      <SelectItem value="Dialysis Room 2">Dialysis Room 2</SelectItem>
                      <SelectItem value="Dialysis Room 3">Dialysis Room 3</SelectItem>
                      <SelectItem value="Dialysis Room 4">Dialysis Room 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machine">Machine</Label>
                  <Select
                    name="machine"
                    value={newSession.machine}
                    onValueChange={(value) => setNewSession((prev) => ({ ...prev, machine: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fresenius 5008">Fresenius 5008</SelectItem>
                      <SelectItem value="NxStage System One">NxStage System One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduledStart">Scheduled Start</Label>
                  <Input
                    id="scheduledStart"
                    name="scheduledStart"
                    value={newSession.scheduledStart}
                    onChange={handleInputChange}
                    placeholder="e.g., 10:00 AM"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledEnd">Scheduled End</Label>
                  <Input
                    id="scheduledEnd"
                    name="scheduledEnd"
                    value={newSession.scheduledEnd}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={newSession.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 4 hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  name="assignedTo"
                  value={newSession.assignedTo}
                  onValueChange={(value) => setNewSession((prev) => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select nurse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nurse Emily Adams">Nurse Emily Adams</SelectItem>
                    <SelectItem value="Nurse David Wilson">Nurse David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowScheduleForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Session</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="today">Today's Sessions</TabsTrigger>
          <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Dialysis Sessions</CardTitle>
              <CardDescription>View and manage scheduled and ongoing dialysis sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Room/Machine</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No dialysis sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">{session.patientName}</div>
                            <div className="text-xs text-muted-foreground">{session.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div>{session.room}</div>
                            <div className="text-xs text-muted-foreground">{session.machine}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>
                                {session.scheduledStart} - {session.scheduledEnd}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">Duration: {session.duration}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                session.status === "In Progress"
                                  ? "default"
                                  : session.status === "Completed"
                                    ? "outline"
                                    : "secondary"
                              }
                              className="flex items-center gap-1"
                            >
                              {session.status === "In Progress" && <Activity className="h-3 w-3" />}
                              {session.status}
                            </Badge>
                            {session.startedAt !== "-" && (
                              <div className="text-xs text-muted-foreground mt-1">Started: {session.startedAt}</div>
                            )}
                          </TableCell>
                          <TableCell>{session.assignedTo}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                              {session.status === "Scheduled" ? (
                                <Button size="sm">
                                  Start
                                </Button>
                              ) : session.status === "In Progress" ? (
                                <Button size="sm">
                                  Monitor
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Dialysis Sessions</CardTitle>
              <CardDescription>View records of completed dialysis sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Conducted By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletedSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No completed sessions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompletedSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="font-medium">{session.patientName}</div>
                            <div className="text-xs text-muted-foreground">{session.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{session.date}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {session.startTime} - {session.endTime}
                            </div>
                          </TableCell>
                          <TableCell>{session.duration}</TableCell>
                          <TableCell>{session.conductedBy}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Droplets className="h-3 w-3 text-blue-500" />
                              {session.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full History
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}