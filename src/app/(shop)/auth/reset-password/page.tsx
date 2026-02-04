'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })

            if (error) {
                toast.error(error.message)
            } else {
                toast.success('Password updated successfully')
                router.push('/auth/login?message=Password updated successfully. Please login.')
            }
        } catch (error: any) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const headerStyle = {
        fontFamily: 'noto_sansbold',
        fontSize: '24px',
        color: '#333',
        marginBottom: '10px',
        textAlign: 'center' as const,
        textTransform: 'uppercase' as const
    }

    const subHeaderStyle = {
        fontFamily: 'noto_sansregular',
        fontSize: '14px',
        color: '#666',
        marginBottom: '30px',
        textAlign: 'center' as const
    }

    const labelStyle = {
        fontFamily: 'noto_sansbold',
        color: '#333',
        marginBottom: '5px',
        display: 'block',
        fontSize: '14px'
    }

    const inputStyle = {
        height: '45px',
        borderRadius: '0',
        fontSize: '16px',
        background: '#f9f9f9',
        border: '1px solid #ddd',
        boxShadow: 'none',
        padding: '10px'
    }

    const buttonStyle = {
        background: '#f25648',
        color: '#fff',
        border: 'none',
        height: '45px',
        fontSize: '16px',
        fontFamily: 'noto_sansbold',
        textTransform: 'uppercase' as const,
        width: '100%',
        marginTop: '10px',
        borderRadius: '4px',
        transition: 'background 0.3s'
    }

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div style={{ background: '#fff', padding: '40px', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <Link href="/auth/login" style={{ color: '#666', display: 'flex', alignItems: 'center', textDecoration: 'none', fontSize: '14px' }}>
                                    <ArrowLeft size={16} style={{ marginRight: '5px' }} /> Back to Login
                                </Link>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <img src="/images/logo.png" alt="MeatKart" style={{ height: '40px', maxWidth: '100%' }} />
                            </div>

                            <h3 style={headerStyle}>Set New Password</h3>
                            <p style={subHeaderStyle}>Please enter your new password below.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label htmlFor="password" style={labelStyle}>New Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Min 6 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={inputStyle}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Re-enter password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={inputStyle}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={buttonStyle}
                                    disabled={loading}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#d14030'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f25648'}
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} style={{ display: 'inline' }} /> : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

