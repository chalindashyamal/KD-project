"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, Calendar, Pencil, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import request from "@/lib/request"

type LabTest = {
  id: number;
  patientId: string;
  patientName: string;
  testType: string;
  orderedDate: string; // ISO date string
  dueDate: string; // ISO date string
  priority: string
  status: string
};

export default function DoctorLabOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showLabOrderForm, setShowLabOrderForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [labOrders, setLabOrders] = useState<LabTest[]>([])
  const [editLabOrder, setEditLabOrder] = useState<LabTest | null>(null)
  const [error, setError] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  const [newLabOrder, setNewLabOrder] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    orderedDate: new Date(),
    dueDate: new Date(),
    priority: "Routine",
  })

  useEffect(() => {
    async function fetchLabOrders() {
      try {
        setLoading(true)
        const response = await request("/api/lab-orders")
        if (!response.ok) {
          throw new Error("Failed to fetch lab orders.")
        }
        const data = await response.json()
        setLabOrders(data.map((order: any) => ({
          ...order,
          patientName: `${order.patient.firstName} ${order.patient.lastName}`,
        })))
      } catch (err: any) {
        console.error("Error fetching lab orders:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLabOrders()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditLabOrder((prev) => prev ? ({ ...prev, [name]: value }) : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await request("/api/lab-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: newLabOrder.patientId,
          testType: newLabOrder.testType,
          orderedDate: newLabOrder.orderedDate.toISOString(),
          dueDate: newLabOrder.dueDate.toISOString(),
          priority: newLabOrder.priority,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create lab order.")
      }

      const createdLabOrder = await response.json()
      createdLabOrder.patientName = `${createdLabOrder.patient.firstName} ${createdLabOrder.patient.lastName}`
      setLabOrders([...labOrders, createdLabOrder])
      setSuccessMessage("Lab order created successfully!")
      setNewLabOrder({
        patientName: "",
        patientId: "",
        testType: "",
        orderedDate: new Date(),
        dueDate: new Date(),
        priority: "Routine",
      })
      setShowLabOrderForm(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error creating lab order:", error)
      setError("Failed to create lab order.")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editLabOrder) return

    try {
      const response = await request("/api/lab-orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editLabOrder.id,
          patientId: editLabOrder.patientId,
          testType: editLabOrder.testType,
          orderedDate: new Date(editLabOrder.orderedDate).toISOString(),
          dueDate: new Date(editLabOrder.dueDate).toISOString(),
          priority: editLabOrder.priority,
          status: editLabOrder.status,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update lab order.")
      }

      const updatedLabOrder = await response.json()
      updatedLabOrder.patientName = editLabOrder.patientName
      setLabOrders(labOrders.map((order) => (order.id === updatedLabOrder.id ? updatedLabOrder : order)))
      setSuccessMessage("Lab order updated successfully!")
      setShowEditForm(false)
      setEditLabOrder(null)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating lab order:", error)
      setError("Failed to update lab order.")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lab order?")) return

    try {
      const response = await request("/api/lab-orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete lab order.")
      }

      setLabOrders(labOrders.filter((order) => order.id !== id))
      setSuccessMessage("Lab order deleted successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting lab order:", error)
      setError("Failed to delete lab order.")
      setTimeout(() => setError(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
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

          <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Lab Order</DialogTitle>
              </DialogHeader>
              {editLabOrder && (
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      name="patientId"
                      value={editLabOrder.patientId}
                      onChange={handleEditInputChange}
                      placeholder="Enter patient ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testType">Test Type</Label>
                    <Select
                      name="testType"
                      value={editLabOrder.testType}
                      onValueChange={(value) => setEditLabOrder((prev) => prev ? ({ ...prev, testType: value }) : null)}
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
                            {editLabOrder.orderedDate
                              ? format(new Date(editLabOrder.orderedDate), "PPP")
                              : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={new Date(editLabOrder.orderedDate)}
                            onSelect={(selectedDate) =>
                              setEditLabOrder((prev) => prev ? ({ ...prev, orderedDate: selectedDate?.toISOString() || new Date().toISOString() }) : null)
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
                            {editLabOrder.dueDate
                              ? format(new Date(editLabOrder.dueDate), "PPP")
                              : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={new Date(editLabOrder.dueDate)}
                            onSelect={(selectedDate) =>
                              setEditLabOrder((prev) => prev ? ({ ...prev, dueDate: selectedDate?.toISOString() || new Date().toISOString() }) : null)
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
                      value={editLabOrder.priority}
                      onValueChange={(value) => setEditLabOrder((prev) => prev ? ({ ...prev, priority: value }) : null)}
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
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      name="status"
                      value={editLabOrder.status}
                      onValueChange={(value) => setEditLabOrder((prev) => prev ? ({ ...prev, status: value }) : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ordered">Ordered</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button" onClick={() => setShowEditForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditLabOrder(order)
                            setShowEditForm(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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