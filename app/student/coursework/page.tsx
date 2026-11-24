import { PageHeader } from '@/components/kit/primitives'
import { AnnouncementsCard, AssignmentsCard, MaterialsCard } from '@/components/student/coursework'

export const metadata = { title: 'Coursework' }

export default function StudentCourseworkPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Coursework" title="Materials, assignments & announcements" description="Everything your faculty has shared, in one place." />
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,380px)]">
        <div className="flex flex-col gap-6">
          <AssignmentsCard />
          <MaterialsCard />
        </div>
        <AnnouncementsCard />
      </div>
    </div>
  )
}
