"use client"

import { useEffect } from "react"
import { DashboardContent } from "@/components/admin/DashboardContent"
import { ProtectedGuard } from "@/components/admin/server/AuthGuard"

export default function AdminDashboard() {
  // Set page title
  useEffect(() => {
    document.title = "Dashboard Admin - WELCOMPLAY"
  }, [])

  return (
    <ProtectedGuard>
      <DashboardContent />
    </ProtectedGuard>
  )
}
