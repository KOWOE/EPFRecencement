import { MemberTable } from "@/components/admin/member-table"

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

export default function FanfarePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 animate-fade-in-up delay-75">
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <TrumpetIcon className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fanfare Nationale</h1>
          <p className="text-slate-500">Gérez les membres inscrits au registre de la fanfare</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-150">
        <MemberTable defaultGroup="FANFARE" />
      </div>
    </div>
  )
}
