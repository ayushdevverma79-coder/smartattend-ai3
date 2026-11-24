import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaLabel,
  accent = 'violet',
  spark,
}: {
  label: string
  value: string
  icon: LucideIcon
  delta?: number
  deltaLabel?: string
  accent?: 'violet' | 'brand' | 'success' | 'danger'
  spark?: number[]
}) {
  const accentCls = {
    violet: 'bg-violet-soft text-violet',
    brand: 'bg-brand-soft text-primary',
    success: 'bg-success-soft text-success',
    danger: 'bg-danger-soft text-danger',
  }[accent]
  const stroke = { violet: 'var(--violet)', brand: 'var(--primary)', success: 'var(--success)', danger: 'var(--danger)' }[accent]
  const up = (delta ?? 0) >= 0

  return (
    <div className="surface group relative overflow-hidden p-5 transition-shadow hover:shadow-[var(--shadow-raised)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <span className={cn('grid size-8 place-items-center rounded-lg', accentCls)}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-foreground">{value}</p>
          {delta !== undefined && (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <span className={cn('inline-flex items-center gap-0.5 font-medium', up ? 'text-success' : 'text-danger')}>
                {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {up ? '+' : ''}
                {delta}%
              </span>
              {deltaLabel}
            </p>
          )}
        </div>
        {spark && <Sparkline values={spark} color={stroke} />}
      </div>
    </div>
  )
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 72
  const h = 28
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
