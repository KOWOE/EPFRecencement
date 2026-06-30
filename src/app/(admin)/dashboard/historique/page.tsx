"use client"

import { History, User, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { getActivityLogs } from "@/lib/actions/parametres"
import { useToast } from "@/context/toast-context"
import { cn } from "@/lib/utils"

type Log = {
  id: string
  adminId: string
  adminName: string
  adminRole: string
  actionType: string
  description: string
  createdAt: string | Date
}

export default function HistoriquePage() {
  const { showToast } = useToast()
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [adminRole, setAdminRole] = useState("Éditeur")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminRole(localStorage.getItem("admin_role") || "Éditeur")
    }
  }, [])

  useEffect(() => {
    if (adminRole === "Super Admin") {
      fetchLogs()
    } else {
      setIsLoading(false)
    }
  }, [adminRole])

  const fetchLogs = async () => {
    setIsLoading(true)
    const res = await getActivityLogs()
    if (res.success && res.data) {
      setLogs(res.data)
    } else {
      showToast(res.error || "Erreur lors du chargement de l'historique", "error")
    }
    setIsLoading(false)
  }

  if (adminRole !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-fade-in-up">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <History className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Accès Refusé</h2>
        <p className="text-slate-500 max-w-md text-center">Vous n'avez pas les droits nécessaires pour consulter l'historique des actions. Cette section est réservée aux Super Administrateurs.</p>
      </div>
    )
  }

  const filteredLogs = logs.filter(log => 
    log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActionColor = (type: string) => {
    switch(type) {
      case "CREATE": return "text-green-600 bg-green-50 border-green-200"
      case "UPDATE": return "text-blue-600 bg-blue-50 border-blue-200"
      case "DELETE": return "text-rose-600 bg-rose-50 border-rose-200"
      default: return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
          <History className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historique des Actions</h1>
          <p className="text-slate-500">Traceabilité complète des opérations sur la plateforme.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une action..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <p className="text-xs text-slate-500">Affichage des 100 dernières actions</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Aucun historique trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Administrateur</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Détails</th>
                  <th className="px-6 py-4">Date et Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {log.adminName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{log.adminName}</p>
                          <p className="text-xs text-slate-500">{log.adminRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-xs font-bold rounded-full border", getActionColor(log.actionType))}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{log.description}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
