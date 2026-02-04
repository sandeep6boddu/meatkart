const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'sandeep@webenrich.com';
    console.log(`Promoting ${email} to super_admin...`);

    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) {
        console.error('User not found!');
        process.exit(1);
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { role: 'super_admin' }
    });

    console.log(`User ${user.name} (${user.email}) promoted to super_admin successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
