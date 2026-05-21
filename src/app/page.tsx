"use client"

import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { 
  Church, 
  ArrowRight, 
  Mic, 
  Music,
  ShieldCheck, 
  Star, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Users,
  Map,
  Layers,
  CheckCircle2,
  FileSpreadsheet,
  FileSignature,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

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
      {/* Tilted main leadpipe */}
      <line x1="4" y1="20" x2="16" y2="8" />
      {/* Mouthpiece */}
      <path d="M3 21l1.5-1.5M2 22a1 1 0 0 0 1.4-1.4" />
      {/* Tubing loop at the bottom */}
      <path d="M7 17c-1.5-1.5-1.5-3 0-4.5s3-1.5 4.5 0" />
      {/* Perpendicular parallel valves */}
      <line x1="10" y1="12" x2="8" y2="10" />
      <circle cx="7.5" cy="9.5" r="0.75" fill="currentColor" />
      
      <line x1="11.5" y1="10.5" x2="9.5" y2="8.5" />
      <circle cx="9" cy="8" r="0.75" fill="currentColor" />
      
      <line x1="13" y1="9" x2="11" y2="7" />
      <circle cx="10.5" cy="6.5" r="0.75" fill="currentColor" />
      
      {/* Bell shape at top right */}
      <path d="M14 10c2.5-3.5 5.5-6.5 8-7" />
      <path d="M16 12c3.5-2.5 6.5-5.5 7-8" />
      <path d="M22 3c1 1-6 7-7 8" />
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

function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const cleanNumStr = value.replace(/[^0-9]/g, "")
    const targetNum = parseInt(cleanNumStr, 10)

    if (isNaN(targetNum)) {
      return
    }

    const duration = 2000 // 2 seconds
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)

      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const currentVal = Math.floor(easeProgress * targetNum)

      setCount(currentVal)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [hasStarted, value])

  const hasPlus = value.includes("+")
  const formattedCount = count.toLocaleString("fr-FR")
  
  return (
    <span ref={elementRef}>
      {formattedCount}
      {hasPlus && "+"}
    </span>
  )
}

const stats = [
  { value: "10 000+", label: "Membres Actifs", icon: Users, color: "text-blue-600 bg-blue-50" },
  { value: "500+", label: "Assemblées Locales", icon: Church, color: "text-emerald-600 bg-emerald-50" },
  { value: "30+", label: "Régions & Districts", icon: Map, color: "text-indigo-600 bg-indigo-50" }
]

const groups = [
  {
    id: "chorale",
    name: "Chorale",
    description: "Coordination nationale des voix pour une louange harmonisée dans toutes nos régions.",
    icon: Music,
    color: "bg-blue-600 text-blue-600 border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50",
    glowColor: "from-blue-500/10 to-transparent",
    href: "/recensement/chorale"
  },
  {
    id: "fanfare",
    name: "Fanfare",
    description: "Structuration des instruments à vent pour magnifier nos célébrations et défilés nationaux.",
    icon: TrumpetIcon,
    color: "bg-emerald-600 text-emerald-600 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50",
    glowColor: "from-emerald-500/10 to-transparent",
    href: "/recensement/fanfare"
  },
  {
    id: "groupe-musical",
    name: "Groupe Musical / Chantres",
    description: "Identification des chantres et musiciens d'accompagnement pour un ministère de louange d'excellence.",
    icon: MicCableIcon,
    color: "bg-indigo-600 text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:shadow-indigo-100/50",
    glowColor: "from-indigo-500/10 to-transparent",
    href: "/recensement/groupe-musical"
  }
]

const steps = [
  {
    step: "01",
    title: "Sélection du Ministère",
    description: "Choisissez le groupe auquel vous êtes rattaché (Chorale, Fanfare ou Groupe Musical).",
    icon: Layers,
    color: "bg-blue-50 text-blue-600"
  },
  {
    step: "02",
    title: "Saisie des Informations",
    description: "Renseignez vos informations personnelles, votre assemblée locale et vos spécificités musicales.",
    icon: FileSignature,
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    step: "03",
    title: "Validation Nationale",
    description: "Vos données sont enregistrées de façon sécurisée et structurées dans le registre national.",
    icon: CheckCircle2,
    color: "bg-indigo-50 text-indigo-600"
  }
]

