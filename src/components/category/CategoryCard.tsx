import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  name: string
  slug: string
  imageUrl: string
}

export function CategoryCard({ name, slug, imageUrl }: CategoryCardProps) {
  return (
    <Link 
      href={`/category/${slug}`}
      className="group flex flex-col items-center gap-2 p-4 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md hover:border-red-100"
    >
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-red-50 p-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover rounded-full p-2 group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-red-100" />
        )}
      </div>
      <span className="font-medium text-slate-900 group-hover:text-red-600">{name}</span>
    </Link>
  )
}
