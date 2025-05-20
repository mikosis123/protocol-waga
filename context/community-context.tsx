"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Add supabase import
import { supabase, isDevelopment } from "@/lib/supabase"
import { useAuth } from "@/context/auth-context"

// Define types for all entities
type User = {
  id: string
  name: string
  avatar: string
  role: "member" | "moderator" | "admin"
  joinDate: string
  reputation: number
  badges: string[]
}

type Activity = {
  id: string
  type: "post" | "comment" | "resource" | "event" | "reaction"
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
  }
  timestamp: string
  url: string
}

type Event = {
  id: string
  title: string
  description: string
  type: "webinar" | "workshop" | "ama" | "conference"
  date: string
  time: string
  duration: number
  speakers: {
    id: string
    name: string
    avatar: string
    bio: string
  }[]
  registeredCount: number
  capacity: number
  isRegistered: boolean
}

type Resource = {
  id: string
  title: string
  description: string
  type: "guide" | "tutorial" | "whitepaper" | "video"
  author: {
    id: string
    name: string
    avatar: string
  }
  publishDate: string
  downloadCount: number
  rating: number
  url: string
}

type ForumTopic = {
  id: string
  title: string
  category: string
  author: {
    id: string
    name: string
    avatar: string
  }
  publishDate: string
  replyCount: number
  viewCount: number
  lastActivity: string
  isSticky: boolean
  isLocked: boolean
  url: string
}

