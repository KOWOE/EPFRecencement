"use client"

import { FileUp, FileDown, UploadCloud, DownloadCloud, AlertCircle, FileSpreadsheet, Loader2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CustomSelect } from "@/components/ui/custom-select"

export default function ImportsExportsPage() {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<"import" | "export">("export")
  const [selectedExportGroup, setSelectedExportGroup] = useState("")
  const [selectedExportFormat, setSelectedExportFormat] = useState("xlsx")

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault()
    setIsImporting(true)
    setTimeout(() => setIsImporting(false), 2000)
  }

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => setIsExporting(false), 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Imports & Exports</h1>
          <p className="text-slate-500">Gérez vos données via des fichiers Excel ou CSV</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab("export")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === "export" 
                ? "border-blue-600 text-blue-600 bg-blue-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <FileDown className="w-5 h-5" />
            Exporter des Données
          </button>
          <button 
            onClick={() => setActiveTab("import")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === "import" 
                ? "border-emerald-600 text-emerald-600 bg-emerald-50/50" 
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <FileUp className="w-5 h-5" />
            Importer des Données
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === "export" && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <DownloadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Télécharger la base de données</h3>
                <p className="text-slate-500 text-sm">
                  Générez un fichier Excel contenant toutes les informations des membres. Vous pouvez filtrer les données exportées si besoin.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative z-20">
                  <label className="text-xs font-bold text-slate-500 uppercase">Groupe ciblé</label>
                  <CustomSelect 
                    value={selectedExportGroup}
                    onChange={setSelectedExportGroup}
                    placeholder="Tous les membres"
                    colorTheme="slate"
                    options={[
                      { value: "", label: "Tous les membres" },
                      { value: "CHORALE", label: "Chorale" },
                      { value: "FANFARE", label: "Fanfare" },
                      { value: "GROUPE_MUSICAL", label: "Groupe Musical" }
                    ]}
                  />
                </div>
                <div className="space-y-1.5 relative z-10">
                  <label className="text-xs font-bold text-slate-500 uppercase">Format</label>
                  <CustomSelect 
                    value={selectedExportFormat}
                    onChange={setSelectedExportFormat}
                    placeholder="Excel (.xlsx)"
                    colorTheme="slate"
                    options={[
                      { value: "xlsx", label: "Excel (.xlsx)" },
                      { value: "csv", label: "CSV (.csv)" }
                    ]}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/20 disabled:opacity-50"
                >
                  {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                  {isExporting ? "Génération du fichier..." : "Lancer l'exportation"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "import" && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <UploadCloud className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mettre à jour via un fichier</h3>
                <p className="text-slate-500 text-sm">
                  Importez une liste de membres depuis un fichier Excel ou CSV pour mettre à jour la base de données rapidement.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Assurez-vous que votre fichier respecte le format d'importation. Les colonnes obligatoires sont: nom&prenom, numero, email, groupe, region, sous-region.</p>
              </div>

              <form onSubmit={handleImport} className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 hover:border-emerald-500 transition-all cursor-pointer group">
                  <input type="file" accept=".xlsx,.csv" className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <FileUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Cliquez pour sélectionner un fichier</p>
                      <p className="text-xs text-slate-500 mt-1">ou glissez-déposez le ici (Excel ou CSV)</p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={isImporting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                    {isImporting ? "Importation en cours..." : "Lancer l'importation"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
