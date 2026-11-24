import { PageHeader } from '@/components/kit/primitives'
import {
  OverallAttendanceCard,
  RecentActivity,
  RecoveryCalculator,
  ShortageAlerts,
  SubjectBreakdownTable,
  TrendCard,
} from '@/components/student/attendance-widgets'

export const metadata = { title: 'Attendance' }

export default function StudentAttendancePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Attendance" title="Your attendance, in detail" description="Records are published by faculty after each session. Approved leave is marked as excused." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <OverallAttendanceCard />
        <TrendCard />
      </div>
      <SubjectBreakdownTable />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecoveryCalculator />
        <ShortageAlerts />
      </div>
      <RecentActivity showLink={false} />
    </div>
  )
}
