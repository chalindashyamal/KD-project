import type React from "react"
import { StaffHeader } from "@/components/staff/staff-header"
import { StaffSidebar } from "@/components/staff/staff-sidebar"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <StaffSidebar />
      <div className="flex-1 ml-16">
        <StaffHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

