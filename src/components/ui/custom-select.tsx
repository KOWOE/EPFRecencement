"use client"

import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Option {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  searchable?: boolean
  className?: string
  colorTheme?: "blue" | "emerald" | "indigo" | "slate"
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Sélectionner...",
  searchable = false,
  className,
  colorTheme = "blue"
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const filteredOptions = options.filter((opt) => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const themeConfig = {
    blue: {
      ring: "focus:ring-blue-500",
      borderOpen: "border-blue-500",
      bgSelected: "bg-blue-50/80",
      textSelected: "text-blue-700",
      check: "text-blue-600"
    },
    emerald: {
      ring: "focus:ring-emerald-500",
      borderOpen: "border-emerald-500",
      bgSelected: "bg-emerald-50/80",
      textSelected: "text-emerald-700",
      check: "text-emerald-600"
    },
    indigo: {
      ring: "focus:ring-indigo-500",
      borderOpen: "border-indigo-500",
      bgSelected: "bg-indigo-50/80",
      textSelected: "text-indigo-700",
      check: "text-indigo-600"
    },
    slate: {
      ring: "focus:ring-slate-500",
      borderOpen: "border-slate-500",
      bgSelected: "bg-slate-100",
      textSelected: "text-slate-900",
      check: "text-slate-700"
    }
  }

  const theme = themeConfig[colorTheme]

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-left transition-all outline-none",
          isOpen ? `ring-2 ring-opacity-20 ${theme.ring} ${theme.borderOpen}` : "border-slate-200 hover:border-slate-300"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="font-medium text-slate-900 truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className={cn("w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1", theme.ring)}
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                      setSearchTerm("")
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors",
                      isSelected ? theme.bgSelected : "hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {opt.icon && <span className="text-xl leading-none">{opt.icon}</span>}
                      <div>
                        <div className={cn("font-medium text-sm", isSelected ? theme.textSelected : "text-slate-700")}>
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className={cn("text-[11px] mt-0.5", isSelected ? theme.textSelected.replace("700", "500").replace("900", "500") : "text-slate-500")}>
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className={cn("w-4 h-4 shrink-0", theme.check)} />}
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 text-sm text-center text-slate-500">Aucun résultat</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
