
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    if (!email) {
        console.error('Please provide an email address')
        process.exit(1)
    }

    console.log(`Checking for user with email: ${email}`)

    const user = await prisma.user.findFirst({
        where: { email: email }
    })

    if (user) {
        console.log('User found in Prisma DB:')
        console.log(JSON.stringify(user, null, 2))
    } else {
        console.log('User NOT found in Prisma DB')
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
