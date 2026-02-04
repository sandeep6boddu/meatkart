const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'sandeep@webenrich.com';
    const user = await prisma.user.findFirst({
        where: { email },
        select: { id: true, name: true, email: true, role: true }
    });
    console.log('User Role Verification:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
