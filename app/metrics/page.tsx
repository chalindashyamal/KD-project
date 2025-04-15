"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Activity, ArrowUp, ArrowDown, Plus, Download, FileText } from "lucide-react"

// Sample data for charts
const bloodPressureData = [
  { date: "Apr 24", systolic: 135, diastolic: 85 },
  { date: "Apr 25", systolic: 132, diastolic: 83 },
  { date: "Apr 26", systolic: 138, diastolic: 86 },
  { date: "Apr 27", systolic: 130, diastolic: 82 },
  { date: "Apr 28", systolic: 128, diastolic: 80 },
  { date: "Apr 29", systolic: 132, diastolic: 84 },
  { date: "Apr 30", systolic: 134, diastolic: 83 },
]

const weightData = [
  { date: "Apr 24", weight: 72.5 },
  { date: "Apr 25", weight: 72.3 },
  { date: "Apr 26", weight: 72.8 },
  { date: "Apr 27", weight: 73.1 },
  { date: "Apr 28", weight: 72.7 },
  { date: "Apr 29", weight: 72.5 },
  { date: "Apr 30", weight: 72.4 },
]

const fluidData = [
  { date: "Apr 24", intake: 1.8, output: 1.5 },
  { date: "Apr 25", intake: 1.7, output: 1.4 },
  { date: "Apr 26", intake: 1.9, output: 1.6 },
  { date: "Apr 27", intake: 1.6, output: 1.3 },
  { date: "Apr 28", intake: 1.8, output: 1.5 },
  { date: "Apr 29", intake: 1.7, output: 1.4 },
  { date: "Apr 30", intake: 1.2, output: 1.0 },
]

const labData = [
  { date: "Jan 15", creatinine: 5.5, bun: 70, egfr: 10, potassium: 5.2 },
  { date: "Feb 25", creatinine: 5.5, bun: 70, egfr: 10, potassium: 5.2 },
  { date: "Mar 28", creatinine: 5.4, bun: 68, egfr: 11, potassium: 5.3 },
  { date: "Apr 25", creatinine: 5.2, bun: 65, egfr: 12, potassium: 5.1 },
]

