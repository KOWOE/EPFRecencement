"use client"

import { Wrench, ShieldAlert } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        <div className="mx-auto w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-900/50 mb-8 border border-white/10">
          <Wrench className="w-12 h-12 text-white animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Maintenance en cours
        </h1>

        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
          La plateforme de recensement EPF est actuellement indisponible pour cause de mise à jour technique. Nous serons de retour très bientôt avec de nouvelles fonctionnalités.
        </p>

        <div className="pt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold backdrop-blur-sm">
            <ShieldAlert className="w-5 h-5" />
            Merci de votre patience
          </div>
        </div>
      </div>
    </div>
  )
}
