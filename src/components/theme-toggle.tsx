"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" /> // Placeholder to prevent layout shift
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-amber-500 absolute transition-all duration-300 scale-100 rotate-0 dark:scale-0 dark:-rotate-90 group-hover:text-amber-600" />
      <Moon className="h-5 w-5 text-blue-400 absolute transition-all duration-300 scale-0 rotate-90 dark:scale-100 dark:rotate-0 group-hover:text-blue-300" />
    </button>
  )
}
