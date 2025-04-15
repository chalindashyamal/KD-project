"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, FileText, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PatientVitalSignsProps {
  patientId: string
}

export function PatientVitalSigns({ patientId }: PatientVitalSignsProps) {
  const [selectedMetric, setSelectedMetric] = useState("bloodPressure")

  // In a real app, this would come from an API or database based on the patientId
  const vitalSigns = [
    {
      date: "April 30, 2025",
      time: "10:30 AM",
      temperature: 37.2,
      systolic: 135,
      diastolic: 85,
      heartRate: 78,
      respiratoryRate: 16,
      oxygenSaturation: 97,
      weight: 72.5,
    },
    {
      date: "April 23, 2025",
      time: "9:45 AM",
      temperature: 37.0,
      systolic: 132,
      diastolic: 83,
      heartRate: 75,
      respiratoryRate: 15,
      oxygenSaturation: 98,
      weight: 72.8,
    },
    {
      date: "April 16, 2025",
      time: "11:15 AM",
      temperature: 36.8,
      systolic: 138,
      diastolic: 86,
      heartRate: 80,
      respiratoryRate: 17,
      oxygenSaturation: 96,
      weight: 73.1,
    },
    {
      date: "April 9, 2025",
      time: "10:00 AM",
      temperature: 37.1,
      systolic: 140,
      diastolic: 88,
      heartRate: 82,
      respiratoryRate: 16,
      oxygenSaturation: 97,
      weight: 73.5,
    },
    {
      date: "April 2, 2025",
      time: "9:30 AM",
      temperature: 36.9,
      systolic: 142,
      diastolic: 90,
      heartRate: 79,
      respiratoryRate: 15,
      oxygenSaturation: 96,
      weight: 73.8,
    },
  ]

  // Format data for charts
  const chartData = vitalSigns
    .slice()
    .reverse()
    .map((record) => ({
      date: record.date.split(" ")[1],
      systolic: record.systolic,
      diastolic: record.diastolic,
      heartRate: record.heartRate,
      temperature: record.temperature,
      weight: record.weight,
      oxygenSaturation: record.oxygenSaturation,
    }))

  const getStatusBadge = (value: number, type: string) => {
    let status = "normal"

    if (type === "systolic") {
      if (value > 140) status = "high"
      else if (value < 90) status = "low"
    } else if (type === "diastolic") {
      if (value > 90) status = "high"
      else if (value < 60) status = "low"
    } else if (type === "heartRate") {
      if (value > 100) status = "high"
      else if (value < 60) status = "low"
    } else if (type === "temperature") {
      if (value > 37.5) status = "high"
      else if (value < 36.0) status = "low"
    }

    return (
      <Badge
        variant={status === "high" ? "destructive" : status === "low" ? "default" : "outline"}
        className="flex items-center justify-center gap-1"
      >
        {status === "high" ? (
          <>
            <ArrowUp className="h-3 w-3" /> High
          </>
        ) : status === "low" ? (
          <>
            <ArrowDown className="h-3 w-3" /> Low
          </>
        ) : (
          <>
            <Minus className="h-3 w-3" /> Normal
          </>
        )}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vital Signs</h3>
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <Link href={`/doctor/patients/${patientId}/vitals/record`}>
            <Plus className="h-4 w-4" />
            Record Vitals
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Trend Analysis</h4>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                  <SelectItem value="heartRate">Heart Rate</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === "bloodPressure" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[60, 150]} stroke="#888888" />
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
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="hsl(25, 95%, 70%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Diastolic"
                    />
                  </LineChart>
                ) : selectedMetric === "heartRate" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[50, 100]} stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="hsl(187, 75%, 40%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Heart Rate"
                    />
                  </LineChart>
                ) : selectedMetric === "temperature" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis domain={[35.5, 38]} stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #eaeaea",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(187, 75%, 40%)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Temperature"
                    />
                  </LineChart>
                ) : (
                  <LineChart data={chartData}>
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
                      name="Weight"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>BP</TableHead>
                <TableHead>HR</TableHead>
                <TableHead>Temp</TableHead>
                <TableHead>O2</TableHead>
                <TableHead>Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vitalSigns.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{record.date}</div>
                    <div className="text-xs text-muted-foreground">{record.time}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {record.systolic}/{record.diastolic}
                    </div>
                    {getStatusBadge(record.systolic, "systolic")}
                  </TableCell>
                  <TableCell>
                    <div>{record.heartRate} bpm</div>
                    {getStatusBadge(record.heartRate, "heartRate")}
                  </TableCell>
                  <TableCell>
                    <div>{record.temperature}°C</div>
                    {getStatusBadge(record.temperature, "temperature")}
                  </TableCell>
                  <TableCell>{record.oxygenSaturation}%</TableCell>
                  <TableCell>{record.weight} kg</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href={`/doctor/patients/${patientId}/vitals`}>
          <FileText className="h-4 w-4" />
          View Complete Vital History
        </Link>
      </Button>
    </div>
  )
}

