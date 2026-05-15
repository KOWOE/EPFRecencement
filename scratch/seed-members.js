const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const groupTypes = ['CHORALE', 'FANFARE', 'GROUPE_MUSICAL']
  const regions = ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Korhogo', 'Daloa']
  const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Julie', 'Marc', 'Alice', 'Thomas', 'Sophie', 'Lucas']
  const lastNames = ['Koffi', 'Koné', 'Coulibaly', 'Traoré', 'Bakayoko', 'Diallo', 'Diarrassouba', 'N\'Guessan']

  const members = []
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    members.push({
      nom: lastName,
      prenom: firstName + ' ' + (i + 1),
      telephone: '07' + Math.floor(10000000 + Math.random() * 90000000),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      assemblee: 'Assemblée ' + (Math.floor(Math.random() * 10) + 1),
      region: regions[Math.floor(Math.random() * regions.length)],
      sous_region: 'Zone ' + (Math.floor(Math.random() * 5) + 1),
      group_type: groupTypes[Math.floor(Math.random() * groupTypes.length)],
      partition: 'Vocal ' + (Math.floor(Math.random() * 4) + 1),
      instrument: i % 2 === 0 ? 'Piano' : 'Guitare',
      profession: 'Métier ' + (i + 1)
    })
  }

  console.log('🚀 Démarrage du seeding de 100 membres...');
  try {
    const result = await prisma.member.createMany({
      data: members
    })
    console.log(`✅ Succès : ${result.count} membres ont été ajoutés à la base de données.`);
  } catch (err) {
    console.error('❌ Erreur lors du seeding :', err.message);
    if (err.message.includes('Can\'t reach database server')) {
      console.log('\n💡 CONSEIL : Votre serveur PostgreSQL semble être éteint. Lancez-le avant de réexécuter ce script.');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
