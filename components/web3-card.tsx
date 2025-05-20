"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface Web3CardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "emerald" | "purple" | "blue" | "gradient" | "dual"
  hoverEffect?: boolean
}

export default function Web3Card({ children, className = "", variant = "default", hoverEffect = true }: Web3CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case "emerald":
        return "border-emerald-400/40 bg-gradient-to-br from-emerald-800/40 to-emerald-700/20"
      case "purple":
        return "border-purple-500/30 bg-gradient-to-br from-purple-900/40 to-purple-800/20"
      case "blue":
        return "border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-blue-800/20"
      case "gradient":
        return "border-emerald-400/40 bg-gradient-to-br from-emerald-800/30 via-blue-900/20 to-purple-900/30"
      case "dual":
        return "border-emerald-400/40 border-r-purple-500/40 bg-gradient-to-br from-emerald-800/30 to-purple-900/30"
      default:
        return "border-gray-800 bg-black/50"
    }
  }

  const getHoverGlowColor = () => {
    switch (variant) {
      case "emerald":
        return "0 0 20px 5px rgba(16, 185, 129, 0.4)"
      case "purple":
        return "0 0 20px 5px rgba(147, 51, 234, 0.4)"
      case "blue":
        return "0 0 20px 5px rgba(59, 130, 246, 0.4)"
      case "gradient":
        return "0 0 20px 5px rgba(16, 185, 129, 0.3), 0 0 15px 5px rgba(59, 130, 246, 0.2), 0 0 15px 5px rgba(147, 51, 234, 0.2)"
      case "dual":
        return "0 0 20px 5px rgba(16, 185, 129, 0.3), 0 0 20px 5px rgba(147, 51, 234, 0.3)"
      default:
        return "0 0 15px 5px rgba(75, 85, 99, 0.3)"
    }
  }

  const getHoverBorderColor = () => {
    switch (variant) {
      case "emerald":
        return "rgba(16, 185, 129, 0.7)"
      case "purple":
        return "rgba(147, 51, 234, 0.7)"
      case "blue":
        return "rgba(59, 130, 246, 0.7)"
      case "gradient":
        return "rgba(16, 185, 129, 0.6)"
      case "dual":
        return "rgba(16, 185, 129, 0.6)"
      default:
        return "rgba(75, 85, 99, 0.6)"
    }
  }

  const getBackgroundGradient = () => {
    switch (variant) {
      case "emerald":
        return isHovered
          ? "linear-gradient(to bottom right, rgba(6, 95, 70, 0.5), rgba(5, 150, 105, 0.3))"
          : "linear-gradient(to bottom right, rgba(6, 95, 70, 0.4), rgba(5, 150, 105, 0.2))"
      case "purple":
        return isHovered
          ? "linear-gradient(to bottom right, rgba(91, 33, 182, 0.5), rgba(124, 58, 237, 0.3))"
          : "linear-gradient(to bottom right, rgba(91, 33, 182, 0.4), rgba(124, 58, 237, 0.2))"
      case "blue":
        return isHovered
          ? "linear-gradient(to bottom right, rgba(30, 64, 175, 0.5), rgba(37, 99, 235, 0.3))"
          : "linear-gradient(to bottom right, rgba(30, 64, 175, 0.4), rgba(37, 99, 235, 0.2))"
      case "gradient":
        return isHovered
          ? "linear-gradient(to bottom right, rgba(6, 95, 70, 0.5), rgba(30, 64, 175, 0.3), rgba(91, 33, 182, 0.4))"
          : "linear-gradient(to bottom right, rgba(6, 95, 70, 0.4), rgba(30, 64, 175, 0.2), rgba(91, 33, 182, 0.3))"
      case "dual":
        return isHovered
          ? "linear-gradient(to bottom right, rgba(6, 95, 70, 0.5), rgba(91, 33, 182, 0.4))"
          : "linear-gradient(to bottom right, rgba(6, 95, 70, 0.4), rgba(91, 33, 182, 0.3))"
      default:
        return isHovered ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.5)"
    }
  }

  return (
    <div className="relative group">
      {/* Ambient glow effect - appears on hover */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 blur-xl transition-opacity duration-500"
        style={{
          background:
            variant === "dual" || variant === "gradient"
              ? "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(147, 51, 234, 0.2))"
              : variant === "purple"
                ? "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(139, 92, 246, 0.2))"
                : variant === "blue"
                  ? "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.2))"
                  : "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))",
        }}
        animate={{
          opacity: isHovered && hoverEffect ? 0.8 : 0,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 blur-xl"
        style={{
          background:
            variant === "dual" || variant === "gradient"
              ? "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(147, 51, 234, 0.15))"
              : variant === "purple"
                ? "linear-gradient(to right, rgba(147, 51, 234, 0.15), rgba(139, 92, 246, 0.15))"
                : variant === "blue"
                  ? "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.15))"
                  : "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))",
        }}
        animate={{
          opacity: isHovered && hoverEffect ? [0.4, 0.6, 0.4] : 0,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className={`relative overflow-hidden rounded-xl border backdrop-blur-md ${getVariantClasses()} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={
          hoverEffect
            ? {
                y: -5,
                scale: 1.015,
                boxShadow: getHoverGlowColor(),
                borderColor: getHoverBorderColor(),
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              }
            : {}
        }
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
