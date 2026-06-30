"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Filter, Search, ChevronDown, Calendar, MoreHorizontal, Edit, Trash2, Loader2, X, Users, Music, Phone, Mail, MapPin, Flame } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"
import { ConfirmModal } from "@/components/ui/confirm-modal"
import { getMembers, deleteMember, updateMember } from "@/lib/actions/member"
import { getRegions } from "@/lib/actions/parametres"
import { useToast } from "@/context/toast-context"

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
      {/* Tilted main leadpipe */}
      <line x1="4" y1="20" x2="16" y2="8" />
      {/* Mouthpiece */}
      <path d="M3 21l1.5-1.5M2 22a1 1 0 0 0 1.4-1.4" />
      {/* Tubing loop at the bottom */}
      <path d="M7 17c-1.5-1.5-1.5-3 0-4.5s3-1.5 4.5 0" />
      {/* Perpendicular parallel valves */}
      <line x1="10" y1="12" x2="8" y2="10" />
      <circle cx="7.5" cy="9.5" r="0.75" fill="currentColor" />
      
      <line x1="11.5" y1="10.5" x2="9.5" y2="8.5" />
      <circle cx="9" cy="8" r="0.75" fill="currentColor" />
      
      <line x1="13" y1="9" x2="11" y2="7" />
      <circle cx="10.5" cy="6.5" r="0.75" fill="currentColor" />
      
      {/* Bell shape at top right */}
      <path d="M14 10c2.5-3.5 5.5-6.5 8-7" />
      <path d="M16 12c3.5-2.5 6.5-5.5 7-8" />
      <path d="M22 3c1 1-6 7-7 8" />
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
      <line x1="9" y1="15" x2="15" y2="9" />
      <path d="M10 16.5L6.5 20c-.8.8-2 .8-2.8 0s-.8-2 0-2.8l3.5-3.5" />
      <path d="M13 11l3-3a3 3 0 0 1 4.2 4.2l-3 3" />
      <path d="M14.5 9.5l2.5 2.5" />
      <path d="M5.5 19.5c-1 1.5-2 2-3 1s-.5-2.5.8-3.7c1.8-1.8 3.5-1.8 5.3-.5 1.8 1.3 3.5 1.3 5.3 0c1.2-1 2.2-.8 3 .5" />
    </svg>
  )
}

interface MemberTableProps {
  showStats?: boolean
  defaultGroup?: string
}

