'use client'

import { useState } from 'react'
import { CalendarClock, CircleCheck, CircleX, Hourglass, Loader2, Paperclip, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, CardHeader, EmptyState, Field, Modal, Segmented, inputClass } from '@/components/kit/primitives'
import { studentLeaves, type LeaveApplication, type LeaveStatus } from '@/lib/data'

export const leaveStatusMeta: Record<LeaveStatus, { label: string; tone: 'warning' | 'success' | 'danger'; icon: typeof Hourglass }> = {
  pending: { label: 'Pending review', tone: 'warning', icon: Hourglass },
  approved: { label: 'Approved', tone: 'success', icon: CircleCheck },
  rejected: { label: 'Declined', tone: 'danger', icon: CircleX },
}

const LEAVE_TYPES = ['Medical', 'Event / Competition', 'Personal', 'Family emergency', 'Academic']

const fmt = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export function ApplyLeaveDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit?: (l: LeaveApplication) => void }) {
  const [form, setForm] = useState({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const close = () => {
    setForm({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' })
    setErrors({})
    setDone(false)
    onClose()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.from) next.from = 'Choose a start date.'
    if (!form.to) next.to = 'Choose an end date.'
    if (form.from && form.to && form.to < form.from) next.to = 'End date must be after start date.'
    if (form.reason.trim().length < 15) next.reason = 'Add a short reason (at least 15 characters).'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      const days = Math.round((new Date(form.to).getTime() - new Date(form.from).getTime()) / 86400000) + 1
      onSubmit?.({
        id: crypto.randomUUID(),
        type: form.type,
        from: fmt(form.from),
        to: fmt(form.to),
        days,
        reason: form.reason.trim(),
        status: 'pending',
        submitted: 'Just now',
      })
      setLoading(false)
      setDone(true)
    }, 700)
  }

  return (
    <Modal open={open} onClose={close} title={done ? 'Application submitted' : 'Apply for leave'} description={done ? undefined : 'Your class teacher will be notified instantly.'} className="max-w-lg">
      {done ? (
        <div className="flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
            <CircleCheck className="size-6" />
          </span>
          <p className="mt-3 text-[13px] text-muted-foreground">You&apos;ll get a notification as soon as it&apos;s reviewed. Approved leave is marked as excused.</p>
          <Btn onClick={close} className="mt-5 w-full">
            Done
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label="Leave type" htmlFor="leave-type">
            <select id="leave-type" className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {LEAVE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From" htmlFor="leave-from" error={errors.from}>
              <input id="leave-from" type="date" className={inputClass} value={form.from} aria-invalid={!!errors.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            </Field>
            <Field label="To" htmlFor="leave-to" error={errors.to}>
              <input id="leave-to" type="date" className={inputClass} value={form.to} aria-invalid={!!errors.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </Field>
          </div>
          <Field label="Reason" htmlFor="leave-reason" error={errors.reason} hint={<span className="text-[11px] tabular-nums text-muted-foreground">{form.reason.length}/300</span>}>
            <textarea
              id="leave-reason"
              rows={3}
              maxLength={300}
              className={cn(inputClass, 'h-auto resize-none py-2')}
              placeholder="Briefly explain why you need leave…"
              value={form.reason}
              aria-invalid={!!errors.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </Field>
          <button type="button" className="flex items-center gap-2.5 rounded-lg border border-dashed border-input px-3 py-2.5 text-left text-[13px] text-muted-foreground transition-colors hover:border-ring hover:bg-accent/40">
            <Paperclip className="size-4" />
            <span>
              Attach supporting document <span className="text-xs">(optional · PDF, JPG up to 5 MB)</span>
            </span>
          </button>
          <div className="flex justify-end gap-2 pt-1">
            <Btn variant="secondary" onClick={close}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Submit application
            </Btn>
          </div>
        </form>
      )}
    </Modal>
  )
}

export function LeaveView() {
  const [list, setList] = useState(studentLeaves)
  const [filter, setFilter] = useState<'all' | LeaveStatus>('all')
  const [open, setOpen] = useState(false)
  const filtered = filter === 'all' ? list : list.filter((l) => l.status === filter)
  const count = (s: LeaveStatus) => list.filter((l) => l.status === s).length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {(['pending', 'approved', 'rejected'] as LeaveStatus[]).map((s) => {
          const m = leaveStatusMeta[s]
          return (
            <div key={s} className="surface flex items-center gap-3 p-4">
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-lg',
                  s === 'pending' ? 'bg-warning-soft text-[oklch(0.52_0.13_60)]' : s === 'approved' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
                )}
              >
                <m.icon className="size-4" />
              </span>
              <div>
                <p className="text-xl font-semibold tabular-nums">{count(s)}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Card>
        <CardHeader
          title="Applications"
          description="Track the status of every leave request"
          action={
            <Btn size="sm" onClick={() => setOpen(true)}>
              <Plus /> New application
            </Btn>
          }
        />
        <div className="px-5 pt-4">
          <Segmented
            label="Filter applications"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All', count: list.length },
              { value: 'pending', label: 'Pending', count: count('pending') },
              { value: 'approved', label: 'Approved', count: count('approved') },
              { value: 'rejected', label: 'Declined', count: count('rejected') },
            ]}
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarClock className="size-5" />} title="Nothing here" description="No applications match this filter." />
        ) : (
          <ul className="flex flex-col divide-y divide-border p-2">
            {filtered.map((l) => {
              const m = leaveStatusMeta[l.status]
              return (
                <li key={l.id} className="flex flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-lg border border-border bg-card py-1.5 shadow-[var(--shadow-surface)]">
                    <span className="text-[10px] font-medium uppercase text-danger">{l.from.split(' ')[0]}</span>
                    <span className="text-lg font-semibold leading-none tabular-nums">{l.from.split(' ')[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold">{l.type}</p>
                      <span className="text-xs text-muted-foreground">
                        {l.from}
                        {l.from !== l.to && ` – ${l.to}`} · {l.days} {l.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">{l.reason}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Submitted {l.submitted}
                      {l.reviewer && ` · Reviewed by ${l.reviewer}`}
                    </p>
                  </div>
                  <Badge tone={m.tone} dot>
                    {m.label}
                  </Badge>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
      <ApplyLeaveDialog open={open} onClose={() => setOpen(false)} onSubmit={(l) => setList((x) => [l, ...x])} />
    </div>
  )
}
