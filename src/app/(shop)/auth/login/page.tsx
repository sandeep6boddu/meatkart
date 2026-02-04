import { Suspense } from 'react'
import { SimpleLoginForm } from '@/components/auth/SimpleLoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen">Loading...</div>}>
      <SimpleLoginForm />
    </Suspense>
  )
}
