import 'server-only'
import { randomInt, randomUUID } from 'node:crypto'
import { teacher, teacherClasses, teacherStudents } from '@/lib/data'
import { THRESHOLDS, getFaceProvider } from '@/lib/face/provider'
import type {
  Attempt,
  AttemptOutcome,
  AttendanceRecord,
  AttendanceSession,
  CheckInMethod,
  CheckInResult,
  DemoOutcome,
  Enrollment,
  PublicSessionInfo,
  RosterEntry,
  SessionDetail,
  SessionState,
  SessionSummary,
  VerificationOverview,
} from './types'

/**
 * In-memory store for the demo. Supabase integration point: each collection
 * maps to a table in scripts/face-attendance-schema.sql, and every mutation
 * below becomes a single transactional RPC so the duplicate / expiry checks
 * are enforced by the database (unique constraint on session_id + student_id).
 */
type StoredSession = Omit<AttendanceSession, 'state' | 'rosterSize'> & { rosterIds: string[] }
type Store = { sessions: Map<string, StoredSession>; enrollments: Map<string, Enrollment & { templateRef?: string }> }

const g = globalThis as unknown as { __smartattendStore?: Store }

/** Integration point: replace with the authenticated Supabase user id. */
export const getCurrentStudentId = () => 'st0'

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const generateCode = () => Array.from({ length: 6 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('')

const minutesFrom = (base: number, m: number) => new Date(base + m * 60_000).toISOString()
const studentById = (id: string) => teacherStudents.find((s) => s.id === id)
const rosterFor = (section: string) => teacherStudents.filter((s) => s.section === section).map((s) => s.id)

function seed(): Store {
  const now = Date.now()
  const enrollments = new Map<string, Enrollment & { templateRef?: string }>()
  for (const s of teacherStudents) {
    if (s.id === 'st0') continue
    const opted = ['st9', 'st14'].includes(s.id)
    const pending = ['st2', 'st11'].includes(s.id)
    enrollments.set(s.id, {
      studentId: s.id,
      status: opted ? 'opted_out' : pending ? 'not_enrolled' : 'enrolled',
      consentAt: opted || pending ? undefined : minutesFrom(now, -60 * 24 * 30),
      enrolledAt: opted || pending ? undefined : minutesFrom(now, -60 * 24 * 30),
      mode: 'demo',
      templateRef: opted || pending ? undefined : `demo-template:${s.id}`,
    })
  }
  enrollments.set('st0', { studentId: 'st0', status: 'not_enrolled' })

  const sessions = new Map<string, StoredSession>()
  const mk = (classId: string, startOffsetMin: number, durationMin: number, closed: boolean) => {
    const cls = teacherClasses.find((c) => c.id === classId)!
    const createdAt = minutesFrom(now, startOffsetMin)
    const s: StoredSession = {
      id: randomUUID(),
      code: generateCode(),
      classId,
      className: cls.name,
      section: cls.section,
      subject: cls.subject,
      room: cls.room,
      createdAt,
      expiresAt: minutesFrom(now, startOffsetMin + durationMin),
      closedAt: closed ? minutesFrom(now, startOffsetMin + durationMin) : undefined,
      rosterIds: rosterFor(cls.section),
      records: [],
      attempts: [],
    }
    sessions.set(s.id, s)
    return s
  }

  const history = [mk('t2', -60 * 24 * 2, 10, true), mk('t1', -60 * 24, 10, true), mk('t2', -60 * 5, 10, true)]
  for (const [i, s] of history.entries()) {
    for (const [j, id] of s.rosterIds.entries()) {
      const st = studentById(id)!
      const at = minutesFrom(new Date(s.createdAt).getTime(), 1 + j)
      const enr = enrollments.get(id)
      if (id === 'st6' && i === 2) {
        s.attempts.push(
          { id: randomUUID(), studentId: id, name: st.name, roll: st.roll, outcome: 'no_match', flagged: true, reason: 'Face did not match enrolled template (similarity 0.38).', at },
          { id: randomUUID(), studentId: id, name: st.name, roll: st.roll, outcome: 'no_match', flagged: true, reason: 'Second failed match within 2 minutes — possible proxy attempt.', at: minutesFrom(new Date(at).getTime(), 2) },
        )
        continue
      }
      if (id === 'st8' && i === 2) {
        s.records.push({ studentId: id, name: st.name, roll: st.roll, status: 'review', method: 'face', confidence: 'borderline', liveness: 'simulated', mode: 'demo', at })
        continue
      }
      if (id === 'st2' && i === 1) continue
      const alternative = enr?.status !== 'enrolled'
      s.records.push({
        studentId: id,
        name: st.name,
        roll: st.roll,
        status: alternative ? 'manual_present' : 'verified',
        method: alternative ? 'manual' : 'face',
        confidence: alternative ? undefined : 'high',
        liveness: alternative ? 'not_performed' : 'simulated',
        mode: 'demo',
        at,
        reviewedBy: alternative ? teacher.name : undefined,
      })
      if (id === 'st7' && i === 0) {
        s.attempts.push({ id: randomUUID(), studentId: id, name: st.name, roll: st.roll, outcome: 'duplicate', flagged: true, reason: 'Second submission after already being marked present.', at: minutesFrom(new Date(at).getTime(), 3) })
      }
    }
  }

  const live = mk('t1', -2, 15, false)
  for (const id of ['st1', 'st3', 'st10']) {
    const st = studentById(id)!
    live.records.push({ studentId: id, name: st.name, roll: st.roll, status: 'verified', method: 'face', confidence: 'high', liveness: 'simulated', mode: 'demo', at: minutesFrom(now, -1) })
  }

  return { sessions, enrollments }
}

function db(): Store {
  if (!g.__smartattendStore) g.__smartattendStore = seed()
  return g.__smartattendStore
}

function stateOf(s: StoredSession, now = Date.now()): SessionState {
  if (s.closedAt) return 'closed'
  return now > new Date(s.expiresAt).getTime() ? 'expired' : 'active'
}

function hydrate(s: StoredSession): AttendanceSession {
  const { rosterIds, ...rest } = s
  return { ...rest, state: stateOf(s), rosterSize: rosterIds.length }
}

function summarize(s: StoredSession): SessionSummary {
  const { records, attempts, ...rest } = hydrate(s)
  return {
    ...rest,
    verified: records.filter((r) => r.status === 'verified').length,
    review: records.filter((r) => r.status === 'review').length,
    manual: records.filter((r) => r.status === 'manual_present').length,
    flagged: attempts.filter((a) => a.flagged).length,
  }
}

const sorted = () => [...db().sessions.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export function listSessions(): SessionSummary[] {
  return sorted().map(summarize)
}

export function getSessionDetail(id: string): SessionDetail | null {
  const s = db().sessions.get(id)
  if (!s) return null
  const roster: RosterEntry[] = s.rosterIds.map((sid) => {
    const st = studentById(sid)!
    return {
      studentId: sid,
      name: st.name,
      roll: st.roll,
      enrollment: db().enrollments.get(sid)?.status ?? 'not_enrolled',
      record: s.records.find((r) => r.studentId === sid),
      failedAttempts: s.attempts.filter((a) => a.studentId === sid && a.flagged).length,
    }
  })
  return { ...hydrate(s), roster }
}

export function createSession(classId: string, durationMin: number) {
  const cls = teacherClasses.find((c) => c.id === classId)
  if (!cls) return { error: 'Unknown class.' } as const
  if (!Number.isInteger(durationMin) || durationMin < 2 || durationMin > 30) return { error: 'Duration must be 2–30 minutes.' } as const
  for (const s of db().sessions.values()) {
    if (s.classId === classId && stateOf(s) === 'active') s.closedAt = new Date().toISOString()
  }
  const existing = new Set([...db().sessions.values()].map((s) => s.code))
  let code = generateCode()
  while (existing.has(code)) code = generateCode()
  const now = Date.now()
  const s: StoredSession = {
    id: randomUUID(),
    code,
    classId,
    className: cls.name,
    section: cls.section,
    subject: cls.subject,
    room: cls.room,
    createdAt: new Date(now).toISOString(),
    expiresAt: minutesFrom(now, durationMin),
    rosterIds: rosterFor(cls.section),
    records: [],
    attempts: [],
  }
  db().sessions.set(s.id, s)
  return { session: summarize(s) } as const
}

export function closeSession(id: string) {
  const s = db().sessions.get(id)
  if (!s) return false
  if (!s.closedAt) s.closedAt = new Date().toISOString()
  return true
}

export function lookupSession(code: string): PublicSessionInfo | null {
  const s = [...db().sessions.values()].find((x) => x.code === code.trim().toUpperCase())
  if (!s) return null
  return { code: s.code, className: s.className, section: s.section, subject: s.subject, room: s.room, expiresAt: s.expiresAt, state: stateOf(s), teacher: teacher.name }
}

function logAttempt(s: StoredSession, studentId: string, outcome: AttemptOutcome, reason: string, flagged: boolean) {
  const st = studentById(studentId)!
  const priorFailures = s.attempts.filter((a) => a.studentId === studentId && a.flagged).length
  const a: Attempt = {
    id: randomUUID(),
    studentId,
    name: st.name,
    roll: st.roll,
    outcome,
    flagged: flagged || (priorFailures >= 1 && outcome !== 'accepted' && outcome !== 'needs_review'),
    reason: priorFailures >= 1 && flagged ? `${reason} Repeated failure (${priorFailures + 1} attempts).` : reason,
    at: new Date().toISOString(),
  }
  s.attempts.unshift(a)
  return a
}

export async function checkIn(input: { studentId: string; code: string; method: CheckInMethod; demoOutcome?: DemoOutcome }): Promise<CheckInResult> {
  const { studentId, method } = input
  const s = [...db().sessions.values()].find((x) => x.code === input.code.trim().toUpperCase())
  if (!s) return { ok: false, outcome: 'expired', message: 'No attendance session matches that code.' }

  const fail = (outcome: AttemptOutcome, message: string, flagged: boolean): CheckInResult => {
    logAttempt(s, studentId, outcome, message, flagged)
    return { ok: false, outcome, message }
  }

  const state = stateOf(s)
  if (state === 'closed') return fail('closed', 'This session was closed by your faculty.', false)
  if (state === 'expired') return fail('expired', 'This session has expired and no longer accepts submissions.', false)
  if (!s.rosterIds.includes(studentId)) return fail('not_in_roster', `You are not enrolled in ${s.section}.`, true)
  if (s.records.some((r) => r.studentId === studentId)) return fail('duplicate', 'Attendance for this session has already been submitted.', true)

  const st = studentById(studentId)!
  const base = { studentId, name: st.name, roll: st.roll, at: new Date().toISOString() }

  if (method === 'alternative') {
    const record: AttendanceRecord = { ...base, status: 'review', method: 'alternative', liveness: 'not_performed', mode: getFaceProvider().mode }
    s.records.push(record)
    logAttempt(s, studentId, 'needs_review', 'Non-biometric check-in awaiting faculty confirmation.', false)
    return { ok: true, outcome: 'needs_review', message: 'Submitted without face verification. Your faculty will confirm your presence.', record }
  }

  const enrollment = db().enrollments.get(studentId)
  if (enrollment?.status !== 'enrolled' || !enrollment.templateRef) {
    return fail('not_enrolled', 'Register your face first, or check in without face verification.', false)
  }

  const provider = getFaceProvider()
  const result = await provider.verify({ studentId, templateRef: enrollment.templateRef, demoOutcome: input.demoOutcome })

  if (s.records.some((r) => r.studentId === studentId)) return fail('duplicate', 'Attendance for this session has already been submitted.', true)

  if (result.kind === 'unavailable') return fail('provider_unavailable', result.reason, false)
  if (result.kind === 'liveness_failed') return fail('liveness_failed', 'Liveness check failed — a live person could not be confirmed.', true)
  if (result.kind === 'no_match' || result.similarity < THRESHOLDS.review) {
    return fail('no_match', `Face did not match the enrolled template (similarity ${result.similarity.toFixed(2)}).`, true)
  }

  const verified = result.similarity >= THRESHOLDS.verified
  const record: AttendanceRecord = {
    ...base,
    status: verified ? 'verified' : 'review',
    method: 'face',
    confidence: verified ? 'high' : 'borderline',
    liveness: result.liveness,
    mode: provider.mode,
  }
  s.records.push(record)
  if (!verified) logAttempt(s, studentId, 'needs_review', `Borderline match (similarity ${result.similarity.toFixed(2)}) sent for faculty review.`, false)
  return verified
    ? { ok: true, outcome: 'accepted', message: 'Identity verified. You are marked present.', record }
    : { ok: true, outcome: 'needs_review', message: 'Match was uncertain. Your faculty will review this check-in.', record }
}

export function reviewRecord(sessionId: string, studentId: string, decision: 'approve' | 'reject') {
  const r = db().sessions.get(sessionId)?.records.find((x) => x.studentId === studentId)
  if (!r || r.status !== 'review') return false
  r.status = decision === 'approve' ? 'verified' : 'rejected'
  r.reviewedBy = teacher.name
  return true
}

export function markManually(sessionId: string, studentId: string, status: 'present' | 'absent', note?: string) {
  const s = db().sessions.get(sessionId)
  if (!s || !s.rosterIds.includes(studentId)) return false
  const st = studentById(studentId)!
  const record: AttendanceRecord = {
    studentId,
    name: st.name,
    roll: st.roll,
    status: status === 'present' ? 'manual_present' : 'manual_absent',
    method: 'manual',
    liveness: 'not_performed',
    mode: getFaceProvider().mode,
    at: new Date().toISOString(),
    reviewedBy: teacher.name,
    note: note?.slice(0, 200),
  }
  s.records = s.records.filter((r) => r.studentId !== studentId).concat(record)
  return true
}

/** Demo-only: replays realistic check-ins from other roster students so the live view can be evaluated. */
export async function simulateCheckIns(sessionId: string) {
  const s = db().sessions.get(sessionId)
  if (!s || stateOf(s) !== 'active' || getFaceProvider().mode !== 'demo') return false
  const pending = s.rosterIds.filter((id) => id !== getCurrentStudentId() && !s.records.some((r) => r.studentId === id))
  const outcomes: DemoOutcome[] = ['match', 'match', 'borderline', 'match', 'no_match', 'match']
  for (const [i, id] of pending.slice(0, 4).entries()) {
    const enr = db().enrollments.get(id)
    await checkIn({ studentId: id, code: s.code, method: enr?.status === 'enrolled' ? 'face' : 'alternative', demoOutcome: outcomes[i % outcomes.length] })
  }
  const dupe = s.records.find((r) => r.studentId !== getCurrentStudentId())
  if (dupe) await checkIn({ studentId: dupe.studentId, code: s.code, method: 'face', demoOutcome: 'match' })
  return true
}

export function getEnrollment(studentId: string): Enrollment {
  const e = db().enrollments.get(studentId) ?? { studentId, status: 'not_enrolled' as const }
  const { templateRef: _omit, ...safe } = e as Enrollment & { templateRef?: string }
  return safe
}

export async function enroll(studentId: string, demoOutcome?: DemoOutcome) {
  const provider = getFaceProvider()
  const res = await provider.enroll({ studentId, demoOutcome })
  if ('error' in res) return { error: res.error }
  const now = new Date().toISOString()
  db().enrollments.set(studentId, { studentId, status: 'enrolled', consentAt: now, enrolledAt: now, mode: provider.mode, templateRef: res.templateRef })
  return { enrollment: getEnrollment(studentId) }
}

export async function withdrawEnrollment(studentId: string, optOut: boolean) {
  const e = db().enrollments.get(studentId)
  if (e?.templateRef) await getFaceProvider().remove(e.templateRef)
  db().enrollments.set(studentId, { studentId, status: optOut ? 'opted_out' : 'not_enrolled' })
  return getEnrollment(studentId)
}

export function getOverview(): VerificationOverview {
  const enrollments = teacherStudents.map((s) => db().enrollments.get(s.id)?.status ?? 'not_enrolled')
  const all = sorted()
  const dayAgo = Date.now() - 24 * 60 * 60_000
  return {
    mode: getFaceProvider().mode,
    totalStudents: teacherStudents.length,
    enrolled: enrollments.filter((e) => e === 'enrolled').length,
    notEnrolled: enrollments.filter((e) => e === 'not_enrolled').length,
    optedOut: enrollments.filter((e) => e === 'opted_out').length,
    pendingReview: all.reduce((n, s) => n + s.records.filter((r) => r.status === 'review').length, 0),
    failedAttempts24h: all.reduce((n, s) => n + s.attempts.filter((a) => a.flagged && new Date(a.at).getTime() > dayAgo).length, 0),
    alerts: all
      .flatMap((s) => s.attempts.filter((a) => a.flagged).map((a) => ({ ...a, sessionId: s.id, className: s.className, section: s.section })))
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 12),
    history: all.map(summarize),
  }
}
