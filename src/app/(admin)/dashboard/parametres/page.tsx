"use client"

import { Settings, User, Bell, Shield, Key, Database, Plus, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { getRegions, addRegion, deleteRegion, getSousRegions, addSousRegion, deleteSousRegion, getGroupes, addGroupe, deleteGroupe } from "@/lib/actions/parametres"
import { useToast } from "@/context/toast-context"

export default function ParametresPage() {
  const { showToast, showAlertDialog } = useToast()
  const [activeTab, setActiveTab] = useState("profil")

  // Security Toggles
  const [allowPublicReg, setAllowPublicReg] = useState(true)
  const [requireMfa, setRequireMfa] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [statReports, setStatReports] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [notifyChorale, setNotifyChorale] = useState(true)
  const [notifyFanfare, setNotifyFanfare] = useState(true)
  const [notifyGroup, setNotifyGroup] = useState(false)
  
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

  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, type: 'region'|'sous-region'|'groupe'|null, id: string | null, name: string | null}>({
    isOpen: false,
    type: null,
    id: null,
    name: null
  })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadData()
    
    // Load local settings
    const storedPublicReg = localStorage.getItem("setting_allowPublicReg")
    if (storedPublicReg !== null) setAllowPublicReg(storedPublicReg === "true")
    
    const storedMfa = localStorage.getItem("setting_requireMfa")
    if (storedMfa !== null) setRequireMfa(storedMfa === "true")
    
    const storedMaintenance = localStorage.getItem("setting_maintenanceMode")
    if (storedMaintenance !== null) setMaintenanceMode(storedMaintenance === "true")
    
    const storedEmailAlerts = localStorage.getItem("setting_emailAlerts")
    if (storedEmailAlerts !== null) setEmailAlerts(storedEmailAlerts === "true")
    
    const storedStatReports = localStorage.getItem("setting_statReports")
    if (storedStatReports !== null) setStatReports(storedStatReports === "true")
    
    const storedSecAlerts = localStorage.getItem("setting_securityAlerts")
    if (storedSecAlerts !== null) setSecurityAlerts(storedSecAlerts === "true")

    const storedChorale = localStorage.getItem("setting_notifyChorale")
    if (storedChorale !== null) setNotifyChorale(storedChorale === "true")
    
    const storedFanfare = localStorage.getItem("setting_notifyFanfare")
    if (storedFanfare !== null) setNotifyFanfare(storedFanfare === "true")
    
    const storedGroup = localStorage.getItem("setting_notifyGroup")
    if (storedGroup !== null) setNotifyGroup(storedGroup === "true")
  }, [])

  const togglePublicReg = () => {
    const nextVal = !allowPublicReg
    setAllowPublicReg(nextVal)
    localStorage.setItem("setting_allowPublicReg", String(nextVal))
  }

  const toggleMfa = () => {
    const nextVal = !requireMfa
    setRequireMfa(nextVal)
    localStorage.setItem("setting_requireMfa", String(nextVal))
  }

  const toggleMaintenance = () => {
    const nextVal = !maintenanceMode
    setMaintenanceMode(nextVal)
    localStorage.setItem("setting_maintenanceMode", String(nextVal))
  }

  const toggleEmailAlerts = () => {
    const nextVal = !emailAlerts
    setEmailAlerts(nextVal)
    localStorage.setItem("setting_emailAlerts", String(nextVal))
  }

  const toggleStatReports = () => {
    const nextVal = !statReports
    setStatReports(nextVal)
    localStorage.setItem("setting_statReports", String(nextVal))
  }

  const toggleSecurityAlerts = () => {
    const nextVal = !securityAlerts
    setSecurityAlerts(nextVal)
    localStorage.setItem("setting_securityAlerts", String(nextVal))
  }

  const toggleNotifyChorale = () => {
    const nextVal = !notifyChorale
    setNotifyChorale(nextVal)
    localStorage.setItem("setting_notifyChorale", String(nextVal))
  }

  const toggleNotifyFanfare = () => {
    const nextVal = !notifyFanfare
    setNotifyFanfare(nextVal)
    localStorage.setItem("setting_notifyFanfare", String(nextVal))
  }

  const toggleNotifyGroup = () => {
    const nextVal = !notifyGroup
    setNotifyGroup(nextVal)
    localStorage.setItem("setting_notifyGroup", String(nextVal))
  }

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
        showToast("Région ajoutée avec succès !", "success")
      } else {
        setError(res.error || "Erreur lors de l'ajout de la région")
        showAlertDialog("Erreur", res.error || "Erreur lors de l'ajout de la région", "error")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      showAlertDialog("Erreur réseau", "Erreur de connexion au serveur", "error")
    } finally {
      setIsAddingRegion(false)
    }
  }

  const handleDeleteRegion = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await deleteRegion(id)
      if (res.success) {
        setRegions(regions.filter(r => r.id !== id))
        setDeleteModal({isOpen: false, type: null, id: null, name: null})
        showToast("Région supprimée !", "success")
      } else {
        showAlertDialog("Erreur", res.error || "Erreur lors de la suppression", "error")
      }
    } catch (err) {
      showAlertDialog("Erreur", "Une erreur est survenue lors de la suppression", "error")
    } finally {
      setIsDeleting(false)
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
        showToast("Sous-région ajoutée avec succès !", "success")
      } else {
        setError(res.error || "Erreur lors de l'ajout de la sous-région")
        showAlertDialog("Erreur", res.error || "Erreur lors de l'ajout de la sous-région", "error")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      showAlertDialog("Erreur réseau", "Erreur de connexion au serveur", "error")
    } finally {
      setIsAddingSousRegion(false)
    }
  }

  const handleDeleteSousRegion = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await deleteSousRegion(id)
      if (res.success) {
        setSousRegions(sousRegions.filter(s => s.id !== id))
        setDeleteModal({isOpen: false, type: null, id: null, name: null})
        showToast("Sous-région supprimée !", "success")
      } else {
        showAlertDialog("Erreur", res.error || "Erreur lors de la suppression", "error")
      }
    } catch (err) {
      showAlertDialog("Erreur", "Une erreur est survenue lors de la suppression", "error")
    } finally {
      setIsDeleting(false)
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
        showToast("Groupe ajouté avec succès !", "success")
      } else {
        setError(res.error || "Erreur lors de l'ajout du groupe")
        showAlertDialog("Erreur", res.error || "Erreur lors de l'ajout du groupe", "error")
      }
    } catch (err) {
      setError("Erreur de connexion au serveur")
      showAlertDialog("Erreur réseau", "Erreur de connexion au serveur", "error")
    } finally {
      setIsAddingGroupe(false)
    }
  }

  const handleDeleteGroupe = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await deleteGroupe(id)
      if (res.success) {
        setGroupes(groupes.filter(g => g.id !== id))
        setDeleteModal({isOpen: false, type: null, id: null, name: null})
        showToast("Groupe supprimé !", "success")
      } else {
        showAlertDialog("Erreur", res.error || "Erreur lors de la suppression", "error")
      }
    } catch (err) {
      showAlertDialog("Erreur", "Une erreur est survenue lors de la suppression", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmDelete = () => {
    if (!deleteModal.id || !deleteModal.type) return
    if (deleteModal.type === 'region') handleDeleteRegion(deleteModal.id)
    if (deleteModal.type === 'sous-region') handleDeleteSousRegion(deleteModal.id)
    if (deleteModal.type === 'groupe') handleDeleteGroupe(deleteModal.id)
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

          <button 
            onClick={() => setActiveTab("securite")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all",
              activeTab === "securite" 
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm" 
                : "hover:bg-slate-50 border border-transparent text-slate-600"
            )}
          >
            <Shield className={cn("w-5 h-5", activeTab === "securite" ? "text-blue-600" : "text-slate-400")} />
            Sécurité & Accès
          </button>
          
          <button 
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all",
              activeTab === "notifications" 
                ? "bg-white border border-slate-200 text-slate-900 shadow-sm" 
                : "hover:bg-slate-50 border border-transparent text-slate-600"
            )}
          >
            <Bell className={cn("w-5 h-5", activeTab === "notifications" ? "text-blue-600" : "text-slate-400")} />
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
                            <button 
                              type="button"
                              onClick={() => setDeleteModal({ isOpen: true, type: 'region', id: region.id, name: region.name })} 
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-95 group"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform" />
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
                            <button 
                              type="button"
                              onClick={() => setDeleteModal({ isOpen: true, type: 'sous-region', id: sr.id, name: sr.name })} 
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-95 group"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform" />
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
                            <button 
                              type="button"
                              onClick={() => setDeleteModal({ isOpen: true, type: 'groupe', id: groupe.id, name: groupe.name })} 
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-95 group"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4 pointer-events-none group-hover:scale-110 transition-transform" />
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

          {activeTab === "securite" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-400" />
                    Sécurité Globale
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Configurez les règles de sécurité et de contrôle d'accès de la plateforme.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Autoriser les inscriptions publiques</label>
                      <p className="text-xs text-slate-500">Permet aux membres de soumettre les formulaires de recensement en ligne.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={togglePublicReg}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        allowPublicReg ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          allowPublicReg ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Double authentification (MFA)</label>
                      <p className="text-xs text-slate-500">Exige une vérification en deux étapes pour tous les administrateurs.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleMfa}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        requireMfa ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          requireMfa ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Mode Maintenance</label>
                      <p className="text-xs text-slate-500">Désactive temporairement l'application pour les utilisateurs non administrateurs.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleMaintenance}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                        maintenanceMode ? "bg-red-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          maintenanceMode ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Administrateurs du Système</h3>
                  <p className="text-sm text-slate-500 mt-1">Liste des comptes disposant d'un accès administratif.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">AE</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Admin EPF</p>
                        <p className="text-xs text-slate-500">admin@epf-recensement.ci</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Super Admin</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center">SE</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Secrétariat EPF</p>
                        <p className="text-xs text-slate-500">secretariat@epf-recensement.ci</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Éditeur</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5 text-slate-400" />
                    Préférences de Notifications
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Gerez la manière dont vous recevez les alertes et les rapports.</p>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Notifications par Email</label>
                      <p className="text-xs text-slate-500">Recevez des alertes directement dans votre boîte de réception.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleEmailAlerts}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        emailAlerts ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          emailAlerts ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-50">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Rapports statistiques réguliers</label>
                      <p className="text-xs text-slate-500">Recevez un rapport hebdomadaire sur l'état des recensements.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleStatReports}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        statReports ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          statReports ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="space-y-1 pr-4">
                      <label className="text-sm font-semibold text-slate-900">Alertes de sécurité</label>
                      <p className="text-xs text-slate-500">Soyez notifié immédiatement en cas d'activité suspecte sur votre compte.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={toggleSecurityAlerts}
                      className={cn(
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        securityAlerts ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <span 
                        className={cn(
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          securityAlerts ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Suivi des Recensements</h3>
                  <p className="text-sm text-slate-500 mt-1">Choisissez pour quels groupes de recensement vous souhaitez recevoir des notifications d'inscription.</p>
                </div>
                <div className="p-6 space-y-4">
                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifyChorale}
                      onChange={toggleNotifyChorale}
                      className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Groupe Chorale</p>
                      <p className="text-xs text-slate-500">Notifier lors d'une nouvelle inscription dans la Chorale.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifyFanfare}
                      onChange={toggleNotifyFanfare}
                      className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Groupe Fanfare</p>
                      <p className="text-xs text-slate-500">Notifier lors d'une nouvelle inscription dans la Fanfare.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={notifyGroup}
                      onChange={toggleNotifyGroup}
                      className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Groupe Musical</p>
                      <p className="text-xs text-slate-500">Notifier lors d'une nouvelle inscription dans le Groupe Musical.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        title={`Supprimer ${deleteModal.type === 'region' ? 'la région' : deleteModal.type === 'sous-region' ? 'la sous-région' : 'le groupe'}`}
        description={`Êtes-vous sûr de vouloir supprimer "${deleteModal.name}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({isOpen: false, type: null, id: null, name: null})}
        isLoading={isDeleting}
      />
    </div>
  )
}
