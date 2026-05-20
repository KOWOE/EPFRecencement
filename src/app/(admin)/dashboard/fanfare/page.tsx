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
      <path d="M18 8c1.5 0 3 .5 3 2.5v3c0 2-1.5 2.5-3 2.5" />
      <path d="M21 9v6" />
      <path d="M3 13h15" />
      <path d="M3 11h11c1 0 2 .5 2 1.5s-1 1.5-2 1.5H8" />
      <path d="M9 11V7" />
      <circle cx="9" cy="6" r="1" />
      <path d="M12 11V7" />
      <circle cx="12" cy="6" r="1" />
      <path d="M15 11V7" />
      <circle cx="15" cy="6" r="1" />
      <path d="M2 10.5v3" />
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
