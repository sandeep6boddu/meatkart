'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createCategory, updateCategory, type CategoryFormState } from '@/app/actions/category'
import { Loader2 } from 'lucide-react'

type CategoryFormProps = {
  category?: {
    id: string
    name: string
    slug: string
    description?: string | null
    imageUrl?: string | null
    displayOrder: number
  }
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  
  const initialState: CategoryFormState = { message: '', errors: {} }
  
  const updateCategoryWithId = category 
    ? updateCategory.bind(null, category.id) 
    : createCategory

  const [state, formAction, isPending] = useActionState(updateCategoryWithId, initialState)

  return (
    <form action={formAction} className="tw-space-y-8 tw-max-w-2xl">
      <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100 tw-space-y-6">
        
        <div className="tw-space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={category?.name}
            placeholder="e.g. Chicken"
            required
          />
          {state.errors?.name && (
            <p className="tw-text-sm tw-text-red-500">{state.errors.name.join(', ')}</p>
          )}
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={category?.slug}
            placeholder="e.g. chicken"
            required
          />
          {state.errors?.slug && (
            <p className="tw-text-sm tw-text-red-500">{state.errors.slug.join(', ')}</p>
          )}
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            defaultValue={category?.description || ''}
            className="tw-flex tw-min-h-[100px] tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-text-gray-900 tw-ring-offset-white placeholder:tw-text-slate-500 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
            placeholder="Category description..."
          />
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            defaultValue={category?.imageUrl || ''}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="tw-space-y-2">
          <Label htmlFor="displayOrder">Display Order</Label>
          <Input
            id="displayOrder"
            name="displayOrder"
            type="number"
            defaultValue={category?.displayOrder ?? 0}
            required
          />
        </div>

      </div>

      <div className="tw-flex tw-justify-end tw-gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />}
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>

      {state.message && (
        <p className="tw-text-red-500 tw-text-center">{state.message}</p>
      )}
    </form>
  )
}