export default function HealthMetricsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [metricType, setMetricType] = useState("blood-pressure")
  const [timeRange, setTimeRange] = useState("week")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Metrics</h1>
          <p className="text-muted-foreground">Track and monitor your key health indicators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Measurement
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Activity className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Blood Pressure</h3>
          <div className="text-3xl font-bold mb-1">134/83</div>
          <p className="text-sm opacity-90">Last measured: Today</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <ArrowDown className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Weight</h3>
          <div className="text-3xl font-bold mb-1">72.4 kg</div>
          <p className="text-sm opacity-90">-0.1 kg from yesterday</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <ArrowUp className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Fluid Balance</h3>
          <div className="text-3xl font-bold mb-1">+0.2 L</div>
          <p className="text-sm opacity-90">Intake: 1.2L, Output: 1.0L</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <FileText className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Creatinine</h3>
          <div className="text-3xl font-bold mb-1">5.2 mg/dL</div>
          <p className="text-sm opacity-90">Last lab: April 25, 2025</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Metric Trends</CardTitle>
              <div className="flex gap-2">
                <Select value={metricType} onValueChange={setMetricType}>
                  <SelectTrigger className="w-[180px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="fluid">Fluid Balance</SelectItem>
                    <SelectItem value="lab">Lab Results</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[350px]">
              {metricType === "blood-pressure" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[70, 150]} stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="hsl(187, 75%, 40%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="hsl(25, 95%, 70%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {metricType === "weight" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[70, 75]} stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(187, 75%, 40%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {metricType === "fluid" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fluidData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[0, 2.5]} stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="intake"
                      name="Intake (L)"
                      stroke="hsl(187, 75%, 40%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="output"
                      name="Output (L)"
                      stroke="hsl(25, 95%, 70%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              {metricType === "lab" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={labData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="creatinine" name="Creatinine (mg/dL)" fill="hsl(187, 75%, 40%)" />
                    <Bar dataKey="egfr" name="eGFR (mL/min)" fill="hsl(25, 95%, 70%)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <CardTitle>Add Measurement</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metric-type">Metric Type</Label>
                <Select defaultValue="blood-pressure">
                  <SelectTrigger id="metric-type">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood-pressure">Blood Pressure</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="fluid-intake">Fluid Intake</SelectItem>
                    <SelectItem value="fluid-output">Fluid Output</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="glucose">Blood Glucose</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurement-date">Date</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="mx-auto"
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input id="systolic" type="number" placeholder="e.g., 120" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input id="diastolic" type="number" placeholder="e.g., 80" />
                </div>
              </div>

              <Button className="w-full">Save Measurement</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
          <CardTitle>Measurement History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="blood-pressure">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="fluid">Fluid Balance</TabsTrigger>
              <TabsTrigger value="other">Other Metrics</TabsTrigger>
            </TabsList>
            <TabsContent value="blood-pressure" className="mt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Time</div>
                  <div>Reading</div>
                  <div>Status</div>
                </div>
                {[
                  { date: "Apr 30, 2025", time: "8:00 AM", systolic: 134, diastolic: 83, status: "Elevated" },
                  { date: "Apr 29, 2025", time: "8:15 AM", systolic: 132, diastolic: 84, status: "Elevated" },
                  { date: "Apr 28, 2025", time: "7:45 AM", systolic: 128, diastolic: 80, status: "Normal" },
                  { date: "Apr 27, 2025", time: "8:30 AM", systolic: 130, diastolic: 82, status: "Normal" },
                  { date: "Apr 26, 2025", time: "9:00 AM", systolic: 138, diastolic: 86, status: "Elevated" },
                ].map((reading, i) => (
                  <div key={i} className="grid grid-cols-4 p-3 text-sm border-t">
                    <div>{reading.date}</div>
                    <div>{reading.time}</div>
                    <div>
                      {reading.systolic}/{reading.diastolic} mmHg
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reading.status === "Normal"
                            ? "bg-green-100 text-green-800"
                            : reading.status === "Elevated"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {reading.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="weight" className="mt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Time</div>
                  <div>Weight</div>
                  <div>Change</div>
                </div>
                {[
                  { date: "Apr 30, 2025", time: "8:00 AM", weight: 72.4, change: -0.1 },
                  { date: "Apr 29, 2025", time: "8:15 AM", weight: 72.5, change: 0.0 },
                  { date: "Apr 28, 2025", time: "7:45 AM", weight: 72.5, change: -0.2 },
                  { date: "Apr 27, 2025", time: "8:30 AM", weight: 72.7, change: -0.4 },
                  { date: "Apr 26, 2025", time: "9:00 AM", weight: 73.1, change: +0.3 },
                ].map((reading, i) => (
                  <div key={i} className="grid grid-cols-4 p-3 text-sm border-t">
                    <div>{reading.date}</div>
                    <div>{reading.time}</div>
                    <div>{reading.weight} kg</div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reading.change === 0
                            ? "bg-gray-100 text-gray-800"
                            : reading.change < 0
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {reading.change > 0 ? "+" : ""}
                        {reading.change} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="fluid" className="mt-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
                  <div>Date</div>
                  <div>Intake</div>
                  <div>Output</div>
                  <div>Balance</div>
                  <div>Status</div>
                </div>
                {[
                  { date: "Apr 30, 2025", intake: 1.2, output: 1.0, balance: 0.2, status: "Positive" },
                  { date: "Apr 29, 2025", intake: 1.7, output: 1.4, balance: 0.3, status: "Positive" },
                  { date: "Apr 28, 2025", intake: 1.8, output: 1.5, balance: 0.3, status: "Positive" },
                  { date: "Apr 27, 2025", intake: 1.6, output: 1.3, balance: 0.3, status: "Positive" },
                  { date: "Apr 26, 2025", intake: 1.9, output: 1.6, balance: 0.3, status: "Positive" },
                ].map((reading, i) => (
                  <div key={i} className="grid grid-cols-5 p-3 text-sm border-t">
                    <div>{reading.date}</div>
                    <div>{reading.intake} L</div>
                    <div>{reading.output} L</div>
                    <div>
                      {reading.balance > 0 ? "+" : ""}
                      {reading.balance} L
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          reading.balance === 0
                            ? "bg-gray-100 text-gray-800"
                            : reading.balance > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {reading.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="other" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                No other metrics recorded. Use the "Add Measurement" form to add additional health metrics.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

