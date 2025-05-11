"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Bell,
  Search,
  Menu,
  X,
  Home,
  User,
  Calendar,
  Pill,
  Apple,
  MessageSquare,
  Heart,
  Settings,
  BarChart3,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import request from "@/lib/request"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/appointments",
  },
  {
    label: "Medications",
    icon: Pill,
    href: "/medications",
  },
  {
    label: "Diet & Nutrition",
    icon: Apple,
    href: "/diet",
  },
  {
    label: "Health Metrics",
    icon: BarChart3,
    href: "/metrics",
  },
  {
    label: "Chatbot",
    icon: MessageSquare,
    href: "/chatbot",
  },
  {
    label: "Donor Program",
    icon: Heart,
    href: "/donor-program",
  },
]

export default function Header() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getPageTitle = () => {
    const route = routes.find((route) => route.href === pathname)
    return route ? route.label : "KidneyCare"
  }

  const router = useRouter();

  return (
    <header className="h-16 border-b bg-background flex items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-primary text-primary-foreground">
            <div className="flex items-center h-16 px-6 border-b border-primary-foreground/10">
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-xl font-bold">KidneyCare</h1>
            </div>

            <div className="flex-1 py-4">
              <nav className="space-y-1 px-3">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${pathname === route.href
                      ? "bg-primary-foreground/10 text-white"
                      : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-white"
                      }`}
                  >
                    <route.icon className="h-5 w-5 mr-3" />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-primary-foreground/10">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 border-2 border-primary-foreground">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-primary-foreground text-primary">JD</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-primary-foreground/70">Patient ID: PT-12345</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-bold hidden md:block">{getPageTitle()}</h1>

        {isSearchOpen ? (
          <div className="flex items-center w-full md:w-auto md:ml-4">
            <Input placeholder="Search..." className="w-full md:w-64 h-9" autoFocus />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="ml-auto md:ml-4">
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <div className="flex items-center w-full">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span className="font-medium">Upcoming Appointment</span>
                  <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Reminder: Dialysis appointment tomorrow at 10:00 AM
                </p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <div className="flex items-center w-full">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span className="font-medium">Medication Reminder</span>
                  <span className="ml-auto text-xs text-muted-foreground">5h ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Time to take your Tacrolimus (2mg)</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3 cursor-pointer">
                <div className="flex items-center w-full">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span className="font-medium">Lab Results</span>
                  <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Your latest lab results are now available</p>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary font-medium cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={async () => {
                const response = await request("/api/logout", { method: "POST" });
                if (response.ok) {
                  router.push("/login");
                }
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

