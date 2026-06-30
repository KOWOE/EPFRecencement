import { AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  confirmText?: string
  confirmLoadingText?: string
  confirmButtonClassName?: string
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  description, 
  onConfirm, 
  onCancel, 
  isLoading = false,
  confirmText = "Supprimer",
  confirmLoadingText = "Suppression...",
  confirmButtonClassName = "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20 text-white"
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden">
        {/* Soft top border glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600" />
        
        <button 
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-5 pt-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-inner relative">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping opacity-75"></div>
            <AlertTriangle className="w-8 h-8 relative z-10" />
          </div>
          
          <div className="space-y-2 px-2">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>

          <div className="flex w-full gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-slate-100"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-1 px-4 py-2.5 font-medium rounded-xl transition-all disabled:opacity-50 shadow-sm focus:ring-2 focus:ring-rose-200",
                confirmButtonClassName
              )}
            >
              {isLoading ? confirmLoadingText : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

