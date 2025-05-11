"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import request from "@/lib/request"

interface Task {
  id: number;
  title: string;
  patientId: string;
  patientName: string;
  dueDate: Date; // ISO string or Date object
  dueTime: string;
  priority: string;
  assignedTo: string;
  status: string;
  completed: boolean;
  notes?: string;
  completedBy?: string;
  completedDate?: Date; // ISO string or Date object
  completedTime?: string;
}


export function StaffTaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await request('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.map((task: any) => ({
          ...task,
          patientName: `${task.patient.firstName} ${task.patient.lastName}`,
          dueDate: new Date(task.dueDate), // Convert ISO string to Date object
          completedDate: task.completedDate ? new Date(task.completedDate) : undefined, // Convert ISO string to Date object
        })));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }

    loadTasks();
  }, []);

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-4 p-4 border rounded-lg">
          <Checkbox id={`task-${task.id}`} checked={task.completed} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div>
                <label htmlFor={`task-${task.id}`} className="font-medium cursor-pointer">
                  {task.title}
                </label>
                <p className="text-sm text-muted-foreground">Patient: {task.patientName}</p>
              </div>
              <Badge variant={getPriorityBadgeVariant(task.priority)} className="mt-1 sm:mt-0">
                {task.priority}
              </Badge>
            </div>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>Due by {task.dueTime}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/staff/tasks/${task.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ))}
      <Button variant="outline" className="w-full" asChild>
        <Link href="/staff/tasks">View All Tasks</Link>
      </Button>
    </div>
  )
}

