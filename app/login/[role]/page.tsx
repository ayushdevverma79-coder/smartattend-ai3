import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { AuthShell, type Role } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/auth-forms'

const roles = ['student', 'teacher'] as const

export function generateStaticParams() {
  return roles.map((role) => ({ role }))
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params
  return { title: role === 'teacher' ? 'Faculty sign in' : 'Student sign in' }
}

export default async function LoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  if (!roles.includes(role as Role)) notFound()
  return (
    <AuthShell role={role as Role}>
      <LoginForm role={role as Role} />
    </AuthShell>
  )
}
