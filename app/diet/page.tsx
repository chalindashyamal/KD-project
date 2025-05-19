"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Check } from "lucide-react"

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

  const latestDietPlan = dietPlans[0] // Display the most recent plan

  if (!latestDietPlan) {
    return <div>No diet plan available</div>
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader>
          <CardTitle>Personalized Diet Plan</CardTitle>
          <CardDescription>Customized nutrition plan for kidney health</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekday">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekday">Weekday Plan</TabsTrigger>
              <TabsTrigger value="weekend">Weekend Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="weekday" className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Breakfast ({latestDietPlan.weekday.breakfast.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekday.breakfast.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Lunch ({latestDietPlan.weekday.lunch.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekday.lunch.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dinner ({latestDietPlan.weekday.dinner.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekday.dinner.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="weekend" className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Breakfast ({latestDietPlan.weekend.breakfast.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekend.breakfast.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Lunch ({latestDietPlan.weekend.lunch.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekend.lunch.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dinner ({latestDietPlan.weekend.dinner.time})</h3>
                <ul className="space-y-2">
                  {latestDietPlan.weekend.dinner.items.map((item: MealItem, index: number) => (
                    <li key={index} className="flex items-start">
                      {item.isWarning ? (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}