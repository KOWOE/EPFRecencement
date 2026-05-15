"use client"

import { Settings, User, Bell, Shield, Key, Database, Plus, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getRegions, addRegion, deleteRegion, getSousRegions, addSousRegion, deleteSousRegion, getGroupes, addGroupe, deleteGroupe } from "@/lib/actions/parametres"

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("profil")
  
  const [regions, setRegions] = useState<{id: string, name: string}[]>([])
  const [newRegion, setNewRegion] = useState("")

  const [sousRegions, setSousRegions] = useState<{id: string, name: string}[]>([])
  const [newSousRegion, setNewSousRegion] = useState("")

  const [groupes, setGroupes] = useState<{id: string, name: string}[]>([])
  const [newGroupe, setNewGroupe] = useState("")
  
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isAddingRegion, setIsAddingRegion] = useState(false)
  const [isAddingSousRegion, setIsAddingSousRegion] = useState(false)
  const [isAddingGroupe, setIsAddingGroupe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoadingData(true)
    try {
      const [regRes, sousRegRes, grpRes] = await Promise.all([
        getRegions(), getSousRegions(), getGroupes()
      ])
      if (regRes.success && regRes.data) setRegions(regRes.data)
      if (sousRegRes.success && sousRegRes.data) setSousRegions(sousRegRes.data)
      if (grpRes.success && grpRes.data) setGroupes(grpRes.data)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleAddRegion = async () => {
    if (!newRegion.trim()) return
    setIsAddingRegion(true)
    setError(null)
    try {
      const res = await addRegion(newRegion)
      if (res.success && res.data) {
        setRegions([...regions, res.data])
        setNewRegion("")
      } else {
        setError(res.error || "Erreur lors de l'ajout de la région")
        alert(res.error || "Erreur lors de l'ajout de la région")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      alert("Erreur de connexion au serveur")
    } finally {
      setIsAddingRegion(false)
    }
  }

  const handleDeleteRegion = async (id: string) => {
    if(!confirm("Supprimer cette région ?")) return
    const res = await deleteRegion(id)
    if (res.success) {
      setRegions(regions.filter(r => r.id !== id))
    }
  }

  const handleAddSousRegion = async () => {
    if (!newSousRegion.trim()) return
    setIsAddingSousRegion(true)
    setError(null)
    try {
      const res = await addSousRegion(newSousRegion)
      if (res.success && res.data) {
        setSousRegions([...sousRegions, res.data])
        setNewSousRegion("")
      } else {
        setError(res.error || "Erreur lors de l'ajout de la sous-région")
        alert(res.error || "Erreur lors de l'ajout de la sous-région")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      alert("Erreur de connexion au serveur")
    } finally {
      setIsAddingSousRegion(false)
    }
  }

  const handleDeleteSousRegion = async (id: string) => {
    if(!confirm("Supprimer cette sous-région ?")) return
    const res = await deleteSousRegion(id)
    if (res.success) {
      setSousRegions(sousRegions.filter(s => s.id !== id))
    }
  }

  const handleAddGroupe = async () => {
    if (!newGroupe.trim()) return
    setIsAddingGroupe(true)
    setError(null)
    try {
      const res = await addGroupe(newGroupe)
      if (res.success && res.data) {
        setGroupes([...groupes, res.data])
        setNewGroupe("")
      } else {
        setError(res.error || "Erreur lors de l'ajout du groupe")
        alert(res.error || "Erreur lors de l'ajout du groupe")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      alert("Erreur de connexion au serveur")
    } finally {
      setIsAddingGroupe(false)
    }
  }

  const handleDeleteGroupe = async (id: string) => {
    if(!confirm("Supprimer ce groupe ?")) return
    const res = await deleteGroupe(id)
    if (res.success) {
      setGroupes(groupes.filter(g => g.id !== id))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
          <p className="text-slate-500">Gérez vos préférences et la configuration du système</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation / Tabs (Left Column) */}
        <div className="space-y-2 lg:col-span-1">
          <button 
            onClick={() => setActiveTab("profil")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all",
              activeTab === "profil" 
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm" 
                : "hover:bg-slate-50 border border-transparent text-slate-600"
            )}
          >
            <User className={cn("w-5 h-5", activeTab === "profil" ? "text-blue-600" : "text-slate-400")} />
            Profil Utilisateur
          </button>
          
          <button 
            onClick={() => setActiveTab("donnees")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all",
              activeTab === "donnees" 
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm" 
                : "hover:bg-slate-50 border border-transparent text-slate-600"
            )}
          >
            <Database className={cn("w-5 h-5", activeTab === "donnees" ? "text-blue-600" : "text-slate-400")} />
            Données de base
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border border-transparent rounded-xl text-left font-medium text-slate-600 transition-all">
            <Shield className="w-5 h-5 text-slate-400" />
            Sécurité & Accès
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border border-transparent rounded-xl text-left font-medium text-slate-600 transition-all">
            <Bell className="w-5 h-5 text-slate-400" />
            Notifications
          </button>
        </div>

        {/* Content Area (Right Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === "profil" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Informations Personnelles</h3>
                  <p className="text-sm text-slate-500 mt-1">Mettez à jour vos informations de compte administratif.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                      AD
                    </div>
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
                      Changer l'avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Nom complet</label>
                      <input type="text" defaultValue="Admin EPF" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Adresse Email</label>
                      <input type="email" defaultValue="admin@epf-recensement.ci" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-slate-700">Rôle</label>
                      <input type="text" defaultValue="Super Administrateur" disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Key className="w-5 h-5 text-slate-400" />
                    Mot de passe
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Mot de passe actuel</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="pt-2">
                    <button className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                      Mettre à jour le mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "donnees" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-slate-400" />
                    Gestion des données de base
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Ajoutez ou supprimez les régions, sous-régions et groupes qui apparaîtront dans les formulaires.
                  </p>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Régions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Régions</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newRegion}
                        onChange={(e) => setNewRegion(e.target.value)}
                        placeholder="Nouvelle région..." 
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <button 
                        onClick={handleAddRegion}
                        disabled={isAddingRegion || !newRegion.trim()}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
                      >
                        {isAddingRegion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {isAddingRegion ? "Ajout..." : "Ajouter"}
                      </button>
                    </div>
                    {error && (
                      <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-medium animate-in fade-in slide-in-from-top-1">
                        {error}
                      </div>
                    )}
                    {isLoadingData ? (
                      <div className="flex justify-center py-4 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {regions.map((region) => (
                          <div key={region.id} className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">{region.name}</span>
                            <button onClick={() => handleDeleteRegion(region.id)} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sous-régions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Sous-régions</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newSousRegion}
                        onChange={(e) => setNewSousRegion(e.target.value)}
                        placeholder="Nouvelle sous-région..." 
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <button 
                        onClick={handleAddSousRegion}
                        disabled={isAddingSousRegion || !newSousRegion.trim()}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
                      >
                        {isAddingSousRegion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {isAddingSousRegion ? "Ajout..." : "Ajouter"}
                      </button>
                    </div>
                    {isLoadingData ? (
                      <div className="flex justify-center py-4 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {sousRegions.map((sr) => (
                          <div key={sr.id} className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">{sr.name}</span>
                            <button onClick={() => handleDeleteSousRegion(sr.id)} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Groupes */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 border-b pb-2">Groupes / Départements</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newGroupe}
                        onChange={(e) => setNewGroupe(e.target.value)}
                        placeholder="Nouveau groupe..." 
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                      <button 
                        onClick={handleAddGroupe}
                        disabled={isAddingGroupe || !newGroupe.trim()}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20"
                      >
                        {isAddingGroupe ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {isAddingGroupe ? "Ajout..." : "Ajouter"}
                      </button>
                    </div>
                    {isLoadingData ? (
                      <div className="flex justify-center py-4 text-slate-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {groupes.map((groupe) => (
                          <div key={groupe.id} className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">{groupe.name}</span>
                            <button onClick={() => handleDeleteGroupe(groupe.id)} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
