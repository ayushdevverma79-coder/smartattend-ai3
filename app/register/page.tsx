import { AuthShell } from '@/components/auth/auth-shell'
import { RegisterForm } from '@/components/auth/auth-forms'

export const metadata = { title: 'Create account' }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role: r } = await searchParams
  const role = r === 'teacher' ? 'teacher' : 'student'
  return (
    <AuthShell role={role}>
      <RegisterForm key={role} role={role} />
    </AuthShell>
  )
}
