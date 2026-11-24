'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn('surface', className)}>{children}</section>
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

type Tone = 'neutral' | 'brand' | 'violet' | 'success' | 'warning' | 'danger'

const toneMap: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground ring-border',
  brand: 'bg-brand-soft text-primary ring-primary/15',
  violet: 'bg-violet-soft text-violet ring-violet/15',
  success: 'bg-success-soft text-success ring-success/20',
  warning: 'bg-warning-soft text-[oklch(0.52_0.13_60)] ring-warning/25',
  danger: 'bg-danger-soft text-danger ring-danger/20',
}

export function Badge({
  tone = 'neutral',
  children,
  dot,
  className,
}: {
  tone?: Tone
  children: ReactNode
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap',
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  )
}

export function attendanceTone(pct: number): Tone {
  if (pct >= 85) return 'success'
  if (pct >= 75) return 'warning'
  return 'danger'
}

export function ProgressRing({
  value,
  size = 168,
  stroke = 12,
  label,
  sublabel,
  color = 'var(--primary)',
}: {
  value: number
  size?: number
  stroke?: number
  label?: ReactNode
  sublabel?: ReactNode
  color?: string
}) {
  const id = useId()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(value, 100) / 100) * c
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label}
        {sublabel}
      </div>
    </div>
  )
}

export function ProgressBar({ value, tone = 'brand', className }: { value: number; tone?: Tone; className?: string }) {
  const bar: Record<Tone, string> = {
    neutral: 'bg-muted-foreground',
    brand: 'bg-primary',
    violet: 'bg-violet',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={cn('h-full rounded-full transition-all duration-700', bar[tone])} style={{ width: `${value}%` }} />
    </div>
  )
}

export function Avatar({ name, className, tone = 'brand' }: { name: string; className?: string; tone?: 'brand' | 'violet' | 'navy' }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const bg = {
    brand: 'bg-gradient-to-br from-brand to-primary',
    violet: 'bg-gradient-to-br from-violet to-primary',
    navy: 'bg-gradient-to-br from-[oklch(0.35_0.08_268)] to-navy',
  }[tone]
  return (
    <span
      className={cn(
        'inline-grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white ring-2 ring-card',
        bg,
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} />
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-b from-accent to-transparent" aria-hidden />
        <div className="relative grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground shadow-[var(--shadow-raised)]">
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-medium text-primary">{eyebrow}</p>}
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className={cn(
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-0 text-foreground shadow-[var(--shadow-float)] backdrop:bg-navy/40 backdrop:backdrop-blur-[2px] open:animate-in open:fade-in-0 open:zoom-in-95',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 id={titleId} className="text-[15px] font-semibold tracking-tight">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-lg bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
            value === o.value
              ? 'bg-card text-foreground shadow-[var(--shadow-surface)]'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn('tabular-nums', value === o.value ? 'text-muted-foreground' : 'opacity-70')}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: ReactNode
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-foreground">
          {label}
        </label>
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-[var(--shadow-surface)] outline-none transition-all placeholder:text-muted-foreground/70 hover:border-[oklch(0.85_0.015_264)] focus:border-ring focus:ring-3 focus:ring-ring/15 aria-invalid:border-danger aria-invalid:ring-danger/15'
