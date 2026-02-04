'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
            })

            if (error) {
                toast.error(error.message)
            } else {
                setSuccess(true)
                toast.success('Password reset email sent')
            }
        } catch (error: any) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // Custom styles to match homepage & login/signup pages
    const headerStyle = {
        fontFamily: 'noto_sansbold',
        color: '#666666',
        fontSize: '30px',
        marginBottom: '20px',
        textTransform: 'uppercase' as const
    }

    const subHeaderStyle = {
        fontFamily: 'noto_sansregular',
        color: '#999',
        fontSize: '16px',
        marginBottom: '30px'
    }

    const inputStyle = {
        height: '50px',
        fontSize: '16px',
        borderRadius: '0',
        border: '1px solid #e5e5e5',
        boxShadow: 'none',
        marginBottom: '20px',
        fontFamily: 'noto_sansregular'
    }

    const labelStyle = {
        fontFamily: 'noto_sansbold',
        color: '#666666',
        fontSize: '14px',
        marginBottom: '10px',
        fontWeight: 'normal' as const
    }

    const buttonStyle = {
        background: '#f25648',
        color: '#fff',
        border: 'none',
        borderRadius: '0',
        fontSize: '18px',
        fontWeight: 'bold' as const,
        textTransform: 'uppercase' as const,
        padding: '12px',
        width: '100%',
        fontFamily: 'noto_sansbold',
        marginTop: '10px'
    }

    return (
        <div className="container" style={{ marginTop: '80px', marginBottom: '100px' }}>
            <div className="row">
                {/* Centered Column */}
                <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
                    <div style={{ padding: '40px', background: '#fff', border: '1px solid #e5e5e5' }}>

                        <div style={{ marginBottom: '20px' }}>
                            <Link href="/auth/login" style={{ color: '#999', textDecoration: 'none', fontSize: '14px', fontFamily: 'noto_sansregular' }}>
                                &larr; Back to Login
                            </Link>
                        </div>

                        <div className="text-center" style={{ marginBottom: '30px' }}>
                            <img src="/images/logo.png" alt="MeatKart" style={{ height: '60px' }} />
                        </div>

                        <h3 className="text-center" style={headerStyle}>Reset Password</h3>

                        {!success ? (
                            <>
                                <p className="text-center" style={subHeaderStyle}>
                                    Enter your email address and we&apos;ll send you a link to reset your password.
                                </p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email" style={labelStyle}>Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={inputStyle}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-default" style={buttonStyle} disabled={loading}>
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="alert alert-success" style={{ borderRadius: 0, fontFamily: 'noto_sansregular' }}>
                                    Check your email! We&apos;ve sent you a password reset link.
                                </div>
                                <p style={{ color: '#999', fontSize: '14px', fontFamily: 'noto_sansregular', margin: '20px 0' }}>
                                    Did not receive the email? Check your spam folder or try again.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="btn btn-default"
                                    style={{ ...buttonStyle, background: 'transparent', color: '#666', border: '1px solid #ccc', fontSize: '14px' }}
                                >
                                    Try again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

