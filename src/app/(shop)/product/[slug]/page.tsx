
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Sync fix

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product: any = null
  try {
    product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        productImages: { where: { isPrimary: true }, take: 1 },
        productWeights: { where: { isActive: true } }
      }
    })
  } catch (e) {
    console.error(`Error fetching product ${slug}:`, e);
    product = null
  }

  if (!product) {
    return (
      <>
        <div className="breadcrumps-bg">
          <div className="container">
            <ol className="breadcrumb">
              <li><Link href="/">Home</Link></li>
              <li className="active">Product</li>
            </ol>
          </div>
        </div>
        <section className="mutton-section ">
          <div className="container">
            <div className="col-md-12 text-center">
              <h2>Product unavailable</h2>
              <p>Please try again later.</p>
            </div>
          </div>
        </section>
      </>
    )
  }

  const productData = {
    id: product.id,
    name: product.name,
    category: {
      name: product.category.name,
      slug: product.category.slug
    },
    description: product.description,
    freshnessNotes: product.freshnessNotes,
    cutTypes: product.cutTypes,
    freshnessDate: product.freshnessDate,
    imageUrl: product.productImages[0]?.imageUrl || "/images/no-image.png",
    weights: product.productWeights.map((pw: any) => ({
      id: pw.id,
      weight: pw.weight,
      price: Number(pw.price),
      discountPrice: pw.discountPrice ? Number(pw.discountPrice) : null
    })),
    slug: product.slug
  }

  return <ProductClient product={productData} />
}
