"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function DoctorLabOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showLabOrderForm, setShowLabOrderForm] = useState(false)
  const [labOrders, setLabOrders] = useState([
    {
      id: 1,
      patientId: "PT-12345",
      patientName: "John Doe",
      testType: "Comprehensive Metabolic Panel",
      orderedDate: "April 28, 2025",
      dueDate: "May 5, 2025",
      priority: "Routine",
      status: "Ordered",
    },
    {
      id: 2,
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      testType: "Complete Blood Count",
      orderedDate: "April 27, 2025",
      dueDate: "May 4, 2025",
      priority: "Urgent",
      status: "Pending",
    },
    {
      id: 3,
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      testType: "Kidney Function Panel",
      orderedDate: "April 25, 2025",
      dueDate: "April 30, 2025",
      priority: "Routine",
      status: "Completed",
    },
    {
      id: 4,
      patientId: "PT-45678",
      patientName: "Emily Davis",
      testType: "Urinalysis",
      orderedDate: "April 26, 2025",
      dueDate: "May 3, 2025",
      priority: "Routine",
      status: "In Progress",
    },
    {
      id: 5,
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      testType: "Electrolyte Panel",
      orderedDate: "April 24, 2025",
      dueDate: "April 29, 2025",
      priority: "Urgent",
      status: "Completed",
    },
    {
      id: 6,
      patientId: "PT-67890",
      patientName: "Jennifer Brown",
      testType: "Lipid Panel",
      orderedDate: "April 23, 2025",
      dueDate: "April 30, 2025",
      priority: "Routine",
      status: "Completed",
    },
  ])

  const [newLabOrder, setNewLabOrder] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    orderedDate: new Date(),
    dueDate: new Date(),
    priority: "Routine",
  })

  // Filter lab orders based on search query and status filter
  const filteredLabOrders = labOrders.filter((order) => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.testType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "ordered":
        return "secondary"
      case "pending":
        return "default"
      case "in progress":
        return "default"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "destructive"
      case "routine":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewLabOrder((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...labOrders.map((o) => o.id)) + 1
    setLabOrders([
      ...labOrders,
      {
        id: newId,
        patientId: newLabOrder.patientId,
        patientName: newLabOrder.patientName,
        testType: newLabOrder.testType,
        orderedDate: format(newLabOrder.orderedDate, "MMMM d, yyyy"),
        dueDate: format(newLabOrder.dueDate, "MMMM d, yyyy"),
        priority: newLabOrder.priority,
        status: "Ordered",
      },
    ])
    setNewLabOrder({
      patientName: "",
      patientId: "",
      testType: "",
      orderedDate: new Date(),
      dueDate: new Date(),
      priority: "Routine",
    })
    setShowLabOrderForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab Orders</h1>
          <p className="text-muted-foreground">Manage and track patient laboratory tests</p>
        </div>
        <Dialog open={showLabOrderForm} onOpenChange={setShowLabOrderForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Lab Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Lab Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    value={newLabOrder.patientName}
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
                    value={newLabOrder.patientId}
                    onChange={handleInputChange}
                    placeholder="Enter patient ID"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testType">Test Type</Label>
                <Select
                  name="testType"
                  value={newLabOrder.testType}
                  onValueChange={(value) => setNewLabOrder((prev) => ({ ...prev, testType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comprehensive Metabolic Panel">Comprehensive Metabolic Panel</SelectItem>
                    <SelectItem value="Complete Blood Count">Complete Blood Count</SelectItem>
                    <SelectItem value="Kidney Function Panel">Kidney Function Panel</SelectItem>
                    <SelectItem value="Urinalysis">Urinalysis</SelectItem>
                    <SelectItem value="Electrolyte Panel">Electrolyte Panel</SelectItem>
                    <SelectItem value="Lipid Panel">Lipid Panel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ordered Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newLabOrder.orderedDate
                          ? format(newLabOrder.orderedDate, "PPP")
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newLabOrder.orderedDate}
                        onSelect={(selectedDate) =>
                          setNewLabOrder((prev) => ({ ...prev, orderedDate: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newLabOrder.dueDate
                          ? format(newLabOrder.dueDate, "PPP")
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={newLabOrder.dueDate}
                        onSelect={(selectedDate) =>
                          setNewLabOrder((prev) => ({ ...prev, dueDate: selectedDate || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  name="priority"
                  value={newLabOrder.priority}
                  onValueChange={(value) => setNewLabOrder((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowLabOrderForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Lab Order</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lab Orders</CardTitle>
          <CardDescription>View and manage all laboratory test orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, ID, or test type..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Ordered Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLabOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No lab orders found for the selected criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLabOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.patientName}</div>
                        <div className="text-xs text-muted-foreground">{order.patientId}</div>
                      </TableCell>
                      <TableCell>{order.testType}</TableCell>
                      <TableCell>{order.orderedDate}</TableCell>
                      <TableCell>{order.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(order.priority)}>{order.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          {order.status === "Completed" && (
                            <Button variant="outline" size="sm">
                              Results
                            </Button>
                          )}
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
    </div>
  )
}