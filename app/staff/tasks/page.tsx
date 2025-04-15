"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowRight, Clock, Calendar, Plus, CheckCircle2 } from "lucide-react"
import Link from "next/link"

// Sample tasks data
const tasks = [
  {
    id: 1,
    title: "Record vitals for John Doe",
    patientId: "PT-12345",
    patientName: "John Doe",
    dueDate: "Apr 30, 2025",
    dueTime: "11:00 AM",
    priority: "High",
    assignedTo: "Nurse Emily Adams",
    status: "Pending",
    completed: false,
  },
  {
    id: 2,
    title: "Administer medication to Sarah Smith",
    patientId: "PT-23456",
    patientName: "Sarah Smith",
    dueDate: "Apr 30, 2025",
    dueTime: "11:30 AM",
    priority: "Medium",
    assignedTo: "Nurse Emily Adams",
    status: "Pending",
    completed: false,
  },
  {
    id: 3,
    title: "Prepare dialysis machine for Robert Wilson",
    patientId: "PT-56789",
    patientName: "Robert Wilson",
    dueDate: "Apr 30, 2025",
    dueTime: "12:00 PM",
    priority: "High",
    assignedTo: "Nurse Emily Adams",
    status: "Pending",
    completed: false,
  },
  {
    id: 4,
    title: "Check fluid balance for Mike Johnson",
    patientId: "PT-34567",
    patientName: "Mike Johnson",
    dueDate: "Apr 30, 2025",
    dueTime: "1:30 PM",
    priority: "Medium",
    assignedTo: "Nurse Emily Adams",
    status: "Pending",
    completed: false,
  },
  {
    id: 5,
    title: "Collect blood sample from Emily Davis",
    patientId: "PT-45678",
    patientName: "Emily Davis",
    dueDate: "Apr 30, 2025",
    dueTime: "2:00 PM",
    priority: "High",
    assignedTo: "Nurse Emily Adams",
    status: "Pending",
    completed: false,
  },
]

// Sample completed tasks
const completedTasks = [
  {
    id: 101,
    title: "Record vitals for Sarah Smith",
    patientId: "PT-23456",
    patientName: "Sarah Smith",
    dueDate: "Apr 29, 2025",
    dueTime: "9:00 AM",
    completedDate: "Apr 29, 2025",
    completedTime: "9:05 AM",
    priority: "Medium",
    completedBy: "Nurse Emily Adams",
    status: "Completed",
    notes: "All vitals within normal range",
  },
  {
    id: 102,
    title: "Administer medication to John Doe",
    patientId: "PT-12345",
    patientName: "John Doe",
    dueDate: "Apr 29, 2025",
    dueTime: "10:00 AM",
    completedDate: "Apr 29, 2025",
    completedTime: "10:05 AM",
    priority: "High",
    completedBy: "Nurse Emily Adams",
    status: "Completed",
    notes: "Patient tolerated medication well",
  },
  {
    id: 103,
    title: "Assist Robert Wilson with mobility exercises",
    patientId: "PT-56789",
    patientName: "Robert Wilson",
    dueDate: "Apr 29, 2025",
    dueTime: "11:00 AM",
    completedDate: "Apr 29, 2025",
    completedTime: "11:15 AM",
    priority: "Medium",
    completedBy: "Nurse Emily Adams",
    status: "Completed",
    notes: "Patient showing improvement in mobility",
  },
  {
    id: 104,
    title: "Change dressing for Mike Johnson",
    patientId: "PT-34567",
    patientName: "Mike Johnson",
    dueDate: "Apr 29, 2025",
    dueTime: "2:00 PM",
    completedDate: "Apr 29, 2025",
    completedTime: "2:10 PM",
    priority: "Medium",
    completedBy: "Nurse Emily Adams",
    status: "Completed",
    notes: "Wound healing well, no signs of infection",
  },
]

export default function StaffTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter completed tasks based on search query
  const filteredCompletedTasks = completedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage and track staff tasks</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks, patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="ml-4" asChild>
          <Link href="/staff/tasks/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>View and manage your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Due</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No pending tasks found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Checkbox id={`task-${task.id}`} checked={task.completed} />
                          </TableCell>
                          <TableCell>
                            <label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer">
                              {task.title}
                            </label>
                          </TableCell>
                          <TableCell>
                            <div>{task.patientName}</div>
                            <div className="text-xs text-muted-foreground">{task.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{task.dueTime}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{task.dueDate}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/staff/tasks/${task.id}`}>Details</Link>
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/staff/tasks/complete/${task.id}`}>Complete</Link>
                              </Button>
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
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>View history of completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletedTasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No completed tasks found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompletedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-muted-foreground">Priority: {task.priority}</div>
                          </TableCell>
                          <TableCell>
                            <div>{task.patientName}</div>
                            <div className="text-xs text-muted-foreground">{task.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>{task.completedDate}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{task.completedTime}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/staff/tasks/history/${task.id}`}>View Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/staff/tasks/history">
                  View Full History
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

