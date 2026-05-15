import Link from "next/link"
import { Church } from "lucide-react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 py-3 lg:py-4 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Church className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <h1 className="text-base lg:text-xl font-bold text-slate-900 leading-none">EPF Recensement</h1>
              <p className="text-[8px] lg:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 lg:mt-1">Plateforme Nationale</p>
            </div>
          </Link>
          
          {/* Mobile indicator or simple link if needed */}
          <Link href="/dashboard" className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
            Admin
          </Link>
        </div>
      </header>

      <main className="flex-1 py-6 lg:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 lg:py-8 text-center text-slate-400 text-[10px] lg:text-sm">
        <p>© {new Date().getFullYear()} Églises de Pentecôte de la Foi <br className="lg:hidden" /> Tous droits réservés</p>
      </footer>
    </div>
  )
}
