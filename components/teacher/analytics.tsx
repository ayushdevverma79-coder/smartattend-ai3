'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Clock, MapPin, Send, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Avatar, Badge, Card, CardHeader, ProgressBar, attendanceTone } from '@/components/kit/primitives'
import { HorizontalBars, MultiLineChart, StackedBarChart } from '@/components/charts/charts'
import { REQUIRED_ATTENDANCE, dailySessions, distribution, monthlyAttendance, pct, teacherClasses, teacherStudents } from '@/lib/data'

const sectionColors: Record<string, string> = {
  'CSE 5A': 'var(--chart-1)',
  'CSE 5B': 'var(--chart-3)',
  'M.Tech 1': 'var(--chart-4)',
  'CSE 1C': 'var(--chart-5)',
}

export function SectionTrendCard() {
  const [hidden, setHidden] = useState<string[]>([])
  const keys = Object.keys(sectionColors)
  return (
    <Card>
      <CardHeader title="Attendance by section" description="Monthly average · July – November" />
      <div className="flex flex-wrap gap-1.5 px-5 pt-4">
        {keys.map((k) => {
          const off = hidden.includes(k)
          return (
            <button
              key={k}
              onClick={() => setHidden((h) => (off ? h.filter((x) => x !== k) : [...h, k]))}
              aria-pressed={!off}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all',
                off ? 'border-border text-muted-foreground opacity-60' : 'border-border bg-card text-foreground shadow-[var(--shadow-surface)]',
              )}
            >
              <span className="size-2 rounded-full" style={{ background: sectionColors[k] }} aria-hidden />
              {k}
            </button>
          )
        })}
      </div>
      <div className="px-3 pb-3 pt-3">
        <MultiLineChart data={monthlyAttendance} xKey="month" series={keys.filter((k) => !hidden.includes(k)).map((k) => ({ key: k, color: sectionColors[k] }))} height={268} />
      </div>
    </Card>
  )
}

export function DistributionCard() {
  const total = distribution.reduce((a, d) => a + d.students, 0)
  return (
    <Card className="flex flex-col">
      <CardHeader title="Distribution" description={`${total} students across all sections`} />
      <div className="flex-1 px-3 pt-4">
        <HorizontalBars data={distribution} height={176} />
      </div>
      <div className="grid grid-cols-2 gap-px border-t border-border bg-border">
        <div className="bg-card px-5 py-3">
          <p className="text-[11px] text-muted-foreground">Above requirement</p>
          <p className="text-lg font-semibold tabular-nums text-success">{(((distribution[0].students + distribution[1].students) / total) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-card px-5 py-3">
          <p className="text-[11px] text-muted-foreground">Needs intervention</p>
          <p className="text-lg font-semibold tabular-nums text-danger">{distribution[2].students + distribution[3].students}</p>
        </div>
      </div>
    </Card>
  )
}

export function WeeklySessionsCard() {
  return (
    <Card>
      <CardHeader title="This week’s sessions" description="Students present vs. absent per day" />
      <div className="px-3 pb-3 pt-4">
        <StackedBarChart
          data={dailySessions}
          xKey="day"
          height={220}
          series={[
            { key: 'present', name: 'Present', color: 'var(--violet)' },
            { key: 'absent', name: 'Absent', color: 'oklch(0.88 0.04 290)' },
          ]}
        />
      </div>
    </Card>
  )
}

export function TodaySchedule() {
  const today = [
    { ...teacherClasses[0], time: '09:00 – 09:50', state: 'done' as const, present: 58 },
    { ...teacherClasses[3], time: '14:00 – 15:40', state: 'next' as const, present: 0 },
    { ...teacherClasses[1], time: '16:00 – 16:50', state: 'later' as const, present: 0 },
  ]
  return (
    <Card>
      <CardHeader title="Today’s schedule" description="Tuesday, 24 November" />
      <ul className="flex flex-col gap-2 p-4">
        {today.map((c) => (
          <li
            key={c.id}
            className={cn(
              'relative flex flex-col gap-1 overflow-hidden rounded-lg border p-3 pl-4',
              c.state === 'next' ? 'border-violet/25 bg-violet-soft/60' : 'border-border',
            )}
          >
            <span className={cn('absolute inset-y-0 left-0 w-[3px]', c.state === 'next' ? 'bg-violet' : c.state === 'done' ? 'bg-success' : 'bg-border')} aria-hidden />
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[13px] font-medium">{c.name}</p>
              {c.state === 'done' && <Badge tone="success">{c.present}/{c.students} present</Badge>}
              {c.state === 'next' && <Badge tone="violet" dot>Up next</Badge>}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{c.section}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {c.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" />
                {c.room}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function LowAttendanceMonitor({ limit }: { limit?: number }) {
  const [nudged, setNudged] = useState<string[]>([])
  const atRisk = teacherStudents
    .map((s) => ({ ...s, p: pct(s.attended, s.total) }))
    .filter((s) => s.p < 80)
    .sort((a, b) => a.p - b.p)
  const list = limit ? atRisk.slice(0, limit) : atRisk

  return (
    <Card>
      <CardHeader
        title="Low-attendance monitoring"
        description={`${atRisk.filter((s) => s.p < REQUIRED_ATTENDANCE).length} students below ${REQUIRED_ATTENDANCE}%`}
        action={
          limit ? (
            <Link href="/teacher/students?status=risk" className="inline-flex items-center gap-1 text-xs font-medium text-violet hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          ) : (
            <Badge tone="danger">
              <TriangleAlert className="size-3" /> At risk
            </Badge>
          )
        }
      />
      <ul className="flex flex-col divide-y divide-border px-2 py-2">
        {list.map((s) => (
          <li key={s.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <Avatar name={s.name} tone="navy" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13px] font-medium">{s.name}</p>
                <span className={cn('text-[13px] font-semibold tabular-nums', s.p < REQUIRED_ATTENDANCE ? 'text-danger' : 'text-[oklch(0.52_0.13_60)]')}>{s.p.toFixed(1)}%</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <ProgressBar value={s.p} tone={attendanceTone(s.p)} className="flex-1" />
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {s.section} · {s.trend > 0 ? '+' : ''}
                  {s.trend}%
                </span>
              </div>
            </div>
            <Btn
              size="sm"
              variant={nudged.includes(s.id) ? 'success' : 'secondary'}
              onClick={() => setNudged((n) => [...n, s.id])}
              disabled={nudged.includes(s.id)}
              aria-label={`Send reminder to ${s.name}`}
            >
              <Send />
              <span className="hidden sm:inline">{nudged.includes(s.id) ? 'Sent' : 'Remind'}</span>
            </Btn>
          </li>
        ))}
      </ul>
    </Card>
  )
}
