"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coffee, Droplet, GlassWaterIcon as Glass, Plus } from "lucide-react"

export default function FluidTracker() {
  const [fluidLimit] = useState(2000) // 2 liters in ml
  const [currentIntake, setCurrentIntake] = useState(1200) // 1.2 liters in ml
  const [customAmount, setCustomAmount] = useState(0)

  const percentage = Math.min(Math.round((currentIntake / fluidLimit) * 100), 100)
  const remaining = Math.max(fluidLimit - currentIntake, 0)

  const addFluid = (amount: number) => {
    setCurrentIntake((prev) => Math.min(prev + amount, fluidLimit))
  }

  const resetTracker = () => {
    setCurrentIntake(0)
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
                {[
                  { day: "Monday", amount: 1800, limit: 2000 },
                  { day: "Tuesday", amount: 1950, limit: 2000 },
                  { day: "Wednesday", amount: 1700, limit: 2000 },
                  { day: "Thursday", amount: 2000, limit: 2000 },
                  { day: "Friday", amount: 1850, limit: 2000 },
                  { day: "Saturday", amount: 1900, limit: 2000 },
                  { day: "Sunday", amount: 1200, limit: 2000, current: true },
                ].map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">
                        {day.day} {day.current && "(Today)"}
                      </h3>
                      <span className="text-sm font-medium">{Math.round((day.amount / day.limit) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((day.amount / day.limit) * 100)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{day.amount}ml consumed</span>
                      <span>{day.limit - day.amount}ml remaining</span>
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

