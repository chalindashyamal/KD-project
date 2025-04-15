import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export function StaffTaskList() {
  // Sample task data
  const tasks = [
    {
      id: 1,
      title: "Record vitals for John Doe",
      patientId: "PT-12345",
      patientName: "John Doe",
      dueTime: "11:00 AM",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Administer medication to Sarah Smith",
      patientId: "PT-23456",
      patientName: "Sarah Smith",
      dueTime: "11:30 AM",
      priority: "Medium",
      completed: false,
    },
    {
      id: 3,
      title: "Prepare dialysis machine for Robert Wilson",
      patientId: "PT-56789",
      patientName: "Robert Wilson",
      dueTime: "12:00 PM",
      priority: "High",
      completed: false,
    },
    {
      id: 4,
      title: "Check fluid balance for Mike Johnson",
      patientId: "PT-34567",
      patientName: "Mike Johnson",
      dueTime: "1:30 PM",
      priority: "Medium",
      completed: false,
    },
  ]

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

