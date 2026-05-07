'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import TvarahLogo from '../../../components/TvarahLogo'
import WebBackground from '../../../components/WebBackground'
import './login.css'

type Step = 'credentials' | 'otp' | 'reset'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [step, setStep] = useState<Step>('credentials')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.status === 401) {
        setError('Invalid credentials. Please try again.')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }
      setStep('otp')
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch {
      setError('Unable to connect. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpValue }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Invalid OTP. Please try again.')
        return
      }
      const { token } = data.data
      localStorage.setItem('access_token', token.access_token)
      localStorage.setItem('refresh_token', token.refresh_token)
      if (remember) localStorage.setItem('remember_email', email)
      router.push('/dashboard')
    } catch {
      setError('Unable to connect. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = Array(6).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  function handleResend() {
    setOtp(['', '', '', '', '', ''])
    setError('')
    setStep('credentials')
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email address above first.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message || 'Could not send reset email. Please try again.')
        return
      }
      setStep('reset')
    } catch {
      setError('Unable to connect. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">
      <WebBackground />

      {/* ── Left branding panel ── */}
      <div className="auth-brand">
        <TvarahLogo variant="light" size="xl" />

        <h1 className="auth-brand-tagline">
          Quality-Driven,<br />
          <span className="auth-brand-tagline-grad">High-Velocity Hiring.</span>
        </h1>

        <p className="auth-brand-sub">
          Built by professionals with vast leadership experience in AI, data, and business strategy, Tvarah was created to bring clarity, accountability, and long-term thinking back into technical hiring. We don't believe hiring is a numbers game — every placement is a commitment to the client, to the candidate, and to the standard of excellence that defines high-performing teams. Our platform enforces that standard at every step of the funnel.
        </p>

        <div className="auth-brand-features">
          {[
            { icon: <PipelineIcon />, text: 'Visual pipeline with real-time candidate status' },
            { icon: <TeamIcon />,     text: 'Collaborative panel interviews and scorecards' },
            { icon: <ClientIcon />,   text: 'Client-facing job orders and talent tracking' },
            { icon: <DataIcon />,     text: 'AI-scored profiles with structured evaluation data' },
          ].map((f, i) => (
            <div key={i} className="auth-brand-feature">
              <div className="auth-brand-feature-icon">{f.icon}</div>
              <span className="auth-brand-feature-text">{f.text}</span>
            </div>
          ))}
        </div>

        <div className="auth-brand-stats">
          {[
            { value: '72hrs',       label: 'Curated talent profiles delivered' },
            { value: 'AI + Human',  label: 'Dual-layer evaluation approach' },
            { value: 'Full Cycle',  label: 'Sourcing through onboarding' },
          ].map((s, i) => (
            <div key={i} className="auth-brand-stat">
              <span className="auth-brand-stat-value">{s.value}</span>
              <span className="auth-brand-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-card">

          <h2 className="auth-card-heading">Welcome back</h2>
          <p className="auth-card-sub">
            {step === 'credentials' && 'Sign in to your Tvarah account'}
            {step === 'otp' && `Enter the 6-digit OTP sent to ${email}`}
            {step === 'reset' && `A new password has been sent to ${email}`}
          </p>

          <form onSubmit={step === 'credentials' ? handleLogin : step === 'otp' ? handleVerifyOtp : e => e.preventDefault()} noValidate>
            {error && (
              <div className="auth-error">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  placeholder="you@tvarah.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={step === 'otp'}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={step === 'otp'}
                  required
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={step === 'otp' ? -1 : 0}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* OTP field — revealed after successful login */}
            {step === 'otp' && (
              <div className="auth-field auth-otp-field">
                <label className="auth-label">One-Time Password</label>
                <div className="auth-otp-grid" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      className="auth-otp-box"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                <button type="button" className="auth-resend" onClick={handleResend}>
                  Wrong email? Go back
                </button>
              </div>
            )}

            {step === 'credentials' && (
              <div className="auth-row">
                <label className="auth-remember">
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <button type="button" className="auth-forgot" onClick={handleForgotPassword} disabled={loading}>
                  Forgot password?
                </button>
              </div>
            )}

            {step === 'reset' ? (
              <button type="button" className="auth-submit" onClick={() => { setStep('credentials'); setError('') }}>
                Back to Sign in
              </button>
            ) : (
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading
                  ? (step === 'credentials' ? 'Signing in…' : 'Verifying…')
                  : (step === 'credentials' ? 'Sign in' : 'Verify OTP')}
              </button>
            )}
          </form>

          {step === 'credentials' && (
            <div className="auth-contact">
              <span className="auth-contact-text">Don&apos;t have access?</span>
              <a href="mailto:contact@tvarah.com" className="auth-contact-link">Contact us</a>
            </div>
          )}

          <p className="auth-footer">
            © {new Date().getFullYear()} Tvarah Technologies · All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function DataIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}

function PipelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
      <line x1="7" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="17" y2="12"/>
    </svg>
  )
}

function TeamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function ClientIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  )
}
