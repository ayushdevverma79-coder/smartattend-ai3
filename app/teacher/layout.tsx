import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/app-shell'

export const metadata: Metadata = { title: { default: 'Faculty', template: '%s · Faculty · SmartAttend AI' } }

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="teacher">{children}</AppShell>
}
