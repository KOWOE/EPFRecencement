"use client"

import { useEffect, useState } from "react"

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if device is mobile (touch screen) to disable the effect if desired
    // But usually we can just let it sit at 0,0 or follow touch
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  if (!isClient) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.12] bg-blue-600 transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `translate(${mousePosition.x - 400}px, ${mousePosition.y - 400}px)`
        }}
      />
    </div>
  )
}
