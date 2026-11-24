import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-grid size-7 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand via-primary to-violet shadow-[0_1px_2px_oklch(0.3_0.15_268/0.4),inset_0_1px_0_oklch(1_0_0/0.25)]',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12.5l4.5 4.5L20 6" />
      </svg>
    </span>
  )
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className={cn('text-[15px] font-semibold tracking-tight', inverted ? 'text-white' : 'text-foreground')}>
        SmartAttend<span className={inverted ? 'text-white/50' : 'text-muted-foreground'}> AI</span>
      </span>
    </span>
  )
}
