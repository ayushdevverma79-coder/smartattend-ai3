import Link from 'next/link'
import type { ReactNode } from 'react'
import { BarChart3, CalendarCheck, CheckCircle2, GraduationCap, ShieldCheck, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/kit/logo'

export type Role = 'student' | 'teacher'

const copy: Record<Role, { eyebrow: string; title: string; body: string; points: { icon: typeof Users; text: string }[]; quote: string; author: string; meta: string }> = {
  student: {
    eyebrow: 'For students',
    title: 'Know exactly where you stand, in every subject.',
    body: 'Live attendance, shortage alerts and a recovery planner that tells you how many classes you can skip — or need to attend.',
    points: [
      { icon: CalendarCheck, text: 'Subject-wise attendance updated after every class' },
      { icon: ShieldCheck, text: 'Early warnings before you drop below 75%' },
      { icon: GraduationCap, text: 'Assignments, notes and notices in one place' },
    ],
    quote: 'I stopped guessing whether I could miss a lab. The recovery calculator is the first thing I open every Monday.',
    author: 'Ishita Rao',
    meta: 'B.Tech ECE, Semester 6',
  },
  teacher: {
    eyebrow: 'For faculty',
    title: 'Attendance analytics your department will actually use.',
    body: 'Spot low-attendance students early, approve leave in one click and export eligibility reports for every section.',
    points: [
      { icon: BarChart3, text: 'Section trends and distribution at a glance' },
      { icon: Users, text: 'Searchable roster with risk monitoring' },
      { icon: CheckCircle2, text: 'Leave approvals synced to the register' },
    ],
    quote: 'Detention lists used to take a full afternoon at semester end. Now it’s a single export.',
    author: 'Prof. Anand Kulkarni',
    meta: 'HoD, Mechanical Engineering',
  },
}

export function AuthShell({ role, children }: { role: Role; children: ReactNode }) {
  const c = copy[role]
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="SmartAttend AI home">
            <Logo />
          </Link>
          <RoleSwitch role={role} />
        </div>
        <main className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">{children}</main>
        <p className="text-center text-xs text-muted-foreground">
          © 2026 SmartAttend AI ·{' '}
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>{' '}
          ·{' '}
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
        </p>
      </div>

      <aside
        className={cn(
          'relative hidden overflow-hidden bg-navy p-10 text-navy-foreground lg:flex lg:flex-col lg:justify-between',
          role === 'teacher' && 'bg-[oklch(0.2_0.06_285)]',
        )}
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 opacity-90',
            role === 'student'
              ? 'bg-[radial-gradient(60%_50%_at_80%_10%,oklch(0.55_0.2_262/0.45),transparent),radial-gradient(40%_40%_at_10%_90%,oklch(0.55_0.2_290/0.3),transparent)]'
              : 'bg-[radial-gradient(60%_50%_at_80%_10%,oklch(0.55_0.2_292/0.45),transparent),radial-gradient(40%_40%_at_10%_90%,oklch(0.55_0.2_262/0.3),transparent)]',
          )}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
            <span className="size-1.5 rounded-full bg-[oklch(0.75_0.15_160)]" /> {c.eyebrow}
          </span>
          <h2 className="mt-6 max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight text-white">{c.title}</h2>
          <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-white/65">{c.body}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {c.points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-white/80">
                <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/5">
                  <p.icon className="size-4" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <PreviewCard role={role} />

        <figure className="relative max-w-md border-t border-white/10 pt-6">
          <blockquote className="text-pretty text-[15px] leading-relaxed text-white/85">“{c.quote}”</blockquote>
          <figcaption className="mt-3 text-xs text-white/50">
            <span className="font-medium text-white/80">{c.author}</span> · {c.meta}
          </figcaption>
        </figure>
      </aside>
    </div>
  )
}

function PreviewCard({ role }: { role: Role }) {
  const rows =
    role === 'student'
      ? [
          { l: 'Data Structures', v: 92 },
          { l: 'Operating Systems', v: 81 },
          { l: 'Computer Networks', v: 71 },
        ]
      : [
          { l: 'CSE 5A', v: 88 },
          { l: 'CSE 5B', v: 82 },
          { l: 'CSE 3A', v: 76 },
        ]
  return (
    <div className="relative my-8 max-w-sm rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/60">{role === 'student' ? 'Your attendance' : 'Section averages'}</p>
        <p className="text-xs text-white/40">This semester</p>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.l}>
            <div className="flex justify-between text-[13px]">
              <span className="text-white/80">{r.l}</span>
              <span className="tabular-nums text-white">{r.v}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={cn('h-full rounded-full', r.v < 75 ? 'bg-[oklch(0.7_0.17_25)]' : r.v < 85 ? 'bg-[oklch(0.8_0.14_75)]' : 'bg-[oklch(0.72_0.15_160)]')} style={{ width: `${r.v}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function RoleSwitch({ role }: { role: Role }) {
  return (
    <nav aria-label="Choose portal" className="inline-flex rounded-lg border border-border bg-muted p-0.5 text-xs font-medium">
      {(['student', 'teacher'] as const).map((r) => (
        <Link
          key={r}
          href={`/login/${r}`}
          aria-current={r === role ? 'page' : undefined}
          className={cn('rounded-md px-3 py-1.5 capitalize transition-all', r === role ? 'bg-card text-foreground shadow-[var(--shadow-surface)]' : 'text-muted-foreground hover:text-foreground')}
        >
          {r === 'teacher' ? 'Faculty' : 'Student'}
        </Link>
      ))}
    </nav>
  )
}
