import { StatCard } from "@/components/admin/stat-card"
import { MemberTable } from "@/components/admin/member-table"
import { Users, Music, Wind, Church } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vue d'ensemble</h1>
        <p className="text-slate-500">Statistiques du recensement national EPF</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Membres" 
          value="1,284" 
          trend="+12% vs mois dernier" 
          icon={Users} 
        />
        <StatCard 
          title="Choristes" 
          value="542" 
          trend="+5%" 
          icon={Music} 
        />
        <StatCard 
          title="Fanfaristes" 
          value="318" 
          trend="+2%" 
          icon={Wind} 
        />
        <StatCard 
          title="Groupe Musical" 
          value="424" 
          trend="+8%" 
          icon={Church} 
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <MemberTable />
      </div>
    </div>
  )
}
