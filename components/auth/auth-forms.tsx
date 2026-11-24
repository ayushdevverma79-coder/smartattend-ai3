'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Mail, MailCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Btn, btn } from '@/components/kit/btn'
import { Field, inputClass } from '@/components/kit/primitives'
import type { Role } from './auth-shell'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function PasswordInput({ id, value, onChange, invalid, autoComplete, placeholder }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean; autoComplete: string; placeholder?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, 'h-10 pr-10')}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

function Heading({ title, description }: { title: string; description: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function SubmitButton({ loading, children, role }: { loading: boolean; children: React.ReactNode; role: Role }) {
  return (
    <Btn type="submit" size="lg" variant={role === 'teacher' ? 'violet' : 'primary'} disabled={loading} className="mt-1 w-full">
      {loading ? <Loader2 className="animate-spin" /> : null}
      {children}
      {!loading && <ArrowRight />}
    </Btn>
  )
}

export function LoginForm({ role }: { role: Role }) {
  const router = useRouter()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ id?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (!id.trim()) next.id = role === 'student' ? 'Enter your college email or roll number.' : 'Enter your faculty email.'
    else if (role === 'teacher' && !EMAIL_RE.test(id.trim())) next.id = 'That doesn’t look like a valid email.'
    if (!password) next.password = 'Enter your password.'
    else if (password.length < 8) next.password = 'Passwords are at least 8 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => router.push(`/${role}`), 700)
  }

  return (
    <>
      <Heading
        title={role === 'student' ? 'Welcome back' : 'Faculty sign in'}
        description={role === 'student' ? 'Sign in to view your attendance and coursework.' : 'Access your sections, analytics and approvals.'}
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label={role === 'student' ? 'Email or roll number' : 'Faculty email'} htmlFor="login-id" error={errors.id}>
          <input
            id="login-id"
            autoComplete="username"
            value={id}
            onChange={(e) => setId(e.target.value)}
            aria-invalid={!!errors.id || undefined}
            aria-describedby={errors.id ? 'login-id-error' : undefined}
            placeholder={role === 'student' ? 'CS21B047 or you@college.edu' : 'you@college.edu'}
            className={cn(inputClass, 'h-10')}
          />
        </Field>
        <Field
          label="Password"
          htmlFor="login-password"
          error={errors.password}
          hint={
            <Link href={`/forgot-password?role=${role}`} className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="login-password" value={password} onChange={setPassword} invalid={!!errors.password} autoComplete="current-password" placeholder="••••••••" />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-3.5 accent-[var(--primary)]" />
          Keep me signed in on this device
        </label>
        <SubmitButton loading={loading} role={role}>
          Sign in
        </SubmitButton>
      </form>
      <Divider />
      <p className="text-center text-[13px] text-muted-foreground">
        {role === 'student' ? 'New to SmartAttend?' : 'Joining your department?'}{' '}
        <Link href={`/register?role=${role}`} className="font-medium text-foreground hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}

function Divider() {
  return <div className="my-6 h-px bg-border" aria-hidden />
}

function strength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

export function RegisterForm({ role }: { role: Role }) {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', idNo: '', dept: '', password: '', agree: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))
  const s = strength(form.password)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid institutional email.'
    if (!form.idNo.trim()) next.idNo = role === 'student' ? 'Roll number is required.' : 'Employee ID is required.'
    if (!form.dept) next.dept = 'Select your department.'
    if (s < 3) next.password = 'Use 8+ characters with a mix of cases, numbers or symbols.'
    if (!form.agree) next.agree = 'Please accept the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => router.push(`/${role}`), 800)
  }

  const input = (k: 'name' | 'email' | 'idNo', label: string, placeholder: string, auto: string) => (
    <Field label={label} htmlFor={`reg-${k}`} error={errors[k]}>
      <input
        id={`reg-${k}`}
        autoComplete={auto}
        value={form[k]}
        onChange={(e) => set(k, e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!errors[k] || undefined}
        aria-describedby={errors[k] ? `reg-${k}-error` : undefined}
        className={cn(inputClass, 'h-10')}
      />
    </Field>
  )

  return (
    <>
      <Heading
        title={role === 'student' ? 'Create your student account' : 'Create your faculty account'}
        description={
          <>
            Already registered?{' '}
            <Link href={`/login/${role}`} className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </>
        }
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        {input('name', 'Full name', role === 'student' ? 'Aarav Mehta' : 'Dr. Priya Raman', 'name')}
        {input('email', 'Institutional email', 'you@college.edu', 'email')}
        <div className="grid grid-cols-2 gap-3">
          {input('idNo', role === 'student' ? 'Roll number' : 'Employee ID', role === 'student' ? 'CS21B047' : 'FAC-2041', 'off')}
          <Field label="Department" htmlFor="reg-dept" error={errors.dept}>
            <select id="reg-dept" value={form.dept} onChange={(e) => set('dept', e.target.value)} aria-invalid={!!errors.dept || undefined} className={cn(inputClass, 'h-10')}>
              <option value="">Select…</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
              <option>Civil</option>
              <option>Information Tech.</option>
            </select>
          </Field>
        </div>
        <Field label="Password" htmlFor="reg-password" error={errors.password}>
          <PasswordInput id="reg-password" value={form.password} onChange={(v) => set('password', v)} invalid={!!errors.password} autoComplete="new-password" placeholder="At least 8 characters" />
          {form.password && (
            <div className="flex items-center gap-2" aria-live="polite">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={cn('h-1 flex-1 rounded-full bg-muted transition-colors', i < s && (s <= 1 ? 'bg-danger' : s === 2 ? 'bg-warning' : 'bg-success'))} />
                ))}
              </div>
              <span className="w-12 text-right text-[11px] text-muted-foreground">{['Weak', 'Weak', 'Fair', 'Good', 'Strong'][s]}</span>
            </div>
          )}
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-2 text-[13px] text-muted-foreground">
            <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5 size-3.5 accent-[var(--primary)]" />
            <span>
              I agree to the{' '}
              <a href="#" className="text-foreground underline-offset-2 hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-foreground underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
          {errors.agree && (
            <p className="mt-1 text-xs text-danger" role="alert">
              {errors.agree}
            </p>
          )}
        </div>
        <SubmitButton loading={loading} role={role}>
          Create account
        </SubmitButton>
      </form>
    </>
  )
}

export function ForgotPasswordForm({ role }: { role: Role }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) return setError('Enter the email linked to your account.')
    setError(undefined)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 700)
  }

  if (sent)
    return (
      <div className="flex flex-col">
        <span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success">
          <MailCheck className="size-5" />
        </span>
        <Heading title="Check your inbox" description={<>If an account exists for <span className="font-medium text-foreground">{email}</span>, you’ll receive a reset link within a few minutes.</>} />
        <ul className="-mt-2 mb-6 flex flex-col gap-2 text-[13px] text-muted-foreground">
          {['The link expires in 30 minutes', 'Check spam or promotions folders', 'Contact your department admin if it doesn’t arrive'].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="size-3.5 text-success" /> {t}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Btn variant="secondary" className="flex-1" onClick={() => setSent(false)}>
            Use a different email
          </Btn>
          <Link href={`/login/${role}`} className={btn({ variant: 'navy', className: 'flex-1' })}>
            Back to sign in
          </Link>
        </div>
      </div>
    )

  return (
    <>
      <Link href={`/login/${role}`} className="mb-6 inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to sign in
      </Link>
      <span className="mb-4 grid size-11 place-items-center rounded-xl bg-brand-soft text-primary">
        <Mail className="size-5" />
      </span>
      <Heading title="Reset your password" description="Enter your institutional email and we’ll send you a secure reset link." />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Email" htmlFor="fp-email" error={error}>
          <input
            id="fp-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? 'fp-email-error' : undefined}
            placeholder="you@college.edu"
            className={cn(inputClass, 'h-10')}
          />
        </Field>
        <SubmitButton loading={loading} role={role}>
          Send reset link
        </SubmitButton>
      </form>
    </>
  )
}
