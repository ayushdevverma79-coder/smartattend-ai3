import Link from 'next/link'
import { BookOpen, Download, GraduationCap, Percent, Plus, School } from 'lucide-react'
import { btn } from '@/components/kit/btn'
import { PageHeader } from '@/components/kit/primitives'
import { StatCard } from '@/components/kit/stat-card'
import { DistributionCard, LowAttendanceMonitor, SectionTrendCard, TodaySchedule, WeeklySessionsCard } from '@/components/teacher/analytics'
import { LeaveApprovals } from '@/components/teacher/leave-approvals'
import { teacher, teacherClasses, teacherSubjects } from '@/lib/data'

export const metadata = { title: 'Overview' }

export default function TeacherOverviewPage() {
  const totalStudents = teacherClasses.reduce((a, c) => a + c.students, 0)
  const weighted = teacherClasses.reduce((a, c) => a + c.avg * c.students, 0) / totalStudents

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={teacher.department}
        title={`Good morning, ${teacher.firstName}`}
        description="Here’s how your sections are tracking this semester."
        actions={
          <>
            <Link href="/teacher/reports" className={btn({ variant: 'secondary' })}>
              <Download /> Reports
            </Link>
            <Link href="/teacher/classrooms" className={btn({ variant: 'violet' })}>
              <Plus /> New classroom
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total students" value={String(totalStudents)} icon={GraduationCap} delta={3.4} deltaLabel="vs. last sem" accent="violet" spark={[190, 196, 201, 205, 212]} />
        <StatCard label="Active classes" value={String(teacherClasses.length)} icon={School} accent="brand" />
        <StatCard label="Subjects" value={String(teacherSubjects.length)} icon={BookOpen} accent="brand" />
        <StatCard label="Avg. attendance" value={`${weighted.toFixed(1)}%`} icon={Percent} delta={2.6} deltaLabel="this month" accent="success" spark={[89, 86, 83, 80, 83.5]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,340px)]">
        <SectionTrendCard />
        <DistributionCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,340px)]">
        <WeeklySessionsCard />
        <TodaySchedule />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LowAttendanceMonitor limit={5} />
        <LeaveApprovals compact />
      </div>
    </div>
  )
}
