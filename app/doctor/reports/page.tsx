"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, FileText, Calendar, BarChartIcon, PieChartIcon, LineChartIcon, Plus } from "lucide-react"
import Link from "next/link"

export default function DoctorReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Sample data for patient demographics
  const demographicsData = [
    { name: "18-30", value: 15 },
    { name: "31-45", value: 25 },
    { name: "46-60", value: 35 },
    { name: "61-75", value: 20 },
    { name: "76+", value: 5 },
  ]

  // Sample data for diagnosis distribution
  const diagnosisData = [
    { name: "ESRD", value: 40 },
    { name: "CKD Stage 4", value: 25 },
    { name: "CKD Stage 3", value: 15 },
    { name: "Transplant", value: 10 },
    { name: "Other", value: 10 },
  ]

  // Sample data for monthly appointments
  const appointmentData = [
    { month: "Jan", count: 45 },
    { month: "Feb", count: 52 },
    { month: "Mar", count: 48 },
    { month: "Apr", count: 56 },
    { month: "May", count: 50 },
    { month: "Jun", count: 58 },
    { month: "Jul", count: 54 },
    { month: "Aug", count: 52 },
    { month: "Sep", count: 49 },
    { month: "Oct", count: 53 },
    { month: "Nov", count: 55 },
    { month: "Dec", count: 48 },
  ]

  // Sample data for lab results trends
  const labResultsData = [
    { month: "Jan", creatinine: 5.8, bun: 72, egfr: 9 },
    { month: "Feb", creatinine: 5.7, bun: 70, egfr: 9 },
    { month: "Mar", creatinine: 5.6, bun: 69, egfr: 10 },
    { month: "Apr", creatinine: 5.4, bun: 68, egfr: 11 },
    { month: "May", creatinine: 5.2, bun: 65, egfr: 12 },
    { month: "Jun", creatinine: 5.3, bun: 66, egfr: 11 },
  ]

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and generate clinical reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChartIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age distribution of patients</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnosis Distribution</CardTitle>
                <CardDescription>Primary diagnoses of patients</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diagnosisData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {diagnosisData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Appointments</CardTitle>
                <CardDescription>Number of appointments per month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        
      </Tabs>
    </div>
  )
}

