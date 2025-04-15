"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// In a real app, this would come from an API or database
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
  { date: "Apr 24", intake: 1.8 },
  { date: "Apr 25", intake: 1.7 },
  { date: "Apr 26", intake: 1.9 },
  { date: "Apr 27", intake: 1.6 },
  { date: "Apr 28", intake: 1.8 },
  { date: "Apr 29", intake: 1.7 },
  { date: "Apr 30", intake: 1.2 },
]

export default function HealthMetrics() {
  return (
    <Tabs defaultValue="blood-pressure">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
        <TabsTrigger value="weight">Weight</TabsTrigger>
        <TabsTrigger value="fluid">Fluid Intake</TabsTrigger>
      </TabsList>
      <TabsContent value="blood-pressure" className="h-[250px] mt-4">
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
      </TabsContent>
      <TabsContent value="weight" className="h-[250px] mt-4">
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
      </TabsContent>
      <TabsContent value="fluid" className="h-[250px] mt-4">
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
              stroke="hsl(187, 75%, 40%)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}

