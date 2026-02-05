import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.location.findFirst({
    where: { name: 'Tarnaka' }
  })

  if (existing) {
    console.log('Location Tarnaka already exists.')
    return
  }

  const location = await prisma.location.create({
    data: {
      name: 'Tarnaka',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500017',
      address: 'Tarnaka, Hyderabad',
      isActive: true
    }
  })

  console.log('Created location:', location)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
