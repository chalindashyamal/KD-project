import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Apple, Droplets, FileText, PieChart, Download } from "lucide-react"
import DietPlan from "@/components/diet-plan"
import FluidTracker from "@/components/fluid-tracker"
import NutritionGuide from "@/components/nutrition-guide"
import FoodDiary from "@/components/food-diary"

export default function DietPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diet & Nutrition</h1>
          <p className="text-muted-foreground">Manage your dietary needs for optimal kidney health</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Diet Plan
        </Button>
      </div>

      
      

      <Tabs defaultValue="plan">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plan">
            <FileText className="mr-2 h-4 w-4" />
            Diet Plan
          </TabsTrigger>
          <TabsTrigger value="fluid">
            <Droplets className="mr-2 h-4 w-4" />
            Fluid Tracker
          </TabsTrigger>
          <TabsTrigger value="guide">
            <Apple className="mr-2 h-4 w-4" />
            Nutrition Guide
          </TabsTrigger>
          <TabsTrigger value="diary">
            <PieChart className="mr-2 h-4 w-4" />
            Food Diary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-6">
          <DietPlan />
        </TabsContent>

        <TabsContent value="fluid" className="mt-6">
          <FluidTracker />
        </TabsContent>

        <TabsContent value="guide" className="mt-6">
          <NutritionGuide />
        </TabsContent>

        <TabsContent value="diary" className="mt-6">
          <FoodDiary />
        </TabsContent>
      </Tabs>
    </div>
  )
}

