import { NextResponse } from 'next/server'
import { markManually, reviewRecord } from '@/lib/attendance/store'
import { bad, isOneOf, readJson } from '@/lib/attendance/http'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await readJson(req)
  if (!body || typeof body.studentId !== 'string') return bad('studentId is required.')

  if (isOneOf(body.decision, ['approve', 'reject'] as const)) {
    if (!reviewRecord(id, body.studentId, body.decision)) return bad('No check-in awaiting review for this student.', 409)
    return NextResponse.json({ ok: true })
  }

  if (isOneOf(body.manual, ['present', 'absent'] as const)) {
    const note = typeof body.note === 'string' ? body.note : undefined
    if (!markManually(id, body.studentId, body.manual, note)) return bad('Student is not on this session roster.', 404)
    return NextResponse.json({ ok: true })
  }

  return bad('Provide decision (approve | reject) or manual (present | absent).')
}
