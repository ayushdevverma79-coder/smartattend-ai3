import { PageHeader } from '@/components/kit/primitives'
import { LeaveApprovals } from '@/components/teacher/leave-approvals'

export const metadata = { title: 'Leave approvals' }

export default function TeacherLeavePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Requests" title="Leave approvals" description="Approved leave is automatically marked as excused in the attendance register." />
      <LeaveApprovals />
    </div>
  )
}
