import { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormInput({ label, error, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
      <input
        className={cn(
          "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all",
          error && "border-rose-500 focus:ring-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  )
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { label: string; value: string }[]
  error?: string
}

export function FormSelect({ label, options, error, className, ...props }: FormSelectProps) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-semibold text-slate-700 ml-1">
        {label}
      </label>
      <select
        className={cn(
          "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer",
          error && "border-rose-500 focus:ring-rose-500",
          className
        )}
        {...props as any}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  )
}
