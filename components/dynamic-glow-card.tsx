"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type DynamicGlowCardProps = {
  children: ReactNode
  className?: string
  variant?: "emerald" | "purple" | "dual" | "featured"
  intensity?: "low" | "medium" | "high"
}

export default function DynamicGlowCard({
  children,
  className,
  variant = "emerald",
  intensity = "medium",
}: DynamicGlowCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCardClasses = () => {
    switch (variant) {
      case "emerald":
        return "border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 shadow-emerald-500/20"
      case "purple":
        return "border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-purple-800/20 shadow-purple-500/20"
      case "dual":
        return "border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-purple-900/20 to-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.2),_0_0_15px_rgba(147,51,234,0.2)]"
      case "featured":
        return "border-emerald-500/50 bg-gradient-to-br from-emerald-900/50 via-emerald-800/40 to-emerald-900/30 shadow-emerald-500/30"
      default:
        return "border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 shadow-emerald-500/20"
    }
  }

  const getHoverGlowColor = () => {
    switch (variant) {
      case "emerald":
        return "0 0 20px 5px rgba(16, 185, 129, 0.4)"
      case "purple":
        return "0 0 20px 5px rgba(147, 51, 234, 0.4)"
      case "dual":
        return "0 0 20px 5px rgba(16, 185, 129, 0.3), 0 0 20px 5px rgba(147, 51, 234, 0.3)"
      case "featured":
        return "0 0 25px 8px rgba(16, 185, 129, 0.5)"
      default:
        return "0 0 20px 5px rgba(16, 185, 129, 0.4)"
    }
  }

  const getHoverBorderColor = () => {
    switch (variant) {
      case "emerald":
        return "border-emerald-500/70"
      case "purple":
        return "border-purple-500/70"
      case "dual":
        return "border-gradient-to-r from-emerald-500/70 to-purple-500/70"
      case "featured":
        return "border-emerald-400/80"
      default:
        return "border-emerald-500/70"
    }
  }

  const getBackgroundGradient = () => {
    switch (variant) {
      case "emerald":
        return isHovered
          ? "bg-gradient-to-br from-emerald-900/50 to-emerald-800/30"
          : "bg-gradient-to-br from-emerald-900/40 to-emerald-800/20"
      case "purple":
        return isHovered
          ? "bg-gradient-to-br from-purple-900/50 to-purple-800/30"
          : "bg-gradient-to-br from-purple-900/40 to-purple-800/20"
      case "dual":
        return isHovered
          ? "bg-gradient-to-br from-emerald-900/50 via-purple-900/30 to-emerald-900/40"
          : "bg-gradient-to-br from-emerald-900/40 via-purple-900/20 to-emerald-900/30"
      case "featured":
        return isHovered
          ? "bg-gradient-to-br from-emerald-900/60 via-emerald-800/50 to-emerald-900/40"
          : "bg-gradient-to-br from-emerald-900/50 via-emerald-800/40 to-emerald-900/30"
      default:
        return isHovered
          ? "bg-gradient-to-br from-emerald-900/50 to-emerald-800/30"
          : "bg-gradient-to-br from-emerald-900/40 to-emerald-800/20"
    }
  }

  const getIntensityScale = () => {
    switch (intensity) {
      case "low":
        return { hover: 1.01, shadow: "0.3" }
      case "medium":
        return { hover: 1.015, shadow: "0.4" }
      case "high":
        return { hover: 1.02, shadow: "0.5" }
      default:
        return { hover: 1.015, shadow: "0.4" }
    }
  }

  const intensityScale = getIntensityScale()

  return (
    <div className="relative group">
      {/* Ambient glow effect - appears on hover */}
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0 blur-xl transition-opacity duration-500"
        style={{
          background:
            variant === "dual"
              ? "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(147, 51, 234, 0.2))"
              : variant === "purple"
                ? "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(139, 92, 246, 0.2))"
                : "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))",
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-lg opacity-0 blur-xl"
        style={{
          background:
            variant === "dual"
              ? "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(147, 51, 234, 0.15))"
              : variant === "purple"
                ? "linear-gradient(to right, rgba(147, 51, 234, 0.15), rgba(139, 92, 246, 0.15))"
                : "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))",
        }}
        animate={{
          opacity: isHovered ? [0.4, 0.6, 0.4] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className={cn("rounded-lg border backdrop-blur-sm shadow-lg relative z-10", getCardClasses(), className)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{
          y: -5,
          scale: intensityScale.hover,
          boxShadow: getHoverGlowColor(),
          borderColor:
            variant === "dual"
              ? "rgba(16, 185, 129, 0.7)"
              : variant === "purple"
                ? "rgba(147, 51, 234, 0.7)"
                : "rgba(16, 185, 129, 0.7)",
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        animate={{
          background: getBackgroundGradient(),
        }}
        transition={{
          duration: isHovered ? 0.3 : 0.5,
          ease: isHovered ? "easeOut" : "easeIn",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
