"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/community/dashboard-header"
import DynamicGlowCard from "@/components/dynamic-glow-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Add supabase import
import { supabase, isDevelopment } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

// Update the component to use Supabase
export default function NewTopicPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("General")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user: authUser } = useAuth()
  const [categories, setCategories] = useState([
    { id: "1", name: "General" },
    { id: "2", name: "Announcements" },
    { id: "3", name: "Questions" },
    { id: "4", name: "Technical" },
  ])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isDevelopment()) {
        try {
          const { data, error } = await supabase
            .from("forum_categories")
            .select("id, name")
            .order("order", { ascending: true })

          if (error) throw error

          if (data && data.length > 0) {
            setCategories(data)
            setCategory(data[0].name)
          }
        } catch (error) {
          console.error("Error fetching categories:", error)
        }
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    try {
      if (isDevelopment()) {
        // In development, simulate API call
        setTimeout(() => {
          // Redirect to forums page after submission
          router.push("/community/forums")
        }, 1000)
      } else {
        // In production, use Supabase
        if (!authUser) {
          toast({
            title: "Error",
            description: "You must be logged in to create a topic",
            variant: "destructive",
          })
          return
        }

        // Get the category ID
        const selectedCategory = categories.find((c) => c.name === category)

        if (!selectedCategory) {
          throw new Error("Invalid category")
        }

        // Insert the topic
        const { data, error } = await supabase.from("forum_topics").insert({
          title,
          content,
          category_id: selectedCategory.id,
          author_id: authUser.id,
        })

        if (error) throw error

        // Redirect to forums page
        router.push("/community/forums")
      }
    } catch (error) {
      console.error("Error creating topic:", error)
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        title="Create New Topic"
        description="Share your thoughts, questions, or ideas with the community"
      />

      <div className="mb-6">
        <Link href="/community/forums">
          <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forums
          </Button>
        </Link>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <DynamicGlowCard variant="emerald" className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-emerald-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-black/30 border border-emerald-500/30 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-emerald-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-black/30 border border-emerald-500/30 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-emerald-300 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-black/30 border border-emerald-500/30 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                rows={10}
                placeholder="Share your thoughts, questions, or ideas..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-purple-600" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Create Topic
                  </>
                )}
              </Button>
            </div>
          </form>
        </DynamicGlowCard>
      </motion.div>
    </div>
  )
}