type CommunityContextType = {
  user: User | null
  activities: Activity[]
  events: Event[]
  resources: Resource[]
  forumTopics: ForumTopic[]
  isLoading: boolean
  error: string | null
  fetchUserActivity: () => Promise<void>
  registerForEvent: (eventId: string) => Promise<void>
  createForumTopic: (topic: Partial<ForumTopic>) => Promise<void>
  downloadResource: (resourceId: string) => Promise<void>
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

// Mock API functions - would be replaced with real API calls
const fetchCommunityData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Get current date for realistic timestamps
  const currentDate = new Date()

  // Helper to create dates relative to today
  const daysAgo = (days: number) => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  // Helper to create future dates
  const daysFromNow = (days: number) => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + days)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Mock user data
  const user: User = {
    id: "user-1",
    name: "Maria Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "member",
    joinDate: daysAgo(2),
    reputation: 2,
    badges: ["Early Adopter"],
  }

  // Mock activities
  const activities: Activity[] = [
    {
      id: "activity-1",
      type: "post",
      title: "Welcome to WAGA Protocol Community",
      content: "We're excited to launch our community platform. Feel free to introduce yourself!",
      author: {
        id: "user-admin",
        name: "WAGA Admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: daysAgo(1),
      url: "/community/forum/post/1",
    },
    {
      id: "activity-2",
      type: "resource",
      title: "Getting Started with WAGA Protocol",
      content: "A beginner's guide to understanding the WAGA Protocol ecosystem",
      author: {
        id: "user-admin",
        name: "WAGA Admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: daysAgo(1),
      url: "/community/resources/getting-started",
    },
  ]

  // Mock events
  const events: Event[] = [
    {
      id: "event-1",
      title: "WAGA Protocol Introduction Webinar",
      description:
        "Join us for an introduction to the WAGA Protocol and learn how it's transforming the coffee industry",
      type: "webinar",
      date: daysFromNow(7),
      time: "14:00",
      duration: 60,
      speakers: [
        {
          id: "speaker-1",
          name: "Daniel Kimathi",
          avatar: "/placeholder.svg?height=60&width=60",
          bio: "Lead Developer at WAGA Protocol",
        },
      ],
      registeredCount: 3,
      capacity: 100,
      isRegistered: false,
    },
  ]

  // Mock resources
  const resources: Resource[] = [
    {
      id: "resource-1",
      title: "WAGA Protocol Introduction",
      description: "An overview of the WAGA Protocol and its mission",
      type: "guide",
      author: {
        id: "user-admin",
        name: "WAGA Protocol Team",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishDate: daysAgo(1),
      downloadCount: 2,
      rating: 5.0,
      url: "/resources/waga-introduction.pdf",
    },
  ]

  // Mock forum topics
  const forumTopics: ForumTopic[] = [
    {
      id: "topic-1",
      title: "Welcome to the WAGA Protocol Community",
      category: "Announcements",
      author: {
        id: "user-admin",
        name: "WAGA Admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishDate: daysAgo(1),
      replyCount: 1,
      viewCount: 3,
      lastActivity: daysAgo(0.5),
      isSticky: true,
      isLocked: false,
      url: "/community/forum/topic/1",
    },
  ]

  return {
    user,
    activities,
    events,
    resources,
    forumTopics,
  }
}

const registerEventAPI = async (eventId: string, userId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real implementation, this would register the user for the event via your API
  return { success: true }
}

const createForumTopicAPI = async (topicData: Partial<ForumTopic>) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real implementation, this would create a new forum topic via your API
  return {
    id: `topic-${Date.now()}`,
    ...topicData,
    publishDate: new Date().toISOString(),
    replyCount: 0,
    viewCount: 0,
    lastActivity: new Date().toISOString(),
    isSticky: false,
    isLocked: false,
    url: `/community/forum/topic/${Date.now()}`,
  }
}

const downloadResourceAPI = async (resourceId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // In a real implementation, this would track the download and return the resource URL
  return { success: true, downloadUrl: `/api/resources/${resourceId}/download` }
}

// Update the CommunityProvider to use Supabase
export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user: authUser } = useAuth()

  // Fetch user data on mount or when authUser changes
  useEffect(() => {
    fetchUserActivity()
  }, [authUser])

  const fetchUserActivity = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (isDevelopment()) {
        // In development, use mock data
        const data = await fetchCommunityData()
        setUser(data.user)
        setActivities(data.activities)
        setEvents(data.events)
        setResources(data.resources)
        setForumTopics(data.forumTopics)
      } else {
        // In production, fetch from Supabase
        if (!authUser) {
          setUser(null)
          setActivities([])
          setEvents([])
          setResources([])
          setForumTopics([])
          return
        }

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single()

        if (userError) throw userError

        // Map to our User type
        const mappedUser: User = {
          id: userData.id,
          name: userData.name,
          avatar: userData.avatar_url || "/placeholder.svg?height=40&width=40",
          role: userData.role,
          joinDate: userData.created_at,
          reputation: userData.reputation || 0,
          badges: [],
        }

        // Fetch user badges
        const { data: badgesData, error: badgesError } = await supabase
          .from("user_badges")
          .select("badges(name)")
          .eq("user_id", authUser.id)

        if (!badgesError && badgesData) {
          mappedUser.badges = badgesData.map((b) => b.badges.name)
        }

        setUser(mappedUser)

        // Fetch activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from("activities")
          .select(`
            id, type, title, content, created_at,
            users!activities_actor_id_fkey(id, name, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(10)

        if (!activitiesError && activitiesData) {
          const mappedActivities: Activity[] = activitiesData.map((a) => ({
            id: a.id,
            type: a.type,
            title: a.title,
            content: a.content,
            author: {
              id: a.users.id,
              name: a.users.name,
              avatar: a.users.avatar_url || "/placeholder.svg?height=40&width=40",
            },
            timestamp: a.created_at,
            url: `/community/forums/post/${a.id}`,
          }))

          setActivities(mappedActivities)
        }

        // Fetch events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select(`
            id, title, description, type, date, time, duration, location, capacity,
            users!events_organizer_id_fkey(id, name, avatar_url)
          `)
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true })
          .limit(5)

        if (!eventsError && eventsData) {
          // Fetch event speakers and registrations
          const eventIds = eventsData.map((e) => e.id)

          const { data: speakersData } = await supabase.from("event_speakers").select("*").in("event_id", eventIds)

          const { data: registrationsData } = await supabase
            .from("event_registrations")
            .select("event_id, count")
            .in("event_id", eventIds)
            .eq("user_id", authUser.id)
            .group("event_id")

          const { data: registrationCountsData } = await supabase
            .from("event_registrations")
            .select("event_id, count")
            .in("event_id", eventIds)
            .group("event_id")

          const mappedEvents: Event[] = eventsData.map((e) => {
            const eventSpeakers = (speakersData || [])
              .filter((s) => s.event_id === e.id)
              .map((s) => ({
                id: s.id,
                name: s.name,
                avatar: s.avatar_url || "/placeholder.svg?height=60&width=60",
                bio: s.bio,
              }))

            const isRegistered = (registrationsData || []).some((r) => r.event_id === e.id)

            const registeredCount = (registrationCountsData || []).find((r) => r.event_id === e.id)?.count || 0

            return {
              id: e.id,
              title: e.title,
              description: e.description,
              type: e.type,
              date: new Date(e.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              time: e.time,
              duration: e.duration,
              speakers: eventSpeakers,
              registeredCount,
              capacity: e.capacity,
              isRegistered,
            }
          })

          setEvents(mappedEvents)
        }

        // Fetch resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select(`
            id, title, description, type, file_url, download_count, created_at,
            users!resources_author_id_fkey(id, name, avatar_url)
          `)
          .order("created_at", { ascending: false })
          .limit(5)

        if (!resourcesError && resourcesData) {
          // Fetch resource ratings
          const resourceIds = resourcesData.map((r) => r.id)

          const { data: ratingsData } = await supabase
            .from("resource_ratings")
            .select("resource_id, rating")
            .in("resource_id", resourceIds)

          const mappedResources: Resource[] = resourcesData.map((r) => {
            const ratings = (ratingsData || [])
              .filter((rating) => rating.resource_id === r.id)
              .map((rating) => rating.rating)

            const avgRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0

            return {
              id: r.id,
              title: r.title,
              description: r.description,
              type: r.type,
              author: {
                id: r.users.id,
                name: r.users.name,
                avatar: r.users.avatar_url || "/placeholder.svg?height=40&width=40",
              },
              publishDate: r.created_at,
              downloadCount: r.download_count,
              rating: avgRating,
              url: r.file_url,
            }
          })

          setResources(mappedResources)
        }

        // Fetch forum topics
        const { data: topicsData, error: topicsError } = await supabase
          .from("forum_topics")
          .select(`
            id, title, category_id, created_at, is_sticky, is_locked, view_count,
            users!forum_topics_author_id_fkey(id, name, avatar_url),
            forum_categories(name)
          `)
          .order("is_sticky", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(10)

        if (!topicsError && topicsData) {
          // Fetch reply counts
          const topicIds = topicsData.map((t) => t.id)

          const { data: replyCounts } = await supabase
            .from("forum_replies")
            .select("topic_id, count")
            .in("topic_id", topicIds)
            .group("topic_id")

          const mappedTopics: ForumTopic[] = topicsData.map((t) => {
            const replyCount = (replyCounts || []).find((r) => r.topic_id === t.id)?.count || 0

            return {
              id: t.id,
              title: t.title,
              category: t.forum_categories.name,
              author: {
                id: t.users.id,
                name: t.users.name,
                avatar: t.users.avatar_url || "/placeholder.svg?height=40&width=40",
              },
              publishDate: t.created_at,
              replyCount,
              viewCount: t.view_count,
              lastActivity: t.created_at, // This would be updated with actual last activity
              isSticky: t.is_sticky,
              isLocked: t.is_locked,
              url: `/community/forums/${t.id}`,
            }
          })

          setForumTopics(mappedTopics)
        }
      }
    } catch (err) {
      console.error("Failed to fetch community data:", err)
      setError("Failed to fetch community data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [authUser])

  // Update other methods to use Supabase in production
  const registerForEvent = useCallback(
    async (eventId: string) => {
      if (!user) {
        setError("You must be logged in to register for events")
        return
      }

      try {
        if (isDevelopment()) {
          // In development, use mock data
          const result = await registerEventAPI(eventId, user.id)

          if (result.success) {
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event.id === eventId
                  ? {
                      ...event,
                      isRegistered: true,
                      registeredCount: event.registeredCount + 1,
                    }
                  : event,
              ),
            )
          }
        } else {
          // In production, use Supabase
          const { error } = await supabase.from("event_registrations").insert({
            event_id: eventId,
            user_id: authUser?.id,
            status: "registered",
          })

          if (error) throw error

          // Update local state
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === eventId
                ? {
                    ...event,
                    isRegistered: true,
                    registeredCount: event.registeredCount + 1,
                  }
                : event,
            ),
          )
        }
      } catch (err) {
        console.error("Failed to register for event:", err)
        setError("Failed to register for event. Please try again.")
      }
    },
    [user, authUser],
  )

  const createForumTopic = useCallback(
    async (topic: Partial<ForumTopic>) => {
      if (!user) {
        setError("You must be logged in to create forum topics")
        return
      }

      try {
        if (isDevelopment()) {
          // In development, use mock data
          const authorInfo = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          }

          const newTopic = await createForumTopicAPI({
            ...topic,
            author: authorInfo,
          })

          setForumTopics((prev) => [newTopic as ForumTopic, ...prev])
        } else {
          // In production, use Supabase
          // First, get the category ID
          const { data: categoryData, error: categoryError } = await supabase
            .from("forum_categories")
            .select("id")
            .eq("name", topic.category)
            .single()

          if (categoryError) throw categoryError

          // Insert the new topic
          const { data: newTopic, error } = await supabase
            .from("forum_topics")
            .insert({
              title: topic.title,
              content: topic.content || "",
              category_id: categoryData.id,
              author_id: authUser?.id,
              is_sticky: topic.isSticky || false,
              is_locked: topic.isLocked || false,
            })
            .select()
            .single()

          if (error) throw error

          // Fetch the complete topic data
          const { data: completeTopicData, error: fetchError } = await supabase
            .from("forum_topics")
            .select(`
              id, title, content, created_at, is_sticky, is_locked, view_count,
              users!forum_topics_author_id_fkey(id, name, avatar_url),
              forum_categories(name)
            `)
            .eq("id", newTopic.id)
            .single()

          if (fetchError) throw fetchError

          // Map to our ForumTopic type
          const mappedTopic: ForumTopic = {
            id: completeTopicData.id,
            title: completeTopicData.title,
            category: completeTopicData.forum_categories.name,
            author: {
              id: completeTopicData.users.id,
              name: completeTopicData.users.name,
              avatar: completeTopicData.users.avatar_url || "/placeholder.svg?height=40&width=40",
            },
            publishDate: completeTopicData.created_at,
            replyCount: 0,
            viewCount: 0,
            lastActivity: completeTopicData.created_at,
            isSticky: completeTopicData.is_sticky,
            isLocked: completeTopicData.is_locked,
            url: `/community/forums/${completeTopicData.id}`,
          }

          setForumTopics((prev) => [mappedTopic, ...prev])
        }
      } catch (err) {
        console.error("Failed to create forum topic:", err)
        setError("Failed to create forum topic. Please try again.")
      }
    },
    [user, authUser],
  )

  const downloadResource = useCallback(async (resourceId: string) => {
    try {
      if (isDevelopment()) {
        // In development, use mock data
        const result = await downloadResourceAPI(resourceId)

        if (result.success) {
          // Update local state to reflect the download
          setResources((prevResources) =>
            prevResources.map((resource) =>
              resource.id === resourceId
                ? {
                    ...resource,
                    downloadCount: resource.downloadCount + 1,
                  }
                : resource,
            ),
          )
        }
      } else {
        // In production, use Supabase
        // Increment download count
        const { error } = await supabase.rpc("increment_download_count", {
          resource_id: resourceId,
        })

        if (error) throw error

        // Get the resource URL
        const { data: resourceData, error: resourceError } = await supabase
          .from("resources")
          .select("file_url")
          .eq("id", resourceId)
          .single()

        if (resourceError) throw resourceError

        // Update local state
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  downloadCount: resource.downloadCount + 1,
                }
              : resource,
          ),
        )

        // Open the resource in a new tab
        window.open(resourceData.file_url, "_blank")
      }
    } catch (err) {
      console.error("Failed to download resource:", err)
      setError("Failed to download resource. Please try again.")
    }
  }, [])

  return (
    <CommunityContext.Provider
      value={{
        user,
        activities,
        events,
        resources,
        forumTopics,
        isLoading,
        error,
        fetchUserActivity,
        registerForEvent,
        createForumTopic,
        downloadResource,
      }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}
