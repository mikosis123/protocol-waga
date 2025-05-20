"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import DynamicGlowCard from "@/components/dynamic-glow-card"
import { useToast } from "@/hooks/use-toast"
import { isDevelopment } from "@/lib/supabase"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, error } = await signIn(email, password)

      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        })
      } else {
        toast({
          title: "Login failed",
          description: error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // In development mode, show a bypass option
  if (isDevelopment()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <DynamicGlowCard variant="emerald" className="p-6 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-emerald-400 mb-2">Development Mode</h1>
            <p className="text-gray-400">You're running in development mode. Authentication is bypassed.</p>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-600 to-purple-600"
            onClick={() => {
              window.location.href = "/admin/dashboard"
            }}
          >
            Continue to Admin Dashboard
          </Button>
        </DynamicGlowCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <DynamicGlowCard variant="emerald" className="p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-400 mb-2">Admin Login</h1>
          <p className="text-gray-400">Please sign in with your administrator credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="bg-background/50 border-purple-500/20 focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background/50 border-purple-500/20 focus:border-emerald-500/50"
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-purple-600" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </DynamicGlowCard>
    </div>
  )
}