export function MemberTable({ showStats = false, defaultGroup = "" }: MemberTableProps) {
  const router = useRouter()
  const { showToast, showAlertDialog } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(defaultGroup)
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [members, setMembers] = useState<any[]>([])
  const [regions, setRegions] = useState<{value: string, label: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [memRes, regRes] = await Promise.all([getMembers(), getRegions()])
    if (memRes.success && memRes.data) setMembers(memRes.data)
    if (regRes.success && regRes.data) {
      setRegions([
        { value: "", label: "Toutes les régions" },
        ...regRes.data.map((r: any) => ({ value: r.name, label: r.name }))
      ])
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!memberToDelete) return
    setIsDeleting(true)
    const res = await deleteMember(memberToDelete.id)
    if (res.success) {
      setMembers(prev => prev.filter(m => m.id !== memberToDelete.id))
      setOpenMenuId(null)
      setMemberToDelete(null)
      showToast("Membre supprimé avec succès !", "success")
    } else {
      showAlertDialog("Erreur", res.error || "Impossible de supprimer ce membre", "error")
    }
    setIsDeleting(false)
  }

  const filteredMembers = members.filter(member => {
    const fullName = `${member.nom} ${member.prenom}`.toLowerCase()
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesGroup = selectedGroup ? member.group_type === selectedGroup : true
    const matchesRegion = selectedRegion ? member.region === selectedRegion : true

    const date = new Date(member.createdAt)
    const memberYear = date.getFullYear().toString()
    const memberMonth = (date.getMonth() + 1).toString().padStart(2, "0")
    
    const matchesYear = selectedYear ? memberYear === selectedYear : true
    const matchesMonth = selectedMonth ? memberMonth === selectedMonth : true

    return matchesSearch && matchesGroup && matchesRegion && matchesYear && matchesMonth
  })

  const stats = {
    total: members.length,
    chorale: members.filter(m => m.group_type === "CHORALE").length,
    fanfare: members.filter(m => m.group_type === "FANFARE").length,
    groupeMusical: members.filter(m => m.group_type === "GROUPE_MUSICAL").length,
    jeunesse: members.filter(m => m.group_type === "JEUNESSE").length,
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      {showStats && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {/* Card Total */}
            <div 
              onClick={() => setSelectedGroup("")}
              className={cn(
                "p-6 bg-white rounded-[1.25rem] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group",
                selectedGroup === "" ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Membres</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.total}</h3>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  selectedGroup === "" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-blue-50 text-blue-600"
                )}>
                  <Users className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Card Choristes */}
            <div 
              onClick={() => setSelectedGroup("CHORALE")}
              className={cn(
                "p-6 bg-white rounded-[1.25rem] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group",
                selectedGroup === "CHORALE" ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Choristes</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.chorale}</h3>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  selectedGroup === "CHORALE" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-blue-50 text-blue-600"
                )}>
                  <Music className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Card Fanfaristes */}
            <div 
              onClick={() => setSelectedGroup("FANFARE")}
              className={cn(
                "p-6 bg-white rounded-[1.25rem] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group",
                selectedGroup === "FANFARE" ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fanfaristes</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.fanfare}</h3>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  selectedGroup === "FANFARE" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-blue-50 text-blue-600"
                )}>
                  <TrumpetIcon className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Card Groupe Musical */}
            <div 
              onClick={() => setSelectedGroup("GROUPE_MUSICAL")}
              className={cn(
                "p-6 bg-white rounded-[1.25rem] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group",
                selectedGroup === "GROUPE_MUSICAL" ? "border-blue-500 ring-1 ring-blue-500 shadow-md" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Groupe Musical</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.groupeMusical}</h3>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  selectedGroup === "GROUPE_MUSICAL" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-blue-50 text-blue-600"
                )}>
                  <MicCableIcon className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Card Jeunesse */}
            <div 
              onClick={() => setSelectedGroup("JEUNESSE")}
              className={cn(
                "p-6 bg-white rounded-[1.25rem] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group",
                selectedGroup === "JEUNESSE" ? "border-amber-500 ring-1 ring-amber-500 shadow-md" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent opacity-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Jeunesse</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stats.jeunesse}</h3>
                  </div>
                </div>
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3",
                  selectedGroup === "JEUNESSE" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-amber-50 text-amber-500"
                )}>
                  <Flame className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Global Date Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold">Filtres Générales</h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-[140px]">
            <CustomSelect
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Année"
              colorTheme="slate"
              options={[
                { value: "", label: "Toutes années" },
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" }
              ]}
            />
          </div>
          <div className="w-full sm:w-[160px]">
            <CustomSelect
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Mois"
              colorTheme="slate"
              options={[
                { value: "", label: "Tous les mois" },
                { value: "01", label: "Janvier" },
                { value: "02", label: "Février" },
                { value: "03", label: "Mars" },
                { value: "04", label: "Avril" },
                { value: "05", label: "Mai" },
                { value: "06", label: "Juin" },
                { value: "07", label: "Juillet" },
                { value: "08", label: "Août" },
                { value: "09", label: "Septembre" },
                { value: "10", label: "Octobre" },
                { value: "11", label: "Novembre" },
                { value: "12", label: "Décembre" }
              ]}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible animate-in fade-in slide-in-from-bottom-4">
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-lg">Liste des Membres</h3>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-none">
              {showStats && (
                <div className="w-[160px]">
                  <CustomSelect
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    placeholder="Tous les groupes"
                    colorTheme="slate"
                    options={[
                      { value: "", label: "Tous les groupes" },
                      { value: "CHORALE", label: "Chorale" },
                      { value: "FANFARE", label: "Fanfare" },
                      { value: "GROUPE_MUSICAL", label: "Groupe Musical" },
                      { value: "JEUNESSE", label: "Jeunesse" }
                    ]}
                  />
                </div>
              )}
              <div className="w-[160px]">
                <CustomSelect
                  value={selectedRegion}
                  onChange={setSelectedRegion}
                  placeholder="Toutes les régions"
                  searchable
                  colorTheme="slate"
                  options={regions}
                />
              </div>
            </div>

            {/* Add Button with Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Ajouter
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </button>

              {isAddMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1">
                    <button onClick={() => router.push("/recensement/chorale")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                      Membre Chorale
                    </button>
                    <button onClick={() => router.push("/recensement/fanfare")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors">
                      Membre Fanfare
                    </button>
                    <button onClick={() => router.push("/recensement/groupe-musical")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors">
                      Membre Grp. Musical
                    </button>
                    <button onClick={() => router.push("/recensement/jeunesse")} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-500 rounded-lg transition-colors">
                      Membre Jeunesse
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 rounded-tl-lg">Membre</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Région</th>
                <th className="px-6 py-4">Sous-région</th>
                <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm text-slate-500 mt-2">Chargement des membres...</p>
                  </td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className={cn(
                  "hover:bg-slate-50/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 group",
                  openMenuId === member.id ? "relative z-50" : "relative z-0"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 group-hover:scale-105 group-hover:bg-blue-100 transition-all">
                        {member.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]" title={`${member.nom} ${member.prenom}`}>{member.nom} {member.prenom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 whitespace-nowrap">
                    {member.telephone || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-[150px] truncate" title={member.email}>
                    {member.email || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full",
                      member.group_type === "CHORALE" ? "bg-blue-50 text-blue-700" :
                        member.group_type === "FANFARE" ? "bg-emerald-50 text-emerald-700" :
                          member.group_type === "JEUNESSE" ? "bg-amber-50 text-amber-700" :
                            "bg-indigo-50 text-indigo-700"
                    )}>
                      {member.group_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {member.region}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{member.sous_region}</td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="inline-block text-left">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      
                      {/* Action Dropdown */}
                      {openMenuId === member.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-1.5 space-y-1">
                              <button 
                                onClick={() => {
                                  setEditingMember(member)
                                  setOpenMenuId(null)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                              >
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></div> Modifier
                              </button>
                              <button 
                                onClick={() => {
                                  setMemberToDelete(member)
                                  setOpenMenuId(null)
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all"
                              >
                                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></div> Supprimer
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Aucun membre trouvé avec ces critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
            </div>
          ) : filteredMembers.map((member) => (
            <div key={member.id} className={cn(
              "p-5 space-y-4 bg-white rounded-[1.25rem] border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group",
              openMenuId === member.id ? "relative z-50 ring-1 ring-blue-500 shadow-md" : "relative z-0"
            )}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent opacity-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100/50 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {member.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 leading-tight">{member.nom} {member.prenom}</p>
                    <span className={cn(
                      "inline-flex mt-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border",
                      member.group_type === "CHORALE" ? "bg-blue-50 text-blue-700 border-blue-100/50" :
                        member.group_type === "FANFARE" ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" :
                          member.group_type === "JEUNESSE" ? "bg-amber-50 text-amber-700 border-amber-100/50" :
                            "bg-indigo-50 text-indigo-700 border-indigo-100/50"
                    )}>
                      {member.group_type}
                    </span>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="inline-block text-left relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                    className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === member.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-1.5 space-y-1">
                          <button 
                            onClick={() => {
                              setEditingMember(member)
                              setOpenMenuId(null)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all"
                          >
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></div> Modifier
                          </button>
                          <button 
                            onClick={() => {
                              setMemberToDelete(member)
                              setOpenMenuId(null)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-rose-600 rounded-xl transition-all"
                          >
                            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></div> Supprimer
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="relative grid grid-cols-2 gap-y-4 gap-x-3 pt-4 border-t border-slate-50 mt-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3"/> Téléphone</p>
                  <p className="text-sm text-slate-700 font-semibold">{member.telephone || "-"}</p>
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><Mail className="w-3 h-3"/> Email</p>
                  <p className="text-sm text-slate-700 font-semibold truncate" title={member.email}>{member.email || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Région</p>
                  <p className="text-sm text-slate-700 font-semibold truncate" title={member.region}>{member.region}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Sous-région</p>
                  <p className="text-sm text-slate-700 font-semibold truncate" title={member.sous_region}>{member.sous_region}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Aucun membre trouvé avec ces critères.
            </div>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingMember(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                Modifier le membre
              </h3>
              <button onClick={() => setEditingMember(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form action={async (formData) => {
              setIsUpdating(true)
              const res = await updateMember(editingMember.id, formData)
              if (res.success && res.data) {
                const updatedMember = res.data
                setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m))
                setEditingMember(null)
                showToast("Membre modifié avec succès !", "success")
              } else {
                showAlertDialog("Erreur de modification", res.error || "Impossible de modifier ce membre", "error")
              }
              setIsUpdating(false)
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                  <input name="nom" defaultValue={editingMember.nom} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                  <input name="prenom" defaultValue={editingMember.prenom} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input name="email" type="email" defaultValue={editingMember.email} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                <input name="telephone" defaultValue={editingMember.telephone} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Région</label>
                  <select name="region" defaultValue={editingMember.region} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    {regions.filter(r => r.value !== "").map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sous-région</label>
                  <input name="sous_region" defaultValue={editingMember.sous_region} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingMember(null)} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                  {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdating ? "Mise à jour..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!memberToDelete}
        title="Supprimer le membre"
        description={`Êtes-vous sûr de vouloir supprimer ${memberToDelete?.nom} ${memberToDelete?.prenom} ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setMemberToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
