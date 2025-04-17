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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Heart, User, UserCog, Stethoscope } from "lucide-react"

interface User {
  id: string
  username: string
  password: string
  name: string
  specialty?: string // For doctors
  department?: string // For staff
}

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState("patient")
  const [error, setError] = useState("")
  const [users, setUsers] = useState<{
    patients: User[]
    doctors: User[]
    staff: User[]
  }>({
    patients: [
      { id: "P001", username: "john.doe", password: "patient123", name: "John Doe" },
      { id: "P002", username: "sarah.smith", password: "patient123", name: "Sarah Smith" },
      { id: "P003", username: "mike.johnson", password: "patient123", name: "Mike Johnson" },
    ],
    doctors: [
      { id: "D001", username: "dr.wilson", password: "doctor123", name: "Dr. James Wilson", specialty: "Nephrology" },
      { id: "D002", username: "dr.patel", password: "doctor123", name: "Dr. Priya Patel", specialty: "Transplant Surgery" },
      { id: "D003", username: "dr.chen", password: "doctor123", name: "Dr. Lisa Chen", specialty: "Internal Medicine" },
    ],
    staff: [
      { id: "S001", username: "nurse.adams", password: "staff123", name: "Nurse Emily Adams", department: "Dialysis Unit" },
      { id: "S002", username: "tech.brown", password: "staff123", name: "Tech Robert Brown", department: "Lab Services" },
      { id: "S003", username: "admin.garcia", password: "staff123", name: "Admin Maria Garcia", department: "Administration" },
    ],
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    specialty: "",
    department: "",
  })

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
      localStorage.setItem("userRole", userRole)
      localStorage.setItem("userId", userId)

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

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { name, username, password, confirmPassword, role, specialty, department } = registerData

    // Basic validation
    if (!name || !username || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (role === "doctor" && !specialty) {
      setError("Specialty is required for doctors")
      return
    }
    if (role === "staff" && !department) {
      setError("Department is required for staff")
      return
    }
    if ([...users.patients, ...users.doctors, ...users.staff].some((u) => u.username === username)) {
      setError("Username already exists")
      return
    }

    // Generate new user ID
    const newId = (() => {
      if (role === "patient") {
        const lastId = users.patients.length ? parseInt(users.patients[users.patients.length - 1].id.slice(1)) : 0
        return `P${(lastId + 1).toString().padStart(3, "0")}`
      } else if (role === "doctor") {
        const lastId = users.doctors.length ? parseInt(users.doctors[users.doctors.length - 1].id.slice(1)) : 0
        return `D${(lastId + 1).toString().padStart(3, "0")}`
      } else {
        const lastId = users.staff.length ? parseInt(users.staff[users.staff.length - 1].id.slice(1)) : 0
        return `S${(lastId + 1).toString().padStart(3, "0")}`
      }
    })()

    // Create new user
    const newUser: User = { id: newId, name, username, password, ...(role === "doctor" && { specialty }), ...(role === "staff" && { department }) }

    // Update users state
    setUsers((prev) => ({
      patients: role === "patient" ? [...prev.patients, newUser] : prev.patients,
      doctors: role === "doctor" ? [...prev.doctors, newUser] : prev.doctors,
      staff: role === "staff" ? [...prev.staff, newUser] : prev.staff,
    }))

    // Reset form and switch to login tab
    setRegisterData({
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      role: "patient",
      specialty: "",
      department: "",
    })
    setActiveTab("login")
    setError("Registration successful! Please log in.")
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
            <CardTitle>{activeTab === "login" ? "Login to Your Account" : "Register for an Account"}</CardTitle>
            <CardDescription>
              {activeTab === "login" ? "Enter your credentials to access the system" : "Create a new account to join KidneyCare"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Tabs defaultValue="patient" onValueChange={(value) => setUserRole(value)}>
                  <TabsList className="grid w-full grid-cols-3 mt-4">
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
                        <Alert variant={error.includes("successful") ? "default" : "destructive"}>
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
                        <Alert variant={error.includes("successful") ? "default" : "destructive"}>
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
                        <Alert variant={error.includes("successful") ? "default" : "destructive"}>
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
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="Enter a unique username"
                      value={registerData.username}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      name="role"
                      value={registerData.role}
                      onValueChange={(value) => setRegisterData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {registerData.role === "doctor" && (
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select
                        name="specialty"
                        value={registerData.specialty}
                        onValueChange={(value) => setRegisterData((prev) => ({ ...prev, specialty: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nephrology">Nephrology</SelectItem>
                          <SelectItem value="Transplant Surgery">Transplant Surgery</SelectItem>
                          <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                          <SelectItem value="Urology">Urology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {registerData.role === "staff" && (
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        name="department"
                        value={registerData.department}
                        onValueChange={(value) => setRegisterData((prev) => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dialysis Unit">Dialysis Unit</SelectItem>
                          <SelectItem value="Lab Services">Lab Services</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Nursing">Nursing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {error && (
                    <Alert variant={error.includes("successful") ? "default" : "destructive"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">
              {activeTab === "login" ? (
                <a href="#" className="hover:underline">
                  Forgot password?
                </a>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button onClick={() => setActiveTab("login")} className="hover:underline text-primary">
                    Login here
                  </button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
