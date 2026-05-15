import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'https://portal.tvarah.com/api/v1'

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  // Strip leading 'v1' segment if present — BACKEND URL already includes /api/v1
  const segments = path[0] === 'v1' ? path.slice(1) : path
  const url = `${BACKEND}/${segments.join('/')}${req.nextUrl.search}`

  const headers = new Headers()
  const ct = req.headers.get('Content-Type')
  if (ct) headers.set('Content-Type', ct)
  const auth = req.headers.get('Authorization')
  if (auth) headers.set('Authorization', auth)

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined

  const res = await fetch(url, { method: req.method, headers, body })
  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') ?? 'application/json' },
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
