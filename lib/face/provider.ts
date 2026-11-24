import 'server-only'
import type { DemoOutcome, VerificationMode } from '@/lib/attendance/types'

/**
 * Boundary between SmartAttend and a real biometric service (e.g. AWS Rekognition
 * Face Liveness, Azure Face, or a self-hosted model). Raw frames are forwarded to
 * the provider and discarded; only an opaque template reference is persisted.
 */
export type FaceMatchResult =
  | { kind: 'match'; similarity: number; liveness: 'passed' | 'simulated' }
  | { kind: 'no_match'; similarity: number; liveness: 'passed' | 'simulated' }
  | { kind: 'liveness_failed' }
  | { kind: 'unavailable'; reason: string }

export interface FaceVerificationProvider {
  mode: VerificationMode
  enroll(input: { studentId: string; frames?: string[]; demoOutcome?: DemoOutcome }): Promise<{ templateRef: string } | { error: string }>
  verify(input: { studentId: string; templateRef: string; frames?: string[]; demoOutcome?: DemoOutcome }): Promise<FaceMatchResult>
  remove(templateRef: string): Promise<void>
}

/**
 * Demo provider. It performs NO face recognition and NO liveness detection —
 * it returns whatever outcome the demo controls request so the full workflow
 * (thresholds, review queue, anti-proxy rules) can be exercised end-to-end.
 * Every record it produces is tagged `mode: 'demo'`.
 */
const demoProvider: FaceVerificationProvider = {
  mode: 'demo',
  async enroll({ studentId }) {
    return { templateRef: `demo-template:${studentId}` }
  },
  async verify({ demoOutcome = 'match' }) {
    await new Promise((r) => setTimeout(r, 450))
    switch (demoOutcome) {
      case 'match':
        return { kind: 'match', similarity: 0.97, liveness: 'simulated' }
      case 'borderline':
        return { kind: 'match', similarity: 0.82, liveness: 'simulated' }
      case 'no_match':
        return { kind: 'no_match', similarity: 0.41, liveness: 'simulated' }
      case 'liveness_failed':
        return { kind: 'liveness_failed' }
    }
  },
  async remove() {},
}

/**
 * Integration point: set FACE_VERIFICATION_PROVIDER and implement an adapter
 * that satisfies FaceVerificationProvider. Until then the app runs in demo mode.
 */
export function getFaceProvider(): FaceVerificationProvider {
  const configured = process.env.FACE_VERIFICATION_PROVIDER
  if (!configured) return demoProvider
  return {
    mode: 'provider',
    async enroll() {
      return { error: `Provider "${configured}" is configured but no adapter has been implemented yet.` }
    },
    async verify() {
      return { kind: 'unavailable', reason: `Provider "${configured}" adapter not implemented.` }
    },
    async remove() {},
  }
}

/** Similarity thresholds used server-side to decide the record status. */
export const THRESHOLDS = { verified: 0.9, review: 0.75 } as const
