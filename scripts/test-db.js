const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to DB...');
    try {
        const count = await prisma.user.count();
        console.log('Connection successful. User count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
