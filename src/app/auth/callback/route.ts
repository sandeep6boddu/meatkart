import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Sync user to Prisma DB immediately upon verification
            const { data: { user } } = await supabase.auth.getUser()

            if (user && user.email) {
                try {
                    const prisma = (await import('@/lib/prisma')).default

                    // Check if user already exists
                    const existingUser = await prisma.user.findFirst({
                        where: { email: user.email }
                    })

                    if (!existingUser) {
                        // Only create if not exists
                        // Note: We might not have phone number from generic update
                        // If phone is missing, we try to grab it from metadata or generate a placeholder
                        // because schema says phone is required and unique. 
                        // However, for clean integration, we should try to get it from metadata.

                        const phoneFromMeta = user.user_metadata?.phone || user.phone || ''

                        // If we truly have no phone, we might have an issue with the schema constraint.
                        // But let's attempt to create if we have enough info.
                        if (phoneFromMeta) {
                            await prisma.user.create({
                                data: {
                                    email: user.email,
                                    name: user.user_metadata?.name || 'New User',
                                    phone: phoneFromMeta,
                                    role: 'customer'
                                }
                            })
                        } else {
                            // If no phone, we can't create in Prisma due to constraint.
                            // The user will be created later via the Profile page fallback flow
                            // or Checkout flow which asks for phone number.
                            console.log('User synced skipped in callback due to missing phone number')
                        }
                    }
                } catch (dbError) {
                    console.error('Error syncing user to DB in callback:', dbError)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
