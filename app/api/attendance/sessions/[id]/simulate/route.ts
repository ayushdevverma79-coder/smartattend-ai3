import { NextResponse } from 'next/server'
import { simulateCheckIns } from '@/lib/attendance/store'
import { bad } from '@/lib/attendance/http'

/** Demo-only endpoint. Disabled automatically once a real face provider is configured. */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await simulateCheckIns(id))) return bad('Simulation is only available for active sessions in demo mode.', 409)
  return NextResponse.json({ ok: true })
}
