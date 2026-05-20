"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createSession, deleteSession, verifySession } from "@/lib/session"

async function verifyAuth() {
  const session = await verifySession()
  if (!session) throw new Error("Non autorisé : Session invalide ou expirée")
  return session
}

export async function getAdminProfile() {
  try {
    const user = await verifyAuth()
    const admin = await prisma.admin.findUnique({
      where: { email: user.email?.toLowerCase() }
    })
    if (!admin) return { success: false, error: "Administrateur non trouvé" }
    return { success: true, data: { nom: admin.nom, email: admin.email, role: admin.role } }
  } catch (error) {
    return { success: false, error: "Erreur serveur de connexion." }
  }
}

export async function logoutAdmin() {
  await deleteSession()
  return { success: true }
}

// -----------------------------------------------------------------------------
// RÉGIONS
// -----------------------------------------------------------------------------

export async function getRegions() {
  try {
    await verifyAuth()
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    })
    return { success: true as const, data: regions }
  } catch (error) {
    console.error("Error fetching regions:", error)
    return { success: false as const, error: "Erreur lors de la récupération des régions" }
  }
}

export async function addRegion(name: string) {
  if (!name.trim()) return { success: false as const, error: "Le nom de la région est requis" }
  try {
    await verifyAuth()
    const region = await prisma.region.create({
      data: { name: name.trim() },
      select: { id: true, name: true }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: region.id, name: region.name } }
  } catch (error: any) {
    console.error("Error adding region:", error?.message || error)
    if (error?.code === 'P2002') return { success: false as const, error: "Cette région existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout de la région : ${error?.message || String(error)}` }
  }
}

export async function deleteRegion(id: string) {
  try {
    await verifyAuth()
    await prisma.region.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error: any) {
    console.error("Error deleting region:", error?.message || error)
    return { success: false as const, error: `Erreur lors de la suppression de la région : ${error?.message || String(error)}` }
  }
}

// -----------------------------------------------------------------------------
// SOUS-RÉGIONS
// -----------------------------------------------------------------------------

export async function getSousRegions() {
  try {
    await verifyAuth()
    const sousRegions = await prisma.sousRegion.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    })
    return { success: true as const, data: sousRegions }
  } catch (error) {
    console.error("Error fetching sous-regions:", error)
    return { success: false as const, error: "Erreur lors de la récupération des sous-régions" }
  }
}

export async function addSousRegion(name: string) {
  if (!name.trim()) return { success: false as const, error: "Le nom de la sous-région est requis" }
  try {
    await verifyAuth()
    const sousRegion = await prisma.sousRegion.create({
      data: { name: name.trim() },
      select: { id: true, name: true }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: sousRegion.id, name: sousRegion.name } }
  } catch (error: any) {
    console.error("Error adding sous-region:", error?.message || error)
    if (error?.code === 'P2002') return { success: false as const, error: "Cette sous-région existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout de la sous-région : ${error?.message || String(error)}` }
  }
}

export async function deleteSousRegion(id: string) {
  try {
    await verifyAuth()
    await prisma.sousRegion.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error: any) {
    console.error("Error deleting sous-region:", error?.message || error)
    return { success: false as const, error: `Erreur lors de la suppression de la sous-région : ${error?.message || String(error)}` }
  }
}

// -----------------------------------------------------------------------------
// GROUPES / DÉPARTEMENTS
// -----------------------------------------------------------------------------

export async function getGroupes() {
  try {
    await verifyAuth()
    const groupes = await prisma.groupe.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    })
    return { success: true as const, data: groupes }
  } catch (error) {
    console.error("Error fetching groupes:", error)
    return { success: false as const, error: "Erreur lors de la récupération des groupes" }
  }
}

