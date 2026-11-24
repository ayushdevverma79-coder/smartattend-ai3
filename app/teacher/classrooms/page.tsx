import { PageHeader } from '@/components/kit/primitives'
import { ClassroomManager } from '@/components/teacher/classrooms'

export const metadata = { title: 'Classrooms' }

export default function TeacherClassroomsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Manage" title="Classrooms & subjects" description="Create classrooms, share join codes and organise the subjects you teach." />
      <ClassroomManager />
    </div>
  )
}
