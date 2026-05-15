// @ts-nocheck
'use client'
import { useState, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/apiFetch'
import './UsersPage.css'

// ── Config ────────────────────────────────────────────────────────────────────

const ROLE_CFG = {
  'Admin': { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'Recruiter': { bg: '#EEF2FF', text: '#4338CA', dot: '#6366F1' },
  'HR Manager': { bg: '#F0FDF4', text: '#166534', dot: '#22C55E' },
  'Interviewer': { bg: '#F0FDFA', text: '#0F766E', dot: '#14B8A6' },
  'Viewer': { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
}

const STATUS_CFG = {
  'Active': { bg: '#F0FDF4', text: '#15803D', dot: '#22C55E' },
  'Inactive': { bg: '#F1F5F9', text: '#475569', dot: '#94A3B8' },
  'Suspended': { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' },
  'Pending': { bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
}

const ROLE_OPTIONS = Object.keys(ROLE_CFG)
const STATUS_OPTIONS = Object.keys(STATUS_CFG)
const LOCATION_OPTIONS = ['Bengaluru', 'Mumbai', 'Hyderabad', 'Delhi', 'Chennai', 'Pune', 'Remote']

const STATUS_API_MAP = { ACTIVE: 'Active', INACTIVE: 'Inactive', PENDING: 'Pending', SUSPENDED: 'Suspended' }

const AVATAR_COLORS = [
  '#6366F1', '#EC4899', '#22C55E', '#F59E0B', '#14B8A6',
  '#8B5CF6', '#F43F5E', '#0EA5E9', '#10B981', '#EF4444',
]

const EMPTY_FORM = {
  first_name: '', last_name: '', email: '', role: 'Recruiter',
  department: '', location: 'Bengaluru', phone: '',
  avatar_color: '#6366F1',
}

function mapApiUser(u) {
  const hash = [...(u.email || '')].reduce((a, c) => a + c.charCodeAt(0), 0)
  return {
    id: u.keycloakUserId,
    keycloakUserId: u.keycloakUserId,
    first_name: u.firstName || '',
    last_name: u.lastName || '',
    email: u.email || '',
    phone: u.phoneNumber || '',
    department: u.department || '',
    location: u.location || '',
    role: u.role || '—',
    status: STATUS_API_MAP[u.status] || u.status || 'Inactive',
    avatarUrl: u.avatarUrl || null,
    avatar_color: AVATAR_COLORS[hash % AVATAR_COLORS.length],
    created_on: u.createdOn || null,
    updated_on: u.updatedOn || null,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d)
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dt.getDate()} ${mo[dt.getMonth()]} ${dt.getFullYear()}`
}

function fmtDateTime(d) {
  if (!d) return '—'
  const dt = new Date(d)
  const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const hh = String(dt.getHours()).padStart(2, '0')
  const mm = String(dt.getMinutes()).padStart(2, '0')
  return `${dt.getDate()} ${mo[dt.getMonth()]} ${dt.getFullYear()}, ${hh}:${mm}`
}

function getInitials(u) {
  return `${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase() || '?'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UserAvatar({ user, size = 36 }) {
  const [imgError, setImgError] = useState(false)
  const avatarSrc = user.keycloakUserId ? `/api/v1/users/${user.keycloakUserId}/avatar` : null

  if (avatarSrc && !imgError) {
    return (
      <img
        src={avatarSrc}
        alt={getInitials(user)}
        className="usr-avatar usr-avatar-img"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <span className="usr-avatar" style={{ background: user.avatar_color, width: size, height: size, fontSize: size * 0.35 }}>
      {getInitials(user)}
    </span>
  )
}

function RoleBadge({ role }) {
  const c = ROLE_CFG[role] || ROLE_CFG['Viewer']
  return (
    <span className="usr-badge" style={{ background: c.bg, color: c.text }}>
      <span className="usr-badge-dot" style={{ background: c.dot }} />
      {role}
    </span>
  )
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG['Inactive']
  return (
    <span className="usr-badge" style={{ background: c.bg, color: c.text }}>
      <span className="usr-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState([])
  const [searchQ, setSearchQ] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [detailId, setDetailId] = useState(null)
  const [userModal, setUserModal] = useState(false)
  const [userForm, setUserForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [toggleConfirmId, setToggleConfirmId] = useState(null)
  const [sortKey, setSortKey] = useState('first_name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const detail = users.find(u => u.id === detailId)

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiFetch('/api/v1/users')
      if (!res.ok) return
      const json = await res.json()
      const list = (json.data || json || []).map(mapApiUser)
      setUsers(list)
    } catch { }
    finally { setLoading(false) }
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await apiFetch('/api/v1/departments')
      if (!res.ok) return
      const json = await res.json()
      const list = json.data || json || []
      const names = list.map(d => (typeof d === 'string' ? d : d.name || d.departmentName || d))
      if (names.length > 0) setDepartments(names)
    } catch { }
  }, [])

  useEffect(() => { fetchUsers(); fetchDepartments() }, [fetchUsers, fetchDepartments])

  // ── Derived ──────────────────────────────────────────────────────────────────
  const totalActive = users.filter(u => u.status === 'Active').length
  const totalInactive = users.filter(u => u.status === 'Inactive').length
  const totalSuspended = users.filter(u => u.status === 'Suspended').length
  const totalPending = users.filter(u => u.status === 'Pending').length

  const filtered = users
    .filter(u => {
      const okRole = filterRole === 'All' || u.role === filterRole
      const okStatus = filterStatus === 'All' || u.status === filterStatus
      const q = searchQ.toLowerCase()
      const okSearch = !q || [u.first_name, u.last_name, u.email, u.role, u.department, u.location]
        .some(s => (s || '').toLowerCase().includes(q))
      return okRole && okStatus && okSearch
    })
    .sort((a, b) => {
      const va = a[sortKey] || ''
      const vb = b[sortKey] || ''
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * perPage
  const paginated = filtered.slice(pageStart, pageStart + perPage)

  function resetPage() { setPage(1) }
  function goTo(p) { setPage(Math.max(1, Math.min(p, totalPages))) }

  function pageNumbers() {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 2 && i <= safePage + 2)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…')
      }
    }
    return pages
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function SortIcon({ col }) {
    if (sortKey !== col) return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"><path d="M7 15l5 5 5-5M7 9l5-5 5 5" /></svg>
    return sortDir === 'asc'
      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 15l5 5 5-5" /></svg>
      : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 9l5-5 5 5" /></svg>
  }

  const statCards = [
    {
      label: 'Total Users', value: users.length, color: '#0EA5E9', bg: '#F0F9FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
    },
    {
      label: 'Active', value: totalActive, color: '#15803D', bg: '#F0FDF4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
    },
    {
      label: 'Inactive / Pending', value: totalInactive + totalPending, color: '#B45309', bg: '#FFFBEB',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
    },
    {
      label: 'Suspended', value: totalSuspended, color: '#DC2626', bg: '#FEF2F2',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z" /></svg>
    },
  ]

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  function openAdd() {
    setUserForm({ ...EMPTY_FORM, department: departments[0] || '' })
    setUserModal(true)
  }

  async function saveUser() {
    if (!userForm.first_name.trim() || !userForm.email.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch('/backend/auth/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: userForm.first_name,
          lastName: userForm.last_name,
          email: userForm.email,
          phoneNumber: userForm.phone,
          location: userForm.location,
          department: userForm.department,
          role: userForm.role,
        }),
      })
      if (res.ok) {
        await fetchUsers()
        setUserModal(false)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.message || 'Failed to add user.')
      }
    } catch {
      alert('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteUser(id) {
    setDeleting(true)
    try {
      const res = await apiFetch(`/api/v1/users/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setDeleteUserId(null)
        if (detailId === id) setDetailId(null)
        await fetchUsers()
      }
    } catch { }
    finally {
      setDeleting(false)
    }
  }

  async function toggleStatus(id) {
    if (togglingId) return
    const u = users.find(x => x.id === id)
    if (!u) return
    const enable = u.status !== 'Active'
    setTogglingId(id)
    try {
      const res = await apiFetch(`/api/v1/users/${id}/status?enabled=${enable}`, {
        method: 'PATCH',
      })
      if (res.ok) {
        setUsers(us => us.map(x => x.id === id
          ? { ...x, status: enable ? 'Active' : 'Inactive' }
          : x
        ))
        setToggleConfirmId(null)
      }
    } catch { }
    finally { setTogglingId(null) }
  }

  function setF(field) { return e => setUserForm(f => ({ ...f, [field]: e.target.value })) }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="usr-root">

      {/* ── Page Header ── */}
      <div className="usr-page-header">
        <div className="usr-page-header-left">
          <div>
            <div className="usr-page-header-title">Users</div>
            <p className="usr-page-header-meta">
              {users.length} total · <span className="usr-page-header-meta-pending">{totalPending} pending</span>
            </p>
          </div>
        </div>
        <button className="usr-add-btn" onClick={openAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="usr-stats">
        {statCards.map(s => (
          <div key={s.label} className="usr-stat-card">
            <div className="usr-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="usr-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="usr-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="usr-toolbar">
        <div className="usr-toolbar-l">
          {/* Search */}
          <div className="usr-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input className="usr-search" placeholder="Search name, email, department…"
              value={searchQ} onChange={e => { setSearchQ(e.target.value); resetPage() }} />
            {searchQ && (
              <button className="usr-search-clear" onClick={() => setSearchQ('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Role filter */}
          <div className="usr-filter-tabs">
            {['All', ...ROLE_OPTIONS].map(r => (
              <button key={r} className={`usr-ftab${filterRole === r ? ' active' : ''}`}
                onClick={() => { setFilterRole(r); resetPage() }}>
                {r}
                {r !== 'All' && <span className="usr-ftab-count">{users.filter(u => u.role === r).length}</span>}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <select className="usr-status-select" value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); resetPage() }}>
            <option value="All">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <span className="usr-count-label">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="usr-loading">
          <div className="usr-spinner" />
          <span>Loading users…</span>
        </div>
      )}

      {/* ── Users Table ── */}
      {!loading && (
        <div className="usr-table-wrap">
          <table className="usr-table">
            <thead>
              <tr>
                <th className="usr-th-sortable" onClick={() => handleSort('first_name')}>
                  USER <SortIcon col="first_name" />
                </th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th className="usr-th-sortable" onClick={() => handleSort('role')}>
                  ROLE <SortIcon col="role" />
                </th>
                <th>DEPARTMENT</th>
                <th>LOCATION</th>
                <th className="usr-th-sortable" onClick={() => handleSort('status')}>
                  STATUS <SortIcon col="status" />
                </th>
                <th className="usr-th-sortable" onClick={() => handleSort('created_on')}>
                  CREATED <SortIcon col="created_on" />
                </th>
                <th className="usr-th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="usr-empty-row">
                  <div className="usr-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p>No users found</p>
                    <button className="usr-add-btn" onClick={openAdd}>+ Add User</button>
                  </div>
                </td></tr>
              )}
              {paginated.map(u => (
                <tr key={u.id} className="usr-tr" onClick={() => setDetailId(u.id)}>
                  <td>
                    <div className="usr-name-cell">
                      <UserAvatar user={u} size={36} />
                      <div>
                        <div className="usr-full-name">{u.first_name} {u.last_name}</div>
                        <div className="usr-user-id">{u.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="usr-email">{u.email}</div>
                  </td>
                  <td><span className="usr-phone">{u.phone || '—'}</span></td>
                  <td><RoleBadge role={u.role} /></td>
                  <td><span className="usr-dept">{u.department}</span></td>
                  <td>
                    <div className="usr-location-cell">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity=".4">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {u.location}
                    </div>
                  </td>
                  <td><StatusBadge status={u.status} /></td>
                  <td><span className="usr-date">{fmtDate(u.created_on)}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="usr-row-actions">
                      <button
                        className={`usr-icon-btn usr-toggle-btn${u.status === 'Active' ? ' usr-toggle-active' : ''}`}
                        title={u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        onClick={e => { e.stopPropagation(); setToggleConfirmId(u.id) }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                      </button>
                      <button className="usr-icon-btn usr-del-btn" title="Delete" onClick={e => { e.stopPropagation(); setDeleteUserId(u.id) }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > 0 && (
        <div className="usr-pagination">
          <div className="usr-pg-left">
            <span className="usr-pg-info">
              Showing <strong>{pageStart + 1}–{Math.min(pageStart + perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> users
            </span>
            <div className="usr-pg-per">
              Rows per page:
              <select className="usr-pg-select" value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}>
                {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="usr-pg-right">
            <button className="usr-pg-btn" disabled={safePage === 1} onClick={() => goTo(safePage - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {pageNumbers().map((p, i) =>
              p === '…'
                ? <span key={`ellipsis-${i}`} className="usr-pg-ellipsis">…</span>
                : <button key={p}
                  className={`usr-pg-num${safePage === p ? ' usr-pg-active' : ''}`}
                  onClick={() => goTo(p)}>
                  {p}
                </button>
            )}
            <button className="usr-pg-btn" disabled={safePage === totalPages} onClick={() => goTo(safePage + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="usr-overlay" onClick={() => setDetailId(null)} />
          <div className="usr-drawer">

            {/* Drawer header */}
            <div className="usr-drawer-hd">
              <div className="usr-drawer-hd-left">
                <UserAvatar user={detail} size={44} />
                <div>
                  <div className="usr-drawer-title">{detail.first_name} {detail.last_name}</div>
                  <div className="usr-drawer-sub">{detail.email}</div>
                </div>
              </div>
              <div className="usr-drawer-hd-actions">
                <button className="usr-drawer-close" onClick={() => setDetailId(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="usr-drawer-body">

              {/* Status + Role */}
              <div className="usr-dr-badges">
                <StatusBadge status={detail.status} />
                <RoleBadge role={detail.role} />
              </div>

              {/* ── Identity section ── */}
              <div className="usr-dr-section">
                <div className="usr-dr-section-title">Identity</div>
                <div className="usr-dr-grid">
                  {[
                    { label: 'First Name', value: detail.first_name },
                    { label: 'Last Name', value: detail.last_name },
                    { label: 'Email', value: detail.email, mono: true },
                    { label: 'Phone', value: detail.phone || '—' },
                    { label: 'Location', value: detail.location },
                  ].map(r => (
                    <div key={r.label} className="usr-dr-grid-item">
                      <div className="usr-dr-grid-label">{r.label}</div>
                      <div className={`usr-dr-grid-value${r.mono ? ' usr-mono' : ''}`}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Access section ── */}
              <div className="usr-dr-section">
                <div className="usr-dr-section-title">Access & Role</div>
                <div className="usr-dr-grid">
                  {[
                    { label: 'Role', value: detail.role },
                    { label: 'Status', value: detail.status },
                    { label: 'Department', value: detail.department },
                  ].map(r => (
                    <div key={r.label} className="usr-dr-grid-item">
                      <div className="usr-dr-grid-label">{r.label}</div>
                      <div className="usr-dr-grid-value">{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Timestamps section ── */}
              <div className="usr-dr-section">
                <div className="usr-dr-section-title">Timestamps</div>
                <div className="usr-dr-ts-card">
                  <div className="usr-dr-ts-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#94A3B8', flexShrink: 0 }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    <div>
                      <div className="usr-dr-ts-label">Created On</div>
                      <div className="usr-dr-ts-val">{fmtDateTime(detail.created_on)}</div>
                    </div>
                  </div>
                  <div className="usr-dr-ts-sep" />
                  <div className="usr-dr-ts-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#94A3B8', flexShrink: 0 }}>
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                    <div>
                      <div className="usr-dr-ts-label">Last Updated</div>
                      <div className="usr-dr-ts-val">{fmtDateTime(detail.updated_on)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Danger zone ── */}
              <div className="usr-dr-danger">
                <div className="usr-dr-danger-title">Danger Zone</div>
                <div className="usr-dr-danger-row">
                  <div>
                    <div className="usr-dr-danger-label">
                      {detail.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                    </div>
                    <div className="usr-dr-danger-sub">
                      {detail.status === 'Active'
                        ? 'User will lose access immediately.'
                        : 'Restore access for this user.'}
                    </div>
                  </div>
                  <button
                    className={`usr-danger-toggle${detail.status === 'Active' ? ' deactivate' : ' activate'}`}
                    onClick={() => setToggleConfirmId(detail.id)}>
                    {detail.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
                <div className="usr-dr-danger-row">
                  <div>
                    <div className="usr-dr-danger-label">Delete User</div>
                    <div className="usr-dr-danger-sub">Permanently remove this user. This cannot be undone.</div>
                  </div>
                  <button className="usr-danger-delete" onClick={() => setDeleteUserId(detail.id)}>
                    Delete
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ── Add User Modal ── */}
      {userModal && (
        <>
          <div className="usr-overlay usr-overlay-dark" onClick={() => setUserModal(false)} />
          <div className="usr-modal">
            <div className="usr-modal-hd">
              <div>
                <div className="usr-modal-title">Add New User</div>
                <div className="usr-modal-sub">Create a new user account on the platform.</div>
              </div>
              <button className="usr-modal-close" onClick={() => setUserModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="usr-modal-body">

              {/* Avatar preview + color */}
              <div className="usr-avatar-row">
                <UserAvatar user={{ ...userForm, first_name: userForm.first_name || 'U', last_name: userForm.last_name || '' }} size={52} />
                <div className="usr-color-picker">
                  {AVATAR_COLORS.map(col => (
                    <button key={col} type="button"
                      className={`usr-color-swatch${userForm.avatar_color === col ? ' active' : ''}`}
                      style={{ background: col }}
                      onClick={() => setUserForm(f => ({ ...f, avatar_color: col }))} />
                  ))}
                </div>
              </div>

              {/* Name row */}
              <div className="usr-mf-row">
                <div className="usr-mf-group">
                  <label className="usr-mf-label">First Name <span className="usr-req">*</span></label>
                  <input className="usr-mf-input" placeholder="e.g. Rahul" value={userForm.first_name} onChange={setF('first_name')} />
                </div>
                <div className="usr-mf-group">
                  <label className="usr-mf-label">Last Name</label>
                  <input className="usr-mf-input" placeholder="e.g. Verma" value={userForm.last_name} onChange={setF('last_name')} />
                </div>
              </div>

              {/* Email + Phone */}
              <div className="usr-mf-row">
                <div className="usr-mf-group usr-mf-wide">
                  <label className="usr-mf-label">Email Address <span className="usr-req">*</span></label>
                  <input className="usr-mf-input" type="email" placeholder="e.g. user@tvarah.com" value={userForm.email} onChange={setF('email')} />
                </div>
                <div className="usr-mf-group">
                  <label className="usr-mf-label">Phone</label>
                  <input className="usr-mf-input" placeholder="+91 XXXXX XXXXX" value={userForm.phone} onChange={setF('phone')} />
                </div>
              </div>

              {/* Role */}
              <div className="usr-mf-row">
                <div className="usr-mf-group">
                  <label className="usr-mf-label">Role <span className="usr-req">*</span></label>
                  <select className="usr-mf-input" value={userForm.role} onChange={setF('role')}>
                    {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Department + Location */}
              <div className="usr-mf-row">
                <div className="usr-mf-group">
                  <label className="usr-mf-label">Department</label>
                  <select className="usr-mf-input" value={userForm.department} onChange={setF('department')}>
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="usr-mf-group">
                  <label className="usr-mf-label">Location</label>
                  <select className="usr-mf-input" value={userForm.location} onChange={setF('location')}>
                    {LOCATION_OPTIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="usr-modal-ft">
              <button className="usr-modal-cancel" onClick={() => setUserModal(false)} disabled={saving}>Cancel</button>
              <button className="usr-modal-save" onClick={saveUser} disabled={saving}>
                {saving ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Toggle Status Confirm ── */}
      {toggleConfirmId && (() => {
        const u = users.find(x => x.id === toggleConfirmId)
        if (!u) return null
        const isDeactivate = u.status === 'Active'
        return (
          <>
            <div className="usr-overlay usr-overlay-dark" onClick={() => { if (!togglingId) setToggleConfirmId(null) }} />
            <div className="usr-confirm-modal">
              <div className={`usr-confirm-icon${isDeactivate ? '' : ' usr-confirm-icon-green'}`}>
                {isDeactivate
                  ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                  : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="8 12 11 15 16 9" /></svg>
                }
              </div>
              <div className="usr-confirm-title">{isDeactivate ? 'Deactivate User?' : 'Activate User?'}</div>
              <div className="usr-confirm-sub">
                {isDeactivate
                  ? <><strong>{u.first_name} {u.last_name}</strong> will lose access immediately.</>
                  : <>Restore access for <strong>{u.first_name} {u.last_name}</strong>.</>
                }
              </div>
              <div className="usr-confirm-actions">
                <button className="usr-confirm-cancel" onClick={() => setToggleConfirmId(null)} disabled={!!togglingId}>Cancel</button>
                <button
                  className={isDeactivate ? 'usr-confirm-delete' : 'usr-confirm-activate'}
                  onClick={() => toggleStatus(toggleConfirmId)}
                  disabled={!!togglingId}>
                  {togglingId ? '…' : isDeactivate ? 'Yes, Deactivate' : 'Yes, Activate'}
                </button>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── Delete Confirm ── */}
      {deleteUserId && (() => {
        const u = users.find(x => x.id === deleteUserId)
        return (
          <>
            <div className="usr-overlay usr-overlay-dark" onClick={() => setDeleteUserId(null)} />
            <div className="usr-confirm-modal">
              <div className="usr-confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
              <div className="usr-confirm-title">Delete User?</div>
              <div className="usr-confirm-sub">
                You are about to permanently delete <strong>{u?.first_name} {u?.last_name}</strong> ({u?.email}).
                This action cannot be undone.
              </div>
              <div className="usr-confirm-actions">
                <button className="usr-confirm-cancel" onClick={() => setDeleteUserId(null)} disabled={deleting}>Cancel</button>
                <button className="usr-confirm-delete" onClick={() => deleteUser(deleteUserId)} disabled={deleting}>
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </>
        )
      })()}

    </div>
  )
}
