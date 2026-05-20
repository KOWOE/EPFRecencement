"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import * as XLSX from "xlsx"

const memberSchema = z.object({
  nom: z.string().min(2, "Le nom est requis"),
  prenom: z.string().min(2, "Le prénom est requis"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email().optional().or(z.literal("")),
  profession: z.string().optional(),
  assemblee: z.string().min(2, "L'assemblée est requise"),
  sous_region: z.string().optional(),
  region: z.string().min(2, "La région est requise"),
  nom_groupe: z.string().optional(),
  partition: z.string().optional(),
  instrument: z.string().optional(),
  group_type: z.enum(["CHORALE", "FANFARE", "GROUPE_MUSICAL"]),
  
  // Techniques
  lecture_solfege: z.boolean().default(false),
  lecture_notes: z.boolean().default(false),
  
  // Chorale
  chef_choeur: z.string().optional(),
  harmonisation: z.boolean().default(false),
  interet_national: z.boolean().default(false),
  pourquoi_interet: z.string().optional(),
  
  // Groupe Musical
  categorie_chantre: z.string().optional(),
  
  // Attentes
  attentes_bureau: z.string().optional(),
})

export async function createMember(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries())
    
    // Conversion des bohéens (venant de checkboxes ou selects)
    const processedData = {
      ...rawData,
      lecture_solfege: rawData.lecture_solfege === "oui",
      lecture_notes: rawData.lecture_notes === "oui",
      harmonisation: rawData.harmonisation === "oui",
      interet_national: rawData.interet_national === "oui",
    }

    const validatedData = memberSchema.parse(processedData)

    const member = await prisma.member.create({
      data: validatedData as any,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/membres")

    return { success: true, memberId: member.id }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: "Données invalides. Veuillez vérifier les champs." }
    }
    return { success: false, error: "Une erreur est survenue lors de l'enregistrement." }
  }
}

export async function getMembers() {
  try {
    const members = await prisma.member.findMany({
      orderBy: { createdAt: "desc" }
    })
    
    const serializedMembers = members.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }))

    return { success: true, data: serializedMembers }
  } catch (error) {
    console.error("Error fetching members:", error)
    return { success: false, error: "Erreur lors de la récupération des membres" }
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.member.delete({
      where: { id }
    })
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/membres")
    return { success: true }
  } catch (error) {
    console.error("Error deleting member:", error)
    return { success: false, error: "Erreur lors de la suppression du membre" }
  }
}

export async function updateMember(id: string, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries())
    
    const processedData = {
      ...rawData,
      lecture_solfege: rawData.lecture_solfege === "oui" || rawData.lecture_solfege === "true",
      lecture_notes: rawData.lecture_notes === "oui" || rawData.lecture_notes === "true",
      harmonisation: rawData.harmonisation === "oui" || rawData.harmonisation === "true",
      interet_national: rawData.interet_national === "oui" || rawData.interet_national === "true",
    }

    const validatedData = memberSchema.partial().parse(processedData)

    const member = await prisma.member.update({
      where: { id },
      data: validatedData as any,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/membres")

    return { success: true, data: member }
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error)
    return { success: false, error: "Erreur lors de la mise à jour du membre" }
  }
}

function getNormalizedValue(obj: any, targetKeys: string[]): any {
  if (!obj || typeof obj !== "object") return undefined
  
  const normalize = (str: string) => 
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]/g, "") // remove special chars and spaces

  const normalizedTargets = targetKeys.map(normalize)
  
  for (const [key, value] of Object.entries(obj)) {
    if (normalizedTargets.includes(normalize(key))) {
      return value
    }
  }
  return undefined
}

