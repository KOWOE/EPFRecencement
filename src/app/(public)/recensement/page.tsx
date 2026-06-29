import Link from "next/link"
import React from "react"
import { Music, ArrowRight, Search } from "lucide-react"

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

const groups = [
  {
    id: "chorale",
    name: "Chorale",
    description: "Recensement pour tous les membres des chorales locales et régionales.",
    icon: Music,
    color: "bg-blue-600",
    href: "/recensement/chorale"
  },
  {
    id: "fanfare",
    name: "Fanfare",
    description: "Identification des musiciens jouant des instruments à vent et percussions.",
    icon: TrumpetIcon,
    color: "bg-emerald-600",
    href: "/recensement/fanfare"
  },
  {
    id: "groupe-musical",
    name: "Groupe Musical / Chantres",
    description: "Pour les musiciens d'accompagnement et les chantres de l'église.",
    icon: MicCableIcon,
    color: "bg-indigo-600",
    href: "/recensement/groupe-musical"
  },
  {
    id: "jeunesse",
    name: "Jeunesse",
    description: "Recensement pour tous les jeunes membres et responsables de la jeunesse.",
    icon: FlameIcon,
    color: "bg-amber-500",
    href: "/recensement/jeunesse"
  }
]

export default function RecensementSelectionPage() {
  return (
    <div className="space-y-12 text-center animate-fade-in-up">
      <div className="space-y-4 animate-fade-in-up delay-75">
        <h2 className="text-4xl font-extrabold text-slate-900">Recensement des Membres Actifs</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Bienvenue sur la plateforme officielle de recensement. Veuillez sélectionner votre groupe d'appartenance pour remplir votre fiche.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-150">
        {groups.map((group, idx) => (
          <Link 
            key={group.id} 
            href={group.href}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full animate-fade-in-up"
            style={{ animationDelay: `${225 + idx * 75}ms` }}
          >
            <div className={`${group.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
              <group.icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{group.name}</h3>
            <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
              {group.description}
            </p>
            <div className="flex items-center text-blue-600 font-bold gap-2">
              Remplir la fiche <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 animate-fade-in-up delay-300">
        <Link 
          href="/recensement/verification"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <Search className="w-5 h-5" />
          Déjà inscrit ? Vérifier mon recensement
        </Link>
      </div>

      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-16 max-w-2xl mx-auto animate-fade-in-up delay-500">
        <p className="text-blue-800 text-sm italic">
          "Que tout se fasse avec décence et avec ordre." - 1 Corinthiens 14:40
        </p>
      </div>
    </div>
  )
}
