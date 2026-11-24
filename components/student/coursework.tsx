'use client'

import { useState } from 'react'
import { ArrowRight, Download, FileText, Link2, Megaphone, PlayCircle, Pin, Presentation } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, CardHeader, Segmented } from '@/components/kit/primitives'
import { announcements, assignments, materials, type Assignment, type Material } from '@/lib/data'

const kindIcon: Record<Material['kind'], typeof FileText> = { PDF: FileText, Slides: Presentation, Video: PlayCircle, Link: Link2 }

export function AssignmentsCard({ compact }: { compact?: boolean }) {
  const [items, setItems] = useState<Assignment[]>(assignments)
  const list = compact ? items.filter((a) => a.status === 'todo') : items
  return (
    <Card>
      <CardHeader
        title={compact ? 'Due soon' : 'Assignments'}
        description={compact ? 'Upcoming deadlines' : 'Submit before the deadline to keep your streak'}
        action={
          compact && (
            <Link href="/student/coursework" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All work <ArrowRight className="size-3" />
            </Link>
          )
        }
      />
      <ul className="flex flex-col gap-2 p-4">
        {list.map((a) => (
          <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-[oklch(0.86_0.015_264)] hover:bg-muted/40">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground">{a.subject}</span>
                {a.status === 'todo' && a.dueIn.includes('2') && <Badge tone="danger">Due {a.dueIn}</Badge>}
              </div>
              <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground">Due {a.due}</p>
            </div>
            {a.status === 'todo' ? (
              <Btn size="sm" variant="secondary" onClick={() => setItems((x) => x.map((i) => (i.id === a.id ? { ...i, status: 'submitted', dueIn: 'Submitted' } : i)))}>
                Mark submitted
              </Btn>
            ) : a.status === 'submitted' ? (
              <Badge tone="brand" dot>
                Submitted
              </Badge>
            ) : (
              <Badge tone="success">Graded · {a.grade}</Badge>
            )}
          </li>
        ))}
        {list.length === 0 && <li className="py-6 text-center text-[13px] text-muted-foreground">You&apos;re all caught up.</li>}
      </ul>
    </Card>
  )
}

export function AnnouncementsCard({ limit }: { limit?: number }) {
  const list = limit ? announcements.slice(0, limit) : announcements
  const tagTone = { Exam: 'danger', Event: 'violet', Notice: 'brand', Holiday: 'success' } as const
  return (
    <Card>
      <CardHeader title="Announcements" description="From faculty and administration" />
      <ul className="flex flex-col divide-y divide-border px-5 py-2">
        {list.map((n) => (
          <li key={n.id} className="py-3">
            <div className="flex items-center gap-2">
              <Badge tone={tagTone[n.tag]}>{n.tag}</Badge>
              {n.pinned && <Pin className="size-3 text-muted-foreground" aria-label="Pinned" />}
              <span className="ml-auto text-[11px] text-muted-foreground">{n.time}</span>
            </div>
            <p className="mt-1.5 text-[13px] font-medium text-foreground">{n.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Megaphone className="size-3" /> {n.author}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function MaterialsCard() {
  const [kind, setKind] = useState<'all' | Material['kind']>('all')
  const list = kind === 'all' ? materials : materials.filter((m) => m.kind === kind)
  return (
    <Card>
      <CardHeader title="Study materials" description="Notes, slides and recordings shared by faculty" />
      <div className="px-5 pt-4">
        <Segmented
          label="Filter materials"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'All' },
            { value: 'PDF', label: 'Notes' },
            { value: 'Slides', label: 'Slides' },
            { value: 'Video', label: 'Videos' },
            { value: 'Link', label: 'Links' },
          ]}
        />
      </div>
      <ul className="flex flex-col gap-1 p-3">
        {list.map((m) => {
          const Icon = kindIcon[m.kind]
          return (
            <li key={m.id} className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/60">
              <span
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg',
                  m.kind === 'PDF' && 'bg-danger-soft text-danger',
                  m.kind === 'Slides' && 'bg-warning-soft text-[oklch(0.52_0.13_60)]',
                  m.kind === 'Video' && 'bg-violet-soft text-violet',
                  m.kind === 'Link' && 'bg-brand-soft text-primary',
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono">{m.subject}</span> · {m.size} · {m.added}
                </p>
              </div>
              <button
                className="grid size-8 place-items-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-card hover:text-foreground hover:shadow-[var(--shadow-surface)] focus-visible:opacity-100 group-hover:opacity-100"
                aria-label={`Download ${m.title}`}
              >
                <Download className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
