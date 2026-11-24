'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown, Download, Mail, Search, Users, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn } from '@/components/kit/btn'
import { Avatar, Badge, Card, EmptyState, ProgressBar, Segmented, attendanceTone, inputClass } from '@/components/kit/primitives'
import { REQUIRED_ATTENDANCE, pct, teacherStudents, type StudentRow } from '@/lib/data'

export type StatusFilter = 'all' | 'healthy' | 'watch' | 'risk'
type SortKey = 'name' | 'roll' | 'pct' | 'trend'

const sections = ['All sections', ...Array.from(new Set(teacherStudents.map((s) => s.section)))]

const statusOf = (p: number): Exclude<StatusFilter, 'all'> => (p < REQUIRED_ATTENDANCE ? 'risk' : p < 85 ? 'watch' : 'healthy')

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function StudentsTable({ initialStatus = 'all' }: { initialStatus?: StatusFilter }) {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState(sections[0])
  const [status, setStatus] = useState<StatusFilter>(initialStatus)
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'pct', dir: 'asc' })
  const [selected, setSelected] = useState<string[]>([])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teacherStudents
      .map((s) => ({ ...s, p: pct(s.attended, s.total) }))
      .filter((s) => (section === sections[0] ? true : s.section === section))
      .filter((s) => (status === 'all' ? true : statusOf(s.p) === status))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q))
      .sort((a, b) => {
        const v =
          sort.key === 'name' ? a.name.localeCompare(b.name) : sort.key === 'roll' ? a.roll.localeCompare(b.roll) : sort.key === 'pct' ? a.p - b.p : a.trend - b.trend
        return sort.dir === 'asc' ? v : -v
      })
  }, [query, section, status, sort])

  const counts = useMemo(() => {
    const base = teacherStudents.filter((s) => section === sections[0] || s.section === section).map((s) => statusOf(pct(s.attended, s.total)))
    return { all: base.length, healthy: base.filter((x) => x === 'healthy').length, watch: base.filter((x) => x === 'watch').length, risk: base.filter((x) => x === 'risk').length }
  }, [section])

  const toggleSort = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const filtersActive = query || section !== sections[0] || status !== 'all'

  const exportRows = () =>
    downloadCsv('smartattend-students.csv', [
      ['Name', 'Roll', 'Section', 'Attended', 'Total', 'Attendance %', 'Trend'],
      ...rows.map((r) => [r.name, r.roll, r.section, r.attended, r.total, r.p.toFixed(1), r.trend]),
    ])

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or roll number"
              aria-label="Search students"
              className={cn(inputClass, 'pl-9')}
            />
          </div>
          <select value={section} onChange={(e) => setSection(e.target.value)} aria-label="Filter by section" className={cn(inputClass, 'sm:w-44')}>
            {sections.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <Segmented
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'All', count: counts.all },
            { value: 'healthy', label: 'Healthy', count: counts.healthy },
            { value: 'watch', label: 'Watch', count: counts.watch },
            { value: 'risk', label: 'At risk', count: counts.risk },
          ]}
        />
      </div>

      <div className="flex min-h-12 items-center justify-between gap-3 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        {selected.length > 0 ? (
          <div className="flex items-center gap-3">
            <span className="font-medium text-foreground">{selected.length} selected</span>
            <Btn size="sm" variant="secondary">
              <Mail /> Message
            </Btn>
            <button onClick={() => setSelected([])} className="hover:text-foreground">
              Clear
            </button>
          </div>
        ) : (
          <span>
            Showing <span className="font-medium text-foreground">{rows.length}</span> of {teacherStudents.length} students
            {filtersActive && (
              <button
                onClick={() => {
                  setQuery('')
                  setSection(sections[0])
                  setStatus('all')
                }}
                className="ml-2 inline-flex items-center gap-0.5 font-medium text-violet hover:underline"
              >
                <X className="size-3" /> Reset filters
              </button>
            )}
          </span>
        )}
        <Btn size="sm" variant="ghost" onClick={exportRows}>
          <Download /> Export CSV
        </Btn>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Users className="size-5" />} title="No students match" description="Try a different search term or clear the filters." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-y border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="w-10 px-4 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : rows.map((r) => r.id))}
                    className="size-3.5 accent-[var(--violet)]"
                  />
                </th>
                <SortTh label="Student" k="name" sort={sort} onSort={toggleSort} />
                <SortTh label="Roll no." k="roll" sort={sort} onSort={toggleSort} />
                <th className="px-3 py-2.5 font-medium">Section</th>
                <SortTh label="Attendance" k="pct" sort={sort} onSort={toggleSort} className="w-56" />
                <SortTh label="30-day trend" k="trend" sort={sort} onSort={toggleSort} align="right" />
                <th className="px-3 py-2.5 font-medium">Last present</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <Row key={r.id} r={r} selected={selected.includes(r.id)} onSelect={() => setSelected((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function Row({ r, selected, onSelect }: { r: StudentRow & { p: number }; selected: boolean; onSelect: () => void }) {
  const st = statusOf(r.p)
  return (
    <tr className={cn('transition-colors hover:bg-muted/40', selected && 'bg-violet-soft/50 hover:bg-violet-soft/70')}>
      <td className="px-4 py-3">
        <input type="checkbox" checked={selected} onChange={onSelect} aria-label={`Select ${r.name}`} className="size-3.5 accent-[var(--violet)]" />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={r.name} tone="navy" className="size-7 text-[10px]" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{r.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{r.email}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{r.roll}</td>
      <td className="px-3 py-3">
        <Badge tone="neutral">{r.section}</Badge>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <ProgressBar value={r.p} tone={attendanceTone(r.p)} />
          <span className="w-11 text-right font-medium tabular-nums">{r.p.toFixed(1)}%</span>
        </div>
        <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
          {r.attended}/{r.total} classes
        </p>
      </td>
      <td className={cn('px-3 py-3 text-right font-medium tabular-nums', r.trend > 0 ? 'text-success' : r.trend < 0 ? 'text-danger' : 'text-muted-foreground')}>
        {r.trend > 0 ? '+' : ''}
        {r.trend.toFixed(1)}%
      </td>
      <td className="px-3 py-3 text-muted-foreground">{r.lastSeen}</td>
      <td className="px-4 py-3 text-right">
        <Badge tone={st === 'risk' ? 'danger' : st === 'watch' ? 'warning' : 'success'} dot>
          {st === 'risk' ? 'At risk' : st === 'watch' ? 'Watch' : 'Healthy'}
        </Badge>
      </td>
    </tr>
  )
}

function SortTh({
  label,
  k,
  sort,
  onSort,
  className,
  align,
}: {
  label: string
  k: SortKey
  sort: { key: SortKey; dir: 'asc' | 'desc' }
  onSort: (k: SortKey) => void
  className?: string
  align?: 'right'
}) {
  const active = sort.key === k
  const Icon = !active ? ChevronsUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th className={cn('px-3 py-2.5 font-medium', className)} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button onClick={() => onSort(k)} className={cn('inline-flex items-center gap-1 uppercase tracking-wider hover:text-foreground', active && 'text-foreground', align === 'right' && 'ml-auto flex')}>
        {label}
        <Icon className="size-3" />
      </button>
    </th>
  )
}
