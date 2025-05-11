"use client"

import { useEffect, useState } from "react"
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
import request from "@/lib/request"

export default function DoctorReportsPage() {
  const [timeRange, setTimeRange] = useState("month")
  const [reportData, setReportData] = useState({
    demographicsData: [],
    diagnosisData: [],
    appointmentData: [],
  });

  const { demographicsData, diagnosisData, appointmentData } = reportData;

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await request("/api/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports();
  }, []);

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

