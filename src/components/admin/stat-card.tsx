import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  trend?: string
  icon: LucideIcon
  className?: string
}

export function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between", className)}>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  )
}
