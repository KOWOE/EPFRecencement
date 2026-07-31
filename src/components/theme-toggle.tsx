"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
    
    // Auto-switch at sunset (18:00 to 06:00)
    const checkSunset = () => {
      const hour = new Date().getHours()
      const isNight = hour >= 18 || hour < 6
      const savedTheme = localStorage.getItem("theme")
      
      // If the user hasn't explicitly set a theme, or it's system, we enforce the sunset rule
      if (!savedTheme || savedTheme === "system") {
        setTheme(isNight ? "dark" : "light")
      }
    }
    
    // Check initially and then every 10 minutes
    checkSunset()
    const interval = setInterval(checkSunset, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [setTheme])

  if (!mounted) {
    return <div className="w-16 h-8" /> // Placeholder to prevent layout shift
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0F1117] shadow-inner",
        isDark ? "bg-[#1A1D27] border border-[#2E3341]" : "bg-slate-200 border border-slate-300"
      )}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Sun icon for light side */}
      <span className="absolute left-1.5 flex h-4 w-4 items-center justify-center text-amber-500">
        <Sun className="h-3.5 w-3.5" />
      </span>
      
      {/* Moon icon for dark side */}
      <span className="absolute right-1.5 flex h-4 w-4 items-center justify-center text-blue-400">
        <Moon className="h-3.5 w-3.5" />
      </span>
      
      {/* Sliding circle */}
      <span
        className={cn(
          "inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 z-10 flex items-center justify-center",
          isDark ? "translate-x-9" : "translate-x-1"
        )}
      />
    </button>
  )
}
