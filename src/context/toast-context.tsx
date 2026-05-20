"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface DialogConfig {
  isOpen: boolean
  title: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  showAlertDialog: (title: string, message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [dialog, setDialog] = useState<DialogConfig>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  })

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const showAlertDialog = (title: string, message: string, type: ToastType = "info") => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
    })
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, showAlertDialog }}>
      {children}
      
      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>

      {/* Custom Dialog Box (Alert Modal) */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border",
                dialog.type === "success" ? "bg-green-50 border-green-100 text-green-600" :
                dialog.type === "error" ? "bg-rose-50 border-rose-100 text-rose-600" :
                dialog.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-600" :
                "bg-blue-50 border-blue-100 text-blue-600"
              )}>
                {dialog.type === "success" ? <CheckCircle className="w-6 h-6" /> :
                 dialog.type === "error" ? <AlertCircle className="w-6 h-6" /> :
                 dialog.type === "warning" ? <AlertCircle className="w-6 h-6" /> :
                 <Info className="w-6 h-6" />}
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">{dialog.title}</h3>
                <p className="text-sm text-slate-500">{dialog.message}</p>
              </div>

              <div className="w-full pt-4 border-t border-slate-50">
                <button
                  onClick={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                    dialog.type === "success" ? "bg-green-600 hover:bg-green-700 shadow-green-600/20" :
                    dialog.type === "error" ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" :
                    dialog.type === "warning" ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" :
                    "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                  )}
                >
                  D'accord
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-slate-100 pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-300",
      "w-full"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
        toast.type === "success" ? "bg-green-50 border-green-100 text-green-600" :
        toast.type === "error" ? "bg-rose-50 border-rose-100 text-rose-600" :
        toast.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-600" :
        "bg-blue-50 border-blue-100 text-blue-600"
      )}>
        {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> :
         toast.type === "error" ? <AlertCircle className="w-4 h-4" /> :
         toast.type === "warning" ? <AlertCircle className="w-4 h-4" /> :
         <Info className="w-4 h-4" />}
      </div>
      
      <p className="text-sm font-semibold text-slate-800 flex-1">{toast.message}</p>
      
      <button onClick={onClose} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
