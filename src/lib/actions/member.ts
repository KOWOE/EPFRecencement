"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
    return { success: true, data: members }
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
