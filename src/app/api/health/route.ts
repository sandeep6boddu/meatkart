import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const url = process.env.DATABASE_URL || ''
    const parsed = (() => {
      try {
        const u = new URL(url)
        const username = u.username
        const host = u.hostname
        const port = u.port
        const database = u.pathname.slice(1)
        return { username, host, port, database }
      } catch {
        return { username: '', host: '', port: '', database: '' }
      }
    })()
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, env: { hasDatabaseUrl: !!url, ...parsed } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 })
  }
}

