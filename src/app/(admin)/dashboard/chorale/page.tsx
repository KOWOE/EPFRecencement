import { MemberTable } from "@/components/admin/member-table"
import { Music } from "lucide-react"

export default function ChoralePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 animate-fade-in-up delay-75">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Music className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chorale Nationale</h1>
          <p className="text-slate-500">Gérez les membres inscrits au registre de la chorale</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-150">
        <MemberTable defaultGroup="CHORALE" />
      </div>
    </div>
  )
}
