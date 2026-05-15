'use client'
import { useState, useRef, useEffect } from 'react'
import type { CurrentUser } from '../hooks/useCurrentUser'
import { apiFetch } from '@/lib/apiFetch'

interface Props {
  user: CurrentUser
  onClose: () => void
  onSaved: (updated: CurrentUser) => void
}

export default function EditProfileModal({ user, onClose, onSaved }: Props) {
  const [firstName, setFirstName] = useState(user.firstName ?? '')
  const [lastName, setLastName] = useState(user.lastName ?? '')
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? '')
  const [department, setDepartment] = useState(user.department ?? '')
  const [location, setLocation] = useState(user.location ?? '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.keycloakUserId ? `/api/v1/users/${user.keycloakUserId}/avatar` : null
  )
  const [avatarImgErr, setAvatarImgErr] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return
    apiFetch('/api/v1/departments')
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (!json) return
        const list: unknown[] = json.data || json || []
        const names = list.map(d => (typeof d === 'string' ? d : (d as any).name || (d as any).departmentName || String(d)))
        if (names.length > 0) setDepartments(names)
      })
      .catch(() => { })
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarImgErr(false)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append(
        'data',
        new Blob([JSON.stringify({ firstName, lastName, phoneNumber, department, location })], {
          type: 'application/json',
        })
      )
      if (avatarFile) formData.append('avatar', avatarFile)

      const res = await apiFetch('/api/v1/users/me', {
        method: 'PATCH',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || 'Failed to save. Please try again.')
        return
      }
      onSaved(json.data)
      onClose()
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
          <h2 className="epm-title">Edit Profile</h2>
          <button className="epm-close" onClick={onClose} type="button" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Avatar */}
          <div className="epm-avatar-section">
            <div className="epm-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
              {avatarPreview && !avatarImgErr
                ? <img src={avatarPreview} alt="Avatar" className="epm-avatar-img" onError={() => setAvatarImgErr(true)} />
                : <span className="epm-avatar-initials">{`${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?'}</span>
              }
              <div className="epm-avatar-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Change photo</span>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="epm-file-input" onChange={handleAvatarChange} />
            <p className="epm-avatar-hint">JPG or PNG · max 5 MB</p>
          </div>

          {error && (
            <div className="epm-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <div className="epm-grid">
            <div className="epm-field">
              <label className="epm-label">First Name</label>
              <input className="epm-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" required />
            </div>
            <div className="epm-field">
              <label className="epm-label">Last Name</label>
              <input className="epm-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" required />
            </div>
            <div className="epm-field">
              <label className="epm-label">Email</label>
              <input className="epm-input epm-input-readonly" value={user.email} readOnly />
            </div>
            <div className="epm-field">
              <label className="epm-label">Role</label>
              <input className="epm-input epm-input-readonly" value={user.role} readOnly />
            </div>
            <div className="epm-field">
              <label className="epm-label">Phone Number</label>
              <input className="epm-input" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="epm-field">
              <label className="epm-label">Department</label>
              {departments.length > 0 ? (
                <select className="epm-input" value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              ) : (
                <input className="epm-input" value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
              )}
            </div>
            <div className="epm-field epm-field-full">
              <label className="epm-label">Location</label>
              <input className="epm-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Hyderabad, India" />
            </div>
          </div>

          <div className="epm-footer">
            <button type="button" className="epm-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="epm-btn-save" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
