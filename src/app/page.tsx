import Link from "next/link"
import { Church, ArrowRight, Music, Wind, ShieldCheck } from "lucide-react"

export default function RootPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <nav className="border-b border-slate-100 py-6">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Church className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900 tracking-tight">EPF Recensement</span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            Accès Administration
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
              Recensement National 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
              Bâtissons ensemble <br />
              <span className="text-blue-600">l'avenir de nos ministères.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              La plateforme officielle pour l'identification et l'organisation des membres actifs des Églises de Pentecôte de la Foi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/recensement"
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              Démarrer mon recensement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Chorales</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Coordination nationale des voix pour une louange harmonisée dans toutes nos régions.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Fanfares</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Structuration des instruments à vent pour magnifier nos célébrations et défilés.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-left space-y-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                <Church className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Groupes Musicaux</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Identification des chantres et musiciens pour un accompagnement spirituel de qualité.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Églises de Pentecôte de la Foi (EPF). Tous droits réservés.</p>
        </div>
      </footer>
    </div >
  )
}
