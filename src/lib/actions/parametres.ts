"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

async function verifyAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé : Session invalide ou expirée")
  return user
}

export async function getAdminProfile() {
  try {
    const user = await verifyAuth()
    const admin = await prisma.admin.findUnique({
      where: { email: user.email?.toLowerCase() }
    })
    if (!admin) return { success: false, error: "Administrateur non trouvé" }
    return { success: true, data: { id: admin.id, nom: admin.nom, email: admin.email, role: admin.role } }
  } catch (error) {
    return { success: false, error: "Erreur serveur de connexion." }
  }
}

async function logActivity(actionType: string, description: string) {
  try {
    const profileRes = await getAdminProfile()
    if (profileRes.success && profileRes.data) {
      await prisma.activityLog.create({
        data: {
          adminId: profileRes.data.id,
          adminName: profileRes.data.nom,
          adminRole: profileRes.data.role,
          actionType,
          description
        }
      })
    }
  } catch (e) {
    console.error("Error logging activity", e)
  }
}

export async function logoutAdmin() {
  const supabase = await createClient()
  await supabase.auth.signOut()
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
    await logActivity("CREATE", `Ajout de la région ${region.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: region.id, name: region.name } }
  } catch (error) {
    const err = error as Error & { code?: string }
    console.error("Error adding region:", err.message || err)
    if (err.code === 'P2002') return { success: false as const, error: "Cette région existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout de la région : ${err.message || String(err)}` }
  }
}

