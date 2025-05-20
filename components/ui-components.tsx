"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { motion } from "framer-motion"

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-emerald-600 text-white shadow hover:bg-emerald-600/90": variant === "default",
            "border border-emerald-500/20 bg-transparent hover:bg-emerald-500/10": variant === "outline",
            "bg-transparent hover:bg-emerald-500/10": variant === "ghost",
            "text-emerald-500 underline-offset-4 hover:underline": variant === "link",
            "bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-md hover:from-purple-400 hover:to-emerald-400 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-300":
              variant === "gradient",
            "h-9 px-4 py-2 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "default",
            "h-11 px-8 text-base": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

// Card Components
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <div className="relative">
        {/* Ambient glow effect - appears on hover */}
        <motion.div
          className="absolute -inset-1 rounded-xl opacity-0 blur-xl transition-opacity duration-500"
          style={{
            background: "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(147, 51, 234, 0.15))",
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          ref={ref}
          className={cn("rounded-xl border border-gray-800 bg-black/60 text-card-foreground shadow", className)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            y: -3,
            scale: 1.01,
            boxShadow: "0 0 15px 3px rgba(16, 185, 129, 0.2), 0 0 15px 3px rgba(147, 51, 234, 0.2)",
            borderColor: "rgba(75, 85, 99, 0.5)",
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          }}
          {...props}
        />
      </div>
    )
  },
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-gray-400", className)} {...props} />,
)
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"
