"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase, isDevelopment } from "@/lib/supabase"

type User = {
  id: string
  email?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In development mode, set a mock user
    if (isDevelopment()) {
      setUser({
        id: "dev-user-id",
        email: "dev@example.com",
        role: "admin",
      })
      setIsLoading(false)
      return
    }

    // In production, check for an existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking session:", error)
          setUser(null)
        } else if (data?.session?.user) {
          // Get user role from the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.session.user.id)
            .single()

          setUser({
            id: data.session.user.id,
            email: data.session.user.email,
            role: userData?.role || "community_member",
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Unexpected error during session check:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get user role from the users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()

        setUser({
          id: session.user.id,
          email: session.user.email,
          role: userData?.role || "community_member",
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (isDevelopment()) {
      // In development, always succeed
      setUser({
        id: "dev-user-id",
        email: email,
        role: "admin",
      })
      return { success: true }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get user role from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single()

      setUser({
        id: data.user.id,
        email: data.user.email,
        role: userData?.role || "community_member",
      })

      return { success: true }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    if (isDevelopment()) {
      // In development, just clear the user
      setUser(null)
      return
    }

    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>{children}</AuthContext.Provider>
}
