"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Heart, User, UserCog, Stethoscope } from "lucide-react"

// Sample user credentials
const users = {
  patients: [
    { id: "P001", username: "john.doe", password: "patient123", name: "John Doe" },
    { id: "P002", username: "sarah.smith", password: "patient123", name: "Sarah Smith" },
    { id: "P003", username: "mike.johnson", password: "patient123", name: "Mike Johnson" },
  ],
  doctors: [
    { id: "D001", username: "dr.wilson", password: "doctor123", name: "Dr. James Wilson" },
    { id: "D002", username: "dr.patel", password: "doctor123", name: "Dr. Priya Patel" },
    { id: "D003", username: "dr.chen", password: "doctor123", name: "Dr. Lisa Chen" },
  ],
  staff: [
    { id: "S001", username: "nurse.adams", password: "staff123", name: "Nurse Emily Adams" },
    { id: "S002", username: "tech.brown", password: "staff123", name: "Tech Robert Brown" },
    { id: "S003", username: "admin.garcia", password: "staff123", name: "Admin Maria Garcia" },
  ],
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [userRole, setUserRole] = useState("patient")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let userFound = false
    let userId = ""

    if (userRole === "patient") {
      const patient = users.patients.find((p) => p.username === username && p.password === password)
      if (patient) {
        userFound = true
        userId = patient.id
      }
    } else if (userRole === "doctor") {
      const doctor = users.doctors.find((d) => d.username === username && d.password === password)
      if (doctor) {
        userFound = true
        userId = doctor.id
      }
    } else if (userRole === "staff") {
      const staff = users.staff.find((s) => s.username === username && s.password === password)
      if (staff) {
        userFound = true
        userId = staff.id
      }
    }

    if (userFound) {
      // In a real app, you would set authentication tokens/cookies here
      localStorage.setItem("userRole", userRole)
      localStorage.setItem("userId", userId)

      // Redirect based on role
      if (userRole === "patient") {
        router.push("/")
      } else if (userRole === "doctor") {
        router.push("/doctor/dashboard")
      } else if (userRole === "staff") {
        router.push("/staff/dashboard")
      }
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">KidneyCare</h1>
          <p className="text-muted-foreground">Comprehensive Kidney Patient Management System</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" onValueChange={(value) => setUserRole(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="patient" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctor
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Staff
                </TabsTrigger>
              </TabsList>

              <TabsContent value="patient">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="john.doe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Login as Patient
                  </Button>
                </form>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Sample patient login:</p>
                  <p>Username: john.doe</p>
                  <p>Password: patient123</p>
                </div>
              </TabsContent>

              <TabsContent value="doctor">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="dr.wilson"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Login as Doctor
                  </Button>
                </form>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Sample doctor login:</p>
                  <p>Username: dr.wilson</p>
                  <p>Password: doctor123</p>
                </div>
              </TabsContent>

              <TabsContent value="staff">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="nurse.adams"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Login as Staff
                  </Button>
                </form>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Sample staff login:</p>
                  <p>Username: nurse.adams</p>
                  <p>Password: staff123</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">
              <a href="#" className="hover:underline">
                Forgot password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

