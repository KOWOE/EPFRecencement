"use client"

import { FileUp, FileDown, UploadCloud, DownloadCloud, AlertCircle, FileSpreadsheet, Loader2, CheckCircle2, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { CustomSelect } from "@/components/ui/custom-select"
import * as XLSX from "xlsx"
import { importMembers, exportMembers, getUniqueAssemblies } from "@/lib/actions/member"
import { getRegions, getSousRegions } from "@/lib/actions/parametres"

export default function ImportsExportsPage() {
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<"import" | "export">("export")
  const [selectedExportGroup, setSelectedExportGroup] = useState("")
  const [selectedExportRegion, setSelectedExportRegion] = useState("")
  const [selectedExportSousRegion, setSelectedExportSousRegion] = useState("")
  const [selectedExportAssemblee, setSelectedExportAssemblee] = useState("")
  const [selectedExportFormat, setSelectedExportFormat] = useState("xlsx")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)

  const [regionsList, setRegionsList] = useState<{ value: string, label: string }[]>([
    { value: "", label: "Toutes les régions" }
  ])
  const [sousRegionsList, setSousRegionsList] = useState<{ value: string, label: string }[]>([
    { value: "", label: "Toutes les sous-régions" }
  ])
  const [assembleesList, setAssembleesList] = useState<{ value: string, label: string }[]>([
    { value: "", label: "Toutes les assemblées" }
  ])

  useEffect(() => {
    async function loadFiltersData() {
      const regRes = await getRegions()
      if (regRes.success && regRes.data) {
        setRegionsList([
          { value: "", label: "Toutes les régions" },
          ...regRes.data.map(r => ({ value: r.name, label: r.name }))
        ])
      }
      
      const subRes = await getSousRegions()
      if (subRes.success && subRes.data) {
        setSousRegionsList([
          { value: "", label: "Toutes les sous-régions" },
          ...subRes.data.map(sr => ({ value: sr.name, label: sr.name }))
        ])
      }

      const assRes = await getUniqueAssemblies()
      if (assRes.success && assRes.data) {
        setAssembleesList([
          { value: "", label: "Toutes les assemblées" },
          ...assRes.data.map(a => ({ value: a, label: a }))
        ])
      }
    }

    loadFiltersData()
  }, [])

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setIsImporting(true)
    setImportSuccess(null)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const dataBuffer = evt.target?.result
        if (!dataBuffer) {
          throw new Error("Impossible de lire le fichier.")
        }
        
        const workbook = XLSX.read(dataBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        
        const result = await importMembers(data)
        
        if (result.success) {
          setImportSuccess(`L'importation de ${result.count} membre(s) depuis le fichier "${selectedFile.name}" a été effectuée avec succès !`)
          setSelectedFile(null)
        } else {
          alert(result.error || "Erreur lors de l'importation.")
        }
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier :", error)
        alert("Erreur lors de la lecture du fichier. Assurez-vous qu'il s'agit d'un fichier Excel ou CSV valide.")
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsArrayBuffer(selectedFile)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const res = await exportMembers(
        {
          groupType: selectedExportGroup || undefined,
          region: selectedExportRegion || undefined,
          sousRegion: selectedExportSousRegion || undefined,
          assemblee: selectedExportAssemblee || undefined,
        },
        selectedExportFormat
      )
      
      if (!res.success || !res.data) {
        alert(res.error || "Erreur lors de la génération de l'exportation.")
        return
      }

      if (selectedExportFormat === "pdf") {
        const parsedData = JSON.parse(res.data)
        
        // Dynamically import jsPDF and autoTable
        const { default: jsPDF } = await import("jspdf")
        const { default: autoTable } = await import("jspdf-autotable")
        
        const doc = new jsPDF({ orientation: "landscape" })
        
        // Header
        doc.setFontSize(18)
        doc.setTextColor(15, 23, 42) // Slate 900
        doc.text("EPF Recensement - Liste des Membres", 14, 15)
        
        doc.setFontSize(10)
        doc.setTextColor(100, 116, 139) // Slate 500
        doc.text(`Généré le : ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}`, 14, 22)
        
        // Generate Table
        autoTable(doc, {
          startY: 28,
          head: [['Nom & Prénom', 'Numéro', 'Email', 'Groupe', 'Région', 'Sous-région', 'Assemblée']],
          body: parsedData.map((m: any) => [
            m["nom&prenom"],
            m["numero"],
            m["email"],
            m["groupe"],
            m["region"],
            m["sous-region"],
            m["assemblee"]
          ]),
          theme: "striped",
          headStyles: { fillColor: [37, 99, 235] }, // Blue 600
          styles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 25 },
            2: { cellWidth: 40 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 },
            6: { cellWidth: 35 }
          }
        })
        
        doc.save(res.filename || `export.pdf`)
      } else {
        // Dynamic download via Blob
        const byteCharacters = atob(res.data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: res.mimeType })

        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = res.filename || `export.${selectedExportFormat}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation :", error)
      alert("Une erreur est survenue lors de l'exportation des données.")
    } finally {
      setIsExporting(false)
    }
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
                <div className="space-y-1.5 relative z-50">
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
                <div className="space-y-1.5 relative z-40">
                  <label className="text-xs font-bold text-slate-500 uppercase">Région</label>
                  <CustomSelect 
                    value={selectedExportRegion}
                    onChange={setSelectedExportRegion}
                    placeholder="Toutes les régions"
                    colorTheme="slate"
                    options={regionsList}
                  />
                </div>
                <div className="space-y-1.5 relative z-30">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sous-région</label>
                  <CustomSelect 
                    value={selectedExportSousRegion}
                    onChange={setSelectedExportSousRegion}
                    placeholder="Toutes les sous-régions"
                    colorTheme="slate"
                    options={sousRegionsList}
                  />
                </div>
                <div className="space-y-1.5 relative z-20">
                  <label className="text-xs font-bold text-slate-500 uppercase">Assemblée</label>
                  <CustomSelect 
                    value={selectedExportAssemblee}
                    onChange={setSelectedExportAssemblee}
                    placeholder="Toutes les assemblées"
                    colorTheme="slate"
                    options={assembleesList}
                  />
                </div>
                <div className="col-span-2 space-y-1.5 relative z-10">
                  <label className="text-xs font-bold text-slate-500 uppercase">Format</label>
                  <CustomSelect 
                    value={selectedExportFormat}
                    onChange={setSelectedExportFormat}
                    placeholder="Excel (.xlsx)"
                    colorTheme="slate"
                    options={[
                      { value: "xlsx", label: "Excel (.xlsx)" },
                      { value: "csv", label: "CSV (.csv)" },
                      { value: "pdf", label: "Document PDF (.pdf)" }
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

              {importSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-emerald-800 text-sm items-center animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-semibold">{importSuccess}</p>
                  </div>
                  <button onClick={() => setImportSuccess(null)} className="text-emerald-600 hover:text-emerald-800 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleImport} className="space-y-6">
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragOver(false)
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0]
                      if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) {
                        setSelectedFile(file)
                        setImportSuccess(null)
                      }
                    }
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group",
                    isDragOver 
                      ? "border-emerald-500 bg-emerald-50/20" 
                      : selectedFile 
                        ? "border-emerald-300 bg-slate-50/50" 
                        : "border-slate-200 hover:bg-slate-50 hover:border-emerald-500"
                  )}
                >
                  <input 
                    type="file" 
                    accept=".xlsx,.csv" 
                    className="hidden" 
                    id="file-upload" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0])
                        setImportSuccess(null)
                      }
                    }}
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                        <FileSpreadsheet className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedFile(null)
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-bold transition-all"
                      >
                        <X className="w-3.5 h-3.5" /> Retirer le fichier
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">Cliquez pour sélectionner un fichier</p>
                        <p className="text-xs text-slate-500 mt-1">ou glissez-déposez le ici (Excel ou CSV)</p>
                      </div>
                    </label>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={isImporting || !selectedFile}
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
