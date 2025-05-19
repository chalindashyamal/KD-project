"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StaffTaskList } from "@/components/staff/staff-task-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  ClipboardList,
  Bell,
  Clock,
  AlertCircle,
  Search,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { DoctorAppointments } from "@/components/doctor/doctor-appointments"
import { useEffect, useState } from "react"
import request from "@/lib/request"

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    name: "",
    totalPatients: 0,
    todaysAppointments: 0,
    pendingReports: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await request("/api/doctor-dashboard-stats");
        if (!response.ok) {
          console.error("Failed to fetch dashboard stats");
          return;
        }
        const data = await response.json();
        setStats({
          name: `Dr. ${data.name}`,
          totalPatients: data.totalPatients,
          todaysAppointments: data.todaysAppointments,
          pendingReports: data.pendingReports,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {stats.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Patients
          </Button>
          
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Users className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Total Patients</h3>
          <div className="text-3xl font-bold mb-1">{stats.totalPatients}</div>
          <p className="text-sm opacity-90">0 new this month</p>
        </Card>

        <Card className="stat-card gradient-card text-white">
          <div className="card-gradient-overlay" />
          <Calendar className="stat-card-icon h-24 w-24" />
          <h3 className="text-sm font-medium mb-1">Today's Appointments</h3>
          <div className="text-3xl font-bold mb-1">{stats.todaysAppointments}</div>
          <p className="text-sm opacity-90">0 pending confirmations</p>
        </Card>

        
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/doctor/appointments">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <DoctorAppointments/>
          </CardContent>
        </Card>

        

        <Card className="overflow-hidden border-none shadow-md">
          
          <Card className="overflow-hidden border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button size="sm" variant="secondary" asChild>
                <Link href="/staff/tasks">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <StaffTaskList />
          </CardContent>
        </Card>
        
        </Card>
        
      </div>

      

      
    </div>
  )
}

