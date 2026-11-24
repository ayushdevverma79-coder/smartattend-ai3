import { WelcomeHero } from '@/components/student/welcome-hero'
import {
  OverallAttendanceCard,
  QuickLink,
  RecentActivity,
  RecoveryCalculator,
  ShortageAlerts,
  SubjectGrid,
  TrendCard,
} from '@/components/student/attendance-widgets'
import { AnnouncementsCard, AssignmentsCard } from '@/components/student/coursework'

export const metadata = { title: 'Overview' }

export default function StudentOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <WelcomeHero />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <OverallAttendanceCard />
        <TrendCard />
      </div>

      <section aria-labelledby="subjects-heading" className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 id="subjects-heading" className="text-sm font-semibold tracking-tight">
            Subject-wise attendance
          </h2>
          <QuickLink href="/student/attendance" label="Detailed breakdown" />
        </div>
        <SubjectGrid />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ShortageAlerts />
        <RecoveryCalculator />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RecentActivity />
        <AssignmentsCard compact />
        <AnnouncementsCard limit={3} />
      </div>
    </div>
  )
}
