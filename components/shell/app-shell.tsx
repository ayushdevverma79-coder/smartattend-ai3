'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarClock,
  ChevronsUpDown,
  CircleCheck,
  CornerDownLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  School,
  Search,
  Settings,
  Sparkles,
  TriangleAlert,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/kit/primitives'
import { Logo, LogoMark } from '@/components/kit/logo'
import { student, teacher } from '@/lib/data'

type Role = 'student' | 'teacher'
type NavItem = { href: string; label: string; icon: LucideIcon; badge?: string }

const NAV: Record<Role, { section: string; items: NavItem[] }[]> = {
  student: [
    {
      section: 'Workspace',
      items: [
        { href: '/student', label: 'Overview', icon: LayoutDashboard },
        { href: '/student/attendance', label: 'Attendance', icon: CalendarCheck },
        { href: '/student/classrooms', label: 'Classrooms', icon: School },
      ],
    },
    {
      section: 'Academics',
      items: [
        { href: '/student/leave', label: 'Leave', icon: CalendarClock, badge: '1' },
        { href: '/student/coursework', label: 'Coursework', icon: BookOpen, badge: '2' },
      ],
    },
  ],
  teacher: [
    {
      section: 'Teaching',
      items: [
        { href: '/teacher', label: 'Overview', icon: LayoutDashboard },
        { href: '/teacher/classrooms', label: 'Classrooms', icon: School },
        { href: '/teacher/students', label: 'Students', icon: Users },
      ],
    },
    {
      section: 'Operations',
      items: [
        { href: '/teacher/reports', label: 'Reports', icon: BarChart3 },
        { href: '/teacher/leave', label: 'Leave approvals', icon: CalendarClock, badge: '3' },
        { href: '/teacher/posts', label: 'Notices & work', icon: Megaphone },
      ],
    },
  ],
}

const NOTIFICATIONS: Record<Role, { id: string; icon: LucideIcon; tone: string; title: string; body: string; time: string }[]> = {
  student: [
    { id: '1', icon: TriangleAlert, tone: 'text-danger bg-danger-soft', title: 'Operating Systems below 75%', body: 'Attend the next 7 classes to recover.', time: '12m' },
    { id: '2', icon: CircleCheck, tone: 'text-success bg-success-soft', title: 'Leave approved', body: 'Dr. Priya Raman approved your medical leave.', time: '2h' },
    { id: '3', icon: FileText, tone: 'text-primary bg-brand-soft', title: 'New assignment in CS301', body: 'Dijkstra with a binary heap · due Nov 26', time: '3d' },
  ],
  teacher: [
    { id: '1', icon: CalendarClock, tone: 'text-violet bg-violet-soft', title: '3 leave requests pending', body: 'Oldest request is 3 days old.', time: '8m' },
    { id: '2', icon: TriangleAlert, tone: 'text-danger bg-danger-soft', title: '6 students under 75%', body: 'Arjun Patel dropped 8.4% this month.', time: '1h' },
    { id: '3', icon: FileText, tone: 'text-primary bg-brand-soft', title: '41 submissions received', body: 'Dijkstra with a binary heap · CSE 5A', time: '5h' },
  ],
}

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])
  return ref
}

const isActive = (pathname: string, href: string) =>
  href === '/student' || href === '/teacher' ? pathname === href : pathname.startsWith(href)

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMobileOpen(false), [pathname])

  return (
    <div className="min-h-dvh bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col transition-[width] duration-300 ease-out lg:flex',
          collapsed ? 'w-[68px]' : 'w-[248px]',
        )}
      >
        <Sidebar role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-navy/40 backdrop-blur-[2px] animate-in fade-in-0" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <div className="relative h-full w-[264px] animate-in slide-in-from-left duration-300">
            <Sidebar role={role} collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className={cn('flex min-h-dvh flex-col transition-[padding] duration-300 ease-out', collapsed ? 'lg:pl-[68px]' : 'lg:pl-[248px]')}>
        <Topbar role={role} onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}

