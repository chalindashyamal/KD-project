"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowRight, Clock, Calendar, Plus, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: number;
  title: string;
  patientId: string;
  patientName: string;
  dueDate: Date; // ISO string or Date object
  dueTime: string;
  priority: string;
  assignedTo: string;
  status: string;
  completed: boolean;
  notes?: string;
  completedBy?: string;
  completedDate?: Date; // ISO string or Date object
  completedTime?: string;
}

export default function StaffTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [tasksVersion, setTasksVersion] = useState<number>(1);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.map((task: any) => ({
          ...task,
          patientName: `${task.patient.firstName} ${task.patient.lastName}`,
          dueDate: new Date(task.dueDate), // Convert ISO string to Date object
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined, // Convert ISO string to Date object
        })));
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [tasksVersion]);

  const completedTasks = tasks.filter((task) => task.completed)

  const [newTask, setNewTask] = useState({
    title: "",
    patientName: "",
    patientId: "",
    dueDate: new Date(),
    dueTime: "",
    priority: "",
    assignedTo: "",
  })

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  ).filter((task) => !task.completed)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          patientId: newTask.patientId,
          patientName: newTask.patientName,
          dueDate: newTask.dueDate.toISOString(), // Convert to ISO string
          dueTime: newTask.dueTime,
          priority: newTask.priority,
          assignedTo: newTask.assignedTo,
          status: 'Pending',
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create a new task');
      }

      const createdTask = await response.json();

      // Update the local state with the newly created task
      setTasks((prevTasks) => [...prevTasks, createdTask]);

      // Reset the form
      setNewTask({
        title: '',
        patientName: '',
        patientId: '',
        dueDate: new Date(),
        dueTime: '',
        priority: '',
        assignedTo: '',
      });
      setShowCreateTaskForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleComplete = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark task as complete');
      }

      const updatedTask = await response.json();

      setTasksVersion(prev => prev + 1); // Increment version to trigger re-fetch
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
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
        <Dialog open={showCreateTaskForm} onOpenChange={setShowCreateTaskForm}>
          <DialogTrigger asChild>
            <Button className="ml-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newTask.patientName}
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
                    value={newTask.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newTask.dueDate ? format(newTask.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newTask.dueDate}
                        onSelect={(selectedDate) =>
                          setNewTask((prev) => ({ ...prev, dueDate: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueTime">Due Time</Label>
                  <Input
                    id="dueTime"
                    name="dueTime"
                    value={newTask.dueTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 11:00 AM"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  name="priority"
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask((prev) => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nurse Emily Adams">Nurse Emily Adams</SelectItem>
                    <SelectItem value="Nurse David Wilson">Nurse David Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowCreateTaskForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
                            <div className="text-xs text-muted-foreground">{task.dueDate.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                              <Button size="sm" onClick={() => handleComplete(task.id)}>
                                Complete
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
                              <span>{task.completedDate?.toLocaleString() || ''}</span>
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
                            <Button variant="ghost" size="sm">
                              View Details
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