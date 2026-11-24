import { PageHeader } from '@/components/kit/primitives'
import { LeaveView } from '@/components/student/leave'

export const metadata = { title: 'Leave' }

export default function StudentLeavePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Leave" title="Leave applications" description="Request leave and follow its review. Approved leave won’t count against your attendance." />
      <LeaveView />
    </div>
  )
}
