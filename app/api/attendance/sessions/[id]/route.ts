import { NextResponse } from 'next/server'
import { closeSession, getSessionDetail } from '@/lib/attendance/store'
import { bad, noStore, readJson } from '@/lib/attendance/http'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = getSessionDetail(id)
  if (!session) return bad('Session not found.', 404)
  return NextResponse.json({ session }, noStore)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await readJson(req)
  if (body?.action !== 'close') return bad('Unsupported action.')
  if (!closeSession(id)) return bad('Session not found.', 404)
  return NextResponse.json({ ok: true })
}
