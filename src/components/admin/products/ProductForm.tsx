'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct, type ProductFormState } from '@/app/actions/product'
import { Loader2, Plus, X, Upload } from 'lucide-react'

type Category = {
  id: string
  name: string
}

type ProductImage = {
  imageUrl: string
  isPrimary: boolean
}

type ProductWeight = {
  id?: string
  weight: string
  price: number
  discountPrice?: number
  isActive: boolean
}

type ProductFormProps = {
  categories: Category[]
  product?: {
    id: string
    name: string
    slug: string
    categoryId: string
    description?: string | null
    freshnessNotes?: string | null
    cutTypes?: string | null
    freshnessDate?: string | Date | null
    stockQuantity: number
    isActive: boolean
    productImages: ProductImage[]
    productWeights: ProductWeight[]
    locations?: { id: string }[]
  }
  locations: { id: string; name: string }[]
}

export function ProductForm({ categories, product, locations }: ProductFormProps) {
  const router = useRouter()
  // Initialize state from potential error payload OR product prop
  const [images, setImages] = useState<ProductImage[]>(() => {
    /* @ts-ignore - inputs might exist on state */
    return product?.productImages || []
  })
  const [weights, setWeights] = useState<ProductWeight[]>(() => {
    /* @ts-ignore */
    return product?.productWeights || []
  })
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(() => {
    /* @ts-ignore */
    return product?.locations?.map(l => l.id) || []
  })

  // Local state for new entries
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newWeight, setNewWeight] = useState({ weight: '', price: '', discountPrice: '' })

  const initialState: ProductFormState = { message: '', errors: {} }

  // Wrap updateProduct to bind the ID
  const updateProductWithId = product
    ? updateProduct.bind(null, product.id)
    : createProduct

  const [state, formAction, isPending] = useActionState(updateProductWithId, initialState as any)

  // Side effect to sync state inputs back to local state if validation failed
  useEffect(() => {
    if (state?.inputs) {
      if (state.inputs.images) setImages(state.inputs.images)
      if (state.inputs.weights) setWeights(state.inputs.weights)
      if (state.inputs.locationIds) setSelectedLocationIds(state.inputs.locationIds)
    }
  }, [state])

  const handleAddImage = () => {
    if (newImageUrl) {
      setImages([...images, { imageUrl: newImageUrl, isPrimary: images.length === 0 }])
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleAddWeight = () => {
    if (newWeight.weight && newWeight.price) {
      setWeights([...weights, {
        weight: newWeight.weight,
        price: parseFloat(newWeight.price),
        discountPrice: newWeight.discountPrice ? parseFloat(newWeight.discountPrice) : undefined,
        isActive: true
      }])
      setNewWeight({ weight: '', price: '', discountPrice: '' })
    }
  }

  const handleRemoveWeight = (index: number) => {
    setWeights(weights.filter((_, i) => i !== index))
  }

  const handleLocationToggle = (locationId: string) => {
    if (selectedLocationIds.includes(locationId)) {
      setSelectedLocationIds(selectedLocationIds.filter(id => id !== locationId))
    } else {
      setSelectedLocationIds([...selectedLocationIds, locationId])
    }
  }

  return (
    <form action={formAction} className="tw-space-y-8">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">
        {/* Left Column: Basic Info */}
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Basic Information</h3>

            <div className="tw-space-y-4">
              <div className="tw-space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={state?.inputs?.name ?? product?.name}
                  placeholder="e.g. Curry Cut Chicken"
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
                  defaultValue={state?.inputs?.slug ?? product?.slug}
                  placeholder="e.g. curry-cut-chicken"
                  required
                />
                {state.errors?.slug && (
                  <p className="tw-text-sm tw-text-red-500">{state.errors.slug.join(', ')}</p>
                )}
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={state?.inputs?.categoryId ?? product?.categoryId}
                  className="tw-flex tw-h-10 tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-text-gray-900 tw-ring-offset-white file:tw-border-0 file:tw-bg-transparent file:tw-text-sm file:tw-font-medium placeholder:tw-text-slate-500 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {state.errors?.categoryId && (
                  <p className="tw-text-sm tw-text-red-500">{state.errors.categoryId.join(', ')}</p>
                )}
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={(state?.inputs?.description ?? product?.description) || ''}
                  className="tw-flex tw-min-h-[100px] tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-text-gray-900 tw-ring-offset-white placeholder:tw-text-slate-500 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  placeholder="Product description..."
                />
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="freshnessNotes">Freshness Notes</Label>
                <textarea
                  id="freshnessNotes"
                  name="freshnessNotes"
                  defaultValue={(state?.inputs?.freshnessNotes ?? product?.freshnessNotes) || ''}
                  className="tw-flex tw-min-h-[80px] tw-w-full tw-rounded-md tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-2 tw-text-sm tw-text-gray-900 tw-ring-offset-white placeholder:tw-text-slate-500 focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-slate-950 focus-visible:tw-ring-offset-2 disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
                  placeholder="e.g. Freshly cut today..."
                />
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="cutTypes">Cut Types (Comma separated)</Label>
                <Input
                  id="cutTypes"
                  name="cutTypes"
                  defaultValue={(state?.inputs?.cutTypes ?? product?.cutTypes) || ''}
                  placeholder="e.g. Curry Cut, Boneless, Biryani Cut"
                />
              </div>

              <div className="tw-space-y-2">
                <Label htmlFor="freshnessDate">Freshness Date</Label>
                <Input
                  id="freshnessDate"
                  name="freshnessDate"
                  type="date"
                  defaultValue={state?.inputs?.freshnessDate ?? (product?.freshnessDate ? new Date(product.freshnessDate).toISOString().split('T')[0] : '')}
                />
              </div>
            </div>
          </div>

          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Inventory & Status</h3>
            <div className="tw-space-y-4">
              <div className="tw-space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  defaultValue={(state?.inputs?.stockQuantity ?? product?.stockQuantity) ?? 100}
                  required
                />
              </div>

              <div className="tw-flex tw-items-center tw-space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={state?.inputs?.isActive ?? product?.isActive ?? true}
                  className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-primary focus:tw-ring-primary"
                />
                <Label htmlFor="isActive">Active (Visible to customers)</Label>
              </div>

              <div className="tw-flex tw-items-center tw-space-x-2">
                <input
                  type="checkbox"
                  id="isBestSeller"
                  name="isBestSeller"
                  defaultChecked={state?.inputs?.isBestSeller ?? (product as any)?.isBestSeller ?? false}
                  className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-primary focus:tw-ring-primary"
                />
                <Label htmlFor="isBestSeller">Best Seller (Show on homepage)</Label>
              </div>
            </div>
          </div>

          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Availability</h3>
            <input type="hidden" name="locationIds" value={JSON.stringify(selectedLocationIds)} />
            <div className="tw-space-y-2">
              <Label>Locations</Label>
              <div className="tw-grid tw-grid-cols-2 tw-gap-2">
                {locations.map((loc) => (
                  <div key={loc.id} className="tw-flex tw-items-center tw-space-x-2">
                    <input
                      type="checkbox"
                      id={`loc-${loc.id}`}
                      checked={selectedLocationIds.includes(loc.id)}
                      onChange={() => handleLocationToggle(loc.id)}
                      className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-primary focus:tw-ring-primary"
                    />
                    <Label htmlFor={`loc-${loc.id}`} className="tw-font-normal tw-cursor-pointer">
                      {loc.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Images & Variations */}
        <div className="tw-space-y-6">
          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Product Images</h3>

            <input type="hidden" name="images" value={JSON.stringify(images)} />

            <div className="tw-space-y-4">
              <div className="tw-flex tw-gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="tw-flex-1"
                />
                <Button type="button" onClick={handleAddImage} variant="secondary">
                  <Plus size={16} />
                </Button>
              </div>

              <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="tw-relative tw-aspect-square tw-rounded-lg tw-border tw-border-gray-200 tw-overflow-hidden tw-group">
                    <img src={img.imageUrl} alt={`Product ${idx}`} className="tw-w-full tw-h-full tw-object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="tw-absolute tw-top-1 tw-right-1 tw-bg-red-500 tw-text-white tw-rounded-full tw-p-1 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {img.isPrimary && (
                      <span className="tw-absolute tw-bottom-1 tw-left-1 tw-bg-primary tw-text-white tw-text-[10px] tw-px-2 tw-py-0.5 tw-rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {state.errors?.images && (
                <p className="tw-text-sm tw-text-red-500">{state.errors.images.join(', ')}</p>
              )}
            </div>
          </div>

          <div className="tw-bg-white tw-p-6 tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Weights & Pricing</h3>

            <input type="hidden" name="weights" value={JSON.stringify(weights)} />

            <div className="tw-space-y-4">
              <div className="tw-grid tw-grid-cols-3 tw-gap-2">
                <Input
                  value={newWeight.weight}
                  onChange={(e) => setNewWeight({ ...newWeight, weight: e.target.value })}
                  placeholder="Weight (e.g. 500g)"
                />
                <Input
                  value={newWeight.price}
                  onChange={(e) => setNewWeight({ ...newWeight, price: e.target.value })}
                  placeholder="Price"
                  type="number"
                />
                <Input
                  value={newWeight.discountPrice}
                  onChange={(e) => setNewWeight({ ...newWeight, discountPrice: e.target.value })}
                  placeholder="Sale Price (opt)"
                  type="number"
                />
              </div>
              <Button type="button" onClick={handleAddWeight} className="tw-w-full" variant="secondary">
                <Plus size={16} className="tw-mr-2" /> Add Variation
              </Button>

              <div className="tw-space-y-2">
                {weights.map((w, idx) => (
                  <div key={idx} className="tw-flex tw-items-center tw-justify-between tw-p-3 tw-bg-gray-50 tw-rounded-lg tw-border tw-border-gray-200">
                    <div>
                      <span className="tw-font-medium">{w.weight}</span>
                      <div className="tw-text-sm tw-text-gray-500">
                        ₹{w.price}
                        {w.discountPrice && <span className="tw-ml-2 tw-text-green-600">Sale: ₹{w.discountPrice}</span>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWeight(idx)}
                      className="tw-text-gray-400 hover:tw-text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {state.errors?.weights && (
                <p className="tw-text-sm tw-text-red-500">{state.errors.weights.join(', ')}</p>
              )}
            </div>
          </div>
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
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>

      {state.message && (
        <p className="tw-text-red-500 tw-text-center">{state.message}</p>
      )}
    </form>
  )
}
