'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TooltipPayload = { name?: string; value?: number | string; color?: string; payload?: Record<string, unknown> }

function ChartTooltip({
  active,
  payload,
  label,
  suffix = '',
}: {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string | number
  suffix?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-36 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-[var(--shadow-float)]">
      <p className="mb-1.5 font-medium text-foreground">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p) => (
          <div key={String(p.name)} className="flex items-center gap-2">
            <span className="size-2 rounded-sm" style={{ background: p.color }} aria-hidden />
            <span className="flex-1 text-muted-foreground">{p.name}</span>
            <span className="font-medium tabular-nums text-foreground">
              {p.value}
              {suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const axis = { stroke: 'var(--muted-foreground)', fontSize: 11, tickLine: false, axisLine: false } as const

export function TrendAreaChart({
  data,
  xKey,
  series,
  threshold,
  height = 240,
}: {
  data: Record<string, string | number>[]
  xKey: string
  series: { key: string; name: string; color: string; dashed?: boolean }[]
  threshold?: number
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={s.dashed ? 0 : 0.22} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis {...axis} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
        {threshold && (
          <ReferenceLine
            y={threshold}
            stroke="var(--danger)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={{ value: `${threshold}% min`, position: 'insideBottomRight', fill: 'var(--danger)', fontSize: 10 }}
          />
        )}
        <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ stroke: 'var(--border)' }} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color}
            strokeWidth={s.dashed ? 1.5 : 2}
            strokeDasharray={s.dashed ? '4 4' : undefined}
            fill={`url(#fill-${s.key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function StackedBarChart({
  data,
  xKey,
  series,
  height = 200,
}: {
  data: Record<string, string | number>[]
  xKey: string
  series: { key: string; name: string; color: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }} barSize={22}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis {...axis} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.6 }} />
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stackId="a"
            fill={s.color}
            radius={i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export function MultiLineChart({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: Record<string, string | number>[]
  xKey: string
  series: { key: string; color: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis {...axis} domain={[65, 100]} tickFormatter={(v) => `${v}%`} />
        <ReferenceLine y={75} stroke="var(--danger)" strokeDasharray="4 4" strokeOpacity={0.5} />
        <Tooltip content={<ChartTooltip suffix="%" />} cursor={{ stroke: 'var(--border)' }} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.key}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: s.color }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: 'var(--card)' }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export function HorizontalBars({
  data,
  height = 200,
}: {
  data: { band: string; students: number; fill: string }[]
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barSize={14}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="band" {...axis} width={64} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.6 }} />
        <Bar dataKey="students" name="Students" radius={[0, 4, 4, 0]} background={{ fill: 'var(--muted)', radius: 4 }}>
          {data.map((d) => (
            <Cell key={d.band} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
