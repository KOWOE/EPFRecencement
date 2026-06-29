"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import * as ExcelJS from "exceljs"
import { createClient } from "@/lib/supabase/server"

async function verifyAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé : Session invalide ou expirée")
  return user
}

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
  group_type: z.enum(["CHORALE", "FANFARE", "GROUPE_MUSICAL", "JEUNESSE"]),
  
  
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
  
  // Jeunesse
  role_jeunesse: z.string().optional(),
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
    await verifyAuth()
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
    await verifyAuth()
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
    await verifyAuth()
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

export async function importMembers(formData: FormData) {
  try {
    await verifyAuth()
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "Fichier manquant" }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = new ExcelJS.Workbook()
    
    if (file.name.toLowerCase().endsWith('.csv')) {
      const { Readable } = require('stream')
      const stream = Readable.from(buffer)
      await workbook.csv.read(stream)
    } else {
      await workbook.xlsx.load(buffer as any)
    }
    
    const worksheet = workbook.worksheets[0]
    if (!worksheet) {
       return { success: false, error: "Le fichier Excel/CSV est vide." }
    }
    
    const members: any[] = []
    let headers: string[] = []
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = cell.text ? cell.text.trim() : `Col${colNumber}`
        })
      } else {
        const rowData: any = {}
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber]] = cell.text || cell.value
        })
        members.push(rowData)
      }
    })

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
      let group_type: "CHORALE" | "FANFARE" | "GROUPE_MUSICAL" | "JEUNESSE" = "CHORALE"
      if (rawGroup.includes("FANFARE")) {
        group_type = "FANFARE"
      } else if (rawGroup.includes("MUSICAL") || rawGroup.includes("GROUPE")) {
        group_type = "GROUPE_MUSICAL"
      } else if (rawGroup.includes("JEUNESSE") || rawGroup.includes("JEUNE")) {
        group_type = "JEUNESSE"
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
    await verifyAuth()
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
    await verifyAuth()
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
      "groupe": m.group_type === "CHORALE" ? "Chorale" : m.group_type === "FANFARE" ? "Fanfare" : m.group_type === "JEUNESSE" ? "Jeunesse" : "Groupe Musical",
      "region": m.region,
      "sous-region": m.sous_region || "",
      "assemblee": m.assemblee,
      "role": m.role_jeunesse || ""
    }))

    if (format === "pdf") {
      return { 
        success: true, 
        data: JSON.stringify(formattedData), 
        filename: `membres_export_${new Date().toISOString().slice(0, 10)}.pdf`,
        mimeType: "application/pdf"
      }
    }

    // Generate sheet and workbook using exceljs
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Membres")
    
    if (formattedData.length > 0) {
      worksheet.columns = Object.keys(formattedData[0]).map(key => ({ header: key, key: key }))
      formattedData.forEach(row => worksheet.addRow(row))
    }

    let buffer: ArrayBuffer
    if (format === "csv") {
      buffer = await workbook.csv.writeBuffer() as ArrayBuffer
    } else {
      buffer = await workbook.xlsx.writeBuffer() as ArrayBuffer
    }

    // Write to a base64 string
    const base64String = Buffer.from(buffer).toString("base64")

    return { 
      success: true, 
      data: base64String, 
      filename: `membres_export_${new Date().toISOString().slice(0, 10)}.${format}`,
      mimeType: format === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'exportation:", error)
    return { success: false, error: "Une erreur est survenue lors de la génération du fichier d'exportation." }
  }
}

export async function getDashboardStats() {
  try {
    await verifyAuth()
    const [total, chorale, fanfare, musical, jeunesse] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { group_type: "CHORALE" } }),
      prisma.member.count({ where: { group_type: "FANFARE" } }),
      prisma.member.count({ where: { group_type: "GROUPE_MUSICAL" } }),
      prisma.member.count({ where: { group_type: "JEUNESSE" } }),
    ])
    return {
      success: true as const,
      data: {
        total,
        chorale,
        fanfare,
        musical,
        jeunesse
      }
    }
  } catch (error: any) {
    console.error("Error fetching stats:", error?.message || error)
    return { success: false as const, error: `Erreur lors du calcul des statistiques : ${error?.message || String(error)}` }
  }
}

export async function checkMemberRegistration(nom: string, prenom: string) {
  try {
    const member = await prisma.member.findFirst({
      where: {
        nom: {
          equals: nom.trim(),
          mode: 'insensitive'
        },
        prenom: {
          equals: prenom.trim(),
          mode: 'insensitive'
        }
      },
      select: {
        group_type: true
      }
    })

    if (member) {
      return {
        success: true as const,
        isRegistered: true as const,
        group: member.group_type
      }
    }

    return {
      success: true as const,
      isRegistered: false as const
    }
  } catch (error: any) {
    console.error("Error checking registration:", error?.message || error)
    return { success: false as const, error: "Erreur lors de la vérification de l'inscription." }
  }
}
