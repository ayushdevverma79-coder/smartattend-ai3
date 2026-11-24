import { NextResponse } from 'next/server'
import { enroll, getCurrentStudentId, getEnrollment, withdrawEnrollment } from '@/lib/attendance/store'
import { getFaceProvider } from '@/lib/face/provider'
import { bad, noStore, readJson } from '@/lib/attendance/http'

export async function GET() {
  return NextResponse.json({ enrollment: getEnrollment(getCurrentStudentId()), mode: getFaceProvider().mode }, noStore)
}

export async function POST(req: Request) {
  const body = await readJson(req)
  if (body?.consent !== true) return bad('Explicit consent is required before biometric enrollment.', 403)
  const result = await enroll(getCurrentStudentId())
  if ('error' in result) return bad(result.error ?? 'Enrollment failed.', 503)
  return NextResponse.json(result, { status: 201 })
}

export async function DELETE(req: Request) {
  const optOut = new URL(req.url).searchParams.get('optOut') === '1'
  return NextResponse.json({ enrollment: await withdrawEnrollment(getCurrentStudentId(), optOut) })
}
