"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function DoctorLabOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample lab order data
  const labOrders = [
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
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lab Orders</h1>
          <p className="text-muted-foreground">Manage and track patient laboratory tests</p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/doctor/lab-orders/new">
            <Plus className="h-4 w-4" />
            New Lab Order
          </Link>
        </Button>
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
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor/lab-orders/${order.id}`}>View</Link>
                          </Button>
                          {order.status === "Completed" && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/doctor/lab-orders/${order.id}/results`}>Results</Link>
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

