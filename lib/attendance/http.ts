import 'server-only'
import { NextResponse } from 'next/server'

export async function readJson(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export const bad = (message: string, status = 400) => NextResponse.json({ error: message }, { status })

export const noStore = { headers: { 'Cache-Control': 'no-store' } }

export const isOneOf = <T extends string>(v: unknown, opts: readonly T[]): v is T => typeof v === 'string' && (opts as readonly string[]).includes(v)
