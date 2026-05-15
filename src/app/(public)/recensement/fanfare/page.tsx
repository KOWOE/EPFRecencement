"use client"

import { createMember } from "@/lib/actions/member"
import { getRegions, getSousRegions } from "@/lib/actions/parametres"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { X, Check, ChevronRight, ArrowRight, Wind, MapPin, Mic } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomSelect } from "@/components/ui/custom-select"

const steps = [
  { id: 1, name: "Identité" },
  { id: 2, name: "Profil Musical" },
  { id: 3, name: "Attentes" }
]

const partitions = [
  { value: "soprano", label: "Soprano", description: "Voix aiguë", icon: <Mic className="w-4 h-4" /> },
  { value: "alto", label: "Alto", description: "Voix grave femme / enfant", icon: <Mic className="w-4 h-4" /> },
  { value: "tenor", label: "Ténor", description: "Voix aiguë homme", icon: <Mic className="w-4 h-4" /> },
  { value: "basse", label: "Basse", description: "Voix grave homme", icon: <Mic className="w-4 h-4" /> }
]

const booleanOptions = [
  { value: "oui", label: "Oui", description: "Je maîtrise" },
  { value: "non", label: "Non", description: "En apprentissage" }
]

export default function FanfareFormPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    profession: "",
    assemblee: "",
    region: "",
    sous_region: "",
    partition: "",
    instrument: "",
    lecture_solfege: "",
    lecture_notes: "",
    attentes_bureau: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [regionsList, setRegionsList] = useState<{value: string, label: string}[]>([])
  const [sousRegionsList, setSousRegionsList] = useState<{value: string, label: string}[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [reg, sousReg] = await Promise.all([getRegions(), getSousRegions()])
      if (reg.success && reg.data) setRegionsList(reg.data.map(r => ({ value: r.name, label: r.name })))
      if (sousReg.success && sousReg.data) setSousRegionsList(sousReg.data.map(r => ({ value: r.name, label: r.name })))
    }
    loadData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectOption = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    const data = new FormData()
    data.append("group_type", "FANFARE")
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })

    const result = await createMember(data)
    
    if (result.success) {
      router.push("/recensement/succes")
    } else {
      setError(result.error || "Une erreur est survenue")
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.nom && formData.prenom && formData.telephone && formData.assemblee && formData.region && formData.sous_region
    }
    if (currentStep === 2) {
      return formData.partition && formData.instrument
    }
    return true
  }

  const OptionBlock = ({ name, value, label, description }: { name: string, value: string, label: string, description?: string }) => {
    const isSelected = formData[name as keyof typeof formData] === value
    return (
      <div 
        onClick={() => handleSelectOption(name, value)}
        className={cn(
          "cursor-pointer border rounded-2xl p-4 transition-all duration-200 ease-out group hover:-translate-y-0.5",
          isSelected 
            ? "border-emerald-600 bg-emerald-50/50 shadow-sm" 
            : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className={cn(
              "font-medium",
              isSelected ? "text-emerald-900" : "text-slate-700 group-hover:text-slate-900"
            )}>
              {label}
            </span>
            {description && (
              <p className={cn(
                "text-sm mt-1",
                isSelected ? "text-emerald-700/80" : "text-slate-500"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
            isSelected ? "border-emerald-600 bg-emerald-600" : "border-slate-300"
          )}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-400/20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => router.push("/")}
          className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {step.id < currentStep ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : step.id === currentStep ? (
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  step.id === currentStep ? "text-slate-900" : 
                  step.id < currentStep ? "text-slate-900" : "text-slate-400"
                )}>
                  {step.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 mx-1" />
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={!isStepValid() || isSubmitting}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 text-slate-600 font-medium text-sm disabled:opacity-50 hover:bg-slate-200 transition-colors"
        >
          {currentStep === steps.length ? "Terminer" : "Suivant"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto pb-24">
        
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[12vw] font-bold text-slate-900/[0.02] whitespace-nowrap pointer-events-none select-none">
          Fanfare EPF
        </div>

        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-white/50 p-8 md:p-12 relative">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Identité & Localisation</h2>
                <p className="text-slate-500">Vos informations pour le registre national de la Fanfare.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Nom *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Votre nom" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Votre prénom" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Téléphone *</label>
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="0700000000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="email@exemple.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Assemblée *</label>
                  <input type="text" name="assemblee" value={formData.assemblee} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ex: Bouaké" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Profession</label>
                  <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ex: Mécanicien" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Région *</label>
                  <CustomSelect 
                    value={formData.region} 
                    onChange={(val) => handleSelectOption("region", val)} 
                    options={regionsList.map(r => ({ ...r, icon: <MapPin className="w-4 h-4 text-slate-400" /> }))}
                    searchable 
                    placeholder="Sélectionner une région" 
                    colorTheme="emerald" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Sous-région *</label>
                  <CustomSelect 
                    value={formData.sous_region} 
                    onChange={(val) => handleSelectOption("sous_region", val)} 
                    options={sousRegionsList.map(r => ({ ...r, icon: <MapPin className="w-4 h-4 text-slate-400" /> }))}
                    searchable 
                    placeholder="Sélectionner une sous-région" 
                    colorTheme="emerald" 
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Profil Musical (Fanfare)</h2>
                <p className="text-slate-500">Quel est votre rôle dans la fanfare ?</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Votre Partition *</label>
                <div className="max-w-md">
                  <CustomSelect 
                    value={formData.partition} 
                    onChange={(val) => handleSelectOption("partition", val)} 
                    options={partitions}
                    placeholder="Sélectionner une partition" 
                    colorTheme="emerald" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Instrument *</label>
                <input type="text" name="instrument" value={formData.instrument} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Ex: Trompette, Saxophone" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Lecture Solfège</label>
                  <div className="grid grid-cols-2 gap-3">
                    {booleanOptions.map((opt) => (
                      <OptionBlock key={opt.value} name="lecture_solfege" value={opt.value} label={opt.label} />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Lecture de Notes</label>
                  <div className="grid grid-cols-2 gap-3">
                    {booleanOptions.map((opt) => (
                      <OptionBlock key={opt.value} name="lecture_notes" value={opt.value} label={opt.label} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Attentes</h2>
                <p className="text-slate-500">Vos suggestions pour faire grandir l'œuvre.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Attentes envers le Bureau National de la Fanfare</label>
                <textarea name="attentes_bureau" value={formData.attentes_bureau} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 resize-none" placeholder="Vos suggestions ou attentes pour l'évolution de la fanfare..." />
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((step) => (
                <div 
                  key={step.id} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    step.id === currentStep ? "w-6 bg-emerald-600" : 
                    step.id < currentStep ? "bg-emerald-300" : "bg-slate-200"
                  )} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrev}
                  className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Retour
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className={cn(
                  "px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 flex items-center gap-2",
                  (!isStepValid() || isSubmitting) ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : currentStep === steps.length ? (
                  "Soumettre"
                ) : (
                  <>Suivant <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
