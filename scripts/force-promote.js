const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'sandeep@webenrich.com';
    const users = await prisma.user.findMany({
        where: { email },
        select: { id: true, name: true, email: true, role: true }
    });
    console.log('All users with email:', users);

    if (users.length > 0) {
        console.log('Updating all to super_admin...');
        const updateResult = await prisma.user.updateMany({
            where: { email },
            data: { role: 'super_admin' }
        });
        console.log('Update result:', updateResult);
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
