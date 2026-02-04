'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

interface SimpleLoginFormProps {
  onSuccess?: () => void;
}

export function SimpleLoginForm({ onSuccess }: SimpleLoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const message = searchParams.get('message')

  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (e: any) {
      setErrorMsg(e?.message || 'Supabase configuration missing')
      return null
    }
  }, [])

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  })

  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setLoading(true)
    setErrorMsg('')
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Successfully logged in')
      if (onSuccess) {
        onSuccess()
      } else {
        router.push(redirect)
        router.refresh()
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Custom styles to match homepage
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

            <div className="text-center" style={{ marginBottom: '30px' }}>
              <img src="/images/logo.png" alt="MeatKart" style={{ height: '60px' }} />
            </div>

            <h3 className="text-center" style={headerStyle}>Sign In</h3>
            <p className="text-center" style={subHeaderStyle}>Use your email and password to access your account.</p>

            {message && (
              <div className="alert alert-info" style={{ borderRadius: 0 }}>
                {message}
              </div>
            )}

            {errorMsg && (
              <div className="alert alert-danger" style={{ borderRadius: 0 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <div className="form-group">
                <label htmlFor="email" style={labelStyle}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  style={inputStyle}
                  {...emailForm.register('email')}
                  disabled={loading}
                />
                {emailForm.formState.errors.email && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" style={labelStyle}>Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  style={inputStyle}
                  {...emailForm.register('password')}
                  disabled={loading}
                />
                {emailForm.formState.errors.password && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {emailForm.formState.errors.password.message}
                  </p>
                )}

                <div className="text-right" style={{ marginTop: '-10px', marginBottom: '20px' }}>
                  <Link href="/auth/forgot-password" style={{ color: '#f25648', fontSize: '14px', fontFamily: 'noto_sansregular', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button type="submit" className="btn btn-default" style={buttonStyle} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center" style={{ marginTop: '30px' }}>
                <p style={{ color: '#666', fontSize: '15px' }}>
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" style={{ color: '#f25648', fontWeight: 'bold' }}>
                    Create an account
                  </Link>
                </p>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

