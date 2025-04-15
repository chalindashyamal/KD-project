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

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-primary text-primary-foreground px-6 py-4">
          <h2 className="text-xl font-semibold">Nutrition Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Fluid Intake</h3>
              <div className="text-2xl font-bold">1.2L / 2L</div>
              <p className="text-xs text-muted-foreground">60% of daily target</p>
            </div>

            <div className="space-y-2 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Potassium</h3>
              <div className="text-2xl font-bold">1,800mg</div>
              <p className="text-xs text-muted-foreground">72% of daily limit</p>
            </div>

            <div className="space-y-2 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Phosphorus</h3>
              <div className="text-2xl font-bold">800mg</div>
              <p className="text-xs text-muted-foreground">80% of daily limit</p>
            </div>

            <div className="space-y-2 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Apple className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Sodium</h3>
              <div className="text-2xl font-bold">1,500mg</div>
              <p className="text-xs text-muted-foreground">75% of daily limit</p>
            </div>
          </div>
        </div>
      </Card>

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

