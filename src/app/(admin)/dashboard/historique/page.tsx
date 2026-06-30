"use client"

// Importation des icônes depuis la bibliothèque lucide-react pour l'interface utilisateur
import { History, User, Search, Loader2 } from "lucide-react"
// Importation des hooks React nécessaires pour la gestion de l'état et des effets de bord
import { useState, useEffect } from "react"
// Importation de l'action serveur permettant de récupérer l'historique des activités depuis la base de données
import { getActivityLogs } from "@/lib/actions/parametres"
// Importation du contexte personnalisé pour afficher des notifications (toasts) à l'écran
import { useToast } from "@/context/toast-context"
// Importation de la fonction utilitaire pour fusionner dynamiquement des classes CSS (Tailwind)
import { cn } from "@/lib/utils"

// Définition du type TypeScript représentant la structure d'une entrée de l'historique (Log)
type Log = {
  id: string                // Identifiant unique de l'action
  adminId: string           // Identifiant de l'administrateur ayant effectué l'action
  adminName: string         // Nom complet de l'administrateur
  adminRole: string         // Rôle de l'administrateur (ex: Super Admin, Admin, Éditeur)
  actionType: string        // Type de l'action (ex: CREATE, UPDATE, DELETE)
  description: string       // Description textuelle détaillée de l'action effectuée
  createdAt: string | Date  // Date et heure de l'action
}

export default function HistoriquePage() {
  // Récupération de la fonction showToast pour afficher des messages de succès ou d'erreur
  const { showToast } = useToast()
  
  // État local pour stocker la liste des actions (logs) récupérées depuis le serveur
  const [logs, setLogs] = useState<Log[]>([])
  
  // État local pour gérer l'affichage du spinner de chargement pendant la récupération des données
  const [isLoading, setIsLoading] = useState(true)
  
  // État local pour stocker le texte de recherche saisi par l'utilisateur
  const [searchTerm, setSearchTerm] = useState("")
  
  // État local pour stocker le rôle de l'administrateur actuellement connecté (par défaut "Éditeur")
  const [adminRole, setAdminRole] = useState("Éditeur")

  // Premier effet de bord : S'exécute uniquement côté client au montage du composant
  // Il récupère le rôle de l'administrateur depuis le localStorage du navigateur
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminRole(localStorage.getItem("admin_role") || "Éditeur")
    }
  }, [])

  // Deuxième effet de bord : S'exécute à chaque fois que la valeur de 'adminRole' change
  // Il vérifie si l'utilisateur est un "Super Admin" pour lancer la récupération des données
  useEffect(() => {
    if (adminRole === "Super Admin") {
      fetchLogs()
    } else {
      // Si ce n'est pas un Super Admin, on arrête le chargement (il verra la page d'accès refusé)
      setIsLoading(false)
    }
  }, [adminRole])

  // Fonction asynchrone chargée d'appeler le serveur pour récupérer l'historique
  const fetchLogs = async () => {
    setIsLoading(true) // Début du chargement
    const res = await getActivityLogs() // Appel de l'action serveur
    
    // Si la requête est un succès et contient des données, on met à jour l'état 'logs'
    if (res.success && res.data) {
      setLogs(res.data)
    } else {
      // En cas d'échec, affichage d'une notification d'erreur en haut à droite
      showToast(res.error || "Erreur lors du chargement de l'historique", "error")
    }
    setIsLoading(false) // Fin du chargement
  }

  // Vérification de sécurité (RBAC) côté client : 
  // Si le rôle n'est pas "Super Admin", on bloque complètement l'affichage de l'historique
  if (adminRole !== "Super Admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-fade-in-up">
        {/* Icône décorative indiquant l'interdiction/l'historique inaccessible */}
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <History className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Accès Refusé</h2>
        <p className="text-slate-500 max-w-md text-center">Vous n'avez pas les droits nécessaires pour consulter l'historique des actions. Cette section est réservée aux Super Administrateurs.</p>
      </div>
    )
  }

  // Fonction de filtrage de la liste des actions selon le terme de recherche ('searchTerm')
  // Le filtre est insensible à la casse (majuscules/minuscules) et cherche dans le nom, la description ou l'action
  const filteredLogs = logs.filter(log => 
    log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fonction utilitaire pour attribuer une couleur spécifique à chaque type d'action (badge visuel)
  const getActionColor = (type: string) => {
    switch(type) {
      case "CREATE": return "text-green-600 bg-green-50 border-green-200" // Vert pour les créations/ajouts
      case "UPDATE": return "text-blue-600 bg-blue-50 border-blue-200" // Bleu pour les modifications
      case "DELETE": return "text-rose-600 bg-rose-50 border-rose-200" // Rouge pour les suppressions
      default: return "text-slate-600 bg-slate-50 border-slate-200" // Gris par défaut
    }
  }

  // Rendu principal de la page pour le Super Admin
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* En-tête de la page */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
          <History className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historique des Actions</h1>
          <p className="text-slate-500">Traceabilité complète des opérations sur la plateforme.</p>
        </div>
      </div>

      {/* Conteneur principal englobant la barre de recherche et le tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Barre d'outils supérieure contenant la zone de recherche */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher une action..." 
              value={searchTerm} // Liaison avec l'état local
              onChange={(e) => setSearchTerm(e.target.value)} // Mise à jour de l'état à chaque frappe clavier
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <p className="text-xs text-slate-500">Affichage des 100 dernières actions</p>
        </div>

        {/* Affichage conditionnel selon l'état des données */}
        {isLoading ? (
          // 1. Si on est en train de charger, affichage d'une icône animée (spinner)
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredLogs.length === 0 ? (
          // 2. Si le chargement est terminé mais que la liste est vide (aucun log ou recherche infructueuse)
          <div className="p-12 text-center text-slate-500">
            Aucun historique trouvé.
          </div>
        ) : (
          // 3. Affichage du tableau de données si la liste contient des éléments
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* En-tête des colonnes du tableau */}
              <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Administrateur</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Détails</th>
                  <th className="px-6 py-4">Date et Heure</th>
                </tr>
              </thead>
              {/* Corps du tableau listant les logs filtrés */}
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Colonne 1 : Informations sur l'administrateur (initiales, nom, rôle) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Cercle avec les deux premières lettres du nom pour l'avatar */}
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {log.adminName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{log.adminName}</p>
                          <p className="text-xs text-slate-500">{log.adminRole}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Colonne 2 : Type d'action formatée sous forme de badge de couleur */}
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-xs font-bold rounded-full border", getActionColor(log.actionType))}>
                        {log.actionType}
                      </span>
                    </td>
                    
                    {/* Colonne 3 : Description détaillée de l'action */}
                    <td className="px-6 py-4 text-slate-700 font-medium">{log.description}</td>
                    
                    {/* Colonne 4 : Date de l'action formatée au format français (ex: 24 juin 2026 à 14:30) */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(log.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
