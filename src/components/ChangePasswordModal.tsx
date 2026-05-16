'use client'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/apiFetch'
import './ChangePasswordModal.css'

interface Props {
  onClose: () => void
}

function getStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (!pwd) return 0
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score++
  return (score as 0 | 1 | 2 | 3)
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong']

export default function ChangePasswordModal({ onClose }: Props) {
  const [current, setCurrent]       = useState('')
  const [newPwd, setNewPwd]         = useState('')
  const [confirm, setConfirm]       = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const strength = getStrength(newPwd)
  const confirmClass = confirm === ''
    ? ''
    : newPwd === confirm ? 'match' : 'error'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPwd !== confirm)  { setError('New passwords do not match.'); return }
    if (newPwd.length < 8)   { setError('New password must be at least 8 characters.'); return }
    if (newPwd === current)  { setError('New password must differ from the current one.'); return }
    setSaving(true)
    try {
      const res = await apiFetch('/backend/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: newPwd }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.message || 'Failed to change password. Please try again.'); return }
      setSuccess(true)
    } catch {
      setError('Unable to connect. Please check your network.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cpw-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cpw-modal">

        {success ? (
          <div className="cpw-success">
            <div className="cpw-success-ring">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="cpw-success-title">Password updated</div>
            <div className="cpw-success-sub">Your password has been changed successfully.<br />Use it on your next login.</div>
            <button className="cpw-btn-save" style={{ marginTop: 8 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="cpw-header">
              <div className="cpw-header-left">
                <div className="cpw-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <div className="cpw-title">Change Password</div>
                  <div className="cpw-sub">Update your account security</div>
                </div>
              </div>
              <button className="cpw-close" onClick={onClose} type="button" aria-label="Close">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="cpw-body">
                {error && (
                  <div className="cpw-error">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <div className="cpw-field">
                  <label className="cpw-label">Current Password</label>
                  <div className="cpw-input-wrap">
                    <input
                      className="cpw-input"
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={current}
                      onChange={e => setCurrent(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" className="cpw-eye" onClick={() => setShowCurrent(v => !v)} tabIndex={-1}>
                      <EyeIcon open={showCurrent} />
                    </button>
                  </div>
                </div>

                <div className="cpw-divider" />

                <div className="cpw-field">
                  <label className="cpw-label">New Password</label>
                  <div className="cpw-input-wrap">
                    <input
                      className="cpw-input"
                      type={showNew ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={newPwd}
                      onChange={e => setNewPwd(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" className="cpw-eye" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                      <EyeIcon open={showNew} />
                    </button>
                  </div>
                  {newPwd && (
                    <div className="cpw-strength">
                      <div className="cpw-strength-bars">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className={`cpw-strength-bar${strength >= i ? ` s${strength}` : ''}`}
                          />
                        ))}
                      </div>
                      <span className={`cpw-strength-label s${strength}`}>
                        {STRENGTH_LABELS[strength]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="cpw-field">
                  <label className="cpw-label">Confirm New Password</label>
                  <div className="cpw-input-wrap">
                    <input
                      className={`cpw-input${confirmClass ? ` ${confirmClass}` : ''}`}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                    <button type="button" className="cpw-eye" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="cpw-footer">
                <button type="button" className="cpw-btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="cpw-btn-save" disabled={saving}>
                  {saving ? 'Saving…' : 'Change Password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
