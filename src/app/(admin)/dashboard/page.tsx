"use client"

import { StatCard } from "@/components/admin/stat-card"
import { MemberTable } from "@/components/admin/member-table"
import { Users, Mic, FlameIcon as Flame } from "lucide-react"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/actions/member"

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

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

export default function DashboardPage() {
  const [adminName, setAdminName] = useState("Admin EPF")
  const [stats, setStats] = useState({
    total: 0,
    chorale: 0,
    fanfare: 0,
    musical: 0,
    jeunesse: 0
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
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
              icon={MicCableIcon}
              className="animate-fade-in-up delay-300"
            />
            <StatCard 
              title="Jeunesse" 
              value={stats.jeunesse} 
              trend={`${stats.total > 0 ? Math.round((stats.jeunesse / stats.total) * 100) : 0}% du total`}
              icon={FlameIcon}
              className="animate-fade-in-up delay-375"
            />
          </>
        )}
      </div>

      {/* Members Table */}
      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-500">
        <MemberTable />
      </div>
    </div>
  )
}
