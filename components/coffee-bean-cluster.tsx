"use client"

import CoffeeBean from "./coffee-bean"

interface CoffeeBeanClusterProps {
  position?: "left" | "center" | "right"
  className?: string
}

export default function CoffeeBeanCluster({ position = "center", className = "" }: CoffeeBeanClusterProps) {
  // Generate different configurations based on position
  const getPositionClass = () => {
    switch (position) {
      case "left":
        return "-left-4 sm:-left-8"
      case "right":
        return "-right-4 sm:-right-8"
      default:
        return "left-1/2 -translate-x-1/2"
    }
  }

  return (
    <div className={`absolute ${getPositionClass()} ${className} w-48 h-36 pointer-events-none`}>
      {/* Left bean - positioned more to the left */}
      <CoffeeBean
        size={30}
        color="#7D3F12"
        rotationSpeed={0.6}
        floatSpeed={1.0}
        delay={200}
        xOffset={-30}
        yOffset={5}
      />

      {/* Center bean */}
      <CoffeeBean size={30} color="#8B4513" rotationSpeed={0.8} floatSpeed={1.2} delay={0} xOffset={0} yOffset={-10} />

      {/* Right bean - positioned more to the right */}
      <CoffeeBean
        size={30}
        color="#9A5018"
        rotationSpeed={1.0}
        floatSpeed={0.8}
        delay={400}
        xOffset={30}
        yOffset={10}
      />
    </div>
  )
}
