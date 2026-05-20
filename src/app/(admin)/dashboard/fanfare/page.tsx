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
      {/* Tilted main leadpipe */}
      <line x1="4" y1="20" x2="16" y2="8" />
      {/* Mouthpiece */}
      <path d="M3 21l1.5-1.5M2 22a1 1 0 0 0 1.4-1.4" />
      {/* Tubing loop at the bottom */}
      <path d="M7 17c-1.5-1.5-1.5-3 0-4.5s3-1.5 4.5 0" />
      {/* Perpendicular parallel valves */}
      <line x1="10" y1="12" x2="8" y2="10" />
      <circle cx="7.5" cy="9.5" r="0.75" fill="currentColor" />
      
      <line x1="11.5" y1="10.5" x2="9.5" y2="8.5" />
      <circle cx="9" cy="8" r="0.75" fill="currentColor" />
      
      <line x1="13" y1="9" x2="11" y2="7" />
      <circle cx="10.5" cy="6.5" r="0.75" fill="currentColor" />
      
      {/* Bell shape at top right */}
      <path d="M14 10c2.5-3.5 5.5-6.5 8-7" />
      <path d="M16 12c3.5-2.5 6.5-5.5 7-8" />
      <path d="M22 3c1 1-6 7-7 8" />
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
