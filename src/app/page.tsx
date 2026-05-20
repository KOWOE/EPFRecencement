"use client"

import Link from "next/link"
import { useState } from "react"
import { 
  Church, 
  ArrowRight, 
  Music, 
  Wind, 
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
  FileSignature
} from "lucide-react"

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
    icon: Wind,
    color: "bg-emerald-600 text-emerald-600 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50",
    glowColor: "from-emerald-500/10 to-transparent",
    href: "/recensement/fanfare"
  },
  {
    id: "groupe-musical",
    name: "Groupe Musical / Chantres",
    description: "Identification des chantres et musiciens d'accompagnement pour un ministère de louange d'excellence.",
    icon: Church,
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="relative min-h-screen bg-slate-50/50 overflow-x-hidden font-sans">
      
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
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
              <Church className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              EPF <span className="text-blue-600">Recensement</span>
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-500/20 hover:bg-blue-50/20 hover:shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Accès Administration</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Floating Icons for Visual Interest */}
        <div className="hidden lg:block absolute top-[20%] left-[8%] animate-float text-blue-400 opacity-60">
          <Music className="w-10 h-10" />
        </div>
        <div className="hidden lg:block absolute top-[15%] right-[10%] animate-float-delayed text-indigo-400 opacity-60">
          <Wind className="w-10 h-10" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50/80 border border-blue-100/50 rounded-full text-blue-700 text-xs font-bold tracking-wider uppercase animate-pulse">
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
        <div className="max-w-5xl mx-auto mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up delay-150">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color} group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Feature Cards */}
      <section className="relative z-10 py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Choisissez votre département
            </h2>
            <p className="text-slate-500">
              Veuillez sélectionner le groupe musical auquel vous appartenez pour commencer à remplir votre fiche d'inscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {groups.map((group) => (
              <Link 
                key={group.id} 
                href={group.href}
                className="group relative bg-slate-50/50 p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left flex flex-col h-full overflow-hidden"
              >
                {/* Glow Effect */}
                <div className={`absolute -right-16 -top-16 w-36 h-36 bg-gradient-to-br ${group.glowColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <group.icon className={`w-8 h-8 ${group.color.split(" ")[1]}`} />
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
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
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
                className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 z-10 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${item.color} group-hover:scale-105 transition-transform duration-300`}>
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
      <section className="relative z-10 py-20 bg-slate-900 text-white rounded-[2.5rem] mx-4 md:mx-8 mb-20 overflow-hidden shadow-2xl">
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
                className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:bg-white/[0.08] transition-all duration-300"
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
      <section className="relative z-10 py-16 max-w-4xl mx-auto px-6 mb-20">
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
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300"
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
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-24 animate-fade-in-up">
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
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Church className="w-4.5 h-4.5" />
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
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Administration</Link></li>
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

    </div>
  )
}
