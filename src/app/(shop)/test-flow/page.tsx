import prisma from '@/lib/prisma'
import TestFlowClient from './TestFlowClient'

export const dynamic = 'force-dynamic'

export default async function TestFlowPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      productWeights: { where: { isActive: true } },
      productImages: { where: { isPrimary: true }, take: 1 }
    },
    take: 10
  })

  // Transform for client
  const clientProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    categoryName: p.category.name,
    imageUrl: p.productImages[0]?.imageUrl || '',
    weights: p.productWeights.map(pw => ({
      id: pw.id,
      weight: pw.weight,
      price: Number(pw.price)
    }))
  }))

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Debug Test Flow</h1>
      <p>Simple, unstyled page to verify E-commerce logic.</p>
      <hr />
      <TestFlowClient products={clientProducts} />
    </div>
  )
}
