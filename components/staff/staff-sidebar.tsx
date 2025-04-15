"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Calendar, Activity, Settings, LogOut, Pill, ClipboardList, Droplets, Package } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/staff/dashboard",
  },
  {
    label: "Patients",
    icon: Users,
    href: "/staff/patients",
  },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/staff/appointments",
  },
  {
    label: "Vitals",
    icon: Activity,
    href: "/staff/vitals",
  },
  {
    label: "Medications",
    icon: Pill,
    href: "/staff/medications",
  },
  {
    label: "Dialysis",
    icon: Droplets,
    href: "/staff/dialysis",
  },
  {
    label: "Tasks",
    icon: ClipboardList,
    href: "/staff/tasks",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/staff/inventory",
  },
]

export function StaffSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-primary text-primary-foreground z-10">
      <div className="flex items-center justify-center h-16 border-b border-primary-foreground/10">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center py-4 space-y-4">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className="sidebar-icon">
            <route.icon className="h-6 w-6" />
            <span className="sidebar-tooltip">{route.label}</span>
          </Link>
        ))}
      </div>

      
    </div>
  )
}

