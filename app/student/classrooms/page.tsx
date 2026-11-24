import { PageHeader } from '@/components/kit/primitives'
import { ClassroomsView } from '@/components/student/join-classroom'

export const metadata = { title: 'Classrooms' }

export default function StudentClassroomsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Classrooms" title="Your classrooms" description="Join a classroom with the code your teacher shares to start receiving attendance and coursework." />
      <ClassroomsView />
    </div>
  )
}
