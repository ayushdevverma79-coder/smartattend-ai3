import { PageHeader } from '@/components/kit/primitives'
import { PostsView } from '@/components/teacher/posts'

export const metadata = { title: 'Notices & work' }

export default function TeacherPostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Publish" title="Notices, notes & assignments" description="Share announcements, study material, homework and assignments with your sections." />
      <PostsView />
    </div>
  )
}
