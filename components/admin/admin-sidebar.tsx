"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { href: "/admin/content", label: "Content", icon: <FileText size={20} /> },
    { href: "/admin/reports", label: "Reports", icon: <FileText size={20} /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-40 border-r overflow-hidden",
        "bg-gradient-to-br from-emerald-950/80 to-purple-950/80 backdrop-blur-sm",
        "border-r-emerald-500/20",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-10 w-64 h-64 rounded-full bg-emerald-500/5 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 -right-10 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl animate-float-slow-reverse"></div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-2">
          <button
            className="p-2 rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-800/30 to-purple-800/30 hover:from-emerald-700/40 hover:to-purple-700/40"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={18} className="web3-icon" />
            ) : (
              <ChevronLeft size={18} className="web3-icon" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-all duration-300 group",
                    pathname === item.href
                      ? "bg-gradient-to-r from-emerald-700/30 to-purple-700/30 text-white"
                      : "hover:bg-gradient-to-r hover:from-emerald-800/20 hover:to-purple-800/20 text-gray-300 hover:text-white",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 transition-all duration-300",
                      pathname === item.href
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400"
                        : "text-gray-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-purple-400",
                    )}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
