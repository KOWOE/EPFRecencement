"use client"

import { Sidebar } from "@/components/admin/sidebar"
import { Menu, X, Bell, User, Settings } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

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
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">3 nouvelles</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="text-sm text-slate-800 font-medium">Nouveau membre ajouté</p>
                        <p className="text-xs text-slate-500 mt-1">John Doe s'est inscrit à la Chorale.</p>
                        <p className="text-[10px] text-slate-400 mt-2">Il y a 5 min</p>
                      </div>
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="text-sm text-slate-800 font-medium">Mise à jour système</p>
                        <p className="text-xs text-slate-500 mt-1">L'application a été mise à jour avec succès.</p>
                        <p className="text-[10px] text-slate-400 mt-2">Il y a 2 heures</p>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="text-sm text-slate-800 font-medium">Rapport mensuel généré</p>
                        <p className="text-xs text-slate-500 mt-1">Le rapport de Mai est prêt au téléchargement.</p>
                        <p className="text-[10px] text-slate-400 mt-2">Hier à 14:00</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Tout marquer comme lu</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <Link href="/dashboard/parametres" className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors group">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">Admin EPF</p>
                <p className="text-[10px] text-slate-500">Super Admin</p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                AD
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
