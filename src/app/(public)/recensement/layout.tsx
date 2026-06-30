import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function RecensementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isMaintenance = false
  
  try {
    const settings = await prisma.systemSettings.findUnique({ where: { id: "global" } })
    if (settings?.maintenanceMode) {
      isMaintenance = true
    }
  } catch (error) {
    console.error("Database error checking maintenance:", error)
  }

  if (isMaintenance) {
    redirect('/maintenance')
  }

  return <>{children}</>
}
