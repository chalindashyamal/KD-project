"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, Droplet, GlassWaterIcon as Glass, Plus } from "lucide-react"

const fluidLimit = 2000 // 2 liters in ml

type WeeklyData = {
  day: string
  amount: number
  current: boolean
}

export default function FluidTracker() {
  const [currentIntake, setCurrentIntake] = useState(0)
  const [customAmount, setCustomAmount] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])

  const percentage = Math.min(Math.round((currentIntake / fluidLimit) * 100), 100)
  const remaining = Math.max(fluidLimit - currentIntake, 0)

  // Fetch current intake from the API
  useEffect(() => {
    const fetchIntake = async () => {
      try {
        const response = await fetch("/api/daily-intake")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json() as WeeklyData[]
        setWeeklyData(data)
        setCurrentIntake(data.find(day => day.current)?.amount || 0)
      } catch (error) {
        console.error("Failed to fetch daily intake:", error)
      }
    }

    fetchIntake()
  }, [])

  function updateWeeklyDataToday(amount: number) {
    const d = weeklyData.find(day => day.current)
    if (d) d.amount = amount
  }

  // Add fluid and update the API
  const addFluid = async (amount: number) => {
    const newIntake = Math.min(currentIntake + amount, fluidLimit)
    setCurrentIntake(newIntake)
    updateWeeklyDataToday(newIntake)

    try {
      const response = await fetch("/api/daily-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: newIntake }),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
    } catch (error) {
      console.error("Failed to update daily intake:", error)
    }
  }

  // Reset tracker and update the API
  const resetTracker = async () => {
    setCurrentIntake(0)
    updateWeeklyDataToday(0)

    try {
      const response = await fetch("/api/daily-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake: 0 }),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
    } catch (error) {
      console.error("Failed to reset daily intake:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Fluid Tracker</CardTitle>
          <CardDescription>Monitor your fluid intake to stay within your recommended limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Today's Intake</h3>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentIntake}ml consumed</span>
              <span>{remaining}ml remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="flex flex-col h-16 p-2" onClick={() => addFluid(200)}>
              <Glass className="h-5 w-5 mb-1" />
              <span className="text-xs">200ml</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-16 p-2" onClick={() => addFluid(150)}>
              <Coffee className="h-5 w-5 mb-1" />
              <span className="text-xs">150ml</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-16 p-2" onClick={() => addFluid(250)}>
              <Droplet className="h-5 w-5 mb-1" />
              <span className="text-xs">250ml</span>
            </Button>
          </div>

          <div className="flex items-end gap-3">
            <div className="space-y-2 flex-1">
              <Label htmlFor="custom-amount">Custom Amount (ml)</Label>
              <Input
                id="custom-amount"
                type="number"
                min="0"
                max={remaining}
                value={customAmount || ""}
                onChange={(e) => setCustomAmount(Number.parseInt(e.target.value) || 0)}
              />
            </div>
            <Button
              onClick={() => {
                if (customAmount > 0) {
                  addFluid(customAmount)
                  setCustomAmount(0)
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetTracker}>
              Reset Tracker
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const newLimit = prompt("Enter new daily fluid limit (in ml):", fluidLimit.toString())
                if (newLimit && !isNaN(Number.parseInt(newLimit))) {
                  //setFluidLimit(Number.parseInt(newLimit))
                }
              }}
            >
              Update Limit
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fluid Intake History</CardTitle>
          <CardDescription>Track your fluid intake over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="week">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="space-y-4 pt-4">
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {day.day} {day.current && "(Today)"}
                      </h3>
                      <span className="text-sm font-medium">{Math.round((day.amount / fluidLimit) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((day.amount / fluidLimit) * 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{day.amount}ml consumed</span>
                      <span>{fluidLimit - day.amount}ml remaining</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="month" className="pt-4">
              <div className="text-center py-8 text-muted-foreground">
                Monthly view will be available in the next update.
              </div>
            </TabsContent>
            <TabsContent value="trends" className="pt-4">
              <div className="text-center py-8 text-muted-foreground">
                Trend analysis will be available in the next update.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

