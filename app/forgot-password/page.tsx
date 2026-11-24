import { AuthShell } from '@/components/auth/auth-shell'
import { ForgotPasswordForm } from '@/components/auth/auth-forms'

export const metadata = { title: 'Reset password' }

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role: r } = await searchParams
  const role = r === 'teacher' ? 'teacher' : 'student'
  return (
    <AuthShell role={role}>
      <ForgotPasswordForm role={role} />
    </AuthShell>
  )
}
