"use client"

import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface MealItem {
  name: string
  description: string
  isWarning?: boolean
}

interface Meal {
  time: string
  items: MealItem[]
}

interface DietPlan {
  weekday: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
  }
  weekend: {
    breakfast: Meal
    lunch: Meal
    dinner: Meal
  }
}

export default function DietPlanForm() {
  return <Suspense>
    <DietPlanFormView/>
  </Suspense>
}

function DietPlanFormView() {
  const params = useSearchParams()
  const patientId = params?.get('patientId') || ''
  const [dietPlan, setDietPlan] = useState<DietPlan>({
    weekday: {
      breakfast: { time: "7:00 AM - 8:00 AM", items: [] },
      lunch: { time: "12:00 PM - 1:00 PM", items: [] },
      dinner: { time: "6:00 PM - 7:00 PM", items: [] },
    },
    weekend: {
      breakfast: { time: "7:00 AM - 9:00 AM", items: [] },
      lunch: { time: "12:00 PM - 2:00 PM", items: [] },
      dinner: { time: "6:00 PM - 8:00 PM", items: [] },
    },
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const addMealItem = (day: "weekday" | "weekend", meal: "breakfast" | "lunch" | "dinner") => {
    setDietPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          items: [...prev[day][meal].items, { name: "", description: "", isWarning: false }],
        },
      },
    }))
  }

  const updateMealItem = (
    day: "weekday" | "weekend",
    meal: "breakfast" | "lunch" | "dinner",
    index: number,
    field: "name" | "description" | "isWarning",
    value: string | boolean
  ) => {
    setDietPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          items: prev[day][meal].items.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          ),
        },
      },
    }))
  }

  const removeMealItem = (day: "weekday" | "weekend", meal: "breakfast" | "lunch" | "dinner", index: number) => {
    setDietPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          items: prev[day][meal].items.filter((_, i) => i !== index),
        },
      },
    }))
  }

  const updateMealTime = (
    day: "weekday" | "weekend",
    meal: "breakfast" | "lunch" | "dinner",
    time: string
  ) => {
    setDietPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          time,
        },
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!patientId) {
        setMessage({ type: "error", text: "Patient ID is missing." })
        return
      }

      const hasItems = Object.values(dietPlan.weekday).some(meal => meal.items.length > 0) ||
                      Object.values(dietPlan.weekend).some(meal => meal.items.length > 0)
      if (!hasItems) {
        setMessage({ type: "error", text: "Please add at least one meal item." })
        return
      }

      const response = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, weekday: dietPlan.weekday, weekend: dietPlan.weekend }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Diet plan saved successfully!" })
        setTimeout(() => {
          setDietPlan({
            weekday: {
              breakfast: { time: "7:00 AM - 8:00 AM", items: [] },
              lunch: { time: "12:00 PM - 1:00 PM", items: [] },
              dinner: { time: "6:00 PM - 7:00 PM", items: [] },
            },
            weekend: {
              breakfast: { time: "7:00 AM - 9:00 AM", items: [] },
              lunch: { time: "12:00 PM - 2:00 PM", items: [] },
              dinner: { time: "6:00 PM - 8:00 PM", items: [] },
            },
          })
          setMessage(null)
        }, 2000)
      } else {
        const errorData = await response.text()
        console.error("API Response Error:", errorData)
        setMessage({ type: "error", text: `Failed to save diet plan: ${errorData}` })
      }
    } catch (error) {
      console.error("Submission Error:", error)
      setMessage({ type: "error", text: `Failed to save diet plan: ${error.message}` })
    }
  }

  const renderMealForm = (day: "weekday" | "weekend", meal: "breakfast" | "lunch" | "dinner") => {
    const mealData = dietPlan[day][meal]
    return (
      <div className="space-y-3">
        <div className="max-w-xs">
          <Label htmlFor={`${day}-${meal}-time`} className="text-xs font-medium">
            Meal Time
          </Label>
          <Input
            id={`${day}-${meal}-time`}
            value={mealData.time}
            onChange={(e) => updateMealTime(day, meal, e.target.value)}
            placeholder="e.g., 7:00 AM - 8:00 AM"
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium">Meal Items</Label>
          {mealData.items.length === 0 && (
            <p className="text-xs text-muted-foreground">No items added yet.</p>
          )}
          {mealData.items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col sm:flex-row sm:items-end gap-2 p-2 rounded-md",
                item.isWarning ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"
              )}
            >
              <div className="flex-1 space-y-2">
                <div>
                  <Label htmlFor={`${day}-${meal}-${index}-name`} className="text-xs">
                    Item Name
                  </Label>
                  <Input
                    id={`${day}-${meal}-${index}-name`}
                    placeholder="e.g., Egg white omelet"
                    value={item.name}
                    onChange={(e) => updateMealItem(day, meal, index, "name", e.target.value)}
                    className="mt-1 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label htmlFor={`${day}-${meal}-${index}-description`} className="text-xs">
                    Description
                  </Label>
                  <Textarea
                    id={`${day}-${meal}-${index}-description`}
                    placeholder="e.g., Low in phosphorus"
                    value={item.description}
                    onChange={(e) => updateMealItem(day, meal, index, "description", e.target.value)}
                    className="mt-1 min-h-[60px] text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    id={`${day}-${meal}-${index}-warning`}
                    checked={item.isWarning || false}
                    onChange={(e) => updateMealItem(day, meal, index, "isWarning", e.target.checked)}
                    className="h-3 w-3"
                  />
                  <Label
                    htmlFor={`${day}-${meal}-${index}-warning`}
                    className="text-xs text-muted-foreground"
                  >
                    Mark as Warning
                  </Label>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => removeMealItem(day, meal, index)}
                className="h-7 w-7 shrink-0 hover:bg-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => addMealItem(day, meal)}
            className="w-full sm:w-auto hover:bg-gray-100 text-xs h-8"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <Card className="border-none shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg">Create Diet Plan</CardTitle>
          <CardDescription className="text-xs">
            Customize a nutrition plan for kidney health
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {message && (
            <div
              className={cn(
                "p-2 rounded-md text-xs",
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="weekday" className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-[240px] mb-2 h-8">
                <TabsTrigger value="weekday" className="text-xs h-7">
                  Weekday Plan
                </TabsTrigger>
                <TabsTrigger value="weekend" className="text-xs h-7">
                  Weekend Plan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weekday" className="mt-2 space-y-4">
                <section className="border-b pb-3">
                  <h3 className="text-sm font-semibold mb-2">Breakfast</h3>
                  {renderMealForm("weekday", "breakfast")}
                </section>
                <section className="border-b pb-3">
                  <h3 className="text-sm font-semibold mb-2">Lunch</h3>
                  {renderMealForm("weekday", "lunch")}
                </section>
                <section>
                  <h3 className="text-sm font-semibold mb-2">Dinner</h3>
                  {renderMealForm("weekday", "dinner")}
                </section>
              </TabsContent>

              <TabsContent value="weekend" className="mt-2 space-y-4">
                <section className="border-b pb-3">
                  <h3 className="text-sm font-semibold mb-2">Breakfast</h3>
                  {renderMealForm("weekend", "breakfast")}
                </section>
                <section className="border-b pb-3">
                  <h3 className="text-sm font-semibold mb-2">Lunch</h3>
                  {renderMealForm("weekend", "lunch")}
                </section>
                <section>
                  <h3 className="text-sm font-semibold mb-2">Dinner</h3>
                  {renderMealForm("weekend", "dinner")}
                </section>
              </TabsContent>
            </Tabs>
            <Button
              type="submit"
              size="sm"
              className="mt-4 w-full sm:w-auto px-4 py-1 text-xs h-8"
            >
              Save Diet Plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}