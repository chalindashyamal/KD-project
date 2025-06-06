"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ArrowRight, Plus, AlertCircle, ArrowDown, ArrowUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StaffInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("inventory")
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Dialysis Filters",
      category: "Dialysis Supplies",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: "pieces",
      location: "Storage Room A",
      lastRestocked: "Apr 25, 2025",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Dialysis Tubing Sets",
      category: "Dialysis Supplies",
      currentStock: 30,
      minStock: 15,
      maxStock: 60,
      unit: "sets",
      location: "Storage Room A",
      lastRestocked: "Apr 27, 2025",
      status: "In Stock",
    },
    {
      id: 3,
      name: "Epoetin Alfa",
      category: "Medications",
      currentStock: 12,
      minStock: 10,
      maxStock: 50,
      unit: "vials",
      location: "Medication Room",
      lastRestocked: "Apr 20, 2025",
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Dialysate Solution",
      category: "Dialysis Supplies",
      currentStock: 25,
      minStock: 20,
      maxStock: 80,
      unit: "bags",
      location: "Storage Room B",
      lastRestocked: "Apr 22, 2025",
      status: "Low Stock",
    },
    {
      id: 5,
      name: "Sterile Gloves",
      category: "General Supplies",
      currentStock: 200,
      minStock: 100,
      maxStock: 500,
      unit: "pairs",
      location: "Supply Closet",
      lastRestocked: "Apr 28, 2025",
      status: "In Stock",
    },
    {
      id: 6,
      name: "Tacrolimus",
      category: "Medications",
      currentStock: 35,
      minStock: 20,
      maxStock: 100,
      unit: "tablets",
      location: "Medication Room",
      lastRestocked: "Apr 26, 2025",
      status: "In Stock",
    },
  ])
  const [inventoryTransactions] = useState([
    {
      id: 101,
      itemName: "Dialysis Filters",
      type: "Restock",
      quantity: 20,
      date: "Apr 25, 2025",
      time: "10:30 AM",
      performedBy: "Nurse Emily Adams",
      notes: "Regular monthly restock",
    },
    {
      id: 102,
      itemName: "Epoetin Alfa",
      type: "Usage",
      quantity: 5,
      date: "Apr 24, 2025",
      time: "2:15 PM",
      performedBy: "Nurse David Wilson",
      notes: "Used for patient treatments",
    },
    {
      id: 103,
      itemName: "Dialysis Tubing Sets",
      type: "Restock",
      quantity: 15,
      date: "Apr 27, 2025",
      time: "9:00 AM",
      performedBy: "Nurse Emily Adams",
      notes: "Emergency restock due to increased patient load",
    },
    {
      id: 104,
      itemName: "Sterile Gloves",
      type: "Usage",
      quantity: 50,
      date: "Apr 28, 2025",
      time: "11:45 AM",
      performedBy: "Nurse Emily Adams",
      notes: "Regular usage",
    },
  ])

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "",
    location: "",
  })

  // Filter inventory items based on search query
  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter inventory transactions based on search query
  const filteredTransactions = inventoryTransactions.filter(
    (transaction) =>
      transaction.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.performedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get stock level percentage
  const getStockPercentage = (current: number, max: number) => {
    return (current / max) * 100
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "outline"
      case "low stock":
        return "default"
      case "critical":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = Math.max(...inventoryItems.map((item) => item.id)) + 1
    const currentStock = parseInt(newItem.currentStock) || 0
    const minStock = parseInt(newItem.minStock) || 0
    const maxStock = parseInt(newItem.maxStock) || 0
    const status =
      currentStock <= minStock ? "Low Stock" : currentStock <= minStock * 0.5 ? "Critical" : "In Stock"
    setInventoryItems([
      ...inventoryItems,
      {
        id: newId,
        name: newItem.name,
        category: newItem.category,
        currentStock,
        minStock,
        maxStock,
        unit: newItem.unit,
        location: newItem.location,
        lastRestocked: format(new Date(), "MMM d, yyyy"),
        status,
      },
    ])
    setNewItem({
      name: "",
      category: "",
      currentStock: "",
      minStock: "",
      maxStock: "",
      unit: "",
      location: "",
    })
    setShowAddItemForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage medical supplies and medications</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory items..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={showAddItemForm} onOpenChange={setShowAddItemForm}>
          <DialogTrigger asChild>
            <Button className="ml-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={newItem.category}
                  onValueChange={(value) => setNewItem((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dialysis Supplies">Dialysis Supplies</SelectItem>
                    <SelectItem value="Medications">Medications</SelectItem>
                    <SelectItem value="General Supplies">General Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input
                    id="currentStock"
                    name="currentStock"
                    type="number"
                    value={newItem.currentStock}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    value={newItem.minStock}
                    onChange={handleInputChange}
                    placeholder="Enter min stock"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Maximum Stock</Label>
                  <Input
                    id="maxStock"
                    name="maxStock"
                    type="number"
                    value={newItem.maxStock}
                    onChange={handleInputChange}
                    placeholder="Enter max stock"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  name="unit"
                  value={newItem.unit}
                  onValueChange={(value) => setNewItem((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                    <SelectItem value="vials">Vials</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="pairs">Pairs</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  name="location"
                  value={newItem.location}
                  onValueChange={(value) => setNewItem((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Storage Room A">Storage Room A</SelectItem>
                    <SelectItem value="Storage Room B">Storage Room B</SelectItem>
                    <SelectItem value="Medication Room">Medication Room</SelectItem>
                    <SelectItem value="Supply Closet">Supply Closet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => setShowAddItemForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="inventory" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>View and manage inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>
                                {item.currentStock} / {item.maxStock} {item.unit}
                              </span>
                            </div>
                            <Progress
                              value={getStockPercentage(item.currentStock, item.maxStock)}
                              className="h-2 mt-1"
                            />
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {item.status === "Low Stock" && <AlertCircle className="mr-1 h-3 w-3" />}
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                              <Button size="sm">
                                Restock
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
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View inventory transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="font-medium">{transaction.itemName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.type === "Restock" ? "default" : "secondary"}
                              className="flex items-center gap-1"
                            >
                              {transaction.type === "Restock" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.quantity} {transaction.type === "Restock" ? "added" : "used"}
                          </TableCell>
                          <TableCell>
                            <div>{transaction.date}</div>
                            <div className="text-xs text-muted-foreground">{transaction.time}</div>
                          </TableCell>
                          <TableCell>{transaction.performedBy}</TableCell>
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
                View All Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}