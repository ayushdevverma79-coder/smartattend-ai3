import { NextResponse } from 'next/server'
import { checkIn, getCurrentStudentId, lookupSession } from '@/lib/attendance/store'
import { bad, isOneOf, noStore, readJson } from '@/lib/attendance/http'

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get('code') ?? ''
  if (!/^[A-Za-z0-9]{6}$/.test(code)) return bad('Enter the 6-character session code.')
  const session = lookupSession(code)
  if (!session) return bad('No attendance session matches that code.', 404)
  return NextResponse.json({ session }, noStore)
}

/**
 * The student identity always comes from the server session, never the request body,
 * so one student cannot submit attendance on behalf of another.
 * Integration point: add per-student rate limiting (e.g. Upstash) before calling checkIn.
 */
export async function POST(req: Request) {
  const body = await readJson(req)
  if (!body || typeof body.code !== 'string' || !/^[A-Za-z0-9]{6}$/.test(body.code)) return bad('A valid session code is required.')
  if (!isOneOf(body.method, ['face', 'alternative'] as const)) return bad('method must be face or alternative.')
  const demoOutcome = isOneOf(body.demoOutcome, ['match', 'borderline', 'no_match', 'liveness_failed'] as const) ? body.demoOutcome : undefined

  const result = await checkIn({ studentId: getCurrentStudentId(), code: body.code, method: body.method, demoOutcome })
  const status = result.ok ? 200 : result.outcome === 'duplicate' ? 409 : result.outcome === 'expired' || result.outcome === 'closed' ? 410 : 422
  return NextResponse.json(result, { status })
}
