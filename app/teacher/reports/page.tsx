import { PageHeader } from '@/components/kit/primitives'
import { ReportsView } from '@/components/teacher/reports'

export const metadata = { title: 'Reports' }

export default function TeacherReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Analytics" title="Attendance reports" description="Section-level reports generated from published attendance records." />
      <ReportsView />
    </div>
  )
}
