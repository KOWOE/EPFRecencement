import { MemberTable } from "@/components/admin/member-table"

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

export default function JeunessePage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4 animate-fade-in-up delay-75">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
          <FlameIcon className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Jeunesse</h1>
          <p className="text-slate-500">Gérez les membres inscrits au registre de la jeunesse</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-150">
        <MemberTable defaultGroup="JEUNESSE" />
      </div>
    </div>
  )
}
