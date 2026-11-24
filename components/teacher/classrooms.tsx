'use client'

import { useState } from 'react'
import { BookOpen, Check, Clock, Copy, Loader2, MapPin, Plus, RefreshCw, School, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, CardHeader, Field, Modal, ProgressBar, attendanceTone, inputClass } from '@/components/kit/primitives'
import { teacherClasses, teacherSubjects, type TeacherClass, type TeacherSubject } from '@/lib/data'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const randomCode = (prefix: string) =>
  `${(prefix.replace(/[^A-Za-z]/g, '').slice(0, 3) || 'CLS').toUpperCase().padEnd(3, 'X')}-${Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('')}`

function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="group/code inline-flex items-center gap-2 rounded-md border border-dashed border-violet/30 bg-violet-soft/60 px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-violet transition-colors hover:border-violet/60"
      aria-label={`Copy class code ${code}`}
    >
      {code}
      {copied ? <Check className="size-3" /> : <Copy className="size-3 opacity-60 group-hover/code:opacity-100" />}
    </button>
  )
}

export function ClassroomManager() {
  const [classes, setClasses] = useState<TeacherClass[]>(teacherClasses)
  const [subjects, setSubjects] = useState<TeacherSubject[]>(teacherSubjects)
  const [classOpen, setClassOpen] = useState(false)
  const [subjectOpen, setSubjectOpen] = useState(false)

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3" aria-labelledby="classrooms-h">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="classrooms-h" className="text-sm font-semibold">
              Classrooms
            </h2>
            <p className="text-xs text-muted-foreground">Share a code so students can join instantly.</p>
          </div>
          <Btn variant="violet" onClick={() => setClassOpen(true)}>
            <Plus /> New classroom
          </Btn>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {classes.map((c) => (
            <article key={c.id} className="surface flex flex-col p-5 transition-shadow hover:shadow-[var(--shadow-raised)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone="neutral">{c.section}</Badge>
                    <span className="font-mono text-[11px] text-muted-foreground">{c.subject}</span>
                  </div>
                  <h3 className="mt-2 truncate text-[15px] font-semibold">{c.name}</h3>
                </div>
                <CopyCode code={c.code} />
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5" /> {c.students} students
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {c.schedule}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {c.room}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <span className="text-xs text-muted-foreground">Avg. attendance</span>
                <ProgressBar value={c.avg} tone={c.students ? attendanceTone(c.avg) : 'brand'} className="flex-1" />
                <span className="text-[13px] font-semibold tabular-nums">{c.students ? `${c.avg.toFixed(1)}%` : '—'}</span>
                <button
                  onClick={() => setClasses((list) => list.map((x) => (x.id === c.id ? { ...x, code: randomCode(x.name) } : x)))}
                  className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Regenerate class code"
                  title="Regenerate code"
                >
                  <RefreshCw className="size-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="subjects-h">
        <Card className="overflow-hidden">
          <CardHeader
            title="Subjects"
            description="Courses you teach this semester"
            action={
              <Btn size="sm" variant="secondary" onClick={() => setSubjectOpen(true)}>
                <Plus /> Add subject
              </Btn>
            }
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13px]">
              <thead>
                <tr className="border-y border-border bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium" id="subjects-h">
                    Subject
                  </th>
                  <th className="px-3 py-2.5 font-medium">Type</th>
                  <th className="px-3 py-2.5 text-right font-medium">Credits</th>
                  <th className="px-3 py-2.5 font-medium">Sections</th>
                  <th className="px-5 py-2.5 text-right font-medium">Contact hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjects.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-lg bg-violet-soft text-violet">
                          <BookOpen className="size-4" />
                        </span>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{s.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={s.type === 'Core' ? 'brand' : s.type === 'Lab' ? 'warning' : 'violet'}>{s.type}</Badge>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{s.credits}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.sections.length ? s.sections.map((x) => <Badge key={x} tone="neutral">{x}</Badge>) : <span className="text-xs text-muted-foreground">Unassigned</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{s.hours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <CreateClassroomDialog open={classOpen} onClose={() => setClassOpen(false)} subjects={subjects} onCreate={(c) => setClasses((l) => [c, ...l])} />
      <AddSubjectDialog open={subjectOpen} onClose={() => setSubjectOpen(false)} onCreate={(s) => setSubjects((l) => [...l, s])} />
    </div>
  )
}

function CreateClassroomDialog({ open, onClose, subjects, onCreate }: { open: boolean; onClose: () => void; subjects: TeacherSubject[]; onCreate: (c: TeacherClass) => void }) {
  const [form, setForm] = useState({ subject: subjects[0]?.code ?? '', section: '', room: '', schedule: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<TeacherClass>()

  const close = () => {
    setForm({ subject: subjects[0]?.code ?? '', section: '', room: '', schedule: '' })
    setErrors({})
    setCreated(undefined)
    onClose()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.section.trim()) next.section = 'Section is required, e.g. CSE 5C.'
    if (!form.room.trim()) next.room = 'Add a room or lab.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      const sub = subjects.find((s) => s.code === form.subject)!
      const c: TeacherClass = {
        id: crypto.randomUUID(),
        name: sub.name,
        subject: sub.code,
        section: form.section.trim(),
        room: form.room.trim(),
        schedule: form.schedule.trim() || 'Schedule TBD',
        students: 0,
        avg: 0,
        code: randomCode(sub.name),
      }
      onCreate(c)
      setCreated(c)
      setLoading(false)
    }, 600)
  }

  return (
    <Modal open={open} onClose={close} title={created ? 'Classroom created' : 'Create a classroom'} description={created ? undefined : 'A unique join code is generated automatically.'}>
      {created ? (
        <div className="flex flex-col items-center text-center">
          <span className="grid size-12 place-items-center rounded-full bg-violet-soft text-violet">
            <School className="size-6" />
          </span>
          <p className="mt-3 text-[15px] font-semibold">
            {created.name} · {created.section}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">Share this code with your students</p>
          <div className="mt-4 rounded-xl border border-dashed border-violet/40 bg-violet-soft/60 px-6 py-3 font-mono text-2xl font-semibold tracking-[0.25em] text-violet">{created.code}</div>
          <div className="mt-5 flex w-full gap-2">
            <Btn variant="secondary" className="flex-1" onClick={() => navigator.clipboard?.writeText(created.code)}>
              <Copy /> Copy code
            </Btn>
            <Btn variant="violet" className="flex-1" onClick={close}>
              Done
            </Btn>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <Field label="Subject" htmlFor="cc-subject">
            <select id="cc-subject" className={inputClass} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
              {subjects.map((s) => (
                <option key={s.id} value={s.code}>
                  {s.code} · {s.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Section" htmlFor="cc-section" error={errors.section}>
              <input id="cc-section" className={inputClass} placeholder="CSE 5C" value={form.section} aria-invalid={!!errors.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            </Field>
            <Field label="Room" htmlFor="cc-room" error={errors.room}>
              <input id="cc-room" className={inputClass} placeholder="LH-206" value={form.room} aria-invalid={!!errors.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
            </Field>
          </div>
          <Field label="Schedule" htmlFor="cc-schedule" hint={<span className="text-[11px] text-muted-foreground">Optional</span>}>
            <input id="cc-schedule" className={inputClass} placeholder="Tue, Fri · 10:00" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Btn variant="secondary" onClick={close}>
              Cancel
            </Btn>
            <Btn type="submit" variant="violet" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Create classroom
            </Btn>
          </div>
        </form>
      )}
    </Modal>
  )
}

function AddSubjectDialog({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (s: TeacherSubject) => void }) {
  const [form, setForm] = useState({ code: '', name: '', credits: 3, type: 'Core' as TeacherSubject['type'] })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const close = () => {
    setForm({ code: '', name: '', credits: 3, type: 'Core' })
    setErrors({})
    onClose()
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!/^[A-Za-z]{2,4}\d{3}[A-Za-z]?$/.test(form.code.trim())) next.code = 'Use a course code like CS402.'
    if (form.name.trim().length < 3) next.name = 'Enter the subject name.'
    setErrors(next)
    if (Object.keys(next).length) return
    onCreate({ id: crypto.randomUUID(), code: form.code.trim().toUpperCase(), name: form.name.trim(), credits: form.credits, type: form.type, sections: [], hours: 0 })
    close()
  }

  return (
    <Modal open={open} onClose={close} title="Add subject" description="Subjects can be linked to classrooms after creation.">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-[120px_1fr] gap-3">
          <Field label="Code" htmlFor="as-code" error={errors.code}>
            <input id="as-code" className={cn(inputClass, 'font-mono uppercase')} placeholder="CS402" value={form.code} aria-invalid={!!errors.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </Field>
          <Field label="Name" htmlFor="as-name" error={errors.name}>
            <input id="as-name" className={inputClass} placeholder="Compiler Design" value={form.name} aria-invalid={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type" htmlFor="as-type">
            <select id="as-type" className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TeacherSubject['type'] })}>
              <option>Core</option>
              <option>Elective</option>
              <option>Lab</option>
            </select>
          </Field>
          <Field label="Credits" htmlFor="as-credits">
            <input id="as-credits" type="number" min={1} max={6} className={inputClass} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Btn variant="secondary" onClick={close}>
            Cancel
          </Btn>
          <Btn type="submit" variant="violet">
            Add subject
          </Btn>
        </div>
      </form>
    </Modal>
  )
}