export async function deleteRegion(id: string) {
  try {
    await verifyAuth()
    const region = await prisma.region.findUnique({ where: { id } })
    await prisma.region.delete({
      where: { id }
    })
    if (region) await logActivity("DELETE", `Suppression de la région ${region.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error) {
    const err = error as Error
    console.error("Error deleting region:", err.message || err)
    return { success: false as const, error: `Erreur lors de la suppression de la région : ${err.message || String(err)}` }
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
    await logActivity("CREATE", `Ajout de la sous-région ${sousRegion.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: sousRegion.id, name: sousRegion.name } }
  } catch (error) {
    const err = error as Error & { code?: string }
    console.error("Error adding sous-region:", err.message || err)
    if (err.code === 'P2002') return { success: false as const, error: "Cette sous-région existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout de la sous-région : ${err.message || String(err)}` }
  }
}

export async function deleteSousRegion(id: string) {
  try {
    await verifyAuth()
    const sousRegion = await prisma.sousRegion.findUnique({ where: { id } })
    await prisma.sousRegion.delete({
      where: { id }
    })
    if (sousRegion) await logActivity("DELETE", `Suppression de la sous-région ${sousRegion.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error) {
    const err = error as Error
    console.error("Error deleting sous-region:", err.message || err)
    return { success: false as const, error: `Erreur lors de la suppression de la sous-région : ${err.message || String(err)}` }
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
    await logActivity("CREATE", `Ajout du groupe ${groupe.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const, data: { id: groupe.id, name: groupe.name } }
  } catch (error) {
    const err = error as Error & { code?: string }
    console.error("Error adding groupe:", err.message || err)
    if (err.code === 'P2002') return { success: false as const, error: "Ce groupe existe déjà" }
    return { success: false as const, error: `Erreur lors de l'ajout du groupe : ${err.message || String(err)}` }
  }
}

export async function deleteGroupe(id: string) {
  try {
    await verifyAuth()
    const groupe = await prisma.groupe.findUnique({ where: { id } })
    await prisma.groupe.delete({
      where: { id }
    })
    if (groupe) await logActivity("DELETE", `Suppression du groupe ${groupe.name}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error) {
    const err = error as Error
    console.error("Error deleting groupe:", err.message || err)
    return { success: false as const, error: "Erreur lors de la suppression du groupe." }
  }
}

// ----------------- SYSTEM SETTINGS (MAINTENANCE) -----------------

export async function getMaintenanceMode() {
  try {
    const settings = await prisma.systemSettings.findUnique({ where: { id: "global" } })
    return { success: true, maintenanceMode: settings?.maintenanceMode ?? false }
  } catch (error) {
    return { success: false, error: "Erreur lors de la lecture des paramètres." }
  }
}

export async function toggleMaintenanceMode(value: boolean) {
  try {
    await prisma.systemSettings.upsert({
      where: { id: "global" },
      update: { maintenanceMode: value },
      create: { id: "global", maintenanceMode: value }
    })
    
    await logActivity("SETTINGS", `Mode maintenance ${value ? 'activé' : 'désactivé'}`)
    
    revalidatePath("/", "layout")
    
    return { success: true }
  } catch (error) {
    console.error("Toggle maintenance error", error)
    return { success: false, error: "Erreur lors de la modification du mode maintenance." }
  }
}

export async function getActivityLogs() {
  try {
    await verifyAuth()
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100 // Fetch last 100 logs
    })
    return { success: true, data: logs }
  } catch (error) {
    console.error("Erreur getActivityLogs:", error)
    return { success: false, error: "Impossible de récupérer l'historique." }
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
        { nom: "Admin EPF", email: "admin@epf-recensement.ci", role: "Super Admin", pwd: "recensement2026" },
        { nom: "Secrétariat EPF", email: "secretariat@epf-recensement.ci", role: "Éditeur", pwd: "recensement2026" }
      ]
      
      for (const sa of seedAdmins) {
        // Create in Supabase first
        await getSupabaseAdmin().auth.admin.createUser({
          email: sa.email,
          password: sa.pwd,
          email_confirm: true,
          user_metadata: { role: sa.role, nom: sa.nom }
        }).catch(() => {})

        await prisma.admin.create({
          data: { nom: sa.nom, email: sa.email, role: sa.role, password: sa.pwd }
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
  } catch (error) {
    const err = error as Error
    console.error("Error fetching admins:", err.message || err)
    return { success: false as const, error: `Erreur lors de la récupération des administrateurs : ${err.message || String(err)}` }
  }
}

export async function addAdmin(nom: string, email: string, role: string, password?: string) {
  if (!nom.trim()) return { success: false as const, error: "Le nom est requis" }
  if (!email.trim()) return { success: false as const, error: "L'adresse email est requise" }
  if (!role.trim()) return { success: false as const, error: "Le rôle est requis" }
  
  try {
    await verifyAuth()
    
    // Créer le compte dans Supabase Auth en premier
    const { data: authData, error: authError } = await getSupabaseAdmin().auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password && password.trim() ? password.trim() : "Recensement@2026",
      email_confirm: true,
      user_metadata: { role: role.trim(), nom: nom.trim() }
    })

    if (authError) {
       console.error("Supabase Auth Error:", authError)
       return { success: false as const, error: "Impossible de créer le compte sécurisé: " + authError.message }
    }

    // Créer le compte dans Prisma
    const admin = await prisma.admin.create({
      data: {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        ...(password && password.trim() ? { password: password.trim() } : { password: "Recensement@2026" })
      }
    })
    await logActivity("CREATE", `Ajout de l'administrateur ${admin.nom} (${admin.role})`)
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
  } catch (error) {
    const err = error as Error & { code?: string }
    console.error("Error adding admin:", err.message || err)
    if (err.code === 'P2002') return { success: false as const, error: "Cet email est déjà utilisé par un autre administrateur" }
    return { success: false as const, error: `Erreur lors de l'ajout de l'administrateur : ${err.message || String(err)}` }
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

    // Supprimer de Supabase Auth
    if (adminToDelete) {
      const { data: usersData } = await getSupabaseAdmin().auth.admin.listUsers()
      if (usersData && usersData.users) {
        const authUser = usersData.users.find(u => u.email === adminToDelete.email)
        if (authUser) {
           await getSupabaseAdmin().auth.admin.deleteUser(authUser.id)
        }
      }
    }

    await prisma.admin.delete({
      where: { id }
    })
    if (adminToDelete) await logActivity("DELETE", `Suppression de l'administrateur ${adminToDelete.nom}`)
    revalidatePath("/dashboard/parametres")
    return { success: true as const }
  } catch (error) {
    const err = error as Error
    console.error("Error deleting admin:", err.message || err)
    return { success: false as const, error: `Erreur lors de la suppression de l'administrateur : ${err.message || String(err)}` }
  }
}

export async function loginAdmin(email: string, mdp?: string) {
  if (!email || !email.trim()) {
    return { success: false as const, error: "L'adresse email est requise" }
  }
  try {
    // Vérifier que les variables d'environnement sont bien présentes
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("CRITICAL: Supabase env vars missing in loginAdmin!")
      return { success: false as const, error: "Configuration serveur incomplète. Contactez l'administrateur." }
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() }
    })
    
    if (!admin) {
      return { success: false as const, error: "Ce compte n'a pas accès à l'administration." }
    }

    const supabase = await createClient()
    let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: mdp || ""
    })

    // Auto-migration: If Supabase fails but password matches Prisma DB exactly
    if (authError && admin.password === (mdp || "")) {
      // Try to create the user in Supabase Auth
      const { error: createError } = await getSupabaseAdmin().auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: mdp || "",
        email_confirm: true,
        user_metadata: { role: admin.role, nom: admin.nom }
      })
      
      if (!createError) {
        // Retry login
        const retry = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: mdp || ""
        })
        authData = retry.data
        authError = retry.error
      }
    }

    if (authError) {
      console.error("Supabase Auth Error:", authError.message)
      return { success: false as const, error: "Email ou mot de passe incorrect." }
    }
    
    if (!authData?.user) {
      return { success: false as const, error: "Email ou mot de passe incorrect." }
    }

    return {
      success: true as const,
      data: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role
      }
    }
  } catch (error) {
    const err = error as Error
    console.error("Error authenticating admin:", err.message || err)
    return { success: false as const, error: "Erreur de connexion : " + (err.message || "Serveur indisponible") }
  }
}
