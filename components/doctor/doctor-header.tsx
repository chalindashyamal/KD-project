"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const routes = [
  { label: "Dashboard", href: "/doctor/dashboard" },
  { label: "Patients", href: "/doctor/patients" },
  { label: "Appointments", href: "/doctor/appointments" },
  { label: "Prescriptions", href: "/doctor/prescriptions" },
  { label: "Lab Orders", href: "/doctor/lab-orders" },
  { label: "Medical Records", href: "/doctor/medical-records" },
  { label: "Reports", href: "/doctor/reports" },
  { label: "Messages", href: "/doctor/messages" },
]

export function DoctorHeader() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getPageTitle = () => {
    const route = routes.find((route) => route.href === pathname)
    return route ? route.label : "KidneyCare"
  }

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
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                      pathname === route.href
                        ? "bg-primary-foreground/10 text-white"
                        : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-white"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-bold">{getPageTitle()}</h1>

        {isSearchOpen ? (
          <div className="flex items-center w-full md:w-auto md:ml-4">
            <Input placeholder="Search patients, appointments..." className="w-full md:w-64 h-9 ml-auto" autoFocus />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2">
              <X className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="ml-auto">
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}

