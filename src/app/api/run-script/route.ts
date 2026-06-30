import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const items = [
  "Cotonou 1",
  "Cotonou 2",
  "Cotonou 3",
  "Dogbo Tota",
  "Dogbo Ahomey",
  "Dogbo Honton",
  "Azovè",
  "Atomey",
  "Lalo",
  "Toviklin",
  "Klouékanmey",
  "Djoto",
  "Comè",
  "Lokosa",
  "Bohicon",
  "Dassa",
  "Banikouara",
  "Tchaourou",
  "Parakou",
  "Natitingou",
  "Kétou",
  "Porto-Novo"
]

export async function GET() {
  try {
    await prisma.region.deleteMany()
    await prisma.sousRegion.deleteMany()

    for (const name of items) {
      await prisma.region.create({ data: { name } })
      await prisma.sousRegion.create({ data: { name } })
    }

    return NextResponse.json({ success: true, message: "Regions and Sous-regions updated successfully!" })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) })
  }
}
