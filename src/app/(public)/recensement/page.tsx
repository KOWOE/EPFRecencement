import Link from "next/link"
import { Music, Wind, Church, ArrowRight } from "lucide-react"

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
    icon: Wind,
    color: "bg-emerald-600",
    href: "/recensement/fanfare"
  },
  {
    id: "groupe-musical",
    name: "Groupe Musical / Chantres",
    description: "Pour les musiciens d'accompagnement et les chantres de l'église.",
    icon: Church,
    color: "bg-indigo-600",
    href: "/recensement/groupe-musical"
  }
]

export default function RecensementSelectionPage() {
  return (
    <div className="space-y-12 text-center">
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900">Recensement des Membres Actifs</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Bienvenue sur la plateforme officielle de recensement. Veuillez sélectionner votre groupe d'appartenance pour remplir votre fiche.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groups.map((group) => (
          <Link 
            key={group.id} 
            href={group.href}
            className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full"
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

      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-16 max-w-2xl mx-auto">
        <p className="text-blue-800 text-sm italic">
          "Que tout se fasse avec décence et avec ordre." - 1 Corinthiens 14:40
        </p>
      </div>
    </div>
  )
}