function Sidebar({ role, collapsed, onToggle, onClose }: { role: Role; collapsed: boolean; onToggle?: () => void; onClose?: () => void }) {
  const pathname = usePathname()
  const dark = role === 'teacher'
  const user = role === 'student' ? student : teacher

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r',
        dark ? 'border-white/[0.06] bg-navy text-navy-foreground' : 'border-sidebar-border bg-sidebar text-sidebar-foreground',
      )}
    >
      <div className={cn('flex h-14 items-center gap-2', collapsed ? 'justify-center px-0' : 'justify-between px-4')}>
        <Link href={`/${role}`} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="SmartAttend AI home">
          {collapsed ? <LogoMark /> : <Logo inverted={dark} />}
        </Link>
        {onClose && (
          <button onClick={onClose} className="grid size-8 place-items-center rounded-md text-current/70 hover:bg-white/10" aria-label="Close navigation">
            <X className="size-4" />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 pb-2">
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-lg border px-2.5 py-2',
              dark ? 'border-white/[0.08] bg-white/[0.04]' : 'border-border bg-muted/60',
            )}
          >
            <span
              className={cn(
                'grid size-6 place-items-center rounded-md text-[10px] font-bold',
                dark ? 'bg-violet/25 text-[oklch(0.82_0.1_290)]' : 'bg-brand-soft text-primary',
              )}
              aria-hidden
            >
              NIT
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate text-xs font-medium', dark ? 'text-white' : 'text-foreground')}>{student.institution}</p>
              <p className={cn('truncate text-[11px]', dark ? 'text-white/50' : 'text-muted-foreground')}>
                {role === 'student' ? 'Student portal' : 'Faculty workspace'}
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Main">
        {NAV[role].map((group) => (
          <div key={group.section} className="mb-5">
            {!collapsed && (
              <p className={cn('mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider', dark ? 'text-white/35' : 'text-muted-foreground/80')}>
                {group.section}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'group relative flex h-8 items-center gap-2.5 rounded-md text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring',
                        collapsed ? 'justify-center px-0' : 'px-2',
                        dark
                          ? active
                            ? 'bg-white/[0.09] text-white'
                            : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                          : active
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground',
                      )}
                    >
                      {active && (
                        <span
                          className={cn('absolute -left-3 top-1.5 h-5 w-[3px] rounded-r-full', dark ? 'bg-violet' : 'bg-primary')}
                          aria-hidden
                        />
                      )}
                      <item.icon
                        className={cn(
                          'size-4 shrink-0',
                          active ? (dark ? 'text-[oklch(0.78_0.13_290)]' : 'text-primary') : 'opacity-80',
                        )}
                      />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span
                          className={cn(
                            'grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-semibold tabular-nums',
                            dark ? 'bg-violet/30 text-white' : 'bg-primary/10 text-primary',
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge && (
                        <span className={cn('absolute right-2 top-1.5 size-1.5 rounded-full', dark ? 'bg-violet' : 'bg-primary')} aria-hidden />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div
            className={cn(
              'relative overflow-hidden rounded-xl border p-3.5',
              dark
                ? 'border-white/[0.08] bg-gradient-to-br from-violet/25 via-white/[0.03] to-transparent'
                : 'border-primary/10 bg-gradient-to-br from-brand-soft via-card to-card',
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className={cn('size-3.5', dark ? 'text-[oklch(0.8_0.12_290)]' : 'text-primary')} />
              <p className={cn('text-xs font-semibold', dark ? 'text-white' : 'text-foreground')}>
                {role === 'student' ? 'Attendance insight' : 'Weekly digest'}
              </p>
            </div>
            <p className={cn('mt-1.5 text-[12px] leading-relaxed', dark ? 'text-white/60' : 'text-muted-foreground')}>
              {role === 'student'
                ? 'You’re 2 classes away from clearing the OS shortage window.'
                : 'CSE 5B attendance improved 3.0% after last week’s reminders.'}
            </p>
          </div>
        </div>
      )}

      <div className={cn('border-t p-3', dark ? 'border-white/[0.06]' : 'border-sidebar-border')}>
        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          {!collapsed && (
            <>
              <Avatar name={user.name.replace('Dr. ', '')} tone={dark ? 'violet' : 'brand'} className={dark ? 'ring-navy' : ''} />
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-[13px] font-medium', dark ? 'text-white' : 'text-foreground')}>{user.name}</p>
                <p className={cn('truncate text-[11px]', dark ? 'text-white/50' : 'text-muted-foreground')}>
                  {role === 'student' ? student.roll : teacher.designation}
                </p>
              </div>
            </>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className={cn(
                'grid size-8 place-items-center rounded-md transition-colors',
                dark ? 'text-white/60 hover:bg-white/[0.06] hover:text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Topbar({ role, onMenu }: { role: Role; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </button>
        <CommandSearch role={role} />
        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={cn(
              'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset sm:inline-flex',
              role === 'student' ? 'bg-brand-soft text-primary ring-primary/15' : 'bg-violet-soft text-violet ring-violet/15',
            )}
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-current" />
            </span>
            {role === 'student' ? 'Autumn term · Week 10' : 'Faculty · Autumn 2026'}
          </span>
          <Notifications role={role} />
          <ProfileMenu role={role} />
        </div>
      </div>
    </header>
  )
}

function CommandSearch({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const ref = useDismiss(open, () => setOpen(false))

  const items = useMemo(() => NAV[role].flatMap((g) => g.items.map((i) => ({ ...i, section: g.section }))), [role])
  const results = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (href: string) => {
    router.push(href)
    setOpen(false)
    setQ('')
    inputRef.current?.blur()
  }

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setIndex((i) => Math.min(i + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229 && results[index]) {
            go(results[index].href)
          }
        }}
        placeholder={role === 'student' ? 'Search subjects, coursework…' : 'Search students, classes…'}
        aria-label="Search"
        role="combobox"
        aria-expanded={open}
        aria-controls="command-results"
        className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-14 text-[13px] shadow-[var(--shadow-surface)] outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/15"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
        ⌘K
      </kbd>
      {open && (
        <div
          id="command-results"
          role="listbox"
          className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-[var(--shadow-float)] animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1"
        >
          <p className="px-2 pb-1 pt-1.5 text-[11px] font-medium text-muted-foreground">Jump to</p>
          {results.length === 0 ? (
            <p className="px-2 py-6 text-center text-[13px] text-muted-foreground">No results for “{q}”</p>
          ) : (
            results.map((r, i) => (
              <button
                key={r.href}
                role="option"
                aria-selected={i === index}
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(r.href)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-[13px] transition-colors',
                  i === index ? 'bg-muted text-foreground' : 'text-muted-foreground',
                )}
              >
                <r.icon className="size-4" />
                <span className="flex-1">{r.label}</span>
                <span className="text-[11px] text-muted-foreground">{r.section}</span>
                {i === index && <CornerDownLeft className="size-3.5 text-muted-foreground" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function Notifications({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const [read, setRead] = useState<string[]>([])
  const ref = useDismiss(open, () => setOpen(false))
  const items = NOTIFICATIONS[role]
  const unread = items.filter((i) => !read.includes(i.id)).length

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Notifications, ${unread} unread`}
        aria-expanded={open}
      >
        <Bell className="size-4" />
        {unread > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-background" aria-hidden />}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-float)] animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-[13px] font-semibold">Notifications</p>
            <button
              onClick={() => setRead(items.map((i) => i.id))}
              className="text-xs font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
              disabled={unread === 0}
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto p-1.5">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setRead((r) => [...r, n.id])}
                  className="flex w-full gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted"
                >
                  <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', n.tone)}>
                    <n.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="flex-1 truncate text-[13px] font-medium text-foreground">{n.title}</span>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
                  </span>
                  {!read.includes(n.id) && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ProfileMenu({ role }: { role: Role }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const user = role === 'student' ? student : teacher
  const other = role === 'student' ? 'teacher' : 'student'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-muted"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <Avatar name={user.name.replace('Dr. ', '')} tone={role === 'teacher' ? 'violet' : 'brand'} className="size-7" />
        <span className="hidden text-[13px] font-medium md:inline">{user.firstName}</span>
        <ChevronsUpDown className="hidden size-3.5 text-muted-foreground md:inline" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-60 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-[var(--shadow-float)] animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1">
          <div className="px-2.5 py-2">
            <p className="text-[13px] font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="my-1 h-px bg-border" />
          <MenuLink href={`/${role}`} icon={UserRound} label="My profile" />
          <MenuLink href={`/${role}`} icon={Settings} label="Preferences" />
          <MenuLink href={`/${other}`} icon={Sparkles} label={`Preview ${other} portal`} />
          <div className="my-1 h-px bg-border" />
          <MenuLink href={`/login/${role}`} icon={LogOut} label="Sign out" />
        </div>
      )}
    </div>
  )
}

function MenuLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-foreground transition-colors hover:bg-muted">
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </Link>
  )
}
