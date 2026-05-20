"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/context/toast-context"
import { loginAdmin } from "@/lib/actions/parametres"
import { ShieldCheck, ArrowLeft, Loader2, Sparkles, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function ConnexionPage() {
  const router = useRouter()
  const { showToast } = useToast()
  
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // Play interactive synthesizer notes
  const playLoginSound = (type: "click" | "success" | "error" | "google") => {
    if (typeof window === "undefined") return
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()

      if (type === "google") {
        // Play an ascending double tone
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gainNode = ctx.createGain()

        osc1.type = "sine"
        osc2.type = "sine"
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

        osc1.frequency.setValueAtTime(392.00, ctx.currentTime) // G4
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime + 0.15) // C5
        osc2.frequency.setValueAtTime(493.88, ctx.currentTime) // B4
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15) // E5

        osc1.connect(gainNode)
        osc2.connect(gainNode)
        gainNode.connect(ctx.destination)

        osc1.start()
        osc2.start()
        osc1.stop(ctx.currentTime + 0.5)
        osc2.stop(ctx.currentTime + 0.5)
      } else if (type === "success") {
        // High-pitched success chime
        const now = ctx.currentTime
        const frequencies = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
        frequencies.forEach((f, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "triangle"
          osc.frequency.setValueAtTime(f, now + i * 0.08)
          gain.gain.setValueAtTime(0.06, now + i * 0.08)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + 0.4)
        })
      } else if (type === "error") {
        // Flat buzz tone
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sawtooth"
        osc.frequency.setValueAtTime(120, ctx.currentTime)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.3)
      } else {
        // Basic click bubble
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(261.63, ctx.currentTime)
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      }
    } catch (e) {
      console.warn("AudioContext block", e)
    }
  }



  const validateForm = () => {
    const tempErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!email.trim()) {
      tempErrors.email = "L'adresse email est requise."
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Format d'adresse email invalide."
      isValid = false
    }

    if (!password) {
      tempErrors.password = "Le mot de passe est requis."
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      playLoginSound("error")
      return
    }

    setIsLoading(true)
    playLoginSound("click")

    try {
      const result = await loginAdmin(email, password)
      
      if (result.success && result.data) {
        playLoginSound("success")
        showToast(`Ravi de vous revoir, ${result.data.nom} !`, "success")
        
        // Save some metadata in localStorage for fast UI rendering, but the actual security is in the HttpOnly cookie created by the Server Action
        localStorage.setItem("admin_nom", result.data.nom)
        localStorage.setItem("admin_email", result.data.email)
        localStorage.setItem("admin_role", result.data.role)
        
        // Trigger profile-updated event
        window.dispatchEvent(new Event("profile-updated"))
        
        // Redirect to dashboard (middleware will allow it now)
        router.push("/dashboard")
      } else {
        playLoginSound("error")
        setErrors({ email: result.error || "Adresse email non reconnue." })
        showToast(result.error || "Erreur de connexion", "error")
      }
    } catch (err) {
      playLoginSound("error")
      showToast("Une erreur serveur est survenue.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients (Softened to avoid sharp rectangular edges) */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.03] pointer-events-none z-0 mix-blend-multiply" />
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[70%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none z-0" />
      
      {/* Header Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour au site
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-white border border-slate-100 rounded-[28px] p-8 lg:p-10 shadow-2xl shadow-indigo-900/5 relative z-10 animate-fade-in-up">
        
        {/* EPF Header */}
        <div className="flex flex-row items-center justify-center gap-4 mb-8">
          <div 
            className="w-[72px] h-[72px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden"
          >
            <img src="/logo-epf.jpg" alt="Logo EPF" className="w-full h-full object-cover scale-[1.15] hover:scale-[1.2] transition-transform duration-500" />
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-[26px] font-extrabold text-[#001F3F] tracking-tight leading-tight">
              EPF Recensement
            </h1>
            <p className="text-slate-400 text-[11px] uppercase tracking-widest font-bold mt-1">
              Plateforme Nationale
            </p>
          </div>
        </div>



        {/* Credentials Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-600 block">
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              placeholder="Ex: jean.kouassi@epf.ci"
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#F8FAFC]/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                errors.email 
                  ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" 
                  : "border-slate-200 focus:ring-indigo-500/10 focus:border-[#4B39B7]"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-slate-600 block">
                Mot de passe
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                }}
                placeholder="Entrez votre mot de passe..."
                className={`w-full px-4 py-3 rounded-xl border text-sm bg-[#F8FAFC]/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all pr-12 ${
                  errors.password 
                    ? "border-rose-400 focus:ring-rose-500/10 focus:border-rose-500" 
                    : "border-slate-200 focus:ring-indigo-500/10 focus:border-[#4B39B7]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 font-medium">{errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#4B39B7] hover:bg-[#3D2EA3] text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/10 hover:shadow-xl active:scale-[0.99] hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info text */}
        <div className="mt-8 text-center text-xs text-slate-400 font-medium space-y-1">
          <p>
            Vous n'avez pas de compte ?{" "}
            <span 
              onClick={() => {
                playLoginSound("click")
                showToast("Veuillez contacter le Bureau National pour enregistrer un nouvel administrateur.", "info")
              }}
              className="text-[#4B39B7] hover:text-[#3D2EA3] font-bold hover:underline cursor-pointer transition-colors"
            >
              Demander un accès
            </span>
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-3 text-[10px] text-slate-300 font-semibold uppercase tracking-widest border-t border-slate-100">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>EPF Recensement Admin</span>
          </div>
        </div>

      </div>
    </div>
  )
}
