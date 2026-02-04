
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const categoryCount = await prisma.category.count()
        console.log(`Categories: ${categoryCount}`)

        const productCount = await prisma.product.count()
        console.log(`Products: ${productCount}`)

        if (productCount > 0) {
            const products = await prisma.product.findMany({
                take: 3,
                include: { productWeights: true }
            })
            console.log('Sample Products:', JSON.stringify(products, null, 2))
        }
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
