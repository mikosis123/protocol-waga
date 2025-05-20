"use client"

import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAuth } from "@/context/auth-context"
import AdminLogin from "@/components/admin/admin-login"
import { isDevelopment } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading, isAdmin } = useAuth()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  // If in development mode, allow access
  if (isDevelopment()) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 ml-16 md:ml-64 pt-20 px-4">{children}</div>
      </div>
    )
  }

  // If not authenticated or not admin, show login
  if (!user || !isAdmin) {
    return <AdminLogin />
  }

  // If authenticated and admin, show content
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-16 md:ml-64 pt-20 px-4">{children}</div>
    </div>
  )
}
