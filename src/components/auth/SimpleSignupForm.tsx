'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export function SimpleSignupForm() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const supabase = useMemo(() => {
    try {
      return createClient()
    } catch (e: any) {
      setErrorMsg(e?.message || 'Supabase configuration missing')
      return null
    }
  }, [])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    setLoading(true)
    setErrorMsg('')
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: data.name,
            phone: data.phone
          }
        },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Check your email to confirm your account')
      router.push('/auth/login')
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Custom styles to match homepage & login page
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

            <h3 className="text-center" style={headerStyle}>Create Account</h3>
            <p className="text-center" style={subHeaderStyle}>Sign up with your details.</p>

            {errorMsg && (
              <div className="alert alert-danger" style={{ borderRadius: 0 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="name" style={labelStyle}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  style={inputStyle}
                  {...form.register('name')}
                  disabled={loading}
                />
                {form.formState.errors.name && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" style={labelStyle}>Mobile Number</label>
                <input
                  id="phone"
                  type="tel"
                  className="form-control"
                  placeholder="Enter your mobile number"
                  style={inputStyle}
                  {...form.register('phone')}
                  disabled={loading}
                />
                {form.formState.errors.phone && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email" style={labelStyle}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  style={inputStyle}
                  {...form.register('email')}
                  disabled={loading}
                />
                {form.formState.errors.email && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {form.formState.errors.email.message}
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
                  {...form.register('password')}
                  disabled={loading}
                />
                {form.formState.errors.password && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Confirm your password"
                  style={inputStyle}
                  {...form.register('confirmPassword')}
                  disabled={loading}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-danger" style={{ fontSize: '13px', marginTop: '-15px' }}>
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-default" style={buttonStyle} disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              <div className="text-center" style={{ marginTop: '30px' }}>
                <p style={{ color: '#666', fontSize: '15px' }}>
                  Already have an account?{' '}
                  <Link href="/auth/login" style={{ color: '#f25648', fontWeight: 'bold' }}>
                    Sign in
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

