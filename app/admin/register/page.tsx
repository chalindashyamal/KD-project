"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, UserCog, Stethoscope } from "lucide-react"
import request from "@/lib/request"

export default function AdminRegisterPage() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "doctor",
    specialty: "",
    department: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setRegisterData((prev) => ({
      ...prev,
      role: value,
      specialty: value === "doctor" ? prev.specialty : "",
      department: value === "staff" ? prev.department : "",
    }));
  };

  const handleSpecialtyChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, specialty: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, department: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, username, password, confirmPassword, role, specialty, department } = registerData;

    if (!name || !username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (role === "doctor" && !specialty) {
      setError("Specialty is required for doctors");
      return;
    }
    if (role === "staff" && !department) {
      setError("Department is required for staff");
      return;
    }

    try {
      const response = await request("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password, role, specialty, department }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegisterData({
          name: "",
          username: "",
          password: "",
          confirmPassword: "",
          role: "doctor",
          specialty: "",
          department: "",
        });
        setError("Registration successful!");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Admin Registration</CardTitle>
            <CardDescription>Register new doctors and staff for KidneyCare</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  value={registerData.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={registerData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {registerData.role === "doctor" && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={registerData.specialty} onValueChange={handleSpecialtyChange}>
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
                  <Select value={registerData.department} onValueChange={handleDepartmentChange}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}