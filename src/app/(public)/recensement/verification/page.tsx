"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { checkMemberRegistration } from "@/lib/actions/member"

export default function VerificationPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ nom: "", prenom: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ isRegistered: boolean; group?: string; error?: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nom || !formData.prenom) return

    setIsSubmitting(true)
    setResult(null)

    const res = await checkMemberRegistration(formData.nom, formData.prenom)
    
    if (res.success) {
      setResult({ isRegistered: res.isRegistered, group: res.group })
    } else {
      setResult({ isRegistered: false, error: res.error })
    }
    
    setIsSubmitting(false)
  }

  const getGroupName = (group: string) => {
    switch (group) {
      case "CHORALE": return "Chorale"
      case "FANFARE": return "Fanfare"
      case "GROUPE_MUSICAL": return "Groupe Musical"
      case "JEUNESSE": return "Jeunesse"
      default: return group
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => router.push("/recensement")}
          className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium group"
        >
          <div className="p-2 rounded-full bg-slate-200/50 group-hover:bg-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour à l'accueil
        </button>

        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Vérifier mon inscription</h1>
            <p className="text-slate-500 text-sm">Entrez vos informations pour savoir si vous êtes déjà recensé(e).</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nom *</label>
              <input 
                type="text" 
                name="nom" 
                value={formData.nom} 
                onChange={handleInputChange} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="Votre nom" 
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Prénom *</label>
              <input 
                type="text" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleInputChange} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="Votre prénom" 
                required
              />
            </div>

            <button
              type="submit"
              disabled={!formData.nom || !formData.prenom || isSubmitting}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-slate-900/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Vérifier
                </>
              )}
            </button>
          </form>

          {/* Results Area */}
          {result && (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {result.error ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex items-start gap-3">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                  <p>{result.error}</p>
                </div>
              ) : result.isRegistered ? (
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-emerald-900 text-lg">Inscription trouvée !</h3>
                  <p className="text-emerald-700/80 text-sm">
                    Vous êtes bien recensé(e) dans le groupe :<br/>
                    <strong className="text-emerald-800 text-base">{getGroupName(result.group!)}</strong>
                  </p>
                </div>
              ) : (
                <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-1">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-amber-900 text-lg">Aucun résultat</h3>
                  <p className="text-amber-700/80 text-sm">
                    Nous n'avons pas trouvé de recensement à votre nom. Vous pouvez vous inscrire depuis l'accueil.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
