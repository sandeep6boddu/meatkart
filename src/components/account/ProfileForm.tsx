'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from "@/app/actions/user"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'

interface ProfileFormProps {
    user: {
        name: string
        email: string | null
        phone: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await updateProfile(formData)
            if (result.error) {
                if (typeof result.error === 'string') {
                    toast.error(result.error)
                } else {
                    // Check if it's an object of errors
                    const errors = Object.values(result.error).flat().join(', ')
                    toast.error(errors)
                }
            } else if (result.success) {
                toast.success(result.success)
            }
        } catch (e) {
            toast.error('Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

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
        fontWeight: 'normal' as const
    }

    const buttonStyle = {
        background: '#f25648',
        color: '#fff',
        border: 'none',
        borderRadius: '0',
        fontSize: '15px',
        fontWeight: 'bold' as const,
        textTransform: 'uppercase' as const,
        padding: '10px 25px',
        fontFamily: 'noto_sansbold'
    }

    return (
        <form action={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="name" style={labelStyle}>FULL NAME</label>
                        <input
                            id="name"
                            name="name"
                            className="form-control"
                            defaultValue={user.name}
                            placeholder="Enter your name"
                            disabled={loading}
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="email" style={labelStyle}>EMAIL ADDRESS</label>
                        <input
                            id="email"
                            name="email"
                            className="form-control"
                            defaultValue={user.email || ''}
                            readOnly
                            style={{ ...inputStyle, background: '#f9f9f9', color: '#999' }}
                        />
                        <p style={{ color: '#999', fontSize: '11px', marginTop: '5px' }}>Email cannot be changed directly.</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="phone" style={labelStyle}>MOBILE NUMBER</label>
                        <input
                            id="phone"
                            name="phone"
                            className="form-control"
                            defaultValue={user.phone}
                            disabled={loading}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-danger" style={buttonStyle} disabled={loading}>
                    {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </div>
        </form>
    )
}
