'use client'

import { useMemo, useState } from 'react'
import { CalendarRange, Download, FileSpreadsheet, FileText, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Badge, Card, CardHeader, ProgressBar, Segmented, attendanceTone, inputClass } from '@/components/kit/primitives'
import { TrendAreaChart } from '@/components/charts/charts'
import { REQUIRED_ATTENDANCE, monthlyAttendance, pct, teacherClasses, teacherStudents } from '@/lib/data'
import { downloadCsv } from './students-table'

type Range = '1m' | '3m' | 'sem'
const sectionList = teacherClasses.map((c) => c.section)

export function ReportsView() {
  const [section, setSection] = useState(sectionList[0])
  const [range, setRange] = useState<Range>('sem')

  const months = range === '1m' ? 2 : range === '3m' ? 3 : 5
  const series = monthlyAttendance.slice(-months).map((m) => ({ label: m.month, value: m[section as keyof typeof m] as number }))
  const cls = teacherClasses.find((c) => c.section === section)!
  const students = useMemo(() => teacherStudents.filter((s) => s.section === section).map((s) => ({ ...s, p: pct(s.attended, s.total) })), [section])
  const below = students.filter((s) => s.p < REQUIRED_ATTENDANCE)
  const sessions = students[0]?.total ?? 0
  const peak = Math.max(...series.map((s) => s.value))
  const low = Math.min(...series.map((s) => s.value))

  const exportCsv = () =>
    downloadCsv(`attendance-${section.replace(/\s+/g, '-').toLowerCase()}-${range}.csv`, [
      ['Section', section, 'Subject', cls.name],
      [],
      ['Name', 'Roll', 'Attended', 'Total', 'Attendance %', 'Eligible'],
      ...students.map((s) => [s.name, s.roll, s.attended, s.total, s.p.toFixed(1), s.p >= REQUIRED_ATTENDANCE ? 'Yes' : 'No']),
    ])

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select aria-label="Section" value={section} onChange={(e) => setSection(e.target.value)} className={cn(inputClass, 'sm:w-56')}>
              {teacherClasses.map((c) => (
                <option key={c.id} value={c.section}>
                  {c.section} · {c.subject}
                </option>
              ))}
            </select>
            <Segmented
              label="Date range"
              value={range}
              onChange={setRange}
              options={[
                { value: '1m', label: 'Last month' },
                { value: '3m', label: '3 months' },
                { value: 'sem', label: 'Semester' },
              ]}
            />
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => window.print()}>
              <Printer /> Print
            </Btn>
            <Btn variant="violet" onClick={exportCsv}>
              <Download /> Export CSV
            </Btn>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Section average" value={`${cls.avg.toFixed(1)}%`} sub={cls.name} />
        <Metric label="Sessions conducted" value={String(sessions)} sub="Lectures + labs" />
        <Metric label="Peak month" value={`${peak}%`} sub={`Lowest ${low}%`} />
        <Metric label="Below 75%" value={String(below.length)} sub={`of ${students.length} on roll`} danger={below.length > 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,360px)]">
        <Card>
          <CardHeader title={`${section} attendance over time`} description={cls.name} action={<Badge tone="violet"><CalendarRange className="size-3" /> {range === 'sem' ? 'Jul – Nov' : range === '3m' ? 'Sep – Nov' : 'Oct – Nov'}</Badge>} />
          <div className="px-3 pb-3 pt-4">
            <TrendAreaChart data={series} xKey="label" series={[{ key: 'value', name: section, color: 'var(--violet)' }]} height={260} threshold={REQUIRED_ATTENDANCE} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Eligibility snapshot" description="Students on this roll" />
          <ul className="flex flex-col gap-3 p-5">
            {students
              .sort((a, b) => a.p - b.p)
              .map((s) => (
                <li key={s.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="truncate font-medium">{s.name}</span>
                    <span className="tabular-nums text-muted-foreground">{s.p.toFixed(1)}%</span>
                  </div>
                  <ProgressBar value={s.p} tone={attendanceTone(s.p)} />
                </li>
              ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Saved report templates" description="Generated from your published attendance records" />
        <ul className="grid gap-3 p-5 md:grid-cols-3">
          {[
            { icon: FileSpreadsheet, title: 'Monthly attendance register', meta: 'CSV · all sections' },
            { icon: FileText, title: 'Detention eligibility list', meta: 'CSV · below 75%' },
            { icon: FileText, title: 'Semester summary for HoD', meta: 'CSV · aggregated' },
          ].map((t) => (
            <li key={t.title}>
              <button onClick={exportCsv} className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-violet/30 hover:bg-violet-soft/40">
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <t.icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{t.title}</span>
                  <span className="block text-[11px] text-muted-foreground">{t.meta}</span>
                </span>
                <Download className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Metric({ label, value, sub, danger }: { label: string; value: string; sub: string; danger?: boolean }) {
  return (
    <div className="surface p-5">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className={cn('mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums', danger && 'text-danger')}>{value}</p>
      <p className="mt-2 truncate text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
