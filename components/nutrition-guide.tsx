import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function NutritionGuide() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader>
          <CardTitle>Kidney-Friendly Nutrition Guide</CardTitle>
          <CardDescription>Essential information for managing your diet with kidney disease</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="foods">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="foods">Food Guide</TabsTrigger>
              <TabsTrigger value="nutrients">Key Nutrients</TabsTrigger>
              <TabsTrigger value="tips">Helpful Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="foods" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-600">Recommended Foods</CardTitle>
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <CardDescription>Foods that are generally safe for kidney patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="proteins">
                        <AccordionTrigger>Proteins</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Egg whites</p>
                                <p className="text-xs text-muted-foreground">High quality protein, low in phosphorus</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Chicken (skinless)</p>
                                <p className="text-xs text-muted-foreground">Limit to 3-4 oz portions</p>
                              </div>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="vegetables">
                        <AccordionTrigger>Vegetables</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Green beans</p>
                                <p className="text-xs text-muted-foreground">Low in potassium</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Carrots</p>
                                <p className="text-xs text-muted-foreground">Boil to reduce potassium content</p>
                              </div>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-red-600">Foods to Avoid</CardTitle>
                      <X className="h-5 w-5 text-red-600" />
                    </div>
                    <CardDescription>Foods that may be harmful for kidney patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="proteins">
                        <AccordionTrigger>Proteins</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Processed meats</p>
                                <p className="text-xs text-muted-foreground">High in sodium and phosphorus additives</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Organ meats</p>
                                <p className="text-xs text-muted-foreground">Very high in phosphorus</p>
                              </div>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="vegetables">
                        <AccordionTrigger>Vegetables</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Potatoes</p>
                                <p className="text-xs text-muted-foreground">High in potassium</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium">Tomatoes</p>
                                <p className="text-xs text-muted-foreground">High in potassium</p>
                              </div>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nutrients" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Sodium</CardTitle>
                    <CardDescription>
                      <Badge variant="destructive">Limit to 2,000mg daily</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Sodium affects blood pressure and fluid balance. Too much sodium can cause fluid retention, which
                      puts extra strain on your heart and kidneys.
                    </p>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Tips to reduce sodium:</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          Use herbs and spices instead of salt
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          Choose fresh foods over processed foods
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Potassium</CardTitle>
                    <CardDescription>
                      <Badge variant="destructive">Limit to 2,500mg daily</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">
                      Potassium helps your nerves and muscles work properly. When kidneys are damaged, potassium can
                      build up in your blood to dangerous levels.
                    </p>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Tips to reduce potassium:</h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          Choose low-potassium fruits and vegetables
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          Leach potatoes and other high-potassium vegetables
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tips" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practical Nutrition Tips</CardTitle>
                  <CardDescription>Strategies to help manage your kidney-friendly diet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Meal Planning</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <p className="text-sm">Plan meals for the week in advance to ensure balanced nutrition</p>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <p className="text-sm">Use a food diary to track your intake of key nutrients</p>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Shopping Tips</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <p className="text-sm">Read food labels for sodium, potassium, and phosphorus content</p>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <p className="text-sm">Look for "low sodium" or "no salt added" products</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

