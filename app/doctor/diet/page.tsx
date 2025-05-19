"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

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
    const params = useSearchParams()
    const patientId= params?.get('patientId')||''
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
      // Validate patientId
      if (!patientId) {
        alert("Error: Patient ID is missing")
        return
      }

      // Validate diet plan data
      const hasItems = Object.values(dietPlan.weekday).some(meal => meal.items.length > 0) ||
                      Object.values(dietPlan.weekend).some(meal => meal.items.length > 0)
      if (!hasItems) {
        alert("Error: Please add at least one meal item")
        return
      }

      const response = await fetch("/api/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, weekday: dietPlan.weekday, weekend: dietPlan.weekend }),
      })

      if (response.ok) {
        alert("Diet plan saved successfully!")
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
      } else {
        const errorData = await response.text() // Use text() to avoid JSON parse error
        console.error("API Response Error:", errorData)
        alert(`Error: Failed to save diet plan. ${errorData}`)
      }
    } catch (error) {
      console.error("Submission Error:", error)
      alert(`Error: Failed to save diet plan. ${error.message}`)
    }
  }

  const renderMealForm = (day: "weekday" | "weekend", meal: "breakfast" | "lunch" | "dinner") => {
    const mealData = dietPlan[day][meal]
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${day}-${meal}-time`}>Meal Time</Label>
          <Input
            id={`${day}-${meal}-time`}
            value={mealData.time}
            onChange={(e) => updateMealTime(day, meal, e.target.value)}
            placeholder="e.g., 7:00 AM - 8:00 AM"
            className="max-w-xs"
          />
        </div>
        <div className="space-y-2">
          <Label>Meal Items</Label>
          {mealData.items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Item name (e.g., Egg white omelet)"
                  value={item.name}
                  onChange={(e) => updateMealItem(day, meal, index, "name", e.target.value)}
                />
                <Textarea
                  placeholder="Description (e.g., Low in phosphorus)"
                  value={item.description}
                  onChange={(e) => updateMealItem(day, meal, index, "description", e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id={`${day}-${meal}-${index}-warning`}
                    checked={item.isWarning || false}
                    onChange={(e) => updateMealItem(day, meal, index, "isWarning", e.target.checked)}
                  />
                  <Label htmlFor={`${day}-${meal}-${index}-warning`}>Mark as Warning</Label>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                type="button"
                onClick={() => removeMealItem(day, meal, index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            type="button"
            onClick={() => addMealItem(day, meal)}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Create Diet Plan</CardTitle>
          <CardDescription>Enter a customized nutrition plan for kidney health</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="weekday">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekday">Weekday Plan</TabsTrigger>
                <TabsTrigger value="weekend">Weekend Plan</TabsTrigger>
              </TabsList>

              <TabsContent value="weekday" className="mt-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Breakfast</h3>
                  {renderMealForm("weekday", "breakfast")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Lunch</h3>
                  {renderMealForm("weekday", "lunch")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dinner</h3>
                  {renderMealForm("weekday", "dinner")}
                </div>
              </TabsContent>

              <TabsContent value="weekend" className="mt-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Breakfast</h3>
                  {renderMealForm("weekend", "breakfast")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Lunch</h3>
                  {renderMealForm("weekend", "lunch")}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dinner</h3>
                  {renderMealForm("weekend", "dinner")}
                </div>
              </TabsContent>
            </Tabs>
            <Button type="submit" className="mt-6">
              Save Diet Plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}