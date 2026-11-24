import { PageHeader } from '@/components/kit/primitives'
import { LowAttendanceMonitor } from '@/components/teacher/analytics'
import { StudentsTable, type StatusFilter } from '@/components/teacher/students-table'

export const metadata = { title: 'Students' }

export default async function TeacherStudentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const initial: StatusFilter = status === 'risk' || status === 'watch' || status === 'healthy' ? status : 'all'
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Roster" title="Students" description="Search, filter and sort every student across your sections." />
      <StudentsTable key={initial} initialStatus={initial} />
      <LowAttendanceMonitor />
    </div>
  )
}
