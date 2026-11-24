'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, Inbox, Paperclip, X } from 'lucide-react'
import { Btn } from '@/components/kit/btn'
import { Avatar, Badge, Card, CardHeader, EmptyState, Segmented } from '@/components/kit/primitives'
import { leaveStatusMeta } from '@/components/student/leave'
import { teacher, teacherLeaves, type LeaveApplication, type LeaveStatus } from '@/lib/data'

export function LeaveApprovals({ compact }: { compact?: boolean }) {
  const [list, setList] = useState<LeaveApplication[]>(teacherLeaves)
  const [filter, setFilter] = useState<'all' | LeaveStatus>('pending')
  const decide = (id: string, status: LeaveStatus) => setList((l) => l.map((x) => (x.id === id ? { ...x, status, reviewer: teacher.name } : x)))

  const pending = list.filter((l) => l.status === 'pending')
  const shown = compact ? pending.slice(0, 3) : filter === 'all' ? list : list.filter((l) => l.status === filter)

  return (
    <Card>
      <CardHeader
        title={compact ? 'Leave requests' : 'Leave applications'}
        description={`${pending.length} awaiting your review`}
        action={
          compact && (
            <Link href="/teacher/leave" className="inline-flex items-center gap-1 text-xs font-medium text-violet hover:underline">
              Review all <ArrowRight className="size-3" />
            </Link>
          )
        }
      />
      {!compact && (
        <div className="px-5 pt-4">
          <Segmented
            label="Filter leave"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'pending', label: 'Pending', count: pending.length },
              { value: 'approved', label: 'Approved', count: list.filter((l) => l.status === 'approved').length },
              { value: 'rejected', label: 'Declined', count: list.filter((l) => l.status === 'rejected').length },
              { value: 'all', label: 'All', count: list.length },
            ]}
          />
        </div>
      )}
      {shown.length === 0 ? (
        <EmptyState icon={<Inbox className="size-5" />} title="Inbox zero" description="No leave applications need your attention right now." />
      ) : (
        <ul className="flex flex-col gap-2 p-4">
          {shown.map((l) => {
            const m = leaveStatusMeta[l.status]
            return (
              <li key={l.id} className="rounded-lg border border-border p-3.5 transition-colors hover:border-[oklch(0.86_0.015_264)]">
                <div className="flex items-start gap-3">
                  <Avatar name={l.student!} tone="violet" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-[13px] font-semibold">{l.student}</p>
                      <span className="font-mono text-[11px] text-muted-foreground">{l.roll}</span>
                      <Badge tone="neutral">{l.className}</Badge>
                      <span className="ml-auto text-[11px] text-muted-foreground">{l.submitted}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{l.type}</span> · {l.from}
                      {l.from !== l.to && ` – ${l.to}`} · {l.days} {l.days === 1 ? 'day' : 'days'}
                    </p>
                    {!compact && <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{l.reason}</p>}
                    {!compact && l.type === 'Medical' && (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary">
                        <Paperclip className="size-3" /> medical-certificate.pdf
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  {l.status === 'pending' ? (
                    <>
                      <Btn size="sm" variant="ghost" className="text-danger hover:bg-danger-soft hover:text-danger" onClick={() => decide(l.id, 'rejected')}>
                        <X /> Decline
                      </Btn>
                      <Btn size="sm" variant="success" onClick={() => decide(l.id, 'approved')}>
                        <Check /> Approve
                      </Btn>
                    </>
                  ) : (
                    <Badge tone={m.tone} dot>
                      {m.label}
                    </Badge>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
