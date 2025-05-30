"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, FileText, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface PatientLabResultsProps {
  patientId: string
}

export function PatientLabResults({ patientId }: PatientLabResultsProps) {
  const [selectedDate, setSelectedDate] = useState("April 25, 2025")

  // In a real app, this would come from an API or database based on the patientId
  const labResults = [
    {
      date: "April 25, 2025",
      results: [
        { name: "Creatinine", value: 5.2, unit: "mg/dL", range: "0.7-1.3", status: "high" },
        { name: "BUN", value: 65, unit: "mg/dL", range: "7-20", status: "high" },
        { name: "eGFR", value: 12, unit: "mL/min", range: ">60", status: "low" },
        { name: "Potassium", value: 5.1, unit: "mEq/L", range: "3.5-5.0", status: "high" },
        { name: "Sodium", value: 138, unit: "mEq/L", range: "135-145", status: "normal" },
        { name: "Phosphorus", value: 5.8, unit: "mg/dL", range: "2.5-4.5", status: "high" },
        { name: "Calcium", value: 8.9, unit: "mg/dL", range: "8.5-10.2", status: "normal" },
        { name: "Albumin", value: 3.8, unit: "g/dL", range: "3.4-5.4", status: "normal" },
        { name: "Hemoglobin", value: 9.8, unit: "g/dL", range: "13.5-17.5", status: "low" },
      ],
    },
    {
      date: "March 28, 2025",
      results: [
        { name: "Creatinine", value: 5.4, unit: "mg/dL", range: "0.7-1.3", status: "high" },
        { name: "BUN", value: 68, unit: "mg/dL", range: "7-20", status: "high" },
        { name: "eGFR", value: 11, unit: "mL/min", range: ">60", status: "low" },
        { name: "Potassium", value: 5.3, unit: "mEq/L", range: "3.5-5.0", status: "high" },
        { name: "Sodium", value: 137, unit: "mEq/L", range: "135-145", status: "normal" },
        { name: "Phosphorus", value: 6.0, unit: "mg/dL", range: "2.5-4.5", status: "high" },
        { name: "Calcium", value: 8.7, unit: "mg/dL", range: "8.5-10.2", status: "normal" },
        { name: "Albumin", value: 3.7, unit: "g/dL", range: "3.4-5.4", status: "normal" },
        { name: "Hemoglobin", value: 9.5, unit: "g/dL", range: "13.5-17.5", status: "low" },
      ],
    },
    {
      date: "February 25, 2025",
      results: [
        { name: "Creatinine", value: 5.5, unit: "mg/dL", range: "0.7-1.3", status: "high" },
        { name: "BUN", value: 70, unit: "mg/dL", range: "7-20", status: "high" },
        { name: "eGFR", value: 10, unit: "mL/min", range: ">60", status: "low" },
        { name: "Potassium", value: 5.2, unit: "mEq/L", range: "3.5-5.0", status: "high" },
        { name: "Sodium", value: 136, unit: "mEq/L", range: "135-145", status: "normal" },
        { name: "Phosphorus", value: 6.2, unit: "mg/dL", range: "2.5-4.5", status: "high" },
        { name: "Calcium", value: 8.6, unit: "mg/dL", range: "8.5-10.2", status: "normal" },
        { name: "Albumin", value: 3.6, unit: "g/dL", range: "3.4-5.4", status: "normal" },
        { name: "Hemoglobin", value: 9.3, unit: "g/dL", range: "13.5-17.5", status: "low" },
      ],
    },
  ]

  const selectedLabData = labResults.find((lab) => lab.date === selectedDate) || labResults[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Laboratory Results</h3>
        <div className="flex gap-2">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {labResults.map((lab) => (
                <SelectItem key={lab.date} value={lab.date}>
                  {lab.date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={`/doctor/patients/${patientId}/lab-orders/new`}>
              <Plus className="h-4 w-4" />
              Order New Test
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead className="text-right">Result</TableHead>
                <TableHead className="text-right">Reference Range</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedLabData.results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell className="text-right">
                    {result.value} {result.unit}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{result.range}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        result.status === "high" ? "destructive" : result.status === "low" ? "default" : "outline"
                      }
                      className="flex items-center justify-center gap-1"
                    >
                      {result.status === "high" ? (
                        <>
                          <ArrowUp className="h-3 w-3" /> High
                        </>
                      ) : result.status === "low" ? (
                        <>
                          <ArrowDown className="h-3 w-3" /> Low
                        </>
                      ) : (
                        <>
                          <Minus className="h-3 w-3" /> Normal
                        </>
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href={`/doctor/patients/${patientId}/lab-results`}>
          <FileText className="h-4 w-4" />
          View All Lab Results
        </Link>
      </Button>
    </div>
  )
}

