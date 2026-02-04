import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { phone: '9999999999' },
      update: {},
      create: {
        name: 'Test Customer',
        phone: '9999999999',
        email: 'test@example.com',
        role: 'customer'
      }
    });
    console.log('Test user created/found:', user);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
