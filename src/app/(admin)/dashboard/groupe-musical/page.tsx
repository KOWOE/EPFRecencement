import { MemberTable } from "@/components/admin/member-table"
import { Church } from "lucide-react"

export default function GroupeMusicalPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Church className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Groupe Musical</h1>
          <p className="text-slate-500">Gérez les membres inscrits au registre du groupe musical</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <MemberTable defaultGroup="GROUPE_MUSICAL" />
      </div>
    </div>
  )
}
