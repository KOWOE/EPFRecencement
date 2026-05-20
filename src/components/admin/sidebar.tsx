"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Settings,
  Mic,
  FileSpreadsheet,
  X,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { useToast } from "@/context/toast-context"
import { logoutAdmin } from "@/lib/actions/parametres"

function TrumpetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 8c1.5 0 3 .5 3 2.5v3c0 2-1.5 2.5-3 2.5" />
      <path d="M21 9v6" />
      <path d="M3 13h15" />
      <path d="M3 11h11c1 0 2 .5 2 1.5s-1 1.5-2 1.5H8" />
      <path d="M9 11V7" />
      <circle cx="9" cy="6" r="1" />
      <path d="M12 11V7" />
      <circle cx="12" cy="6" r="1" />
      <path d="M15 11V7" />
      <circle cx="15" cy="6" r="1" />
      <path d="M2 10.5v3" />
    </svg>
  )
}

function MicCableIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Microphone body/handle */}
      <line x1="9" y1="15" x2="15" y2="9" />
      {/* Tapered handle sides */}
      <path d="M10 16.5L6.5 20c-.8.8-2 .8-2.8 0s-.8-2 0-2.8l3.5-3.5" />
      {/* Microphone Head (Capsule) */}
      <path d="M13 11l3-3a3 3 0 0 1 4.2 4.2l-3 3" />
      {/* Grille separation line */}
      <path d="M14.5 9.5l2.5 2.5" />
      {/* The wavy cord */}
      <path d="M5.5 19.5c-1 1.5-2 2-3 1s-.5-2.5.8-3.7c1.8-1.8 3.5-1.8 5.3-.5 1.8 1.3 3.5 1.3 5.3 0c1.2-1 2.2-.8 3 .5" />
    </svg>
  )
}

const sidebarItems = [
  { name: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tous les Membres", href: "/dashboard/membres", icon: Users },
  { name: "Chorale", href: "/dashboard/chorale", icon: Mic },
  { name: "Fanfare", href: "/dashboard/fanfare", icon: TrumpetIcon },
  { name: "Groupe Musical", href: "/dashboard/groupe-musical", icon: MicCableIcon },
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

  const confirmLogout = async () => {
    setIsLogoutOpen(false)
    if (onClose) onClose()
    
    // Appel du Server Action pour détruire le cookie de session
    await logoutAdmin()
    
    // Nettoyage visuel du cache local
    localStorage.removeItem("admin_nom")
    localStorage.removeItem("admin_email")
    localStorage.removeItem("admin_role")
    
    showToast("Déconnexion réussie !", "success")
    router.push("/connexion")
  }

  return (
    <div className={cn(
      "flex flex-col bg-[#003366] h-full text-white border-r border-white/10 shrink-0",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="p-6 flex items-center justify-between">
        <Link 
          href="/" 
          onClick={onClose}
          className="flex flex-col group hover:opacity-90 transition-opacity"
        >
          <h1 className="text-xl font-bold flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white flex items-center justify-center shrink-0">
              <img src="/logo.jpg" alt="Logo EPF" className="w-full h-full object-cover" />
            </div>
            <span>EPF Recensement</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Recensement National</p>
        </Link>
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
        confirmText="Se déconnecter"
        confirmLoadingText="Déconnexion..."
      />
    </div>
  )
}
