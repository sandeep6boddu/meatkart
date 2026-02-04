'use client'

import { useState } from 'react'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { toast } from 'sonner'
import { removeItemFromPlatter, deletePlatter, renamePlatter } from '@/app/actions/platter'
import Link from 'next/link'

interface PlatterItem {
    id: string
    productId: string
    weightId: string
    quantity: number
    product: {
        name: string
        productImages: { imageUrl: string }[]
    }
    productWeight: {
        weight: string
        price: number
    }
}

interface Platter {
    id: string
    name: string
    items: PlatterItem[]
}

export default function PlatterClient({ initialPlatters, userId }: { initialPlatters: any[], userId: string }) {
    const [platters, setPlatters] = useState<Platter[]>(initialPlatters)
    const addItemToCart = useCartStore((state) => state.addItem)

    const handleAddPlatterToCart = (platter: Platter) => {
        if (platter.items.length === 0) {
            toast.error('Platter is empty')
            return
        }

        platter.items.forEach(item => {
            addItemToCart({
                productId: item.productId,
                name: item.product.name,
                price: Number(item.productWeight.price),
                quantity: item.quantity,
                imageUrl: item.product.productImages[0]?.imageUrl || '',
                weight: item.productWeight.weight,
                weightId: item.weightId
            })
        })

        toast.success(`${platter.name} added to cart!`)
    }

    const handleRemoveItem = async (itemId: string, platterId: string) => {
        const res = await removeItemFromPlatter(itemId)
        if (res.success) {
            setPlatters(prev => prev.map(p => {
                if (p.id === platterId) {
                    return { ...p, items: p.items.filter(i => i.id !== itemId) }
                }
                return p
            }))
            toast.success('Item removed')
        }
    }

    const handleDeletePlatter = async (platterId: string) => {
        if (!confirm('Are you sure you want to delete this platter?')) return

        const res = await deletePlatter(platterId)
        if (res.success) {
            setPlatters(prev => prev.filter(p => p.id !== platterId))
            toast.success('Platter deleted')
        }
    }

    if (platters.length === 0) {
        return (
            <div className="tw-bg-white tw-rounded-xl tw-p-20 tw-text-center tw-shadow-sm">
                <div className="tw-flex tw-justify-center tw-mb-6">
                    <div className="tw-w-32 tw-h-32 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                        <ShoppingBag size={64} className="tw-text-gray-300" />
                    </div>
                </div>
                <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-mb-2">Your platter is empty</h2>
                <p className="tw-text-gray-500 tw-mb-8">Build your weekly meat template for faster checkouts!</p>
                <Link
                    href="/search"
                    className="tw-inline-block tw-bg-teal tw-text-white tw-px-8 tw-py-3 tw-rounded-lg tw-font-bold tw-uppercase hover:tw-bg-teal-hover tw-transition-colors"
                >
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="tw-space-y-10">
            {platters.map((platter) => (
                <div key={platter.id} className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-overflow-hidden">
                    <div className="tw-bg-teal tw-px-6 tw-py-4 tw-flex tw-justify-between tw-items-center">
                        <h3 className="tw-text-white tw-font-bold tw-text-xl">{platter.name}</h3>
                        <div className="tw-flex tw-gap-4">
                            <button
                                onClick={() => handleDeletePlatter(platter.id)}
                                className="tw-text-white/80 hover:tw-text-white tw-transition-colors"
                                title="Delete Platter"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="tw-p-6">
                        {platter.items.length === 0 ? (
                            <p className="tw-text-gray-500 tw-text-center tw-py-8">No items in this platter yet.</p>
                        ) : (
                            <div className="tw-divide-y tw-divide-gray-100">
                                {platter.items.map((item) => (
                                    <div key={item.id} className="tw-py-4 tw-flex tw-items-center tw-justify-between">
                                        <div className="tw-flex tw-items-center tw-gap-4">
                                            <div className="tw-w-16 tw-h-16 tw-bg-gray-100 tw-rounded-lg tw-overflow-hidden">
                                                <img
                                                    src={item.product.productImages[0]?.imageUrl}
                                                    alt={item.product.name}
                                                    className="tw-w-full tw-h-full tw-object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="tw-font-bold tw-text-gray-800">{item.product.name}</h4>
                                                <p className="tw-text-sm tw-text-gray-500">{item.productWeight.weight} • ₹{item.productWeight.price}</p>
                                            </div>
                                        </div>

                                        <div className="tw-flex tw-items-center tw-gap-6">
                                            <div className="tw-flex tw-items-center tw-bg-gray-50 tw-rounded-lg tw-px-3 tw-py-1">
                                                <span className="tw-text-gray-600 tw-font-medium">Qty: {item.quantity}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id, platter.id)}
                                                className="tw-text-gray-400 hover:tw-text-red-500 tw-transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="tw-bg-gray-50 tw-px-6 tw-py-6 tw-flex tw-justify-between tw-items-center">
                        <div>
                            <p className="tw-text-sm tw-text-gray-500">Total Potential Price</p>
                            <p className="tw-text-2xl tw-font-bold tw-text-orange-cta">
                                ₹ {platter.items.reduce((acc, item) => acc + (Number(item.productWeight.price) * item.quantity), 0)}
                            </p>
                        </div>
                        <button
                            onClick={() => handleAddPlatterToCart(platter)}
                            className="tw-bg-orange-cta tw-text-white tw-px-8 tw-py-4 tw-rounded-lg tw-font-bold tw-uppercase hover:tw-bg-orange-cta-hover tw-transition-all tw-flex tw-items-center tw-gap-3 tw-shadow-md active:tw-scale-95"
                        >
                            <Utensils size={20} />
                            Add Entire Platter to Cart
                        </button>
                    </div>
                </div>
            ))}

            <div className="tw-flex tw-justify-center tw-pt-4">
                <Link
                    href="/search"
                    className="tw-text-teal tw-font-semibold hover:tw-underline tw-flex tw-items-center tw-gap-2"
                >
                    <Plus size={18} /> Add more items to your platter from store
                </Link>
            </div>
        </div>
    )
}

function Utensils(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
    )
}
