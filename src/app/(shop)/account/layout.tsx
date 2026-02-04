import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AccountSidebar } from '@/components/account/AccountSidebar'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <>
      <div className="breadcrumps-bg">
        <div className="container">
          <ol className="breadcrumb">
            <li><Link href="/">Home</Link></li>
            <li className="active">My Account</li>
          </ol>
        </div>
      </div>

      <section className="mutton-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar />
            </div>
            <div className="col-md-9">
              {children}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
