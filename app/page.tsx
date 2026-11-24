import Link from 'next/link'
import { ArrowRight, BarChart3, BellRing, Calculator, CalendarClock, GraduationCap, KeyRound, Presentation, ShieldCheck } from 'lucide-react'
import { btn } from '@/components/kit/btn'
import { Logo } from '@/components/kit/logo'

const features = [
  { icon: BarChart3, title: 'Live attendance analytics', body: 'Subject, section and department trends with clear thresholds.' },
  { icon: BellRing, title: 'Shortage alerts', body: 'Students are warned well before they fall below 75%.' },
  { icon: Calculator, title: 'Recovery planner', body: 'Know exactly how many classes to attend to become eligible again.' },
  { icon: KeyRound, title: 'Class codes', body: 'Faculty create classrooms and students join in seconds.' },
  { icon: CalendarClock, title: 'Leave workflow', body: 'Apply, review and approve leave — synced to the register.' },
  { icon: ShieldCheck, title: 'Exportable reports', body: 'Eligibility and monthly registers in one click.' },
]

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="flex items-center gap-2" aria-label="Primary">
          <Link href="/login/teacher" className={btn({ variant: 'ghost', className: 'hidden sm:inline-flex' })}>
            Faculty login
          </Link>
          <Link href="/login/student" className={btn({ variant: 'navy' })}>
            Sign in
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 text-center md:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-surface)]">
            <span className="size-1.5 rounded-full bg-success" /> Built for Indian higher education
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
            Attendance intelligence for every classroom.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            SmartAttend AI gives students clarity on eligibility and gives faculty the analytics to act early — in one calm, fast workspace.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
            <PortalCard href="/login/student" icon={GraduationCap} title="Student portal" body="Attendance, recovery planner, leave & coursework" accent="brand" />
            <PortalCard href="/login/teacher" icon={Presentation} title="Faculty portal" body="Analytics, classrooms, approvals & reports" accent="violet" />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Exploring the demo?{' '}
            <Link href="/student" className="font-medium text-foreground hover:underline">
              Open student dashboard
            </Link>{' '}
            ·{' '}
            <Link href="/teacher" className="font-medium text-foreground hover:underline">
              Open faculty dashboard
            </Link>
          </p>
        </section>

        <section aria-labelledby="features-h" className="border-t border-border bg-card/60">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 id="features-h" className="text-sm font-semibold text-foreground">
              Everything attendance, nothing extra
            </h2>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <li key={f.title} className="bg-card p-6">
                  <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-primary">
                    <f.icon className="size-4" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
        <span>© 2026 SmartAttend AI</span>
        <span>Designed for students and faculty</span>
      </footer>
    </div>
  )
}

function PortalCard({ href, icon: Icon, title, body, accent }: { href: string; icon: typeof GraduationCap; title: string; body: string; accent: 'brand' | 'violet' }) {
  return (
    <Link href={href} className="surface group flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-raised)]">
      <span className={accent === 'brand' ? 'grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary' : 'grid size-11 shrink-0 place-items-center rounded-xl bg-violet-soft text-violet'}>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-foreground">{title}</span>
        <span className="block text-[13px] text-muted-foreground">{body}</span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  )
}
