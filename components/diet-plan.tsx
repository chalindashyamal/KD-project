import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, X } from "lucide-react"

export default function DietPlan() {
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
                <h3 className="text-lg font-semibold mb-3">Breakfast (7:00 AM - 8:00 AM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Egg white omelet with bell peppers and onions</p>
                      <p className="text-sm text-muted-foreground">Low in phosphorus and potassium</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">White toast with unsalted margarine</p>
                      <p className="text-sm text-muted-foreground">Low sodium option</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Apple (1 small)</p>
                      <p className="text-sm text-muted-foreground">Lower potassium fruit</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Coffee (limit to 1 small cup)</p>
                      <p className="text-sm text-muted-foreground">Count as part of fluid restriction</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Lunch (12:00 PM - 1:00 PM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Chicken sandwich on white bread</p>
                      <p className="text-sm text-muted-foreground">Use unsalted chicken and minimal mayo</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Green beans (1/2 cup)</p>
                      <p className="text-sm text-muted-foreground">Low potassium vegetable</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Grapes (15 small)</p>
                      <p className="text-sm text-muted-foreground">Lower potassium fruit</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dinner (6:00 PM - 7:00 PM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Grilled chicken breast (3 oz)</p>
                      <p className="text-sm text-muted-foreground">Use herbs instead of salt for seasoning</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">White rice (1/2 cup)</p>
                      <p className="text-sm text-muted-foreground">Low potassium grain</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Carrots (1/2 cup, boiled)</p>
                      <p className="text-sm text-muted-foreground">Boiling reduces potassium content</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="weekend" className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Breakfast (7:00 AM - 9:00 AM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Pancakes (2 medium) with maple syrup</p>
                      <p className="text-sm text-muted-foreground">Low phosphorus breakfast option</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Blueberries (1/4 cup)</p>
                      <p className="text-sm text-muted-foreground">Lower potassium fruit</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Lunch (12:00 PM - 2:00 PM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Turkey wrap with white tortilla</p>
                      <p className="text-sm text-muted-foreground">Use unsalted turkey and minimal mayo</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Cucumber slices (1/2 cup)</p>
                      <p className="text-sm text-muted-foreground">Low potassium vegetable</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dinner (6:00 PM - 8:00 PM)</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Pasta with olive oil and herbs (1 cup)</p>
                      <p className="text-sm text-muted-foreground">Low potassium and phosphorus meal</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Green beans (1/2 cup)</p>
                      <p className="text-sm text-muted-foreground">Low potassium vegetable</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader>
          <CardTitle>Dietary Restrictions</CardTitle>
          <CardDescription>Important limitations for kidney health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <Badge variant="destructive" className="mb-2">
                Limit Sodium
              </Badge>
              <p className="text-sm">Daily limit: 2,000mg</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Avoid:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Processed foods
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Canned soups
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Fast food
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Badge variant="destructive" className="mb-2">
                Limit Potassium
              </Badge>
              <p className="text-sm">Daily limit: 2,500mg</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Avoid:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Bananas
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Potatoes
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Tomatoes
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Badge variant="destructive" className="mb-2">
                Limit Phosphorus
              </Badge>
              <p className="text-sm">Daily limit: 1,000mg</p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Avoid:</p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Dairy products
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Nuts and seeds
                  </li>
                  <li className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-2" />
                    Whole grains
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

