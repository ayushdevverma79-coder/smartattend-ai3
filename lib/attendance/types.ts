export type VerificationMode = 'demo' | 'provider'

export type DemoOutcome = 'match' | 'borderline' | 'no_match' | 'liveness_failed'

export type CheckInMethod = 'face' | 'alternative'

export type RecordStatus = 'verified' | 'review' | 'manual_present' | 'manual_absent' | 'rejected'

export type AttemptOutcome =
  | 'accepted'
  | 'needs_review'
  | 'duplicate'
  | 'expired'
  | 'closed'
  | 'not_in_roster'
  | 'not_enrolled'
  | 'no_match'
  | 'liveness_failed'
  | 'provider_unavailable'

export type EnrollmentStatus = 'not_enrolled' | 'enrolled' | 'opted_out'

export type Enrollment = {
  studentId: string
  status: EnrollmentStatus
  consentAt?: string
  enrolledAt?: string
  mode?: VerificationMode
}

export type AttendanceRecord = {
  studentId: string
  name: string
  roll: string
  status: RecordStatus
  method: CheckInMethod | 'manual'
  /** Match confidence band only — no biometric template or image is ever returned to clients. */
  confidence?: 'high' | 'borderline'
  liveness: 'passed' | 'not_performed' | 'simulated'
  mode: VerificationMode
  at: string
  reviewedBy?: string
  note?: string
}

export type Attempt = {
  id: string
  studentId: string
  name: string
  roll: string
  outcome: AttemptOutcome
  flagged: boolean
  reason: string
  at: string
}

export type SessionState = 'active' | 'expired' | 'closed'

export type AttendanceSession = {
  id: string
  code: string
  classId: string
  className: string
  section: string
  subject: string
  room: string
  createdAt: string
  expiresAt: string
  closedAt?: string
  state: SessionState
  rosterSize: number
  records: AttendanceRecord[]
  attempts: Attempt[]
}

export type SessionSummary = Omit<AttendanceSession, 'records' | 'attempts'> & {
  verified: number
  review: number
  manual: number
  flagged: number
}

export type PublicSessionInfo = Pick<
  AttendanceSession,
  'code' | 'className' | 'section' | 'subject' | 'room' | 'expiresAt' | 'state'
> & { teacher: string }

export type CheckInResult = {
  ok: boolean
  outcome: AttemptOutcome
  message: string
  record?: AttendanceRecord
}

export type RosterEntry = {
  studentId: string
  name: string
  roll: string
  enrollment: EnrollmentStatus
  record?: AttendanceRecord
  failedAttempts: number
}

export type SessionDetail = AttendanceSession & { roster: RosterEntry[] }

export type VerificationOverview = {
  mode: VerificationMode
  enrolled: number
  notEnrolled: number
  optedOut: number
  totalStudents: number
  pendingReview: number
  failedAttempts24h: number
  alerts: (Attempt & { sessionId: string; className: string; section: string })[]
  history: SessionSummary[]
}
