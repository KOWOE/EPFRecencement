"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Filter, Search, ChevronDown, Calendar, MoreHorizontal, Edit, Trash2, Loader2, X } from "lucide-react"
import { CustomSelect } from "@/components/ui/custom-select"
import { getMembers, deleteMember } from "@/lib/actions/member"
import { getRegions } from "@/lib/actions/parametres"

export function MemberTable() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  
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

  const handleDelete = async (member: any) => {
    if (!confirm(`Voulez-vous vraiment supprimer ${member.nom} ${member.prenom} ?`)) return
    const res = await deleteMember(member.id)
    if (res.success) {
      setMembers(prev => prev.filter(m => m.id !== member.id))
      setOpenMenuId(null)
    } else {
      alert(res.error)
    }
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

  return (
    <div className="space-y-6">
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
                    { value: "GROUPE_MUSICAL", label: "Groupe Musical" }
                  ]}
                />
              </div>
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
                <th className="px-6 py-4 rounded-tl-lg">Nom & Email</th>
                <th className="px-6 py-4">Groupe</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Région</th>
                <th className="px-6 py-4">Sous-région</th>
                <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-sm text-slate-500 mt-2">Chargement des membres...</p>
                  </td>
                </tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:scale-105 group-hover:bg-blue-100 transition-all">
                        {member.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{member.nom} {member.prenom}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-full",
                      member.group_type === "CHORALE" ? "bg-blue-50 text-blue-700" :
                        member.group_type === "FANFARE" ? "bg-emerald-50 text-emerald-700" :
                          "bg-indigo-50 text-indigo-700"
                    )}>
                      {member.group_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{member.role}</td>
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
                          <div className="absolute right-6 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1">
                              <button 
                                onClick={() => {
                                  setEditingMember(member)
                                  setOpenMenuId(null)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" /> Modifier
                              </button>
                              <button 
                                onClick={() => handleDelete(member)}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Supprimer
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
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
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
            <div key={member.id} className="p-4 space-y-3 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {member.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{member.nom} {member.prenom}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="inline-block text-left relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === member.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-1">
                          <button 
                            onClick={() => {
                              alert(`Modification du membre : ${member.name}`)
                              setOpenMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" /> Modifier
                          </button>
                          <button 
                            onClick={() => {
                              if(confirm(`Voulez-vous vraiment supprimer ${member.name} ?`)) {
                                alert(`Membre supprimé.`)
                              }
                              setOpenMenuId(null)
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-3 border-t border-slate-50">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Groupe</p>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold rounded-md",
                    member.group_type === "CHORALE" ? "bg-blue-50 text-blue-700" :
                      member.group_type === "FANFARE" ? "bg-emerald-50 text-emerald-700" :
                        "bg-indigo-50 text-indigo-700"
                  )}>
                    {member.group_type}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Rôle</p>
                  <p className="text-xs text-slate-700 font-medium">{member.role}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Région</p>
                  <p className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {member.region}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Sous-région</p>
                  <p className="text-xs text-slate-700 font-medium flex items-center gap-1">
                    {member.sous_region}
                  </p>
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
              if (res.success) {
                setMembers(prev => prev.map(m => m.id === res.data.id ? res.data : m))
                setEditingMember(null)
              } else {
                alert(res.error)
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
    </div>
  )
}
