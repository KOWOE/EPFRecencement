const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Seeding des paramètres par défaut...');
  
  const regions = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Korhogo', 'Daloa'];
  const sousRegions = ['Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest', 'Centre'];
  const groupes = ['Louange', 'Adoration', 'Intercession', 'Logistique'];

  for (const name of regions) {
    await prisma.region.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const name of sousRegions) {
    await prisma.sousRegion.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const name of groupes) {
    await prisma.groupe.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('✅ Paramètres ajoutés avec succès.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
