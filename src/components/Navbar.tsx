'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '../LanguageContext'
import TvarahLogo from './TvarahLogo'
import { useCurrentUser } from '../hooks/useCurrentUser'
import EditProfileModal from './EditProfileModal'
import ChangePasswordModal from './ChangePasswordModal'
import './EditProfileModal.css'

interface Tab {
  href: string
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    href: '/dashboard', label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#4F46E5" opacity="0.9"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#4F46E5" opacity="0.7"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#4F46E5" opacity="0.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#4F46E5" opacity="0.35"/>
      </svg>
    ),
  },
  {
    href: '/pipeline-funnel', label: 'Funnel View',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16l-6 8v6l-4-2v-4L4 4z" fill="#10b981" opacity="0.8"/>
      </svg>
    ),
  },
  {
    href: '/pipeline-funnel-2', label: 'Funnel View 2',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16l-6 8v6l-4-2v-4L4 4z" fill="#287A52" opacity="0.8"/>
      </svg>
    ),
  },
  {
    href: '/pipeline-kanban', label: 'Kanban Board',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2"  y="3" width="5" height="18" rx="1.5" fill="#6366f1" opacity="0.8"/>
        <rect x="9"  y="3" width="5" height="13" rx="1.5" fill="#6366f1" opacity="0.55"/>
        <rect x="16" y="3" width="5" height="8"  rx="1.5" fill="#6366f1" opacity="0.35"/>
      </svg>
    ),
  },
  {
    href: '/pipeline-demo', label: 'Pipeline Demo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="2" fill="#6366f1"/>
        <circle cx="12" cy="12" r="2" fill="#6366f1"/>
        <circle cx="19" cy="12" r="2" fill="#6366f1"/>
        <line x1="7" y1="12" x2="10" y2="12" stroke="#6366f1" strokeWidth="1.5"/>
        <line x1="14" y1="12" x2="17" y2="12" stroke="#6366f1" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href: '/tasks', label: 'Tasks',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" fill="#16A34A" opacity="0.15"/>
        <path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="#16A34A" strokeWidth="1.6"/>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="#16A34A" strokeWidth="1.6"/>
        <path d="m9 12 2 2 4-4" stroke="#16A34A" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: '/panel', label: 'Panel',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3" fill="#F43F5E" opacity="0.9"/>
        <circle cx="17" cy="7" r="2.5" fill="#F43F5E" opacity="0.65"/>
        <path d="M2 20a7 7 0 0 1 14 0" fill="#F43F5E" opacity="0.9"/>
        <path d="M17 14c2.7 0 5 1.5 5 3.5V20h-4.5" fill="#F43F5E" opacity="0.55"/>
      </svg>
    ),
  },
]

function LangToggle() {
  const { lang, toggle } = useLanguage()
  return (
    <button className="lang-toggle" onClick={toggle} type="button" title="Switch language">
      <span className={lang === 'en' ? 'lang-opt lang-active' : 'lang-opt'}>EN</span>
      <span className="lang-sep">|</span>
      <span className={lang === 'te' ? 'lang-opt lang-active' : 'lang-opt'}>తె</span>
    </button>
  )
}

function MessagesPopup() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const messages = [
    { id: 1, name: 'Anil Kumar', text: 'Loan repayment confirmed for this month.', time: '2m ago', avatar: 'AK' },
    { id: 2, name: 'Priya Sharma', text: 'Please update my address details.', time: '1h ago', avatar: 'PS' },
    { id: 3, name: 'Ravi Reddy', text: 'When is the next meeting scheduled?', time: '3h ago', avatar: 'RR' },
  ]
  return (
    <div className="navbar-popup-wrap" ref={ref}>
      <button className="navbar-icon-btn" type="button" aria-label="Messages" onClick={() => setOpen(v => !v)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H6l-4 4V6c0-1.1.9-2 2-2z"/>
        </svg>
      </button>
      {open && (
        <div className="navbar-popup">
          <div className="navbar-popup-header">
            <span className="navbar-popup-title">Messages</span>
            <span className="navbar-popup-count">{messages.length}</span>
          </div>
          <div className="navbar-popup-list">
            {messages.map(m => (
              <div key={m.id} className="navbar-popup-item">
                <div className="navbar-popup-avatar">{m.avatar}</div>
                <div className="navbar-popup-content">
                  <div className="navbar-popup-name">{m.name}</div>
                  <div className="navbar-popup-text">{m.text}</div>
                </div>
                <div className="navbar-popup-time">{m.time}</div>
              </div>
            ))}
          </div>
          <div className="navbar-popup-footer">View all messages</div>
        </div>
      )}
    </div>
  )
}

