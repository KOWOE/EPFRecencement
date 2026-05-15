"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
}

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2",
        pending && "opacity-80 cursor-not-allowed",
        className
      )}
    >
      {pending && <Loader2 className="w-5 h-5 animate-spin" />}
      {pending ? "Enregistrement en cours..." : children}
    </button>
  )
}
