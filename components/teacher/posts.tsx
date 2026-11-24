'use client'

import { useState } from 'react'
import { BookMarked, ClipboardList, FileText, Loader2, Megaphone, MoreHorizontal, NotebookPen, Paperclip, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, CardHeader, EmptyState, Field, Segmented, inputClass } from '@/components/kit/primitives'
import { teacherClasses, teacherPosts, type Post } from '@/lib/data'

const kinds: { kind: Post['kind']; icon: typeof Megaphone; tone: 'brand' | 'violet' | 'warning' | 'success' }[] = [
  { kind: 'Notice', icon: Megaphone, tone: 'brand' },
  { kind: 'Notes', icon: BookMarked, tone: 'success' },
  { kind: 'Homework', icon: NotebookPen, tone: 'warning' },
  { kind: 'Assignment', icon: ClipboardList, tone: 'violet' },
]
const kindMeta = Object.fromEntries(kinds.map((k) => [k.kind, k])) as Record<Post['kind'], (typeof kinds)[number]>
const sections = Array.from(new Set(teacherClasses.map((c) => c.section)))

export function PostsView() {
  const [posts, setPosts] = useState<Post[]>(teacherPosts)
  const [filter, setFilter] = useState<'All' | Post['kind']>('All')
  const shown = filter === 'All' ? posts : posts.filter((p) => p.kind === filter)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr]">
      <Composer onPost={(p) => setPosts((l) => [p, ...l])} />
      <Card>
        <CardHeader title="Published" description={`${posts.length} items shared this semester`} />
        <div className="px-5 pt-4">
          <Segmented
            label="Filter posts"
            value={filter}
            onChange={setFilter}
            options={[{ value: 'All', label: 'All' }, ...kinds.map((k) => ({ value: k.kind, label: k.kind }))]}
          />
        </div>
        {shown.length === 0 ? (
          <EmptyState icon={<FileText className="size-5" />} title={`No ${filter.toLowerCase()} yet`} description="Use the composer to share your first one." />
        ) : (
          <ul className="flex flex-col divide-y divide-border px-2 py-2">
            {shown.map((p) => {
              const m = kindMeta[p.kind]
              const Icon = m.icon
              return (
                <li key={p.id} className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-lg',
                      { brand: 'bg-brand-soft text-primary', violet: 'bg-violet-soft text-violet', warning: 'bg-warning-soft text-[oklch(0.52_0.13_60)]', success: 'bg-success-soft text-success' }[m.tone],
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge tone={m.tone}>{p.kind}</Badge>
                      <span className="text-[11px] text-muted-foreground">{p.posted}</span>
                    </div>
                    <p className="mt-1 text-[13px] font-medium text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.target}
                      {p.due && ` · Due ${p.due}`} · {p.engagement}
                    </p>
                  </div>
                  <button className="grid size-7 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100 focus-visible:opacity-100" aria-label="More actions">
                    <MoreHorizontal className="size-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </div>
  )
}

function Composer({ onPost }: { onPost: (p: Post) => void }) {
  const [kind, setKind] = useState<Post['kind']>('Notice')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targets, setTargets] = useState<string[]>([sections[0]])
  const [due, setDue] = useState('')
  const [file, setFile] = useState<string>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const needsDue = kind === 'Homework' || kind === 'Assignment'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (title.trim().length < 4) next.title = 'Give it a clear title.'
    if (!targets.length) next.targets = 'Choose at least one section.'
    if (needsDue && !due) next.due = 'Set a due date.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => {
      onPost({
        id: crypto.randomUUID(),
        kind,
        title: title.trim(),
        target: targets.join(', '),
        posted: 'Just now',
        due: needsDue ? new Date(due).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : undefined,
        engagement: '0 seen',
      })
      setTitle('')
      setBody('')
      setDue('')
      setFile(undefined)
      setLoading(false)
    }, 500)
  }

  return (
    <Card className="h-fit lg:sticky lg:top-20">
      <CardHeader title="Compose" description="Publish to one or more sections" />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 p-5">
        <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Post type">
          {kinds.map((k) => {
            const Icon = k.icon
            const active = kind === k.kind
            return (
              <button
                key={k.kind}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setKind(k.kind)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border px-1 py-2.5 text-[11px] font-medium transition-all',
                  active ? 'border-violet/40 bg-violet-soft text-violet shadow-[var(--shadow-surface)]' : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {k.kind}
              </button>
            )
          })}
        </div>
        <Field label="Title" htmlFor="pc-title" error={errors.title}>
          <input id="pc-title" className={inputClass} value={title} aria-invalid={!!errors.title} onChange={(e) => setTitle(e.target.value)} placeholder={kind === 'Notice' ? 'Mid-semester exam schedule' : kind === 'Notes' ? 'Unit 4 — Dynamic Programming' : 'Problem set 6'} />
        </Field>
        <Field label="Details" htmlFor="pc-body" hint={<span className="text-[11px] text-muted-foreground">Optional</span>}>
          <textarea id="pc-body" rows={3} className={cn(inputClass, 'h-auto resize-none py-2')} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add instructions or context…" />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium">Sections</legend>
          <div className="flex flex-wrap gap-1.5">
            {sections.map((s) => {
              const on = targets.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTargets((t) => (on ? t.filter((x) => x !== s) : [...t, s]))}
                  className={cn('rounded-full border px-2.5 py-1 text-xs font-medium transition-colors', on ? 'border-violet/40 bg-violet-soft text-violet' : 'border-border text-muted-foreground hover:text-foreground')}
                >
                  {s}
                </button>
              )
            })}
          </div>
          {errors.targets && <p className="mt-1.5 text-xs text-danger">{errors.targets}</p>}
        </fieldset>
        {needsDue && (
          <Field label="Due date" htmlFor="pc-due" error={errors.due}>
            <input id="pc-due" type="date" className={inputClass} value={due} aria-invalid={!!errors.due} onChange={(e) => setDue(e.target.value)} />
          </Field>
        )}
        <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
          <label className="inline-flex cursor-pointer items-center gap-1.5 truncate text-xs font-medium text-muted-foreground hover:text-foreground">
            <Paperclip className="size-3.5" />
            <span className="truncate">{file ?? 'Attach file'}</span>
            <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name)} />
          </label>
          <Btn type="submit" variant="violet" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            Publish
          </Btn>
        </div>
      </form>
    </Card>
  )
}
