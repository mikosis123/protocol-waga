"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useCommunity } from "@/context/community-context"
import DynamicGlowCard from "@/components/dynamic-glow-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ThumbsUp, Share, Flag, Send } from "lucide-react"
import Link from "next/link"
import { supabase, isDevelopment } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

// Update the component to use Supabase
export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const { forumTopics } = useCommunity()
  const [topic, setTopic] = useState<any>(null)
  const [replyText, setReplyText] = useState("")
  const { user: authUser } = useAuth()

  // Mock replies
  const [replies, setReplies] = useState([
    {
      id: "reply-1",
      author: {
        id: "user-2",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Coffee Farmer",
      },
      content: "This is really interesting! I've been looking for ways to implement this in my farm.",
      publishDate: new Date().toISOString(),
      likes: 3,
    },
    {
      id: "reply-2",
      author: {
        id: "user-3",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Developer",
      },
      content:
        "Great initiative! I'd love to contribute to this project. Are there any specific areas where you need help?",
      publishDate: new Date().toISOString(),
      likes: 5,
    },
  ])

  useEffect(() => {
    const fetchTopicData = async () => {
      if (isDevelopment()) {
        // In development, use mock data from context
        const foundTopic = forumTopics.find((t) => t.id === params.id)
        if (foundTopic) {
          setTopic(foundTopic)
        } else {
          // If topic not found, redirect to forums page
          router.push("/community/forums")
        }
      } else {
        // In production, fetch from Supabase
        try {
          // Fetch the topic
          const { data: topicData, error: topicError } = await supabase
            .from("forum_topics")
            .select(`
              id, title, content, created_at, is_sticky, is_locked, view_count,
              users!forum_topics_author_id_fkey(id, name, avatar_url),
              forum_categories(name)
            `)
            .eq("id", params.id)
            .single()

          if (topicError) {
            console.error("Error fetching topic:", topicError)
            router.push("/community/forums")
            return
          }

          // Increment view count
          await supabase.rpc("increment_topic_view_count", {
            topic_id: params.id,
          })

          // Fetch replies
          const { data: repliesData, error: repliesError } = await supabase
            .from("forum_replies")
            .select(`
              id, content, created_at,
              users!forum_replies_author_id_fkey(id, name, avatar_url, role)
            `)
            .eq("topic_id", params.id)
            .order("created_at", { ascending: true })

          if (repliesError) {
            console.error("Error fetching replies:", repliesError)
          }

          // Map to our types
          const mappedTopic = {
            id: topicData.id,
            title: topicData.title,
            content: topicData.content,
            category: topicData.forum_categories.name,
            author: {
              id: topicData.users.id,
              name: topicData.users.name,
              avatar: topicData.users.avatar_url || "/placeholder.svg?height=40&width=40",
            },
            publishDate: topicData.created_at,
            isSticky: topicData.is_sticky,
            isLocked: topicData.is_locked,
          }

          const mappedReplies = repliesData
            ? repliesData.map((reply) => ({
                id: reply.id,
                author: {
                  id: reply.users.id,
                  name: reply.users.name,
                  avatar: reply.users.avatar_url || "/placeholder.svg?height=40&width=40",
                  role: reply.users.role,
                },
                content: reply.content,
                publishDate: reply.created_at,
                likes: 0, // We would fetch this from a reactions table in a real implementation
              }))
            : []

          setTopic(mappedTopic)
          setReplies(mappedReplies)
        } catch (error) {
          console.error("Error in forum post page:", error)
          router.push("/community/forums")
        }
      }
    }

    fetchTopicData()
  }, [params.id, router, forumTopics])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    if (isDevelopment()) {
      // In development, use mock data
      // Add new reply
      const newReply = {
        id: `reply-${replies.length + 1}`,
        author: {
          id: "current-user",
          name: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Member",
        },
        content: replyText,
        publishDate: new Date().toISOString(),
        likes: 0,
      }

      setReplies([...replies, newReply])
    } else {
      // In production, use Supabase
      try {
        if (!authUser) {
          toast({
            title: "Error",
            description: "You must be logged in to reply",
            variant: "destructive",
          })
          return
        }

        // Insert the reply
        const { data, error } = await supabase
          .from("forum_replies")
          .insert({
            content: replyText,
            topic_id: params.id,
            author_id: authUser.id,
          })
          .select(`
            id, content, created_at,
            users!forum_replies_author_id_fkey(id, name, avatar_url, role)
          `)
          .single()

        if (error) throw error

        // Map to our type
        const newReply = {
          id: data.id,
          author: {
            id: data.users.id,
            name: data.users.name,
            avatar: data.users.avatar_url || "/placeholder.svg?height=40&width=40",
            role: data.users.role,
          },
          content: data.content,
          publishDate: data.created_at,
          likes: 0,
        }

        // Add to local state
        setReplies([...replies, newReply])

        // Update the topic's last activity
        await supabase.from("forum_topics").update({ last_activity: new Date().toISOString() }).eq("id", params.id)
      } catch (error) {
        console.error("Error submitting reply:", error)
        toast({
          title: "Error",
          description: "Failed to submit reply. Please try again.",
          variant: "destructive",
        })
      }
    }

    setReplyText("")
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-emerald-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/community/forums">
          <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300 p-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forums
          </Button>
        </Link>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <DynamicGlowCard variant="emerald" className="p-6 mb-6">
          <div className="flex items-start">
            <img
              src={topic.author.avatar || "/placeholder.svg"}
              alt={topic.author.name}
              className="h-12 w-12 rounded-full mr-4 border border-emerald-500/30"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-black/30 px-2 py-0.5 rounded-full text-xs text-emerald-300 border border-emerald-500/20">
                  {topic.category}
                </span>
                {topic.isSticky && (
                  <span className="bg-purple-900/30 px-2 py-0.5 rounded-full text-xs text-purple-300 border border-purple-500/20">
                    Pinned
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-200 mb-2">{topic.title}</h1>
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <span>By {topic.author.name}</span>
                <span className="mx-2">•</span>
                <span>Posted on {new Date(topic.publishDate).toLocaleDateString()}</span>
              </div>
              <div className="text-gray-300 mb-6">
                <p>
                  {topic.content ||
                    "Welcome to the WAGA Protocol community! This is a place to discuss all things related to blockchain technology in the coffee industry. Feel free to ask questions, share your experiences, and connect with other members."}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="border-emerald-500/30">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm" className="border-emerald-500/30">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="border-emerald-500/30">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </DynamicGlowCard>
      </motion.div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-emerald-300 mb-4">
          <span className="hero-gradient-text">Replies ({replies.length})</span>
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <motion.div key={reply.id} initial="hidden" animate="visible" variants={fadeIn}>
            <DynamicGlowCard variant="purple" className="p-6">
              <div className="flex items-start">
                <img
                  src={reply.author.avatar || "/placeholder.svg"}
                  alt={reply.author.name}
                  className="h-10 w-10 rounded-full mr-4 border border-emerald-500/30"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-gray-200">{reply.author.name}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{reply.author.role}</span>
                  </div>
                  <div className="text-gray-300 mb-4">
                    <p>{reply.content}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <span>{new Date(reply.publishDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DynamicGlowCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <DynamicGlowCard variant="emerald" className="p-6">
          <h3 className="text-lg font-medium text-emerald-300 mb-4">Leave a Reply</h3>
          <form onSubmit={handleSubmitReply}>
            <div className="mb-4">
              <textarea
                className="w-full p-3 bg-black/30 border border-emerald-500/30 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                rows={4}
                placeholder="Share your thoughts..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-purple-600">
                <Send className="h-4 w-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </form>
        </DynamicGlowCard>
      </motion.div>
    </div>
  )
}