type AlertType = 'info' | 'warning' | 'success'

function AlertsPopup() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const alerts: { id: number; type: AlertType; title: string; text: string; time: string }[] = [
    { id: 1, type: 'info', title: 'EMI Due Reminder', text: '3 members have EMI due this week.', time: '10m ago' },
    { id: 2, type: 'warning', title: 'Overdue Payment', text: 'Member #004 payment is 5 days overdue.', time: '2h ago' },
    { id: 3, type: 'success', title: 'New Member Joined', text: 'Rajeev Kuchana registered successfully.', time: '1d ago' },
  ]
  const typeColor: Record<AlertType, string> = { info: '#38BDF8', warning: '#F59E0B', success: '#34D399' }
  return (
    <div className="navbar-popup-wrap" ref={ref}>
      <button className="navbar-icon-btn" type="button" aria-label="Alerts" onClick={() => setOpen(v => !v)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span className="navbar-icon-badge" />
      </button>
      {open && (
        <div className="navbar-popup">
          <div className="navbar-popup-header">
            <span className="navbar-popup-title">Alerts</span>
            <span className="navbar-popup-count">{alerts.length}</span>
          </div>
          <div className="navbar-popup-list">
            {alerts.map(a => (
              <div key={a.id} className="navbar-popup-item">
                <div className="navbar-popup-alert-dot" style={{ background: typeColor[a.type] }} />
                <div className="navbar-popup-content">
                  <div className="navbar-popup-name">{a.title}</div>
                  <div className="navbar-popup-text">{a.text}</div>
                </div>
                <div className="navbar-popup-time">{a.time}</div>
              </div>
            ))}
          </div>
          <div className="navbar-popup-footer">View all alerts</div>
        </div>
      )}
    </div>
  )
}

function ProfileMenu() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [changePwdOpen, setChangePwdOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [avatarImgErr, setAvatarImgErr] = useState(false)
  const { user, initials, fullName, avatarSrc, setUser } = useCurrentUser()
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => { setAvatarImgErr(false) }, [avatarSrc])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = useCallback(async () => {
    setSigningOut(true)
    const refreshToken = localStorage.getItem('refresh_token')
    const accessToken = localStorage.getItem('access_token')
    try {
      if (refreshToken) {
        await fetch('/backend/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('remember_email')
      router.push('/login')
    }
  }, [router])
  return (
    <div className="navbar-actions">
      <LangToggle />
      <MessagesPopup />
      <AlertsPopup />
      <div className="profile-menu" ref={ref}>
        <button
          className="profile-avatar-btn"
          onClick={() => setOpen(v => !v)}
          type="button"
          aria-label="Open profile menu"
        >
          <div className="profile-avatar">
            {avatarSrc && !avatarImgErr
              ? <img src={avatarSrc} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={() => setAvatarImgErr(true)} />
              : initials}
          </div>
        </button>
        {open && (
          <div className="profile-dropdown">
            <div className="profile-dropdown-header">
              <div className="profile-avatar profile-avatar-lg">
                {avatarSrc && !avatarImgErr
                  ? <img src={avatarSrc} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={() => setAvatarImgErr(true)} />
                  : initials}
              </div>
              <div>
                <div className="profile-dropdown-name">{fullName}</div>
                <div className="profile-dropdown-email">{user?.email ?? '—'}</div>
              </div>
            </div>
            <div className="profile-dropdown-divider" />
            <button className="profile-dropdown-item" type="button" onClick={() => { setOpen(false); setEditOpen(true) }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              My Profile
            </button>
            <button className="profile-dropdown-item" type="button" onClick={() => { setOpen(false); setChangePwdOpen(true) }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Change Password
            </button>
            <div className="profile-dropdown-divider" />
            <button
              className="profile-dropdown-item profile-dropdown-signout"
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        )}
      </div>
      {editOpen && user && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={updated => { setUser(updated); setEditOpen(false) }}
        />
      )}
      {changePwdOpen && <ChangePasswordModal onClose={() => setChangePwdOpen(false)} />}
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="app-navbar">
      <div className="app-brand">
        <TvarahLogo variant="light" size="md" />
      </div>

      <nav className="app-tabs">
        {tabs.map(tab => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`app-tab ${pathname === tab.href ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <span className="app-tab-icon">{tab.icon}</span>
            <span className="app-tab-label">{tab.label}</span>
          </Link>
        ))}
      </nav>

      <ProfileMenu />
    </header>
  )
}
