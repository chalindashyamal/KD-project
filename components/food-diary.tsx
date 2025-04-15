"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Plus, Clock, Edit, Trash2 } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// In a real app, this would come from an API or database
const foodDiaryEntries = [
  {
    id: 1,
    date: "2025-04-30",
    meal: "Breakfast",
    foods: [
      { name: "White toast", amount: "2 slices", sodium: 150, potassium: 70, phosphorus: 30 },
      { name: "Egg whites", amount: "2", sodium: 110, potassium: 60, phosphorus: 5 },
      { name: "Apple", amount: "1 small", sodium: 0, potassium: 90, phosphorus: 10 },
    ],
    notes: "Felt good after breakfast, no issues.",
  },
  {
    id: 2,
    date: "2025-04-30",
    meal: "Lunch",
    foods: [
      { name: "Chicken sandwich", amount: "1", sodium: 350, potassium: 200, phosphorus: 120 },
      { name: "Green beans", amount: "1/2 cup", sodium: 0, potassium: 90, phosphorus: 20 },
    ],
    notes: "Felt a bit thirsty after lunch, might have been too much sodium.",
  },
  {
    id: 3,
    date: "2025-04-29",
    meal: "Dinner",
    foods: [
      { name: "White rice", amount: "1 cup", sodium: 0, potassium: 55, phosphorus: 68 },
      { name: "Grilled chicken", amount: "3 oz", sodium: 70, potassium: 220, phosphorus: 155 },
      { name: "Carrots", amount: "1/2 cup", sodium: 45, potassium: 180, phosphorus: 30 },
    ],
    notes: "",
  },
]

export default function FoodDiary() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState("entries")

  const filteredEntries = foodDiaryEntries.filter((entry) => entry.date === selectedDate)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDate(date)
      setSelectedDate(format(date, "yyyy-MM-dd"))
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader>
            <CardTitle>Food Diary Calendar</CardTitle>
            <CardDescription>Select a date to view or add entries</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="border rounded-md"
            />
            <div className="mt-4 text-center">
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="mr-2 h-4 w-4" />
                {showAddForm ? "Cancel" : "Add Food Entry"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Food Entries</CardTitle>
                <CardDescription>{date ? format(date, "MMMM d, yyyy") : "Select a date"}</CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="entries">Entries</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="entries" className="mt-0">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No food entries for the selected date.</div>
              ) : (
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge className="mb-2">{entry.meal}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {entry.meal === "Breakfast" ? "Morning" : entry.meal === "Lunch" ? "Midday" : "Evening"}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Entry
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Entry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        {entry.foods.map((food, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {food.name} ({food.amount})
                            </span>
                            <div className="flex space-x-2">
                              <Badge variant="outline" className="text-xs">
                                Na: {food.sodium}mg
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                K: {food.potassium}mg
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                P: {food.phosphorus}mg
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>

                      {entry.notes && (
                        <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                          <span className="font-semibold">Notes:</span> {entry.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="summary" className="mt-0">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No data to summarize for the selected date.
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Nutrient Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Sodium</p>
                        <p className="text-xl font-bold">
                          {filteredEntries.flatMap((e) => e.foods).reduce((sum, food) => sum + food.sodium, 0)}mg
                        </p>
                        <p className="text-xs text-muted-foreground">of 2,000mg limit</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Potassium</p>
                        <p className="text-xl font-bold">
                          {filteredEntries.flatMap((e) => e.foods).reduce((sum, food) => sum + food.potassium, 0)}mg
                        </p>
                        <p className="text-xs text-muted-foreground">of 2,500mg limit</p>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Phosphorus</p>
                        <p className="text-xl font-bold">
                          {filteredEntries.flatMap((e) => e.foods).reduce((sum, food) => sum + food.phosphorus, 0)}mg
                        </p>
                        <p className="text-xs text-muted-foreground">of 1,000mg limit</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Meals Breakdown</h3>
                    <div className="space-y-2">
                      {["Breakfast", "Lunch", "Dinner"].map((mealType) => {
                        const meal = filteredEntries.find((e) => e.meal === mealType)
                        return (
                          <div key={mealType} className="flex justify-between items-center p-2 border-b">
                            <span>{mealType}</span>
                            {meal ? (
                              <Badge variant="outline">{meal.foods.length} items</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted/50">
                                Not recorded
                              </Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

