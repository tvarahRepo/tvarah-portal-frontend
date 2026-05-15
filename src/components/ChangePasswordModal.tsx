'use client'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/apiFetch'
import './EditProfileModal.css'

interface Props {
  onClose: () => void
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [current, setCurrent] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (newPwd !== confirm) { setError('New passwords do not match.'); return }
    if (newPwd.length < 8)  { setError('New password must be at least 8 characters.'); return }
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
    <div className="epm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="epm-modal">

        <div className="epm-header">
          <h2 className="epm-title">Change Password</h2>
          <button className="epm-close" onClick={onClose} type="button" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="cpw-success">
            <div className="cpw-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" />
              </svg>
            </div>
            <div className="cpw-success-title">Password changed</div>
            <div className="cpw-success-sub">Your password has been updated successfully.</div>
            <button className="epm-btn-save" style={{ marginTop: 8 }} onClick={onClose}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="epm-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="epm-grid" style={{ gridTemplateColumns: '1fr' }}>
              <PasswordField label="Current Password" value={current} show={showCurrent}
                onChange={setCurrent} onToggle={() => setShowCurrent(v => !v)} />
              <PasswordField label="New Password" value={newPwd} show={showNew}
                onChange={setNewPwd} onToggle={() => setShowNew(v => !v)} hint="Minimum 8 characters" />
              <PasswordField label="Confirm New Password" value={confirm} show={showConfirm}
                onChange={setConfirm} onToggle={() => setShowConfirm(v => !v)} />
            </div>

            <div className="epm-footer">
              <button type="button" className="epm-btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="epm-btn-save" disabled={saving}>
                {saving ? 'Saving…' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function PasswordField({ label, value, show, onChange, onToggle, hint }: {
  label: string; value: string; show: boolean
  onChange: (v: string) => void; onToggle: () => void; hint?: string
}) {
  return (
    <div className="epm-field">
      <label className="epm-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="epm-input"
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ paddingRight: 40 }}
          required
        />
        <button type="button" onClick={onToggle} style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0,
          display: 'flex', alignItems: 'center',
        }}>
          {show
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
      {hint && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{hint}</div>}
    </div>
  )
}