const testimonials = [
  {
    name: "Pasteur Emmanuel Konan",
    role: "Président National de la Musique EPF",
    content: "Ce recensement national est une étape historique. Grâce à cette plateforme, nous pouvons enfin identifier les talents et coordonner nos louanges sur toute l'étendue du territoire.",
    rating: 5,
    avatarText: "EK"
  },
  {
    name: "Sœur Grace Amenan",
    role: "Choriste, Cathédrale de la Foi",
    content: "L'inscription a été extrêmement simple. J'ai pu renseigner mon pupitre et mon expérience en moins de 3 minutes. Le design est magnifique, fluide et très agréable à utiliser.",
    rating: 5,
    avatarText: "GA"
  },
  {
    name: "Frère Marc Kouassi",
    role: "Chef de Fanfare Régional, Bouaké",
    content: "Un outil indispensable pour structurer notre fanfare. Il nous permet de savoir exactement qui joue de quel instrument et de planifier efficacement nos formations régionales.",
    rating: 5,
    avatarText: "MK"
  }
]

const faqs = [
  {
    question: "Pourquoi ce recensement est-il obligatoire ?",
    answer: "Le recensement permet au Bureau National d'avoir une cartographie précise des compétences, voix et instruments disponibles afin d'organiser des formations ciblées et de structurer l'œuvre musicale nationale de nos églises."
  },
  {
    question: "Qui doit s'inscrire sur cette plateforme ?",
    answer: "Tous les membres actifs, stagiaires et encadreurs des chorales, des fanfares et des groupes musicaux des Églises de Pentecôte de la Foi (EPF)."
  },
  {
    question: "Mes données personnelles sont-elles sécurisées ?",
    answer: "Oui, la sécurité est notre priorité. Toutes vos informations sont cryptées et stockées de manière confidentielle. Elles sont réservées à l'usage exclusif du secrétariat national de l'EPF."
  },
  {
    question: "Comment puis-je modifier mes informations après soumission ?",
    answer: "En cas d'erreur de saisie, vous pouvez contacter le responsable de votre groupe local ou régional. Les administrateurs système disposent des droits nécessaires pour corriger et mettre à jour vos fiches depuis le tableau de bord sécurisé."
  }
]

