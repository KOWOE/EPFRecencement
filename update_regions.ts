import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  console.log("Deleting old regions and sous-regions...")
  await prisma.region.deleteMany({})
  await prisma.sousRegion.deleteMany({})

  console.log("Inserting new regions and sous-regions...")
  for (const name of items) {
    await prisma.region.create({ data: { name } })
    await prisma.sousRegion.create({ data: { name } })
  }
  console.log("Done!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
