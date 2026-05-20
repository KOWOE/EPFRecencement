import { MemberTable } from "@/components/admin/member-table"

function MicCableIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="9" y1="15" x2="15" y2="9" />
      <path d="M10 16.5L6.5 20c-.8.8-2 .8-2.8 0s-.8-2 0-2.8l3.5-3.5" />
      <path d="M13 11l3-3a3 3 0 0 1 4.2 4.2l-3 3" />
      <path d="M14.5 9.5l2.5 2.5" />
      <path d="M5.5 19.5c-1 1.5-2 2-3 1s-.5-2.5.8-3.7c1.8-1.8 3.5-1.8 5.3-.5 1.8 1.3 3.5 1.3 5.3 0c1.2-1 2.2-.8 3 .5" />
    </svg>
  )
}

export default function GroupeMusicalPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 animate-fade-in-up delay-75">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <MicCableIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Groupe Musical</h1>
          <p className="text-slate-500">Gérez les membres inscrits au registre du groupe musical</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-150">
        <MemberTable defaultGroup="GROUPE_MUSICAL" />
      </div>
    </div>
  )
}
