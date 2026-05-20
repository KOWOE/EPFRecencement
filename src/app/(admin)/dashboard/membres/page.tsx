import { MemberTable } from "@/components/admin/member-table"
import { Users } from "lucide-react"

export default function MembresPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 animate-fade-in-up delay-75">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tous les Membres</h1>
          <p className="text-slate-500">Gérez l'ensemble des membres recensés au niveau national</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-150">
        <MemberTable showStats={true} />
      </div>
    </div>
  )
}
