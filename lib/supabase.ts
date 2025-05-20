import { createClient } from "@supabase/supabase-js"

// Check if we're in a development environment
export const isDevelopment = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  )
}

// Create a Supabase client
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Using development mode.")

    // Return a mock client for development
    if (isDevelopment()) {
      return {
        auth: {
          signInWithPassword: async () => ({ data: { user: { id: "mock-user-id" } }, error: null }),
          signOut: async () => ({ error: null }),
          getSession: async () => ({
            data: { session: { user: { id: "mock-user-id", email: "admin@example.com", role: "admin" } } },
            error: null,
          }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: {}, error: null }),
            }),
          }),
        }),
      }
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance of the Supabase client
export const supabase = createSupabaseClient()
