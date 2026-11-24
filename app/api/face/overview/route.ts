import { NextResponse } from 'next/server'
import { getOverview } from '@/lib/attendance/store'
import { noStore } from '@/lib/attendance/http'

export async function GET() {
  return NextResponse.json(getOverview(), noStore)
}
