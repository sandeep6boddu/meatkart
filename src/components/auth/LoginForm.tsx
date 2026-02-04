'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number is too long'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
})

export function LoginForm() {
  const [step, setStep] = useState<'phone' | 'otp' | 'register' | 'email'>('phone')
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
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

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
  })

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  })

  async function onPhoneSubmit(data: z.infer<typeof phoneSchema>) {
    setLoading(true)
    setErrorMsg('')
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const formattedPhone = data.phone.startsWith('+') ? data.phone : `+91${data.phone}`
      setPhoneNumber(formattedPhone)

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })

      if (error) {
        setErrorMsg(error.message)
        toast.error(error.message)
        return
      }

      toast.success('OTP sent to your mobile number')
      setStep('otp')
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
    setLoading(true)
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { error, data: authData } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: data.otp,
        type: 'sms',
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (!authData.user) {
        toast.error('Authentication failed')
        return
      }

      // Check if user exists in our database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
        console.error('Error fetching user:', userError)
        // Proceed to register if error is just "not found", otherwise handle? 
        // For safety, if error is distinct from "not found", we might want to alert.
        // But usually RLS or just missing row returns null or error. 
      }

      if (!userData) {
        // New user - redirect to registration step
        setStep('register')
      } else {
        // Existing user - login success
        toast.success('Successfully logged in')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('OTP Submit Error:', error)
      toast.error('Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

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
      const { data: userInfo } = await supabase.auth.getUser()
      const authUser = userInfo?.user
      if (!authUser) {
        toast.error('Authentication failed')
        return
      }
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error fetching user:', userError)
      }
      if (!userData) {
        setStep('register')
      } else {
        toast.success('Successfully logged in')
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong')
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function onRegisterSubmit(data: z.infer<typeof registerSchema>) {
    setLoading(true)
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Authentication error: No session found')
        return
      }

      let finalPhone = phoneNumber
      if (!finalPhone) {
        if (!data.phone || data.phone.length < 10) {
          toast.error('Enter a valid phone number')
          return
        }
        finalPhone = data.phone.startsWith('+') ? data.phone : `+91${data.phone}`
        setPhoneNumber(finalPhone)
      }

      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          phone: finalPhone,
          name: data.name,
          email: data.email || null,
          role: 'customer'
        })

      if (error) {
        console.error('Registration Error:', error)
        toast.error(error.message)
        return
      }

      toast.success('Account created successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Registration Exception:', error)
      toast.error('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  async function handleSocialLogin(provider: 'google' | 'facebook') {
    setLoading(true)
    try {
      if (!supabase) {
        toast.error('Supabase configuration missing')
        return
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error('Failed to initiate social login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tw-bg-white tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden tw-max-w-4xl tw-w-full tw-flex tw-flex-col md:tw-flex-row tw-border tw-border-gray-100">
      {/* Left Side - Brand/Image Area */}
      <div className="tw-bg-primary tw-p-8 md:tw-p-12 tw-flex tw-flex-col tw-justify-between tw-text-white md:tw-w-5/12 tw-bg-[url('/images/pattern.png')] tw-bg-cover tw-bg-center tw-relative">
        <div className="tw-relative tw-z-10">
          <img src="/images/logo.png" alt="MeatKart" className="tw-h-12 tw-w-auto tw-brightness-0 tw-invert tw-mb-8" />
          <h2 className="tw-text-3xl tw-font-bold tw-mb-4">Fresh Meat,<br />Delivered.</h2>
          <p className="tw-text-white/80 tw-text-lg">Experience the premium quality meat delivered straight to your doorstep.</p>
        </div>
        <div className="tw-relative tw-z-10 tw-mt-12 tw-hidden md:tw-block">
          <p className="tw-text-sm tw-text-white/60">© 2024 MeatKart</p>
        </div>
        {/* Overlay for better text readability if image is used */}
        <div className="tw-absolute tw-inset-0 tw-bg-primary/90 tw-z-0"></div>
      </div>

      {/* Right Side - Form Area */}
      <div className="tw-p-8 md:tw-p-12 tw-flex-1 tw-flex tw-flex-col tw-justify-center">
        <div className="tw-max-w-sm tw-mx-auto tw-w-full">
          <h3 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">
            {step === 'phone' && 'Get Started'}
            {step === 'email' && 'Sign In'}
            {step === 'otp' && 'Verify Mobile'}
            {step === 'register' && 'Finish Setup'}
          </h3>
          <p className="tw-text-gray-500 tw-mb-8">
            {step === 'phone' && 'Enter your mobile number to sign in or create an account.'}
            {step === 'email' && 'Enter your email and password to sign in.'}
            {step === 'otp' && `We've sent a code to ${phoneNumber}. Please enter it below.`}
            {step === 'register' && 'Almost there! Just a few more details to create your account.'}
          </p>

          {errorMsg && (
            <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-text-red-600 tw-px-4 tw-py-3 tw-rounded-lg tw-mb-6 tw-text-sm">
              {errorMsg}
            </div>
          )}

          {step === 'phone' && (
            <div className="tw-space-y-6">
              <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="tw-space-y-4">
                <div className="tw-space-y-1.5">
                  <Label htmlFor="phone" className="tw-text-sm tw-font-medium tw-text-gray-700">Mobile Number</Label>
                  <div className="tw-flex tw-relative">
                    <div className="tw-flex tw-items-center tw-justify-center tw-absolute tw-left-0 tw-top-0 tw-bottom-0 tw-w-12 tw-bg-gray-50 tw-text-gray-500 tw-border-r tw-border-gray-200 tw-rounded-l-lg tw-z-10">
                      <span className="tw-text-sm">+91</span>
                    </div>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      type="tel"
                      className="tw-pl-14 tw-h-14 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all tw-text-lg"
                      {...phoneForm.register('phone')}
                      disabled={loading}
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="tw-text-xs tw-text-red-500 tw-mt-1">{phoneForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <Button type="submit" className="tw-w-full tw-h-14 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-font-semibold tw-rounded-lg tw-shadow-lg tw-shadow-primary/30 tw-transition-all hover:tw-translate-y-[-1px] tw-text-lg" disabled={loading}>
                  {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : <>Continue <ArrowRight className="tw-ml-2 tw-h-5 tw-w-5" /></>}
                </Button>
              </form>

              <div className="tw-relative">
                <div className="tw-absolute tw-inset-0 tw-flex tw-items-center">
                  <span className="tw-w-full tw-border-t tw-border-gray-100" />
                </div>
                <div className="tw-relative tw-flex tw-justify-center tw-text-xs tw-uppercase">
                  <span className="tw-bg-white tw-px-3 tw-text-gray-400 tw-font-medium">Or continue with</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="tw-flex tw-items-center tw-justify-center tw-h-11 tw-px-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-white tw-text-gray-600 tw-font-medium tw-text-sm hover:tw-bg-gray-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                >
                  <svg className="tw-mr-2 tw-h-5 tw-w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading}
                  className="tw-flex tw-items-center tw-justify-center tw-h-11 tw-px-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-white tw-text-gray-600 tw-font-medium tw-text-sm hover:tw-bg-gray-50 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                >
                  <svg className="tw-mr-2 tw-h-5 tw-w-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.747-2.971 2.54v1.422h3.326l-.342 3.667h-2.984v7.98h-5.843z" />
                  </svg>
                  Facebook
                </button>
              </div>
              <div className="tw-text-center">
                <button
                  type="button"
                  className="tw-text-sm tw-text-gray-500 tw-hover:text-primary tw-font-medium tw-transition-colors"
                  onClick={() => setStep('email')}
                  disabled={loading}
                >
                  Use email/password instead
                </button>
              </div>
            </div>
          )}

          {step === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="tw-space-y-6">
              <div className="tw-space-y-1.5">
                <Label htmlFor="email" className="tw-text-sm tw-font-medium tw-text-gray-700">Email</Label>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                  {...emailForm.register('email')}
                  disabled={loading}
                />
                {emailForm.formState.errors.email && (
                  <p className="tw-text-xs tw-text-red-500 tw-mt-1">{emailForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="tw-space-y-1.5">
                <Label htmlFor="password" className="tw-text-sm tw-font-medium tw-text-gray-700">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                  {...emailForm.register('password')}
                  disabled={loading}
                />
                {emailForm.formState.errors.password && (
                  <p className="tw-text-xs tw-text-red-500 tw-mt-1">{emailForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-font-semibold tw-rounded-lg tw-shadow-lg tw-shadow-primary/30 tw-transition-all hover:tw-translate-y-[-1px]" disabled={loading}>
                {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : 'Sign In'}
              </Button>
              <div className="tw-text-center">
                <button
                  type="button"
                  className="tw-text-sm tw-text-gray-500 tw-hover:text-primary tw-font-medium tw-transition-colors"
                  onClick={() => setStep('phone')}
                  disabled={loading}
                >
                  Use phone OTP instead
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="tw-space-y-6">
              <div className="tw-space-y-1.5">
                <Label htmlFor="otp" className="tw-text-sm tw-font-medium tw-text-gray-700">One-Time Password</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  type="text"
                  maxLength={6}
                  className="tw-h-14 tw-text-center tw-text-2xl tw-tracking-[0.5em] tw-font-bold tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                  {...otpForm.register('otp')}
                  disabled={loading}
                />
                {otpForm.formState.errors.otp && (
                  <p className="tw-text-xs tw-text-red-500 tw-mt-1">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>
              <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-font-semibold tw-rounded-lg tw-shadow-lg tw-shadow-primary/30 tw-transition-all hover:tw-translate-y-[-1px]" disabled={loading}>
                {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : 'Verify Code'}
              </Button>
              <div className="tw-text-center">
                <button
                  type="button"
                  className="tw-text-sm tw-text-gray-500 tw-hover:text-primary tw-font-medium tw-transition-colors"
                  onClick={() => setStep('phone')}
                  disabled={loading}
                >
                  Change phone number
                </button>
              </div>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="tw-space-y-4">
              <div className="tw-space-y-1.5">
                <Label htmlFor="name" className="tw-text-sm tw-font-medium tw-text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                  {...registerForm.register('name')}
                  disabled={loading}
                />
                {registerForm.formState.errors.name && (
                  <p className="tw-text-xs tw-text-red-500 tw-mt-1">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              {!phoneNumber && (
                <div className="tw-space-y-1.5">
                  <Label htmlFor="phone" className="tw-text-sm tw-font-medium tw-text-gray-700">Mobile Number</Label>
                  <div className="tw-flex tw-relative">
                    <div className="tw-flex tw-items-center tw-justify-center tw-absolute tw-left-0 tw-top-0 tw-bottom-0 tw-w-12 tw-bg-gray-50 tw-text-gray-500 tw-border-r tw-border-gray-200 tw-rounded-l-lg tw-z-10">
                      <span className="tw-text-sm">+91</span>
                    </div>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      type="tel"
                      className="tw-pl-14 tw-h-12 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                      {...registerForm.register('phone')}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="tw-space-y-1.5">
                <Label htmlFor="email" className="tw-text-sm tw-font-medium tw-text-gray-700">Email Address (Optional)</Label>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  type="email"
                  className="tw-h-12 tw-bg-gray-50 tw-border-gray-200 tw-focus:ring-2 tw-focus:ring-primary/20 tw-focus:border-primary tw-rounded-lg tw-transition-all"
                  {...registerForm.register('email')}
                  disabled={loading}
                />
                {registerForm.formState.errors.email && (
                  <p className="tw-text-xs tw-text-red-500 tw-mt-1">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="tw-w-full tw-h-12 tw-bg-primary tw-hover:bg-red-700 tw-text-white tw-font-semibold tw-rounded-lg tw-shadow-lg tw-shadow-primary/30 tw-transition-all hover:tw-translate-y-[-1px] tw-mt-2" disabled={loading}>
                {loading ? <Loader2 className="tw-mr-2 tw-h-5 tw-w-5 tw-animate-spin" /> : 'Create Account'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
