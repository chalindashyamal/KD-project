import type React from "react"
import { DoctorHeader } from "@/components/doctor/doctor-header"
import { DoctorSidebar } from "@/components/doctor/doctor-sidebar"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DoctorSidebar />
      <div className="flex-1 ml-16">
        <DoctorHeader />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

