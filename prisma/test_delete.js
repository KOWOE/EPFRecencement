const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDelete() {
  const regions = await prisma.region.findMany()
  if (regions.length > 0) {
    const id = regions[0].id
    console.log(`Tentative de suppression de la région : ${regions[0].name} (${id})`)
    try {
      await prisma.region.delete({ where: { id } })
      console.log('✓ Suppression réussie !')
    } catch (e) {
      console.error('✗ Échec de la suppression :', e.message)
    }
  } else {
    console.log('Aucune région à supprimer.')
  }
}

testDelete().finally(() => prisma.$disconnect())
