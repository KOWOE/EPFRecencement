"use client"

import { Sidebar } from "@/components/admin/sidebar"
import { Menu, X, Bell, User, Settings, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  link: string
  read: boolean
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Profile State synced with localStorage
  const [profile, setProfile] = useState({
    nom: "Admin EPF",
    email: "admin@epf-recensement.ci",
    role: "Super Admin"
  })

  // Dynamic Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Nouveau membre ajouté",
      description: "John Doe s'est inscrit à la Chorale.",
      time: "Il y a 5 min",
      link: "/dashboard/membres",
      read: false
    },
    {
      id: "2",
      title: "Mise à jour système",
      description: "L'application a été mise à jour avec succès.",
      time: "Il y a 2 heures",
      link: "/dashboard/parametres",
      read: false
    },
    {
      id: "3",
      title: "Rapport mensuel généré",
      description: "Le rapport de Mai est prêt au téléchargement.",
      time: "Hier à 14:00",
      link: "/dashboard/imports-exports",
      read: false
    }
  ])

  // Sync profile from localStorage on mount and register custom event listener
  useEffect(() => {
    const loadProfile = () => {
      const storedNom = localStorage.getItem("admin_nom") || "Admin EPF"
      const storedEmail = localStorage.getItem("admin_email") || "admin@epf-recensement.ci"
      const storedRole = localStorage.getItem("admin_role") || "Super Admin"
      setProfile({ nom: storedNom, email: storedEmail, role: storedRole })
    }

    loadProfile()
    window.addEventListener("profile-updated", loadProfile)
    return () => {
      window.removeEventListener("profile-updated", loadProfile)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length
  const hasUnread = unreadCount > 0

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notif: NotificationItem) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
    setIsNotifOpen(false)
    router.push(notif.link)
  }

  // Get initials for profile avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-slate-900/50 lg:hidden transition-opacity duration-300",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsSidebarOpen(false)}>
        <div className={cn(
          "fixed inset-y-0 left-0 w-72 bg-[#003366] transition-transform duration-300 transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )} onClick={(e) => e.stopPropagation()}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} isMobile />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm lg:text-lg font-semibold text-slate-800">Espace Administration</h2>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={cn(
                  "p-2 hover:bg-slate-100 rounded-full text-slate-500 relative transition-all active:scale-95",
                  isNotifOpen && "bg-slate-100 text-slate-800"
                )}
              >
                <Bell className="w-5 h-5" />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <span className={cn(
                        "text-xs font-medium px-2.5 py-0.5 rounded-full transition-all duration-300",
                        hasUnread ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {hasUnread ? `${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''}` : "À jour"}
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={cn(
                            "p-4 border-b border-slate-50 transition-all duration-300 cursor-pointer flex gap-3 items-start",
                            notif.read 
                              ? "bg-white hover:bg-slate-50/50" 
                              : "bg-blue-50/30 hover:bg-blue-50/60 border-l-2 border-blue-500"
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className={cn(
                                "text-sm font-semibold transition-colors duration-300",
                                notif.read ? "text-slate-600" : "text-slate-900"
                              )}>
                                {notif.title}
                              </p>
                              {notif.read && (
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.description}</p>
                            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 text-center">
                      <button 
                        onClick={handleMarkAllAsRead}
                        disabled={!hasUnread}
                        className={cn(
                          "text-sm font-semibold transition-all duration-300 w-full py-1.5 rounded-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                          hasUnread 
                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50/50" 
                            : "text-emerald-600 hover:text-emerald-700 font-bold bg-emerald-50/50"
                        )}
                      >
                        {hasUnread ? "Tout marquer comme lu" : "Toutes les notifications sont lues ✓"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            {/* User Profile Info */}
            <Link href="/dashboard/parametres" className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {profile.nom}
                </p>
                <p className="text-[10px] text-slate-500">{profile.role}</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                {getInitials(profile.nom)}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
