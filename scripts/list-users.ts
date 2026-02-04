
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Listing top 10 users in Prisma DB:')
    const users = await prisma.user.findMany({
        take: 10
    })

    if (users.length === 0) {
        console.log('No users found in the database.')
    } else {
        users.forEach(u => {
            console.log(`- ${u.email} (ID: ${u.id}, Phone: ${u.phone})`)
        })
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
