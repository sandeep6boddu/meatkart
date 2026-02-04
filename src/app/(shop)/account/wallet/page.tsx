import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Wallet, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react'

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser?.email) return null

  const user = await prisma.user.findFirst({
    where: { email: authUser.email },
    include: {
      wallet: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      }
    }
  })

  const balance = user?.wallet?.balance || 0
  const transactions = user?.wallet?.transactions || []

  return (
    <div className="account-wallet">
      <h2 style={{ fontFamily: 'noto_sansbold', color: '#666', fontSize: '24px', margin: '0 0 25px 0', textTransform: 'uppercase' }}>
        My Wallet
      </h2>

      <div className="row">
        {/* Balance Card */}
        <div className="col-md-4" style={{ marginBottom: '30px' }}>
          <div style={{ background: '#f25648', color: '#fff', padding: '30px', position: 'relative', overflow: 'hidden' }}>
            <Wallet size={48} style={{ position: 'absolute', bottom: '-10px', right: '-10px', opacity: 0.2, transform: 'rotate(-15deg)' }} />
            <p style={{ margin: 0, fontSize: '13px', textTransform: 'uppercase', opacity: 0.9 }}>Available Balance</p>
            <h3 style={{ margin: '10px 0', fontSize: '32px', fontFamily: 'noto_sansbold' }}>₹{Number(balance).toFixed(2)}</h3>
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', opacity: 0.8 }}>
              Use this balance for your next purchase.
            </div>
          </div>
        </div>

        {/* History Card */}
        <div className="col-md-8">
          <div style={{ border: '1px solid #eee', background: '#fff' }}>
            <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fcfcfc' }}>
              <h4 style={{ margin: 0, fontFamily: 'noto_sansbold', color: '#666', fontSize: '16px' }}>
                <History size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                TRANSACTION HISTORY
              </h4>
            </div>
            <div style={{ padding: '20px' }}>
              {transactions.length === 0 ? (
                <div className="text-center" style={{ padding: '40px 0', color: '#999' }}>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {transactions.map((tx) => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: tx.type === 'credit' ? '#e9f5e9' : '#f9eded',
                          color: tx.type === 'credit' ? '#3fb73f' : '#f25648',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                        </div>
                        <div>
                          <p style={{ margin: 0, color: '#555', fontSize: '14px', fontWeight: 'bold' }}>{tx.description || 'Transaction'}</p>
                          <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '15px', color: tx.type === 'credit' ? '#3fb73f' : '#333' }}>
                        {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
