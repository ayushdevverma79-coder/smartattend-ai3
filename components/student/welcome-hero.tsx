'use client'

import { useState } from 'react'
import { CalendarClock, KeyRound, MapPin, Plus } from 'lucide-react'
import { Btn } from '@/components/kit/btn'
import { pct, student, studentTotals } from '@/lib/data'
import { JoinClassroomDialog } from './join-classroom'
import { ApplyLeaveDialog } from './leave'

export function WelcomeHero() {
  const [joinOpen, setJoinOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[oklch(0.3_0.08_268)] bg-navy text-navy-foreground shadow-[var(--shadow-raised)]">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden />
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-brand/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 right-48 size-72 rounded-full bg-violet/25 blur-3xl" aria-hidden />

      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
        <div className="max-w-xl">
          <p className="text-xs font-medium text-white/55">Tuesday, 24 November · {student.semester}</p>
          <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-white md:text-[28px]">
            Good morning, {student.firstName}.
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-white/65">
            You&apos;re attending <span className="font-medium text-white">{pct(studentTotals.attended, studentTotals.total).toFixed(1)}%</span> of classes this term — above the
            requirement. One subject needs attention before mid-semester exams.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn onClick={() => setJoinOpen(true)} className="bg-white text-navy shadow-none hover:bg-white/90">
              <KeyRound /> Join classroom
            </Btn>
            <Btn
              onClick={() => setLeaveOpen(true)}
              className="border border-white/15 bg-white/[0.06] text-white shadow-none hover:bg-white/[0.12]"
            >
              <Plus /> Apply for leave
            </Btn>
          </div>
        </div>

        <div className="w-full rounded-xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur md:w-72">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">Up next</p>
            <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-medium text-[oklch(0.85_0.12_158)]">in 35 min</span>
          </div>
          <p className="mt-2 text-[15px] font-semibold text-white">Database Management Systems</p>
          <p className="text-xs text-white/55">Prof. Karthik Iyer</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-white/65">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5" /> 11:00 – 11:50
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" /> LH-210
            </span>
          </div>
        </div>
      </div>

      <JoinClassroomDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
      <ApplyLeaveDialog open={leaveOpen} onClose={() => setLeaveOpen(false)} />
    </section>
  )
}
