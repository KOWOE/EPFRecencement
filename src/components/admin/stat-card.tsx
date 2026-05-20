"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface StatCardProps {
  title: string
  value: string | number
  trend?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0)

  useEffect(() => {
    const strVal = String(value)
    const cleanNumStr = strVal.replace(/[^0-9]/g, "")
    const targetNum = parseInt(cleanNumStr, 10)

    if (isNaN(targetNum)) {
      setDisplayValue(value)
      return
    }

    const duration = 1200 // 1.2 seconds animation
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      // Cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.floor(easeProgress * targetNum)

      if (strVal.includes(",")) {
        setDisplayValue(currentVal.toLocaleString("en-US"))
      } else {
        setDisplayValue(currentVal.toLocaleString("fr-FR"))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md group", className)}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{displayValue}</h3>
          {trend && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white">
        <Icon className="w-6 h-6 text-blue-600 transition-colors duration-300 group-hover:text-white" />
      </div>
    </div>
  )
}