export async function importMembers(members: any[]) {
  try {
    let importedCount = 0
    
    for (const m of members) {
      // 1. Resolve full name
      const rawFullName = getNormalizedValue(m, ["nom&prenom", "nom_prenom", "nom et prenom", "nomprenom", "nom", "Nom"])
      const fullName = String(rawFullName || "").trim()
      if (!fullName) continue
      
      const parts = fullName.split(/\s+/)
      const nom = parts[0] || "Non spécifié"
      const prenom = parts.slice(1).join(" ") || "Non spécifié"

      // 2. Resolve telephone
      const rawTelephone = getNormalizedValue(m, ["numero", "telephone", "phone", "tel"])
      const telephone = String(rawTelephone || "00000000").trim()

      // 3. Resolve email
      const rawEmail = getNormalizedValue(m, ["email", "mail"])
      const email = rawEmail ? String(rawEmail).trim() : null

      // 4. Resolve group type
      const rawGroup = String(getNormalizedValue(m, ["groupe", "group", "groupe_type"]) || "").toUpperCase()
      let group_type: "CHORALE" | "FANFARE" | "GROUPE_MUSICAL" = "CHORALE"
      if (rawGroup.includes("FANFARE")) {
        group_type = "FANFARE"
      } else if (rawGroup.includes("MUSICAL") || rawGroup.includes("GROUPE")) {
        group_type = "GROUPE_MUSICAL"
      }

      // 5. Resolve region, subregion and assemblee
      const rawRegion = getNormalizedValue(m, ["region", "region_name"])
      const regionName = String(rawRegion || "Non spécifiée").trim()

      const rawSousRegion = getNormalizedValue(m, ["sousregion", "sous-region", "sous_region", "sous region"])
      const sousRegionName = String(rawSousRegion || "Non spécifiée").trim()

      const rawAssemblee = getNormalizedValue(m, ["assemblee", "assemblée"])
      const assemblee = String(rawAssemblee || "Non spécifiée").trim()

      // Ensure region exists in lookup table
      if (regionName && regionName !== "Non spécifiée") {
        const existingRegion = await prisma.region.findUnique({ where: { name: regionName } })
        if (!existingRegion) {
          await prisma.region.create({ data: { name: regionName } }).catch(() => {})
        }
      }

      // Ensure subregion exists in lookup table
      if (sousRegionName && sousRegionName !== "Non spécifiée") {
        const existingSubRegion = await prisma.sousRegion.findUnique({ where: { name: sousRegionName } })
        if (!existingSubRegion) {
          await prisma.sousRegion.create({ data: { name: sousRegionName } }).catch(() => {})
        }
      }

      // Create member
      await prisma.member.create({
        data: {
          nom,
          prenom,
          telephone,
          email,
          group_type,
          region: regionName,
          sous_region: sousRegionName,
          assemblee,
          lecture_solfege: false,
          lecture_notes: false,
        }
      })
      importedCount++
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/membres")
    return { success: true, count: importedCount }
  } catch (error) {
    console.error("Erreur lors de l'importation:", error)
    return { success: false, error: "Une erreur est survenue lors de l'importation des membres." }
  }
}

export async function getUniqueAssemblies() {
  try {
    const members = await prisma.member.findMany({
      select: {
        assemblee: true
      },
      distinct: ['assemblee'],
      orderBy: {
        assemblee: 'asc'
      }
    })
    
    const assemblies = members
      .map(m => m.assemblee)
      .filter(a => a && a.trim() !== "")
      
    return { success: true, data: assemblies }
  } catch (error) {
    console.error("Error fetching assemblies:", error)
    return { success: false, error: "Erreur lors de la récupération des assemblées" }
  }
}

export async function exportMembers(
  filters: {
    groupType?: string
    region?: string
    sousRegion?: string
    assemblee?: string
  },
  format: string = "xlsx"
) {
  try {
    const where: any = {}
    if (filters.groupType) {
      where.group_type = filters.groupType
    }
    if (filters.region) {
      where.region = filters.region
    }
    if (filters.sousRegion) {
      where.sous_region = filters.sousRegion
    }
    if (filters.assemblee) {
      where.assemblee = filters.assemblee
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    if (members.length === 0) {
      return { success: false, error: "Aucun membre trouvé pour l'exportation." }
    }

    // Format data for spreadsheet
    const formattedData = members.map(m => ({
      "nom&prenom": `${m.nom} ${m.prenom}`.trim(),
      "numero": m.telephone,
      "email": m.email || "",
      "groupe": m.group_type === "CHORALE" ? "Chorale" : m.group_type === "FANFARE" ? "Fanfare" : "Groupe Musical",
      "region": m.region,
      "sous-region": m.sous_region || "",
      "assemblee": m.assemblee
    }))

    // Generate sheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Membres")

    // Write to a base64 string
    const bookType = format === "csv" ? "csv" : "xlsx"
    const buffer = XLSX.write(workbook, { type: "base64", bookType })

    return { 
      success: true, 
      data: buffer, 
      filename: `membres_export_${new Date().toISOString().slice(0, 10)}.${format}`,
      mimeType: format === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'exportation:", error)
    return { success: false, error: "Une erreur est survenue lors de la génération du fichier d'exportation." }
  }
}