export default function RootPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [isSynthExpanded, setIsSynthExpanded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active")
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
      }
    )

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const playInteractiveNote = (type: "vocal" | "brass" | "synth" | "stat" | "pop") => {
    if (typeof window === "undefined") return
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const ctx = new AudioContextClass()
      const now = ctx.currentTime

      if (type === "vocal") {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(523.25, now) // C5
        gain.gain.setValueAtTime(0.06, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.65)
      } else if (type === "brass") {
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()
        osc1.type = "triangle"
        osc1.frequency.setValueAtTime(311.13, now) // Eb4
        osc2.type = "triangle"
        osc2.frequency.setValueAtTime(466.16, now) // Bb4
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)
        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 0.55)
        osc2.stop(now + 0.55)
      } else if (type === "synth") {
        const frequencies = [523.25, 659.25, 783.99, 1046.50]
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = "sine"
          osc.frequency.setValueAtTime(freq, now + idx * 0.08)
          gain.gain.setValueAtTime(0.04, now + idx * 0.08)
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + idx * 0.08)
          osc.stop(now + idx * 0.08 + 0.45)
        })
      } else if (type === "stat") {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(392.00, now)
        osc.frequency.setValueAtTime(784.00, now + 0.06)
        gain.gain.setValueAtTime(0.05, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.3)
      } else if (type === "pop") {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.setValueAtTime(880.00, now)
        osc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.05)
        gain.gain.setValueAtTime(0.04, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
      }
    } catch (e) {}
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
    playInteractiveNote("pop")
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 overflow-x-clip font-sans">
      
      {/* Background Decorative Textures & Glows */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="absolute inset-0 noise-overlay opacity-[0.015] pointer-events-none z-0" />
      
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-15%] w-[50%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />

      {/* Header/Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 bg-white flex items-center justify-center shadow-lg shadow-blue-600/10 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.jpg" alt="Logo EPF" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              EPF <span className="text-blue-600">Recensement</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Floating Icons for Visual Interest */}
        <div 
          onClick={() => playInteractiveNote("vocal")}
          className="hidden lg:block absolute top-[20%] left-[8%] animate-float text-blue-400 opacity-60 hover:opacity-100 hover:scale-125 hover:rotate-12 active:scale-95 transition-all duration-300 cursor-pointer p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-sm"
          title="Cliquez pour chanter 🎵"
        >
          <Mic className="w-8 h-8" />
        </div>
        <div 
          onClick={() => playInteractiveNote("brass")}
          className="hidden lg:block absolute top-[15%] right-[10%] animate-float-delayed text-indigo-400 opacity-60 hover:opacity-100 hover:scale-125 hover:-rotate-12 active:scale-95 transition-all duration-300 cursor-pointer p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100/50 shadow-sm"
          title="Cliquez pour souffler 🎺"
        >
          <TrumpetIcon className="w-8 h-8" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div 
            onClick={() => playInteractiveNote("synth")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 border border-blue-100/50 rounded-full text-blue-700 text-xs font-bold tracking-wider uppercase cursor-pointer hover:bg-blue-100/50 active:scale-95 transition-all animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recensement National Officiel 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Bâtissons ensemble <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              l'avenir de nos ministères.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            La plateforme officielle pour l'identification, la structuration et la valorisation des choristes, fanfaristes et musiciens des Églises de Pentecôte de la Foi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/recensement"
              className="px-8 py-4.5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/25 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>Démarrer mon recensement</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              onClick={() => playInteractiveNote("stat")}
              className={cn(
                "p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center gap-4 group cursor-pointer reveal-zoom",
                idx === 0 ? "reveal-stagger-1" : idx === 1 ? "reveal-stagger-2" : "reveal-stagger-3"
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Feature Cards */}
      <section className="relative z-10 py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3 reveal">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Choisissez votre département
            </h2>
            <p className="text-slate-500">
              Veuillez sélectionner le groupe musical auquel vous appartenez pour commencer à remplir votre fiche d'inscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {groups.map((group, idx) => (
              <Link 
                key={group.id} 
                href={group.href}
                onMouseEnter={() => {
                  if (group.id === "chorale") playInteractiveNote("vocal")
                  else if (group.id === "fanfare") playInteractiveNote("brass")
                  else playInteractiveNote("synth")
                }}
                className={cn(
                  "group relative bg-slate-50/50 p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full overflow-hidden reveal-zoom",
                  idx === 0 ? "reveal-stagger-1" : idx === 1 ? "reveal-stagger-2" : "reveal-stagger-3"
                )}
              >
                {/* Glow Effect */}
                <div className={cn("absolute -right-16 -top-16 w-36 h-36 bg-gradient-to-br rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500", group.glowColor)} />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <group.icon className={cn("w-8 h-8", group.color.split(" ")[1])} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{group.name}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                    {group.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-4 flex items-center text-blue-600 font-bold gap-2 text-sm">
                  <span>S'inscrire maintenant</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* "Comment ça marche" Section */}
      <section className="relative z-10 py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3 reveal">
            <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              Fonctionnement
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comment fonctionne le recensement ?
            </h2>
            <p className="text-slate-500">
              Une démarche simplifiée en 3 étapes pour répertorier tous nos ministres de louange.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-200 -translate-y-12 z-0" />

            {steps.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => playInteractiveNote("pop")}
                className={cn(
                  "relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 z-10 group cursor-pointer reveal-left",
                  idx === 0 ? "reveal-stagger-1" : idx === 1 ? "reveal-stagger-2" : "reveal-stagger-3"
                )}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 bg-slate-900 text-white rounded-[2.5rem] mx-4 md:mx-8 mb-20 overflow-hidden shadow-2xl reveal">
        <div className="absolute inset-0 bg-grid-line opacity-[0.1] pointer-events-none" />
        <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -right-32 -top-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Témoignages & Commentaires
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ce que disent nos responsables
            </h2>
            <p className="text-slate-400 text-sm">
              L'impact de la plateforme sur la coordination nationale de nos cultes et célébrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => playInteractiveNote("synth")}
                className={cn(
                  "bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:bg-white/[0.08] transition-all duration-300 cursor-pointer reveal-right",
                  idx === 0 ? "reveal-stagger-1" : idx === 1 ? "reveal-stagger-2" : "reveal-stagger-3"
                )}
              >
                <div className="space-y-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-inner">
                    {item.avatarText}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-slate-400 text-[11px] font-medium tracking-wide uppercase mt-0.5">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 max-w-4xl mx-auto px-6 mb-20 reveal">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Foire Aux Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Des questions ? Nous y répondons.
          </h2>
          <p className="text-slate-500 text-sm">
            Tout ce que vous devez savoir pour compléter votre fiche sereinement.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div 
                key={index}
                className={cn(
                  "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 reveal",
                  index === 0 ? "reveal-stagger-1" : index === 1 ? "reveal-stagger-2" : index === 2 ? "reveal-stagger-3" : "reveal-stagger-4"
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 font-bold text-slate-800 hover:text-blue-600 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-50 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 reveal-zoom">
        <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[2.5rem] shadow-xl p-8 md:p-14 text-center overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0 bg-grid-line opacity-[0.08]" />
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[100%] rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[100%] rounded-full bg-indigo-500/20 blur-[90px]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Prenez part à la structuration nationale
            </h2>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed opacity-90">
              Votre recensement aide à mieux organiser les ressources musicales et les formations de notre ministère à travers toutes les églises locales.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/recensement"
                className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold text-base hover:bg-blue-50 hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>Remplir ma fiche en ligne</span>
                <ArrowRight className="w-4.5 h-4.5 text-blue-900 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-800 bg-white flex items-center justify-center shrink-0">
                  <img src="/logo.jpg" alt="Logo EPF" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-lg">EPF Recensement</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                La plateforme officielle d'identification et de gestion des chantres, musiciens et choristes des Églises de Pentecôte de la Foi (EPF).
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Départements</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/recensement/chorale" className="hover:text-white transition-colors">Chorale</Link></li>
                <li><Link href="/recensement/fanfare" className="hover:text-white transition-colors">Fanfare</Link></li>
                <li><Link href="/recensement/groupe-musical" className="hover:text-white transition-colors">Groupe Musical</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Liens Utiles</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support & Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Églises de Pentecôte de la Foi (EPF). Tous droits réservés.</p>
            <p>Conçu pour l'édification et la gloire de Dieu.</p>
          </div>
        </div>
      </footer>

      {/* Floating Mini-Synth Widget (Surprise Easter Egg) */}
      <div className="fixed bottom-6 left-6 z-[999] pointer-events-auto">
        {!isSynthExpanded ? (
          <button
            onClick={() => {
              setIsSynthExpanded(true)
              playInteractiveNote("synth")
            }}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-600/30 transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
            title="Activer le Mini-Synthé 🎹"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-5 h-5 relative z-10 animate-pulse" />
          </button>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-2xl w-72 space-y-4 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Mic className="w-4 h-4 text-blue-600 animate-bounce" />
                <span className="font-bold text-xs uppercase tracking-wider">Mini Synthé EPF</span>
              </div>
              <button 
                onClick={() => {
                  setIsSynthExpanded(false)
                  playInteractiveNote("pop")
                }}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal">
              Cliquez sur les touches pour composer une louange ! 🎵
            </p>

            <div className="grid grid-cols-5 gap-1.5 pt-2">
              {[
                { note: "Do", freq: 523.25, color: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" },
                { note: "Ré", freq: 587.33, color: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" },
                { note: "Mi", freq: 659.25, color: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" },
                { note: "Sol", freq: 783.99, color: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/20" },
                { note: "La", freq: 880.00, color: "bg-violet-500 hover:bg-violet-600 shadow-violet-500/20" },
              ].map((key, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      try {
                        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
                        if (AudioContextClass) {
                          const ctx = new AudioContextClass()
                          const now = ctx.currentTime
                          const osc = ctx.createOscillator()
                          const gain = ctx.createGain()
                          osc.type = "sine"
                          osc.frequency.setValueAtTime(key.freq, now)
                          gain.gain.setValueAtTime(0.08, now)
                          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
                          osc.connect(gain)
                          gain.connect(ctx.destination)
                          osc.start(now)
                          osc.stop(now + 0.5)
                        }
                      } catch(e) {}
                    }
                  }}
                  className={cn(
                    "h-16 rounded-xl flex flex-col justify-end pb-2 items-center text-white text-[10px] font-bold shadow-md active:scale-95 transition-all hover:-translate-y-0.5 cursor-pointer",
                    key.color
                  )}
                >
                  {key.note}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
