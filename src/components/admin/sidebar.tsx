"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Church,
  Music,
  Wind,
  FileSpreadsheet,
  X,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from "@/context/toast-context"

const sidebarItems = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tous les Membres", href: "/dashboard/membres", icon: Users },
  { name: "Chorale", href: "/dashboard/chorale", icon: Music },
  { name: "Fanfare", href: "/dashboard/fanfare", icon: Wind },
  { name: "Groupe Musical", href: "/dashboard/groupe-musical", icon: Church },
  { name: "Imports & Exports", href: "/dashboard/imports-exports", icon: FileSpreadsheet },
]

interface SidebarProps {
  onClose?: () => void
  isMobile?: boolean
}

export function Sidebar({ onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { showToast } = useToast()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const confirmLogout = () => {
    setIsLogoutOpen(false)
    if (onClose) onClose()
    showToast("Déconnexion réussie !", "success")
    router.push("/")
  }

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
 
      <div className="p-4 border-t border-white/10 space-y-1">
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

        <button 
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-500/10 transition-all duration-200 cursor-pointer text-left"
        >
          <LogOut className="w-5 h-5 text-rose-300/60" />
          Déconnexion
        </button>
      </div>

      <ConfirmModal 
        isOpen={isLogoutOpen}
        title="Déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter de l'espace administration ?"
        onConfirm={confirmLogout}
        onCancel={() => setIsLogoutOpen(false)}
        isLoading={false}
      />
    </div>
  )
}
