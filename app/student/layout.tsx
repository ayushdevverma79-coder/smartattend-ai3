import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/app-shell'

export const metadata: Metadata = { title: { default: 'Student', template: '%s · Student · SmartAttend AI' } }

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="student">{children}</AppShell>
}
