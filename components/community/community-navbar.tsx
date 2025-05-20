"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Bell, MessageSquare, User, Settings, Home } from "lucide-react"
import { useCommunity } from "@/context/community-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useScrollTop } from "@/hooks/use-scroll-top"

const navItems = [
  { name: "Dashboard", href: "/community/dashboard" },
  { name: "Forums", href: "/community/forums" },
  { name: "Resources", href: "/community/resources" },
  { name: "Events", href: "/community/events" },
  { name: "Members", href: "/community/members" },
]

export function CommunityNavbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user } = useCommunity()
  const scrolled = useScrollTop()

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen])

  // Add padding to body to account for fixed navbar
  useEffect(() => {
    document.body.style.paddingTop = "64px" // 4rem or 64px to match h-16
    return () => {
      document.body.style.paddingTop = "0px"
    }
  }, [])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b border-emerald-500/20 bg-emerald-950/80 backdrop-blur supports-[backdrop-filter]:bg-emerald-950/60 transition-all duration-300",
          scrolled ? "shadow-[0_4px_20px_-12px_rgba(16,185,129,0.3)]" : "",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                <span className="text-xl font-bold">
                  <span className="web3-dual-gradient-text-glow">WAGA Community</span>
                </span>
              </Link>
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "nav-item",
                      pathname === item.href ? "active text-emerald-400" : "text-gray-300 hover:text-emerald-300",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="theme-toggle relative">
                    <Bell />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 web3-card-purple">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="font-medium">New reply to your forum post</div>
                      <div className="text-xs text-muted-foreground">5 minutes ago</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="font-medium">Event reminder: DeFi Workshop</div>
                      <div className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-emerald-400">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Messages */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="theme-toggle relative">
                    <MessageSquare />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 web3-card-purple">
                  <DropdownMenuLabel>Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="font-medium">Maria Chen</div>
                      <div className="text-xs text-muted-foreground">Thanks for your help with the...</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start py-2">
                      <div className="font-medium">James Wilson</div>
                      <div className="text-xs text-muted-foreground">Are you attending the workshop?</div>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-emerald-400">View all messages</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="theme-toggle rounded-full">
                    <img
                      src={user?.avatar || "/placeholder.svg?height=40&width=40"}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full border border-emerald-500/30"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 web3-card-purple">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Back to Home */}
              <Link href="/" className="profile-button hidden md:flex emerald-glow">
                <span>
                  <Home className="h-4 w-4 mr-2 inline-block" />
                  Back to Home
                </span>
              </Link>

              {/* Mobile menu button */}
              <button className="mobile-menu-toggle md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu - moved outside the nav to avoid positioning issues */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md overflow-y-auto md:hidden">
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center justify-end px-4">
              <button className="mobile-menu-toggle" onClick={() => setIsMenuOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 px-4 pb-6">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 to-purple-900/10 pointer-events-none"></div>
              <div className="absolute inset-0 web3-grid-bg opacity-10 pointer-events-none"></div>

              <nav className="flex flex-col space-y-4 mt-4 relative z-10">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "nav-item",
                      pathname === item.href ? "active text-emerald-400" : "text-gray-300 hover:text-emerald-300",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <Link
                  href="/"
                  className={cn("nav-item", "text-gray-300 hover:text-emerald-300")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="h-4 w-4 mr-2 inline" />
                  <span>Back to Home</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
