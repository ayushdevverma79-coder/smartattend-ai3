import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'navy' | 'danger' | 'success' | 'violet'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[0_1px_2px_oklch(0.3_0.15_268/0.3),inset_0_1px_0_oklch(1_0_0/0.15)] hover:bg-[oklch(0.48_0.2_268)]',
  secondary:
    'border border-border bg-card text-foreground shadow-[var(--shadow-surface)] hover:bg-muted hover:border-[oklch(0.87_0.012_264)]',
  ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  navy: 'bg-navy text-navy-foreground shadow-[0_1px_2px_oklch(0.2_0.05_268/0.4),inset_0_1px_0_oklch(1_0_0/0.1)] hover:bg-[oklch(0.26_0.06_268)]',
  danger: 'border border-danger/20 bg-danger-soft text-danger hover:bg-danger/10',
  success: 'border border-success/20 bg-success-soft text-success hover:bg-success/10',
  violet:
    'bg-violet text-white shadow-[0_1px_2px_oklch(0.3_0.15_290/0.3),inset_0_1px_0_oklch(1_0_0/0.15)] hover:bg-[oklch(0.5_0.2_292)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-7 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5',
  md: 'h-9 gap-2 px-3.5 text-[13px] [&_svg]:size-4',
  lg: 'h-10 gap-2 px-4 text-sm [&_svg]:size-4',
  icon: 'size-9 [&_svg]:size-4',
}

export function btn({ variant = 'primary', size = 'md', className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Btn({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={btn({ variant, size, className })} {...props} />
}
