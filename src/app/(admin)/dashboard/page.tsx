"use client"

import { StatCard } from "@/components/admin/stat-card"
import { MemberTable } from "@/components/admin/member-table"
import { Users, Mic, Church } from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/actions/member"

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
      <path d="M18 8c1.5 0 3 .5 3 2.5v3c0 2-1.5 2.5-3 2.5" />
      <path d="M21 9v6" />
      <path d="M3 13h15" />
      <path d="M3 11h11c1 0 2 .5 2 1.5s-1 1.5-2 1.5H8" />
      <path d="M9 11V7" />
      <circle cx="9" cy="6" r="1" />
      <path d="M12 11V7" />
      <circle cx="12" cy="6" r="1" />
      <path d="M15 11V7" />
      <circle cx="15" cy="6" r="1" />
      <path d="M2 10.5v3" />
    </svg>
  )
}

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin EPF")
  const [stats, setStats] = useState({
    total: 0,
    chorale: 0,
    fanfare: 0,
    musical: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const name = localStorage.getItem("admin_nom") || "Admin EPF"
    setAdminName(name)

    const loadStats = async () => {
      try {
        const res = await getDashboardStats()
        if (res.success && res.data) {
          setStats(res.data)
        }
      } catch (err) {
        console.error("Failed to load stats", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header and Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Bienvenue, <span className="text-blue-600 font-bold">{adminName}</span> 👋
          </h1>
          <p className="text-slate-500 mt-1">Voici l'état actuel du recensement national EPF</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between animate-pulse"
            >
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-8 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
            </div>
          ))
        ) : (
          <>
            <StatCard 
              title="Total Membres" 
              value={stats.total} 
              trend="Inscriptions actives" 
              icon={Users}
              className="animate-fade-in-up delay-75"
            />
            <StatCard 
              title="Choristes" 
              value={stats.chorale} 
              trend={`${stats.total > 0 ? Math.round((stats.chorale / stats.total) * 100) : 0}% du total`}
              icon={Mic}
              className="animate-fade-in-up delay-150"
            />
            <StatCard 
              title="Fanfaristes" 
              value={stats.fanfare} 
              trend={`${stats.total > 0 ? Math.round((stats.fanfare / stats.total) * 100) : 0}% du total`}
              icon={TrumpetIcon}
              className="animate-fade-in-up delay-225"
            />
            <StatCard 
              title="Groupe Musical" 
              value={stats.musical} 
              trend={`${stats.total > 0 ? Math.round((stats.musical / stats.total) * 100) : 0}% du total`}
              icon={Church}
              className="animate-fade-in-up delay-300"
            />
          </>
        )}
      </div>

      {/* Members Table */}
      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-375">
        <MemberTable />
      </div>
    </div>
  )
}
