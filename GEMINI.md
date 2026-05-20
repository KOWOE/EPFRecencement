# 🛸 EPF Recensement - Project Intelligence (GEMINI.md)

## 📋 Présentation de l'Application
**EPF Recensement** est une plateforme moderne de recensement et de gestion pour les Églises de Pentecôte de la Foi (EPF). L'application permet de collecter les données d'engagement des membres répartis dans différents groupes (Chorale, Fanfare, et Groupe Musical), tout en offrant aux administrateurs un tableau de bord puissant pour filtrer, analyser, exporter les données et gérer les paramètres du système.

---

## ✨ Fonctionnalités Implémentées

### 🛡️ Espace Administration (Dashboard)
- **Tableau de Bord Global :** Vue d'ensemble avec statistiques dynamiques et réactives.
- **Gestion des Membres (`MemberTable`) :** 
  - Affichage en liste avec filtres multicritères (Recherche, Groupes, Régions, Année, Mois).
  - Actions de modification et suppression avec retour visuel immédiat.
  - Double affichage adaptatif : Table complète sur desktop et cartes détaillées sur mobile.
- **Imports & Exports avancés :**
  - **Importation :** Chargement en masse de membres depuis des fichiers Excel (.xlsx) ou CSV avec retour visuel.
  - **Exportation :** Exportation des données filtrées au format **Excel**, **CSV** ou **PDF** interactif (généré proprement côté client avec en-têtes et structures adaptées).
  - **Filtres géographiques :** Export par région, sous-région, ou assemblée locale.
- **Page Paramètres :**
  - **Profil Utilisateur :** Informations du compte administrateur.
  - **Données de base :** Ajout/suppression dynamique en temps réel de Régions, Sous-régions et Groupes.
  - **Sécurité & Accès :** Toggles de contrôle (inscriptions publiques, MFA, mode maintenance) et gestion des administrateurs système.
  - **Notifications :** Préférences d'alertes email, rapports périodiques, et notifications d'événements par groupe avec persistance locale (`localStorage`).

### 📝 Système de Notification & Dialogues Customisés
- **Toast Notifications :** Alertes animées et temporisées en haut à droite pour confirmer les succès d'action.
- **Dialogues d'Alerte :** Modales de dialogue animées au centre avec floutage d'arrière-plan (`backdrop-blur-sm`) pour remplacer les alertes natives `alert()` du navigateur.

---

## 🏗️ Structure des Fichiers Clés

```text
src/
├── app/
│   ├── (admin)/layout.tsx     # Layout d'administration (Sidebar + TopBar responsive)
│   ├── (admin)/dashboard/     # Tableau de bord global
│   │   ├── page.tsx           # Statistiques globales
│   │   ├── membres/           # Gestion générale des membres
│   │   ├── imports-exports/   # Module d'import/export de fichiers Excel/CSV/PDF
│   │   └── parametres/        # Profil, référentiels, sécurité et notifications
│   ├── (public)/recensement/  # Formulaires publics multi-étapes
│   │   ├── chorale/
│   │   ├── fanfare/
│   │   └── groupe-musical/
│   └── layout.tsx             # Root layout avec ToastProvider intégré
├── components/
│   ├── admin/
│   │   ├── sidebar.tsx        # Barre de navigation latérale responsive
│   │   └── member-table.tsx   # Tableau principal de gestion des membres
│   ├── ui/
│   │   ├── custom-select.tsx  # Menu déroulant premium personnalisé
│   │   └── confirm-modal.tsx  # Fenêtre modale de confirmation personnalisée
├── context/
│   └── toast-context.tsx      # Gestionnaire global des Toasts et Dialogues
├── lib/
│   ├── actions/
│   │   ├── member.ts          # Requêtes membres et exports Excel/PDF
│   │   └── parametres.ts      # Requêtes régions, sous-régions, groupes
│   └── utils.ts               # Classes utilitaires (Tailwind merge)
```

---

## 🛠️ Stack Technique
- **Framework :** [Next.js 15+](https://nextjs.org/) (App Router).
- **Styling :** [Tailwind CSS](https://tailwindcss.com/) (système de design fluide).
- **Icônes :** [Lucide React](https://lucide.dev/).
- **Base de Données :** [Prisma](https://www.prisma.io/) avec PostgreSQL.
- **Librairies Clés :** `xlsx` (parsing Excel), `jspdf` & `jspdf-autotable` (génération PDF).

---

## 🎨 Décisions de Design & Identité Visuelle

### Identité Visuelle
- **Couleurs :** Bleu profond (`#003366`) pour l'autorité ecclésiastique, Blanc pur pour la clarté et touches de Bleu électrique (`#0056D2`) pour les actions principales.
- **Formes :** Rayons cohérents `rounded-xl` et `rounded-2xl` pour adoucir les cartes et éléments interactifs.
- **Profondeur :** Ombres douces (`shadow-sm` à `shadow-lg`) combinées à des bordures fines (`border-slate-100`).

---

## 🤖 Instructions pour les futurs modèles IA (Règles Importantes)
Lors de futures modifications, respectez scrupuleusement ces règles :

1. **Pas d'Alertes Natives :** N'utilisez **jamais** `alert()` ou `confirm()` natifs du navigateur. Utilisez toujours le hook `useToast` issu de `@/context/toast-context` via `showToast(msg, type)` ou `showAlertDialog(titre, msg, type)`.
2. **Pas d'Inputs Natifs :** N'utilisez pas les balises `<select>` HTML par défaut dans les formulaires. Utilisez toujours le composant `<CustomSelect />` de `src/components/ui/custom-select.tsx`.
3. **Responsivité Obligatoire :** Toute modification de mise en page doit être testée pour les écrans mobiles (hamburger menu, grilles adaptatives, tableaux repliés en cartes).
4. **Cohérence des Variables :** Suivre les palettes de couleurs `blue` et `slate`, les rayons d'angles `rounded-xl` et `rounded-2xl`, et les transitions d'opacités cubic-bezier pour les interactions au survol.
