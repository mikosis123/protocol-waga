"use client"

import type React from "react"
import { CommunitySidebar } from "@/components/community/community-sidebar"
import { useAuth } from "@/context/auth-context"
import { useWallet } from "@/context/wallet-context"
import { isDevelopment } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DynamicGlowCard from "@/components/dynamic-glow-card"

interface CommunityLayoutProps {
  children: React.ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  const { user, isLoading } = useAuth()
  const { isConnected } = useWallet()

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
        <CommunitySidebar />
        <div className="flex-1 ml-16 md:ml-64 pt-20 px-4">{children}</div>
      </div>
    )
  }

  // If not authenticated or wallet not connected, show access required message
  if (!user || !isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <DynamicGlowCard variant="emerald" className="p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-400 mb-2">Access Required</h1>
            <p className="text-gray-400">Please connect your wallet to access the community area.</p>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-600 to-purple-600"
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </Button>
        </DynamicGlowCard>
      </div>
    )
  }

  // If authenticated, show content
  return (
    <div className="flex min-h-screen">
      <CommunitySidebar />
      <div className="flex-1 ml-16 md:ml-64 pt-20 px-4">{children}</div>
    </div>
  )
}
