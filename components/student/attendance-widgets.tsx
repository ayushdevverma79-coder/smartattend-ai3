'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Calculator, CircleCheck, CircleX, Clock3, ShieldCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge, Card, CardHeader, ProgressBar, ProgressRing, Segmented, attendanceTone, inputClass } from '@/components/kit/primitives'
import { StackedBarChart, TrendAreaChart } from '@/components/charts/charts'
import {
  REQUIRED_ATTENDANCE,
  pct,
  recentActivity,
  studentSubjects,
  studentTotals,
  thisWeek,
  weeklyTrend,
  type ActivityItem,
  type AttendanceStatus,
  type Subject,
} from '@/lib/data'

export function classesToRecover(attended: number, total: number, target = REQUIRED_ATTENDANCE) {
  if (pct(attended, total) >= target) return 0
  return Math.ceil((target * total - 100 * attended) / (100 - target))
}

export function classesCanSkip(attended: number, total: number, target = REQUIRED_ATTENDANCE) {
  return Math.max(0, Math.floor((100 * attended - target * total) / target))
}

export function OverallAttendanceCard() {
  const overall = pct(studentTotals.attended, studentTotals.total)
  const skip = classesCanSkip(studentTotals.attended, studentTotals.total)
  return (
    <Card className="flex flex-col">
      <CardHeader title="Overall attendance" description="All subjects · Autumn 2026" action={<Badge tone={attendanceTone(overall)} dot>On track</Badge>} />
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        <ProgressRing
          value={overall}
          size={176}
          stroke={14}
          color="var(--violet)"
          label={
            <span className="text-4xl font-semibold tracking-tight tabular-nums text-foreground">
              {overall.toFixed(1)}
              <span className="text-xl text-muted-foreground">%</span>
            </span>
          }
          sublabel={<span className="mt-1 text-xs text-muted-foreground">{studentTotals.attended} of {studentTotals.total} classes</span>}
        />
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        <MiniStat label="Required" value={`${REQUIRED_ATTENDANCE}%`} />
        <MiniStat label="Safe to skip" value={`${skip}`} tone="text-success" />
        <MiniStat label="vs. cohort" value="+2.4%" tone="text-primary" />
      </div>
    </Card>
  )
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="px-4 py-3 text-center">
      <p className={cn('text-[15px] font-semibold tabular-nums text-foreground', tone)}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

export function TrendCard() {
  const [view, setView] = useState<'trend' | 'week'>('trend')
  return (
    <Card>
      <CardHeader
        title={view === 'trend' ? 'Attendance trend' : 'This week'}
        description={view === 'trend' ? 'Weekly attendance compared with your cohort' : 'Classes attended vs. missed per day'}
        action={
          <Segmented
            label="Chart view"
            value={view}
            onChange={setView}
            options={[
              { value: 'trend', label: '10 weeks' },
              { value: 'week', label: 'This week' },
            ]}
          />
        }
      />
      <div className="px-3 pb-3 pt-4">
        {view === 'trend' ? (
          <TrendAreaChart
            data={weeklyTrend}
            xKey="week"
            threshold={REQUIRED_ATTENDANCE}
            height={256}
            series={[
              { key: 'you', name: 'You', color: 'var(--chart-1)' },
              { key: 'cohort', name: 'Cohort avg', color: 'var(--chart-3)', dashed: true },
            ]}
          />
        ) : (
          <StackedBarChart
            data={thisWeek}
            xKey="day"
            height={256}
            series={[
              { key: 'present', name: 'Attended', color: 'var(--chart-1)' },
              { key: 'absent', name: 'Missed', color: 'oklch(0.85 0.06 25)' },
            ]}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <Legend color="var(--chart-1)" label={view === 'trend' ? 'You' : 'Attended'} />
        <Legend color={view === 'trend' ? 'var(--chart-3)' : 'oklch(0.85 0.06 25)'} label={view === 'trend' ? 'Cohort average' : 'Missed'} />
        {view === 'trend' && <Legend color="var(--danger)" label="75% requirement" dashed />}
      </div>
    </Card>
  )
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-0.5 w-3 rounded-full', dashed && 'border-t border-dashed bg-transparent')} style={dashed ? { borderColor: color } : { background: color }} aria-hidden />
      {label}
    </span>
  )
}

export function SubjectCard({ subject }: { subject: Subject }) {
  const p = pct(subject.attended, subject.total)
  const tone = attendanceTone(p)
  const recover = classesToRecover(subject.attended, subject.total)
  const skip = classesCanSkip(subject.attended, subject.total)
  return (
    <article className="group surface relative flex flex-col overflow-hidden p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]">
      <span className="absolute inset-x-0 top-0 h-0.5 opacity-80" style={{ background: subject.color }} aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-muted-foreground">{subject.code}</p>
          <h3 className="mt-0.5 truncate text-[13px] font-semibold text-foreground">{subject.name}</h3>
        </div>
        <span className={cn('text-lg font-semibold tabular-nums', tone === 'danger' ? 'text-danger' : 'text-foreground')}>
          {p.toFixed(0)}%
        </span>
      </div>
      <ProgressBar value={p} tone={tone} className="mt-3" />
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground tabular-nums">
          {subject.attended}/{subject.total} classes
        </span>
        {recover > 0 ? (
          <span className="font-medium text-danger">Attend {recover} more</span>
        ) : (
          <span className="text-muted-foreground">
            Can skip <span className="font-medium text-foreground">{skip}</span>
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-dashed border-border pt-3 text-[11px] text-muted-foreground">
        <span className="truncate">{subject.faculty}</span>
        <span className="shrink-0">{subject.schedule}</span>
      </div>
    </article>
  )
}

export function SubjectGrid({ limit }: { limit?: number }) {
  const list = limit ? studentSubjects.slice(0, limit) : studentSubjects
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {list.map((s) => (
        <SubjectCard key={s.id} subject={s} />
      ))}
    </div>
  )
}

export function ShortageAlerts() {
  const shortages = studentSubjects
    .map((s) => ({ ...s, p: pct(s.attended, s.total), need: classesToRecover(s.attended, s.total) }))
    .filter((s) => s.p < 80)
    .sort((a, b) => a.p - b.p)

  return (
    <Card>
      <CardHeader title="Shortage alerts" description="Subjects at risk of falling under 75%" action={<Badge tone="danger">{shortages.filter((s) => s.need > 0).length} critical</Badge>} />
      <ul className="flex flex-col gap-2 p-4">
        {shortages.map((s) => {
          const critical = s.need > 0
          return (
            <li
              key={s.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3',
                critical ? 'border-danger/15 bg-danger-soft/60' : 'border-warning/20 bg-warning-soft/60',
              )}
            >
              <span className={cn('mt-0.5 grid size-7 shrink-0 place-items-center rounded-md', critical ? 'bg-danger/10 text-danger' : 'bg-warning/15 text-[oklch(0.52_0.13_60)]')}>
                <TriangleAlert className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-foreground">{s.name}</p>
                  <span className={cn('text-[13px] font-semibold tabular-nums', critical ? 'text-danger' : 'text-[oklch(0.52_0.13_60)]')}>{s.p.toFixed(1)}%</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {critical
                    ? `Attend the next ${s.need} consecutive classes to reach 75%.`
                    : `Only ${classesCanSkip(s.attended, s.total)} absence left before shortage.`}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function RecoveryCalculator() {
  const [subjectId, setSubjectId] = useState(studentSubjects[2].id)
  const [target, setTarget] = useState(REQUIRED_ATTENDANCE)
  const [upcoming, setUpcoming] = useState(12)
  const [skips, setSkips] = useState(0)

  const s = studentSubjects.find((x) => x.id === subjectId)!
  const result = useMemo(() => {
    const current = pct(s.attended, s.total)
    const need = Math.max(0, Math.ceil((target * s.total - 100 * s.attended) / (100 - target)))
    const projected = pct(s.attended + (upcoming - skips), s.total + upcoming)
    const canSkip = Math.max(0, Math.floor((100 * (s.attended + upcoming) - target * (s.total + upcoming)) / 100))
    return { current, need, projected, canSkip, feasible: need <= upcoming }
  }, [s, target, upcoming, skips])

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Recovery calculator"
        description="Plan the classes you need to hit your goal"
        action={
          <span className="grid size-8 place-items-center rounded-lg bg-violet-soft text-violet">
            <Calculator className="size-4" />
          </span>
        }
      />
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="calc-subject" className="text-xs font-medium text-muted-foreground">
            Subject
          </label>
          <select id="calc-subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={inputClass}>
            {studentSubjects.map((x) => (
              <option key={x.id} value={x.id}>
                {x.code} · {x.name} ({pct(x.attended, x.total).toFixed(0)}%)
              </option>
            ))}
          </select>
        </div>
        <RangeField id="calc-target" label="Target attendance" value={target} min={60} max={95} step={5} suffix="%" onChange={setTarget} />
        <RangeField id="calc-upcoming" label="Classes left this term" value={upcoming} min={1} max={30} onChange={(v) => { setUpcoming(v); setSkips((k) => Math.min(k, v)) }} />
        <div className="sm:col-span-2">
          <RangeField id="calc-skips" label="Classes I plan to miss" value={skips} min={0} max={upcoming} onChange={setSkips} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
        <ResultCell label="Current" value={`${result.current.toFixed(1)}%`} />
        <ResultCell
          label="Must attend"
          value={result.need === 0 ? '—' : `${result.need}`}
          tone={result.need === 0 ? 'text-success' : result.feasible ? 'text-foreground' : 'text-danger'}
        />
        <ResultCell
          label="Projected"
          value={`${result.projected.toFixed(1)}%`}
          tone={result.projected >= target ? 'text-success' : 'text-danger'}
        />
      </div>
      <div
        className={cn(
          'flex items-start gap-2.5 px-5 py-3.5 text-[13px]',
          result.projected >= target ? 'bg-success-soft/70 text-[oklch(0.42_0.1_158)]' : 'bg-danger-soft/70 text-[oklch(0.48_0.17_25)]',
        )}
        aria-live="polite"
      >
        {result.projected >= target ? <ShieldCheck className="mt-0.5 size-4 shrink-0" /> : <TriangleAlert className="mt-0.5 size-4 shrink-0" />}
        <p>
          {result.projected >= target
            ? `You’ll finish at ${result.projected.toFixed(1)}%. You can afford up to ${result.canSkip} absences in ${s.code}.`
            : result.feasible
              ? `Missing ${skips} classes drops you to ${result.projected.toFixed(1)}%. Attend at least ${result.need} of the next ${upcoming}.`
              : `Reaching ${target}% isn’t possible this term — you’d need ${result.need} classes but only ${upcoming} remain.`}
        </p>
      </div>
    </Card>
  )
}

function RangeField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </label>
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
      />
    </div>
  )
}

function ResultCell({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-card px-4 py-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 text-lg font-semibold tabular-nums text-foreground', tone)}>{value}</p>
    </div>
  )
}

const statusMeta: Record<AttendanceStatus, { label: string; icon: typeof CircleCheck; cls: string; tone: 'success' | 'danger' | 'warning' | 'violet' }> = {
  present: { label: 'Present', icon: CircleCheck, cls: 'text-success bg-success-soft', tone: 'success' },
  absent: { label: 'Absent', icon: CircleX, cls: 'text-danger bg-danger-soft', tone: 'danger' },
  late: { label: 'Late', icon: Clock3, cls: 'text-[oklch(0.52_0.13_60)] bg-warning-soft', tone: 'warning' },
  excused: { label: 'On leave', icon: ShieldCheck, cls: 'text-violet bg-violet-soft', tone: 'violet' },
}

export function RecentActivity({ items = recentActivity, showLink = true }: { items?: ActivityItem[]; showLink?: boolean }) {
  return (
    <Card>
      <CardHeader
        title="Recent activity"
        description="Your latest attendance records"
        action={
          showLink && (
            <Link href="/student/attendance" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="size-3" />
            </Link>
          )
        }
      />
      <ol className="relative px-5 py-4">
        {items.map((a, i) => {
          const m = statusMeta[a.status]
          return (
            <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < items.length - 1 && <span className="absolute left-[13px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" aria-hidden />}
              <span className={cn('relative grid size-7 shrink-0 place-items-center rounded-full ring-4 ring-card', m.cls)}>
                <m.icon className="size-3.5" />
              </span>
              <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-foreground">{a.subject}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.date} · {a.time} · {a.room}
                  </p>
                </div>
                <Badge tone={m.tone}>{m.label}</Badge>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export function SubjectBreakdownTable() {
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Subject breakdown" description="Detailed attendance per subject" />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-y border-border bg-muted/50 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5 font-medium">Subject</th>
              <th className="px-3 py-2.5 font-medium">Faculty</th>
              <th className="px-3 py-2.5 text-right font-medium">Attended</th>
              <th className="w-48 px-3 py-2.5 font-medium">Attendance</th>
              <th className="px-5 py-2.5 text-right font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {studentSubjects.map((s) => {
              const p = pct(s.attended, s.total)
              const need = classesToRecover(s.attended, s.total)
              return (
                <tr key={s.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full" style={{ background: s.color }} aria-hidden />
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="font-mono text-[11px] text-muted-foreground">{s.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{s.faculty}</td>
                  <td className="px-3 py-3 text-right tabular-nums text-foreground">
                    {s.attended}
                    <span className="text-muted-foreground">/{s.total}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <ProgressBar value={p} tone={attendanceTone(p)} />
                      <span className="w-10 text-right font-medium tabular-nums">{p.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {need > 0 ? <Badge tone="danger">Need {need}</Badge> : <Badge tone={attendanceTone(p)}>{p >= 85 ? 'Healthy' : 'Watch'}</Badge>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
      {label} <ArrowUpRight className="size-3" />
    </Link>
  )
}
