const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('Database connection successful')
    const regions = await prisma.region.findMany()
    console.log('Regions:', regions)
  } catch (e) {
    console.error('Database connection failed:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
