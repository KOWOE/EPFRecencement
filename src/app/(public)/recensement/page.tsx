import Link from "next/link"
import React from "react"
import { ArrowRight, Search, Drum } from "lucide-react"

function CleDeSolIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15.5 10.5A3.5 3.5 0 1 0 12 14v6.5a2.5 2.5 0 0 1-5 0c0-1.6 1.5-2.5 3-2.5h2" />
      <path d="M12 14V3.5a1.5 1.5 0 0 1 3 0c0 2-3.5 3-3.5 7" />
      <path d="M12 21.5V14" />
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
      <path d="M3 12h10" />
      <path d="M13 12c0-3 3-4 6-4 1.5 0 3 1.5 3 4s-1.5 4-3 4c-3 0-6-1-6-4" />
      <path d="M11 12v4a2 2 0 0 1-4 0v-4" />
      <path d="M7 12V8" />
      <path d="M9 12V8" />
      <path d="M11 12V8" />
      <path d="M1.5 10v4" />
      <path d="M1.5 12H3" />
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
    icon: CleDeSolIcon,
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
    name: "Groupe Musical",
    description: "Pour les musiciens d'accompagnement et les chantres de l'église.",
    icon: Drum,
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
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full animate-fade-in-up"
            style={{ animationDelay: `${225 + idx * 75}ms` }}
          >
            <div className={`${group.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shrink-0`}>
              <group.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{group.name}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              {group.description}
            </p>
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 text-blue-600 font-semibold text-sm">
              <span>Remplir la fiche</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
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
