"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  FileUp, 
  FileDown, 
  Settings,
  Church,
  Music,
  Wind,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tous les Membres", href: "/dashboard/membres", icon: Users },
  { name: "Chorale", href: "/dashboard/chorale", icon: Music },
  { name: "Fanfare", href: "/dashboard/fanfare", icon: Wind },
  { name: "Groupe Musical", href: "/dashboard/groupe-musical", icon: Church },
  { name: "Imports", href: "/dashboard/imports", icon: FileUp },
  { name: "Exports", href: "/dashboard/exports", icon: FileDown },
]

interface SidebarProps {
  onClose?: () => void
  isMobile?: boolean
}

export function Sidebar({ onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "flex flex-col bg-[#003366] h-full text-white border-r border-white/10 shrink-0",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Church className="w-6 h-6 text-blue-400" />
            EPF System
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Recensement National</p>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-[#0056D2] text-white shadow-lg shadow-blue-900/20" 
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/40")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link 
          href="/dashboard/parametres"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
            pathname === "/dashboard/parametres" 
              ? "bg-[#0056D2] text-white shadow-lg shadow-blue-900/20" 
              : "text-white/70 hover:text-white hover:bg-white/5"
          )}
        >
          <Settings className={cn("w-5 h-5", pathname === "/dashboard/parametres" ? "text-white" : "text-white/40")} />
          Paramètres
        </Link>
      </div>
    </div>
  )
}