export async function addGroupe(name: string) {
  if (!name.trim()) return { success: false as const, error: "Le nom du groupe est requis" }
  try {
    await verifyAuth()
    const groupe = await prisma.groupe.create({
      data: { name: name.trim() },
      select: { id: true, name: true }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: groupe.id, name: groupe.name } }
  } catch (error: any) {
    console.error("Error adding groupe:", error?.message || error)
    if (error?.code === 'P2002') return { success: false as const, error: "Ce groupe existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout du groupe : ${error?.message || String(error)}` }
  }
}

export async function deleteGroupe(id: string) {
  try {
    await verifyAuth()
    await prisma.groupe.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error: any) {
    console.error("Error deleting groupe:", error?.message || error)
    return { success: false as const, error: `Erreur lors de la suppression du groupe : ${error?.message || String(error)}` }
  }
}

// -----------------------------------------------------------------------------
// Administrateurs
// -----------------------------------------------------------------------------

export async function getAdmins() {
  try {
    await verifyAuth()
    let admins = await prisma.admin.findMany({
      orderBy: { nom: "asc" }
    })
    
    if (admins.length === 0) {
      // Seed default admins
      const seedAdmins = [
        { nom: "Admin EPF", email: "admin@epf-recensement.ci", role: "Super Admin" },
        { nom: "Secrétariat EPF", email: "secretariat@epf-recensement.ci", role: "Éditeur" }
      ]
      
      for (const sa of seedAdmins) {
        await prisma.admin.create({
          data: { ...sa, password: "recensement2026" }
        }).catch(() => {})
      }
      
      admins = await prisma.admin.findMany({
        orderBy: { nom: "asc" }
      })
    }
    
    const serializedAdmins = admins.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString()
    }))
    
    return { success: true as const, data: serializedAdmins }
  } catch (error: any) {
    console.error("Error fetching admins:", error?.message || error)
    return { success: false as const, error: `Erreur lors de la récupération des administrateurs : ${error?.message || String(error)}` }
  }
}

export async function addAdmin(nom: string, email: string, role: string, password?: string) {
  if (!nom.trim()) return { success: false as const, error: "Le nom est requis" }
  if (!email.trim()) return { success: false as const, error: "L'adresse email est requise" }
  if (!role.trim()) return { success: false as const, error: "Le rôle est requis" }
  
  try {
    await verifyAuth()
    const admin = await prisma.admin.create({
      data: {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        ...(password && password.trim() ? { password: password.trim() } : {})
      }
    })
    revalidatePath("/dashboard/parametres")
    return {
      success: true as const,
      data: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    console.error("Error adding admin:", error?.message || error)
    if (error?.code === 'P2002') return { success: false as const, error: "Cet email est déjà utilisé par un autre administrateur" }
    return { success: false as const, error: `Erreur lors de l'ajout de l'administrateur : ${error?.message || String(error)}` }
  }
}

export async function deleteAdmin(id: string) {
  try {
    await verifyAuth()
    // Garde-fou : empêcher de supprimer le dernier Super Admin
    const adminToDelete = await prisma.admin.findUnique({ where: { id } })
    if (adminToDelete && adminToDelete.role === "Super Admin") {
      const superAdminsCount = await prisma.admin.count({
        where: { role: "Super Admin" }
      })
      if (superAdminsCount <= 1) {
        return { success: false as const, error: "Impossible de supprimer le dernier Super Admin. Au moins un Super Admin est requis." }
      }
    }

    await prisma.admin.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error: any) {
    console.error("Error deleting admin:", error?.message || error)
    return { success: false as const, error: `Erreur lors de la suppression de l'administrateur : ${error?.message || String(error)}` }
  }
}

export async function loginAdmin(email: string, mdp?: string) {
  if (!email || !email.trim()) {
    return { success: false as const, error: "L'adresse email est requise" }
  }
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    })
    if (!admin) {
      return { success: false as const, error: "Adresse email non reconnue comme administrateur" }
    }
    
    if (mdp && admin.password !== mdp) {
      return { success: false as const, error: "Mot de passe incorrect" }
    }
    
    // Créer la session sécurisée (Cookie HttpOnly)
    await createSession(admin.email, admin.nom, admin.role)

    return {
      success: true as const,
      data: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role
      }
    }
  } catch (error: any) {
    console.error("Error authenticating admin:", error)
    return { success: false as const, error: "Une erreur est survenue lors de la connexion" }
  }
}
