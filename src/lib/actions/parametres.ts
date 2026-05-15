"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// -----------------------------------------------------------------------------
// RÉGIONS
// -----------------------------------------------------------------------------

export async function getRegions() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" }
    })
    return { success: true, data: regions }
  } catch (error) {
    console.error("Error fetching regions:", error)
    return { success: false, error: "Erreur lors de la récupération des régions" }
  }
}

export async function addRegion(name: string) {
  if (!name.trim()) return { success: false, error: "Le nom de la région est requis" }
  try {
    const region = await prisma.region.create({
      data: { name: name.trim() }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true, data: region }
  } catch (error: any) {
    console.error("Error adding region:", error)
    if (error.code === 'P2002') return { success: false, error: "Cette région existe déjà" }
    return { success: false, error: "Erreur lors de l'ajout de la région" }
  }
}

export async function deleteRegion(id: string) {
  try {
    await prisma.region.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true }
  } catch (error) {
    console.error("Error deleting region:", error)
    return { success: false, error: "Erreur lors de la suppression de la région" }
  }
}

// -----------------------------------------------------------------------------
// SOUS-RÉGIONS
// -----------------------------------------------------------------------------

export async function getSousRegions() {
  try {
    const sousRegions = await prisma.sousRegion.findMany({
      orderBy: { name: "asc" }
    })
    return { success: true, data: sousRegions }
  } catch (error) {
    console.error("Error fetching sous-regions:", error)
    return { success: false, error: "Erreur lors de la récupération des sous-régions" }
  }
}

export async function addSousRegion(name: string) {
  if (!name.trim()) return { success: false, error: "Le nom de la sous-région est requis" }
  try {
    const sousRegion = await prisma.sousRegion.create({
      data: { name: name.trim() }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true, data: sousRegion }
  } catch (error: any) {
    console.error("Error adding sous-region:", error)
    if (error.code === 'P2002') return { success: false, error: "Cette sous-région existe déjà" }
    return { success: false, error: "Erreur lors de l'ajout de la sous-région" }
  }
}

export async function deleteSousRegion(id: string) {
  try {
    await prisma.sousRegion.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true }
  } catch (error) {
    console.error("Error deleting sous-region:", error)
    return { success: false, error: "Erreur lors de la suppression de la sous-région" }
  }
}

// -----------------------------------------------------------------------------
// GROUPES / DÉPARTEMENTS
// -----------------------------------------------------------------------------

export async function getGroupes() {
  try {
    const groupes = await prisma.groupe.findMany({
      orderBy: { name: "asc" }
    })
    return { success: true, data: groupes }
  } catch (error) {
    console.error("Error fetching groupes:", error)
    return { success: false, error: "Erreur lors de la récupération des groupes" }
  }
}

export async function addGroupe(name: string) {
  if (!name.trim()) return { success: false, error: "Le nom du groupe est requis" }
  try {
    const groupe = await prisma.groupe.create({
      data: { name: name.trim() }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true, data: groupe }
  } catch (error: any) {
    console.error("Error adding groupe:", error)
    if (error.code === 'P2002') return { success: false, error: "Ce groupe existe déjà" }
    return { success: false, error: "Erreur lors de l'ajout du groupe" }
  }
}

export async function deleteGroupe(id: string) {
  try {
    await prisma.groupe.delete({
      where: { id }
    })
    revalidatePath("/dashboard/parametres")
    return { success: true }
  } catch (error) {
    console.error("Error deleting groupe:", error)
    return { success: false, error: "Erreur lors de la suppression du groupe" }
  }
}
