"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path.includes("#")) {
      return pathname === path
    }
    return pathname?.startsWith(path)
  }

  return (
    <div className="flex items-center space-x-4">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="text-xl font-bold">
          <span className="web3-dual-gradient-text-glow">WAGAProtocol</span>
        </span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/#about"
          className={cn(
            "nav-item",
            isActive("/#about") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          About
        </Link>
        <Link
          href="/#features"
          className={cn(
            "nav-item",
            isActive("/#features") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          Features
        </Link>
        <Link
          href="/#roadmap"
          className={cn(
            "nav-item",
            isActive("/#roadmap") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          Roadmap
        </Link>
        <Link
          href="/explore"
          className={cn(
            "nav-item",
            isActive("/explore") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          Demo
        </Link>
        <Link
          href="/community/dashboard"
          className={cn(
            "nav-item",
            isActive("/community") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          Community
        </Link>
        <Link
          href="/admin/dashboard"
          className={cn(
            "nav-item",
            isActive("/admin") ? "active text-foreground" : "text-foreground/60 hover:text-foreground/80",
          )}
        >
          Admin
        </Link>
      </nav>
    </div>
  )
}
