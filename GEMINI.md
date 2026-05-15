# 🛸 EPF Recensement - Project Intelligence (GEMINI.md)

## 📋 Présentation de l'Application
**EPF Recensement** est une plateforme moderne de gestion et de recensement pour les Églises de Pentecôte de la Foi (EPF). L'application permet de collecter de manière structurée les données des membres répartis dans différents groupes musicaux et administratifs, tout en offrant aux administrateurs un tableau de bord puissant pour l'analyse et la gestion.

---

## ✨ Fonctionnalités Implémentées

### 🛡️ Espace Administration (Dashboard)
- **Tableau de Bord Global :** Vue d'ensemble avec cartes de statistiques dynamiques.
- **Gestion des Membres (`MemberTable`) :** 
  - Affichage en liste avec filtres multicritères (Recherche, Groupes, Régions).
  - **Filtres Temporels :** Filtrage global par Année et Mois pour les campagnes de recensement.
  - **Actions Contextuelles :** Menu "3 points" (cliquez pour ouvrir) permettant de modifier ou supprimer un membre.
  - **Responsive :** Vue spécifique pour mobile transformant le tableau en cartes élégantes.
- **Top Bar Interactive :**
  - Accès direct aux paramètres via l'icône profil.
  - Système de notifications avec menu déroulant animé.
- **Page Paramètres :** 
  - Navigation par onglets.
  - Gestion des données de base (ajout/suppression dynamique de Régions, Sous-régions et Groupes).

### 📝 Formulaires de Recensement (Publics)
- **Formulaires Spécialisés :** Chorale, Fanfare, et Groupe Musical.
- **UX Immersive :** Utilisation de composants `CustomSelect` pour une sélection fluide et esthétique.
- **Navigation Multi-étapes :** Formulaires divisés par sections (Infos Personnelles, Infos Spirituelles, Engagement).

---

## 🏗️ Structure des Fichiers Clés

```text
src/
├── app/
│   ├── (admin)/dashboard/     # Routes administratives
│   │   ├── layout.tsx         # Layout avec Sidebar et TopBar
│   │   ├── page.tsx           # Vue d'ensemble (Stats)
│   │   └── parametres/        # Gestion des référentiels
│   ├── (public)/recensement/  # Formulaires publics
│   │   ├── chorale/
│   │   ├── fanfare/
│   │   └── groupe-musical/
├── components/
│   ├── admin/                 # Composants spécifiques admin
│   │   ├── sidebar.tsx        # Navigation latérale
│   │   ├── member-table.tsx   # Cœur de la gestion des membres
│   │   └── stat-card.tsx      # Cartes de statistiques
│   ├── ui/                    # Design System réutilisable
│   │   └── custom-select.tsx  # Composant de sélection premium
├── lib/
│   └── utils.ts               # Utilitaires (Tailwind Merge, etc.)
```

---

## 🛠️ Stack Technique
- **Framework :** [Next.js 15+](https://nextjs.org/) (App Router).
- **Styling :** [Tailwind CSS](https://tailwindcss.com/) pour une interface utilitaire et réactive.
- **Icônes :** [Lucide React](https://lucide.dev/).
- **Animations :** Tailwind Animate & Transitions CSS (Cubic-bezier).
- **Base de Données (Prévu) :** [Prisma](https://www.prisma.io/) avec PostgreSQL.

---

## 🎨 Décisions de Design & Identité Visuelle

### Identité Visuelle (Preset "Afrique Premium" / "Nuit Professionnelle")
- **Palette :** Bleu profond (#003366) pour l'autorité, blanc pur pour la clarté, et touches de bleu électrique pour les actions.
- **Bordures :** `rounded-2xl` (16px) pour tous les conteneurs majeurs pour un aspect moderne et doux.
- **Profondeur :** Utilisation d'ombres légères (`shadow-sm`) et de bordures subtiles (`border-slate-100`).

### Principes UX
1. **Pas de menus natifs :** Utilisation systématique du `CustomSelect` pour maintenir une cohérence visuelle.
2. **Micro-interactions :** `hover:-translate-y-1` et `hover:shadow-md` sur les éléments interactifs pour donner une sensation de réactivité.
3. **États de clic :** Les menus déroulants et actions sont déclenchés par **clic** (et non survol) pour garantir une accessibilité optimale sur mobile et éviter les ouvertures accidentelles.

---

## 🤖 Instructions pour les futurs modèles IA
Lors de la modification de ce projet, respectez impérativement les règles suivantes :

1. **Cohérence du Design :** Tout nouvel élément doit utiliser les variables de couleur `slate`, `blue`, et les arrondis `rounded-xl` ou `rounded-2xl`.
2. **Standardisation des Inputs :** N'utilisez **jamais** de balise `<select>` native. Utilisez toujours `<CustomSelect />`.
3. **Logique de Filtrage :** Toute nouvelle liste de données doit inclure les filtres globaux par Année/Mois situés en haut du contenu (`member-table.tsx`).
4. **Persistance des Données :** Pour les fonctionnalités de création (Régions, Sous-régions), préférez l'implémentation de mutations Prisma pour garantir que les changements sont visibles dans toute l'application.
5. **Animations :** Utilisez les classes `animate-in fade-in slide-in-from-bottom-4` pour les chargements de sections.

---
*Dernière mise à jour : 15 Mai 2026*
