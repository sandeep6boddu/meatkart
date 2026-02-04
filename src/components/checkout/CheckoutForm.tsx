'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { Loader2 } from 'lucide-react'

type CheckoutFormProps = {
    user?: {
        name: string
        email: string | null
        phone: string
        addresses: Array<{
            street: string | null
            city: string | null
            pincode: string | null
            isDefault: boolean
        }>
    } | null
}

export function CheckoutForm({ user }: CheckoutFormProps) {
    const router = useRouter()
    const items = useCartStore((s) => s.items)
    const getTotal = useCartStore((s) => s.getTotal)
    const clearCart = useCartStore((s) => s.clearCart)

    const defaultAddress = user?.addresses.find(a => a.isDefault) || user?.addresses[0]

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: defaultAddress?.street || '',
        city: defaultAddress?.city || '',
        pincode: defaultAddress?.pincode || '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const inputStyle = {
        height: '45px',
        borderRadius: '0',
        border: '1px solid #e5e5e5',
        boxShadow: 'none',
        fontFamily: 'noto_sansregular',
        fontSize: '14px'
    }

    const labelStyle = {
        fontFamily: 'noto_sansbold',
        color: '#666',
        fontSize: '13px',
        marginBottom: '8px',
        fontWeight: 'normal',
        textTransform: 'uppercase'
    }

    const sectionHeaderStyle = {
        fontFamily: 'noto_sansbold',
        color: '#f25648',
        fontSize: '18px',
        marginBottom: '20px',
        borderBottom: '1px solid #ececec',
        paddingBottom: '10px'
    }

    if (items.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', marginBottom: '15px' }}>Your cart is empty</h2>
                <p style={{ fontFamily: 'noto_sansregular', color: '#999', marginBottom: '25px' }}>Add items to cart before checkout.</p>
                <Link href="/" style={{
                    background: '#f25648',
                    color: '#fff',
                    padding: '10px 25px',
                    textDecoration: 'none',
                    fontFamily: 'noto_sansbold',
                    textTransform: 'uppercase'
                }}>
                    Continue Shopping
                </Link>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    totalAmount: getTotal(),
                    customer: formData
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Checkout failed')
            }

            const data = await res.json()
            clearCart()
            router.push(`/checkout/success?orderId=${data.orderId}`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <div className="breadcrumps-bg">
                <div className="container">
                    <ol className="breadcrumb">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/cart">Cart</Link></li>
                        <li className="active">Checkout</li>
                    </ol>
                </div>
            </div>

            <section className="mutton-section">
                <div className="container">
                    <div className="row">
                        {/* Checkout Form */}
                        <div className="col-md-7">
                            <div className="mutton-content" style={{ background: '#fff', padding: '30px', marginBottom: '30px', border: '1px solid #ececec' }}>
                                <h3 style={sectionHeaderStyle}>SHIPPING DETAILS</h3>

                                <form onSubmit={handleSubmit}>
                                    {error && <div className="alert alert-danger" style={{ borderRadius: 0 }}>{error}</div>}

                                    <div className="form-group">
                                        <label style={labelStyle}>FULL NAME *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Enter full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={labelStyle}>EMAIL ADDRESS (Optional)</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Enter email address"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={labelStyle}>PHONE NUMBER *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={inputStyle}
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={labelStyle}>ADDRESS *</label>
                                        <textarea
                                            className="form-control"
                                            name="address"
                                            required
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{ ...inputStyle, height: 'auto', padding: '10px' }}
                                            placeholder="Enter full address"
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label style={labelStyle}>CITY *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    style={inputStyle}
                                                    placeholder="City"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label style={labelStyle}>PINCODE *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="pincode"
                                                    required
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    style={inputStyle}
                                                    placeholder="Pincode"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-block"
                                        disabled={isSubmitting}
                                        style={{
                                            background: '#f25648',
                                            color: '#fff',
                                            borderRadius: 0,
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontFamily: 'noto_sansbold',
                                            textTransform: 'uppercase',
                                            marginTop: '20px',
                                            border: 'none'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <Loader2 className="animate-spin" size={18} /> PROCESSING...
                                            </span>
                                        ) : 'PLACE ORDER (COD)'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="col-md-5">
                            <div className="mutton-content" style={{ background: '#fff', padding: '30px', border: '1px solid #ececec' }}>
                                <h3 style={sectionHeaderStyle}>ORDER SUMMARY</h3>

                                <div style={{ marginBottom: '20px' }}>
                                    {items.map((item) => (
                                        <div key={`${item.productId}-${item.weightId}`} style={{
                                            padding: '15px 0',
                                            borderBottom: '1px solid #f5f5f5',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div>
                                                <p style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#555' }}>{item.name}</p>
                                                <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>{item.weight} x {item.quantity}</p>
                                            </div>
                                            <span style={{ fontFamily: 'noto_sansbold', color: '#333' }}>&#8377; {item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: '#f9f9f9', padding: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontFamily: 'noto_sansregular', color: '#666' }}>Subtotal</span>
                                        <span style={{ fontFamily: 'noto_sansbold', color: '#333' }}>&#8377; {getTotal()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <span style={{ fontFamily: 'noto_sansregular', color: '#666' }}>Delivery Chaarges</span>
                                        <span style={{ fontFamily: 'noto_sansbold', color: '#3c763d' }}>FREE</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                                        <span style={{ fontFamily: 'noto_sansbold', color: '#333', fontSize: '16px' }}>TOTAL</span>
                                        <span style={{ fontFamily: 'noto_sansbold', color: '#f25648', fontSize: '20px' }}>&#8377; {getTotal()}</span>
                                    </div>
                                </div>

                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '12px', color: '#999' }}>
                                        <span style={{ color: '#f25648' }}>*</span> Cash on Delivery available
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
