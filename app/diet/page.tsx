"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check } from "lucide-react"
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
  id: string
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

export default function DietPlan({ patientId }: { patientId: string }) {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])

  useEffect(() => {
    const fetchDietPlans = async () => {
      try {
        const response = await fetch(`/api/diet`)
        if (response.ok) {
          const data = await response.json()
          setDietPlans(data)
        } else {
          console.error("Failed to fetch diet plans")
        }
      } catch (error) {
        console.error("Error fetching diet plans:", error)
      }
    }
    fetchDietPlans()
  }, [patientId])

  const latestDietPlan = dietPlans[0]

  if (!latestDietPlan) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        No diet plan available
      </div>
    )
  }

  const renderMealCard = (meal: Meal, mealName: string) => (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl">{mealName}</CardTitle>
        <CardDescription className="text-sm">{meal.time}</CardDescription>
      </CardHeader>
      <CardContent>
        {meal.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items added for this meal.</p>
        ) : (
          <ul className="space-y-3">
            {meal.items.map((item: MealItem, index: number) => (
              <li
                key={index}
                className={cn(
                  "flex items-start p-2 rounded-md",
                  item.isWarning ? "bg-yellow-50" : "bg-gray-50"
                )}
              >
                {item.isWarning ? (
                  <AlertCircle
                    className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0"
                    title="Warning: Consult your nutritionist"
                  />
                ) : (
                  <Check
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0"
                    title="Safe to consume"
                  />
                )}
                <div>
                  <p className="font-medium text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Personalized Diet Plan</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Customized nutrition plan for kidney health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekday" className="w-full">
            <TabsList className="grid grid-cols-2 w-full sm:w-[300px] mb-4">
              <TabsTrigger
                value="weekday"
                className="py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Weekday Plan
              </TabsTrigger>
              <TabsTrigger
                value="weekend"
                className="py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Weekend Plan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="weekday" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderMealCard(latestDietPlan.weekday.breakfast, "Breakfast")}
                {renderMealCard(latestDietPlan.weekday.lunch, "Lunch")}
                {renderMealCard(latestDietPlan.weekday.dinner, "Dinner")}
              </div>
            </TabsContent>

            <TabsContent value="weekend" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {renderMealCard(latestDietPlan.weekend.breakfast, "Breakfast")}
                {renderMealCard(latestDietPlan.weekend.lunch, "Lunch")}
                {renderMealCard(latestDietPlan.weekend.dinner, "Dinner")}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}