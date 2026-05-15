import Link from "next/link"
import { CheckCircle, Home, ArrowRight } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="text-center space-y-8 py-12">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
          <CheckCircle className="w-16 h-16" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">Enregistrement Réussi !</h2>
        <p className="text-slate-600 max-w-md mx-auto text-lg">
          Merci pour votre participation au recensement. Vos informations ont été transmises avec succès au Bureau National.
        </p>
      </div>

      <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/recensement" 
          className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </Link>
        <Link 
          href="/recensement" 
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          Nouveau recensement
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="pt-12">
        <p className="text-sm text-slate-400 italic">
          Que la paix du Seigneur soit avec vous.
        </p>
      </div>
    </div>
  )
}
