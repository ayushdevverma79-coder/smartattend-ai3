'use client'

import { useState } from 'react'
import { CircleCheck, KeyRound, Loader2, School, Users } from 'lucide-react'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, EmptyState, Field, Modal, inputClass } from '@/components/kit/primitives'
import { discoverableClassrooms, joinedClassrooms, type Classroom } from '@/lib/data'

export function JoinClassroomDialog({
  open,
  onClose,
  onJoined,
  existing = joinedClassrooms,
}: {
  open: boolean
  onClose: () => void
  onJoined?: (c: Classroom) => void
  existing?: Classroom[]
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState<Classroom>()

  const reset = () => {
    setCode('')
    setError(undefined)
    setJoined(undefined)
    setLoading(false)
    onClose()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = code.trim().toUpperCase()
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{4}$/.test(normalized)) {
      setError('Class codes look like ABC-1234. Check with your teacher.')
      return
    }
    if (existing.some((c) => c.code === normalized)) {
      setError('You’re already a member of this classroom.')
      return
    }
    setLoading(true)
    setError(undefined)
    setTimeout(() => {
      setLoading(false)
      const found = discoverableClassrooms[normalized]
      if (!found) {
        setError('No classroom found with that code.')
        return
      }
      setJoined(found)
      onJoined?.(found)
    }, 700)
  }

  return (
    <Modal open={open} onClose={reset} title={joined ? 'You’re in' : 'Join a classroom'} description={joined ? undefined : 'Enter the 7-character code shared by your teacher.'}>
      {joined ? (
        <div className="flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success">
            <CircleCheck className="size-6" />
          </span>
          <p className="mt-3 text-[15px] font-semibold">{joined.name}</p>
          <p className="text-[13px] text-muted-foreground">
            {joined.faculty} · {joined.students} students
          </p>
          <Btn onClick={reset} className="mt-5 w-full">
            Done
          </Btn>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label="Class code" htmlFor="class-code" error={error}>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                id="class-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError(undefined)
                }}
                placeholder="CNW-5A21"
                maxLength={8}
                autoComplete="off"
                aria-invalid={!!error}
                aria-describedby={error ? 'class-code-error' : undefined}
                className={`${inputClass} h-11 pl-9 font-mono text-base tracking-[0.2em]`}
              />
            </div>
          </Field>
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            Try <button type="button" className="font-mono font-medium text-primary hover:underline" onClick={() => setCode('CNW-5A21')}>CNW-5A21</button> or{' '}
            <button type="button" className="font-mono font-medium text-primary hover:underline" onClick={() => setCode('DMT-9Z3L')}>DMT-9Z3L</button> for a sample classroom.
          </p>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={reset}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={loading || code.length < 8}>
              {loading && <Loader2 className="animate-spin" />}
              Join classroom
            </Btn>
          </div>
        </form>
      )}
    </Modal>
  )
}

export function ClassroomsView() {
  const [list, setList] = useState<Classroom[]>(joinedClassrooms)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">{list.length}</span> classrooms joined
        </p>
        <Btn onClick={() => setOpen(true)}>
          <KeyRound /> Join with code
        </Btn>
      </div>
      {list.length === 0 ? (
        <Card>
          <EmptyState icon={<School className="size-5" />} title="No classrooms yet" description="Ask your teacher for a class code to start tracking attendance." />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c, i) => (
            <article key={c.id} className="surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]">
              <div className="flex items-start justify-between">
                <span
                  className="grid size-10 place-items-center rounded-xl text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.2)]"
                  style={{ background: `linear-gradient(135deg, var(--chart-${(i % 5) + 1}), var(--navy))` }}
                  aria-hidden
                >
                  <School className="size-5" />
                </span>
                <Badge tone="neutral" className="font-mono">
                  {c.code}
                </Badge>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{c.name}</h3>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{c.faculty}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> {c.students} students
                </span>
                <span className="font-mono">{c.subject}</span>
              </div>
            </article>
          ))}
        </div>
      )}
      <JoinClassroomDialog open={open} onClose={() => setOpen(false)} existing={list} onJoined={(c) => setList((l) => [c, ...l])} />
    </>
  )
}
