import { NextResponse } from 'next/server'
import { createSession, listSessions } from '@/lib/attendance/store'
import { bad, noStore, readJson } from '@/lib/attendance/http'

// Integration point: require an authenticated faculty session (Supabase auth + role claim) on every teacher route.

export async function GET() {
  return NextResponse.json({ sessions: listSessions() }, noStore)
}

export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body || typeof body.classId !== 'string') return bad('classId is required.')
  const result = createSession(body.classId, Number(body.durationMin ?? 10))
  if ('error' in result) return bad(result.error ?? 'Could not create session.')
  return NextResponse.json(result, { status: 201 })
}
