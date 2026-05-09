// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from 'react'
import './PanelPage.css'

// ── Config ────────────────────────────────────────────────────────────────────

const AVAILABILITY_CFG = {
  Available:  { dot: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
  Busy:       { dot: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
  'On Leave': { dot: '#9CA3AF', bg: '#F3F4F6', text: '#6B7280' },
  Inactive:   { dot: '#EF4444', bg: '#FEF2F2', text: '#DC2626' },
}

const DEPT_CFG = {
  Engineering:  { bg: '#EEF2FF', text: '#4F46E5' },
  Product:      { bg: '#FFF7ED', text: '#C2410C' },
  Design:       { bg: '#FDF4FF', text: '#7E22CE' },
  Analytics:    { bg: '#ECFDF5', text: '#065F46' },
  HR:           { bg: '#FFF1F2', text: '#BE123C' },
  Sales:        { bg: '#EFF6FF', text: '#1D4ED8' },
  Operations:   { bg: '#F0FDF4', text: '#15803D' },
}

const DOMAIN_COLORS = [
  '#4F46E5','#0D9488','#D97706','#9333EA',
  '#DC2626','#0284C7','#16A34A','#DB2777',
]

const AVAILABILITY_OPTIONS = Object.keys(AVAILABILITY_CFG)
const DEPT_OPTIONS = Object.keys(DEPT_CFG)

const ALL_DOMAINS = [
  'System Design','Backend','Frontend','Full Stack','React','Node.js',
  'Java','Python','Go','Data Structures','Behavioral','HR',
  'Cloud / AWS','DevOps','Machine Learning','Product Thinking',
  'Android','iOS','Security','Database',
]

const PALETTE = [
  '#4F7FFF','#EC4899','#10B981','#F59E0B',
  '#EF4444','#6366F1','#0D9488','#F43F5E',
  '#8B5CF6','#1A2B4A',
]

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED = [
  {
    id: 'IV-001', name: 'Rahul Verma', color: '#4F7FFF',
    designation: 'Engineering Manager', department: 'Engineering', company: 'Google',
    email: 'rahul.verma@google.com', phone: '+91 98765 43210',
    domains: ['System Design', 'Backend', 'Java', 'Distributed Systems'],
    experience: 12, totalInterviews: 48, rating: 4.8,
    availability: 'Available', joinedDate: '2024-01-15',
    notes: 'Prefers morning slots. Expert in distributed systems.',
  },
  {
    id: 'IV-002', name: 'Sam Lee', color: '#EC4899',
    designation: 'Senior Product Manager', department: 'Product', company: 'Wipro',
    email: 'sam.lee@wipro.com', phone: '+91 87654 32109',
    domains: ['Product Thinking', 'Behavioral', 'HR'],
    experience: 9, totalInterviews: 35, rating: 4.5,
    availability: 'Available', joinedDate: '2024-02-10',
    notes: 'Focuses on product sense and cross-functional collaboration.',
  },
  {
    id: 'IV-003', name: 'Vikram Singh', color: '#10B981',
    designation: 'Staff Engineer', department: 'Engineering', company: 'Amazon',
    email: 'vikram.singh@amazon.com', phone: '+91 76543 21098',
    domains: ['Cloud / AWS', 'DevOps', 'System Design', 'Go'],
    experience: 14, totalInterviews: 62, rating: 4.9,
    availability: 'Busy', joinedDate: '2023-11-05',
    notes: 'Available only on Tue/Thu afternoons this month.',
  },
  {
    id: 'IV-004', name: 'Ananya Rao', color: '#F59E0B',
    designation: 'UX Lead', department: 'Design', company: 'HCL Tech',
    email: 'ananya.rao@hcltech.com', phone: '+91 65432 10987',
    domains: ['Frontend', 'React', 'Behavioral'],
    experience: 7, totalInterviews: 22, rating: 4.3,
    availability: 'Available', joinedDate: '2024-03-20',
    notes: 'Great at design and culture-fit rounds.',
  },
  {
    id: 'IV-005', name: 'Deepak Joshi', color: '#6366F1',
    designation: 'ML Engineer', department: 'Analytics', company: 'Accenture',
    email: 'deepak.joshi@accenture.com', phone: '+91 54321 09876',
    domains: ['Machine Learning', 'Python', 'Data Structures'],
    experience: 6, totalInterviews: 18, rating: 4.1,
    availability: 'On Leave', joinedDate: '2024-04-01',
    notes: 'On leave until May 15.',
  },
  {
    id: 'IV-006', name: 'Meera Nair', color: '#0D9488',
    designation: 'HR Business Partner', department: 'HR', company: 'TCS',
    email: 'meera.nair@tcs.com', phone: '+91 43210 98765',
    domains: ['HR', 'Behavioral'],
    experience: 8, totalInterviews: 41, rating: 4.6,
    availability: 'Available', joinedDate: '2023-12-12',
    notes: 'Handles all final-round HR interviews.',
  },
  {
    id: 'IV-007', name: 'Arjun Kapoor', color: '#F43F5E',
    designation: 'iOS Tech Lead', department: 'Engineering', company: 'Infosys',
    email: 'arjun.kapoor@infosys.com', phone: '+91 32109 87654',
    domains: ['iOS', 'Android', 'Mobile', 'Swift'],
    experience: 10, totalInterviews: 29, rating: 4.4,
    availability: 'Inactive', joinedDate: '2023-09-01',
    notes: 'Currently engaged on a client project. Resume in Q3.',
  },
  {
    id: 'IV-008', name: 'Priya Mehta', color: '#8B5CF6',
    designation: 'Principal Engineer', department: 'Engineering', company: 'Microsoft',
    email: 'priya.mehta@microsoft.com', phone: '+91 91234 56789',
    domains: ['Full Stack', 'Node.js', 'React', 'System Design'],
    experience: 11, totalInterviews: 53, rating: 4.7,
    availability: 'Available', joinedDate: '2023-10-20',
    notes: 'Prefers video calls. Excellent at whiteboard coding rounds.',
  },
  {
    id: 'IV-009', name: 'Kiran Reddy', color: '#D97706',
    designation: 'Data Engineering Lead', department: 'Analytics', company: 'Flipkart',
    email: 'kiran.reddy@flipkart.com', phone: '+91 80123 45678',
    domains: ['Python', 'Database', 'Machine Learning', 'Data Structures'],
    experience: 9, totalInterviews: 31, rating: 4.2,
    availability: 'Available', joinedDate: '2024-01-08',
    notes: 'Strong in analytics and data pipeline interviews.',
  },
  {
    id: 'IV-010', name: 'Nikhil Sharma', color: '#0284C7',
    designation: 'Cloud Architect', department: 'Engineering', company: 'IBM',
    email: 'nikhil.sharma@ibm.com', phone: '+91 79012 34567',
    domains: ['Cloud / AWS', 'Security', 'DevOps', 'Distributed Systems'],
    experience: 13, totalInterviews: 44, rating: 4.6,
    availability: 'Busy', joinedDate: '2023-08-15',
    notes: 'Available every alternate week. Contact via email first.',
  },
  {
    id: 'IV-011', name: 'Sonia Gupta', color: '#DB2777',
    designation: 'Product Design Manager', department: 'Design', company: 'Swiggy',
    email: 'sonia.gupta@swiggy.in', phone: '+91 78901 23456',
    domains: ['Frontend', 'Behavioral', 'Product Thinking'],
    experience: 8, totalInterviews: 27, rating: 4.4,
    availability: 'Available', joinedDate: '2024-02-28',
    notes: 'Great for design thinking and PM rounds.',
  },
  {
    id: 'IV-012', name: 'Aditya Nair', color: '#059669',
    designation: 'SRE Lead', department: 'Engineering', company: 'Zomato',
    email: 'aditya.nair@zomato.com', phone: '+91 67890 12345',
    domains: ['DevOps', 'Cloud / AWS', 'Security', 'Backend'],
    experience: 7, totalInterviews: 20, rating: 3.9,
    availability: 'Available', joinedDate: '2024-03-05',
    notes: 'New to panel but very structured in feedback.',
  },
  {
    id: 'IV-013', name: 'Ritu Patel', color: '#7C3AED',
    designation: 'Talent Acquisition Lead', department: 'HR', company: 'Razorpay',
    email: 'ritu.patel@razorpay.com', phone: '+91 56789 01234',
    domains: ['HR', 'Behavioral', 'Product Thinking'],
    experience: 6, totalInterviews: 38, rating: 4.3,
    availability: 'Available', joinedDate: '2023-11-18',
    notes: 'Specialises in culture-fit and leadership assessment.',
  },
  {
    id: 'IV-014', name: 'Suresh Iyer', color: '#1A2B4A',
    designation: 'VP Engineering', department: 'Engineering', company: 'PhonePe',
    email: 'suresh.iyer@phonepe.com', phone: '+91 45678 90123',
    domains: ['System Design', 'Distributed Systems', 'Backend', 'Go'],
    experience: 17, totalInterviews: 71, rating: 4.9,
    availability: 'Busy', joinedDate: '2023-07-01',
    notes: 'Senior panelist. Available only for senior/lead roles.',
  },
  {
    id: 'IV-015', name: 'Kavitha Menon', color: '#16A34A',
    designation: 'Android Tech Lead', department: 'Engineering', company: 'CRED',
    email: 'kavitha.menon@cred.club', phone: '+91 34567 89012',
    domains: ['Android', 'Mobile', 'Java', 'Kotlin'],
    experience: 9, totalInterviews: 24, rating: 4.3,
    availability: 'Available', joinedDate: '2024-04-15',
    notes: 'Focused on mobile architecture and clean code practices.',
  },
  {
    id: 'IV-016', name: 'Rohan Das', color: '#DC2626',
    designation: 'Backend Engineer III', department: 'Engineering', company: 'Meesho',
    email: 'rohan.das@meesho.com', phone: '+91 23456 78901',
    domains: ['Backend', 'Java', 'Data Structures', 'Database'],
    experience: 5, totalInterviews: 14, rating: 4.0,
    availability: 'On Leave', joinedDate: '2024-05-01',
    notes: 'On paternity leave until June 10.',
  },
  {
    id: 'IV-017', name: 'Lakshmi Prasad', color: '#0891B2',
    designation: 'Data Science Manager', department: 'Analytics', company: 'Paytm',
    email: 'lakshmi.prasad@paytm.com', phone: '+91 12345 67890',
    domains: ['Machine Learning', 'Python', 'Data Structures', 'Behavioral'],
    experience: 10, totalInterviews: 36, rating: 4.5,
    availability: 'Available', joinedDate: '2023-09-22',
    notes: 'Good mix of technical depth and communication evaluation.',
  },
  {
    id: 'IV-018', name: 'Harsh Vardhan', color: '#4F46E5',
    designation: 'Security Engineer', department: 'Engineering', company: 'BrowserStack',
    email: 'harsh.v@browserstack.com', phone: '+91 99887 76655',
    domains: ['Security', 'Backend', 'Cloud / AWS', 'DevOps'],
    experience: 8, totalInterviews: 19, rating: 4.1,
    availability: 'Inactive', joinedDate: '2023-06-10',
    notes: 'Transitioning teams. Will re-join panel from July.',
  },
  {
    id: 'IV-019', name: 'Divya Krishnan', color: '#F97316',
    designation: 'Frontend Architect', department: 'Engineering', company: 'Ola',
    email: 'divya.k@ola.com', phone: '+91 88776 65544',
    domains: ['React', 'Frontend', 'Full Stack', 'Node.js'],
    experience: 9, totalInterviews: 33, rating: 4.4,
    availability: 'Available', joinedDate: '2024-01-30',
    notes: 'Expert in React and modern frontend patterns.',
  },
  {
    id: 'IV-020', name: 'Mohit Agarwal', color: '#84CC16',
    designation: 'Engineering Director', department: 'Engineering', company: 'Juspay',
    email: 'mohit.a@juspay.in', phone: '+91 77665 54433',
    domains: ['System Design', 'Distributed Systems', 'Backend', 'Behavioral'],
    experience: 15, totalInterviews: 58, rating: 4.7,
    availability: 'Available', joinedDate: '2023-10-05',
    notes: 'Handles senior engineering and architect-level panels.',
  },
]

const EMPTY_FORM = {
  name: '', color: '#4F7FFF',
  designation: '', department: 'Engineering', company: '',
  email: '', phone: '',
  domains: [],
  experience: '', totalInterviews: '', rating: '',
  availability: 'Available', joinedDate: '',
  notes: '',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mkInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

function ratingColor(r) {
  if (r >= 4.5) return { color: '#15803D', bg: '#DCFCE7' }
  if (r >= 4.0) return { color: '#A16207', bg: '#FEF9C3' }
  if (r >= 3.0) return { color: '#C2410C', bg: '#FFF7ED' }
  return { color: '#DC2626', bg: '#FEE2E2' }
}

function domainColor(idx) {
  return DOMAIN_COLORS[idx % DOMAIN_COLORS.length]
}

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${mo[parseInt(m) - 1]} ${y}`
}

function RatingStars({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <span className="pnl-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`pnl-star${i <= full ? ' pnl-star-full' : i === full + 1 && half ? ' pnl-star-half' : ''}`}>★</span>
      ))}
    </span>
  )
}

let _nextId = SEED.length + 1
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20]
function newId() { return `IV-${String(_nextId++).padStart(3, '0')}` }

// ── Sub-components ────────────────────────────────────────────────────────────

function AvailBadge({ status, size = 'md' }) {
  const c = AVAILABILITY_CFG[status] || AVAILABILITY_CFG.Available
  return (
    <span className={`pnl-badge pnl-badge-${size}`} style={{ background: c.bg, color: c.text }}>
      <span className="pnl-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

function DeptChip({ dept }) {
  const c = DEPT_CFG[dept] || { bg: '#F3F4F6', text: '#374151' }
  return (
    <span className="pnl-dept-chip" style={{ background: c.bg, color: c.text }}>{dept}</span>
  )
}

function Avatar({ name, color, size = 36 }) {
  return (
    <span className="pnl-avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>
      {mkInitials(name)}
    </span>
  )
}

function DomainTag({ label, idx }) {
  const c = domainColor(idx)
  return (
    <span className="pnl-domain-tag" style={{ background: c + '18', color: c, borderColor: c + '40' }}>
      {label}
    </span>
  )
}

function ScoreRing({ value, label, color }) {
  return (
    <div className="pnl-ring" style={{ borderColor: color, color }}>
      <span className="pnl-ring-val">{value}</span>
      <span className="pnl-ring-lbl">{label}</span>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PanelPage() {
  const [interviewers, setInterviewers]   = useState(SEED)
  const [filterAvail, setFilter]          = useState('All')
  const [searchQ, setSearchQ]             = useState('')
  const [viewMode, setView]               = useState('table')
  const [sortKey, setSortKey]             = useState('name')
  const [sortAsc, setSortAsc]             = useState(true)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editingId, setEditingId]         = useState(null)
  const [form, setForm]                   = useState(EMPTY_FORM)
  const [formErrors, setFormErrors]       = useState({})
  const [deleteId, setDeleteId]           = useState(null)
  const [detailId, setDetailId]           = useState(null)
  const [domainInput, setDomainInput]     = useState('')
  const [domainSugOpen, setDomainSugOpen] = useState(false)
  const [page, setPage]                   = useState(1)
  const [pageSize, setPageSize]           = useState(10)
  const domainRef = useRef(null)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setDetailId(null); setModalOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function onClickOut(e) {
      if (domainRef.current && !domainRef.current.contains(e.target)) setDomainSugOpen(false)
    }
    document.addEventListener('mousedown', onClickOut)
    return () => document.removeEventListener('mousedown', onClickOut)
  }, [])

  // ── Derived ───────────────────────────────────────────────────────────────

  const filtered = interviewers
    .filter(iv => {
      const okAvail = filterAvail === 'All' || iv.availability === filterAvail
      const q = searchQ.toLowerCase()
      const okSearch = !q || [iv.name, iv.designation, iv.company, iv.department, ...iv.domains]
        .some(s => s.toLowerCase().includes(q))
      return okAvail && okSearch
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage    = Math.min(page, totalPages)
  const pageStart   = (safePage - 1) * pageSize
  const paginated   = filtered.slice(pageStart, pageStart + pageSize)

  function goToPage(p) { setPage(Math.max(1, Math.min(p, totalPages))) }
  function handlePageSizeChange(size) { setPageSize(size); setPage(1) }
  function handleFilterChange(val) { setFilter(val); setPage(1) }
  function handleSearch(val) { setSearchQ(val); setPage(1) }

  const avgRating = interviewers.length
    ? (interviewers.reduce((s, iv) => s + (iv.rating || 0), 0) / interviewers.length).toFixed(1)
    : '—'

  const statCards = [
    {
      label: 'Total Interviewers', value: interviewers.length,
      color: '#4F46E5', bg: '#EEF2FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    },
    {
      label: 'Available Now', value: interviewers.filter(iv => iv.availability === 'Available').length,
      color: '#15803D', bg: '#F0FDF4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
    },
    {
      label: 'Total Interviews Done', value: interviewers.reduce((s, iv) => s + (iv.totalInterviews || 0), 0),
      color: '#0D9488', bg: '#F0FDFA',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
    },
    {
      label: 'Avg. Rating', value: avgRating,
      color: '#D97706', bg: '#FFFBEB',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
    },
    {
      label: 'Busy / On Leave', value: interviewers.filter(iv => iv.availability === 'Busy' || iv.availability === 'On Leave').length,
      color: '#C2410C', bg: '#FFF7ED',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    },
  ]

  // ── CRUD ──────────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null); setForm(EMPTY_FORM); setFormErrors({})
    setDomainInput(''); setModalOpen(true)
  }

  function openEdit(iv) {
    setEditingId(iv.id)
    setForm({ ...iv, domains: [...iv.domains], experience: iv.experience ?? '', totalInterviews: iv.totalInterviews ?? '', rating: iv.rating ?? '' })
    setFormErrors({}); setDomainInput(''); setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false); setEditingId(null)
  }

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name        = 'Name is required'
    if (!form.designation.trim()) e.designation = 'Designation is required'
    if (!form.company.trim())     e.company     = 'Company is required'
    if (!form.email.trim())       e.email       = 'Email is required'
    if (form.domains.length === 0) e.domains    = 'Add at least one domain'
    return e
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    const entry = {
      ...form,
      experience:       form.experience === '' ? 0 : Number(form.experience),
      totalInterviews:  form.totalInterviews === '' ? 0 : Number(form.totalInterviews),
      rating:           form.rating === '' ? null : Number(form.rating),
      domains:          [...form.domains],
    }
    if (editingId) {
      setInterviewers(ivs => ivs.map(x => x.id === editingId ? { ...entry, id: editingId } : x))
    } else {
      setInterviewers(ivs => [...ivs, { ...entry, id: newId() }])
    }
    closeModal()
  }

  function handleDelete(id) {
    setInterviewers(ivs => ivs.filter(x => x.id !== id))
    setDeleteId(null)
    if (detailId === id) setDetailId(null)
  }

  function addDomain(val) {
    const v = (val || domainInput).trim()
    if (v && !form.domains.includes(v)) {
      setForm(f => ({ ...f, domains: [...f.domains, v] }))
    }
    setDomainInput('')
    setDomainSugOpen(false)
  }

  function removeDomain(d) {
    setForm(f => ({ ...f, domains: f.domains.filter(x => x !== d) }))
  }

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function toggleSort(key) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(true) }
  }

  const detail = interviewers.find(iv => iv.id === detailId)
  const filteredSuggestions = ALL_DOMAINS.filter(d =>
    !form.domains.includes(d) && d.toLowerCase().includes(domainInput.toLowerCase())
  )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="pnl-root">

      {/* ── Page header ── */}
      <div className="pnl-page-hd">
        <div className="pnl-page-hd-left">
          <div>
            <h1 className="pnl-page-title">Panel</h1>
            <p className="pnl-page-sub">
              {interviewers.length} total · <span className="pnl-page-sub-pending">{interviewers.filter(iv => iv.availability === 'Available').length} available</span>
            </p>
          </div>
        </div>
        <div className="pnl-page-hd-right">
          <button className="pnl-export-btn" type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="pnl-add-btn" type="button" onClick={openAdd}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Interviewer
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="pnl-stats">
        {statCards.map(s => (
          <div key={s.label} className="pnl-stat-card">
            <div className="pnl-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="pnl-stat-body">
              <div className="pnl-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="pnl-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="pnl-toolbar">
        <div className="pnl-toolbar-l">
          <div className="pnl-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="pnl-search"
              placeholder="Search name, company, domain..."
              value={searchQ}
              onChange={e => handleSearch(e.target.value)}
            />
            {searchQ && (
              <button className="pnl-search-clear" type="button" onClick={() => handleSearch('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          <div className="pnl-filter-tabs">
            {['All', ...AVAILABILITY_OPTIONS].map(s => (
              <button
                key={s}
                type="button"
                className={`pnl-ftab${filterAvail === s ? ' pnl-ftab-active' : ''}`}
                onClick={() => handleFilterChange(s)}
              >
                {s}
                {s !== 'All' && (
                  <span className="pnl-ftab-count">{interviewers.filter(iv => iv.availability === s).length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="pnl-toolbar-r">
          <div className="pnl-view-toggle">
            <button
              type="button"
              className={`pnl-vt-btn${viewMode === 'table' ? ' active' : ''}`}
              onClick={() => setView('table')}
              title="Table view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button
              type="button"
              className={`pnl-vt-btn${viewMode === 'cards' ? ' active' : ''}`}
              onClick={() => setView('cards')}
              title="Card view"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          </div>
          <span className="pnl-count-label">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <select
            className="pnl-page-size-select"
            value={pageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            title="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table view ── */}
      {viewMode === 'table' && (
        <div className="pnl-table-wrap">
          <table className="pnl-table">
            <thead>
              <tr>
                <th className="pnl-th-sort" onClick={() => toggleSort('id')}>
                  ID {sortKey === 'id' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-sort" onClick={() => toggleSort('name')}>
                  INTERVIEWER {sortKey === 'name' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-sort" onClick={() => toggleSort('designation')}>
                  DESIGNATION {sortKey === 'designation' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th>DOMAINS</th>
                <th className="pnl-th-sort" onClick={() => toggleSort('experience')}>
                  EXP {sortKey === 'experience' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-sort" onClick={() => toggleSort('totalInterviews')}>
                  INTERVIEWS {sortKey === 'totalInterviews' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-sort" onClick={() => toggleSort('rating')}>
                  RATING {sortKey === 'rating' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-sort" onClick={() => toggleSort('availability')}>
                  STATUS {sortKey === 'availability' && <span className="pnl-sort-arrow">{sortAsc ? '↑' : '↓'}</span>}
                </th>
                <th className="pnl-th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="pnl-empty-row">
                    <div className="pnl-empty">
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      <p>No interviewers found</p>
                      <button type="button" className="pnl-add-btn" onClick={openAdd}>+ Add Interviewer</button>
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map(iv => {
                const rc = iv.rating != null ? ratingColor(iv.rating) : null
                return (
                  <tr key={iv.id} className="pnl-tr" onClick={() => setDetailId(iv.id)}>
                    <td><span className="pnl-id-badge">{iv.id}</span></td>
                    <td>
                      <div className="pnl-cand-cell">
                        <Avatar name={iv.name} color={iv.color} size={34} />
                        <div>
                          <div className="pnl-cand-name">{iv.name}</div>
                          <div className="pnl-cand-client">{iv.company}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="pnl-desig">{iv.designation}</div>
                      <DeptChip dept={iv.department} />
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="pnl-domain-wrap">
                        {iv.domains.slice(0, 3).map((d, i) => (
                          <DomainTag key={d} label={d} idx={i} />
                        ))}
                        {iv.domains.length > 3 && (
                          <span className="pnl-domain-more">+{iv.domains.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="pnl-exp-val">{iv.experience}<span className="pnl-exp-unit">y</span></span>
                    </td>
                    <td>
                      <span className="pnl-interview-count">{iv.totalInterviews}</span>
                    </td>
                    <td>
                      {rc ? (
                        <div className="pnl-rating-cell">
                          <span className="pnl-rating-val" style={{ color: rc.color, background: rc.bg }}>
                            {iv.rating}
                          </span>
                          <RatingStars rating={iv.rating} />
                        </div>
                      ) : <span className="pnl-no-score">—</span>}
                    </td>
                    <td><AvailBadge status={iv.availability} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="pnl-row-actions">
                        <button
                          type="button"
                          className="pnl-icon-btn pnl-edit-btn"
                          title="Edit"
                          onClick={() => openEdit(iv)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="pnl-icon-btn pnl-del-btn"
                          title="Delete"
                          onClick={() => setDeleteId(iv.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Card view ── */}
      {viewMode === 'cards' && (
        <div className="pnl-cards-grid">
          {filtered.length === 0 && (
            <div className="pnl-empty pnl-empty-cards">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <p>No interviewers found</p>
              <button type="button" className="pnl-add-btn" onClick={openAdd}>+ Add Interviewer</button>
            </div>
          )}
          {paginated.map(iv => {
            const rc = iv.rating != null ? ratingColor(iv.rating) : null
            return (
              <div key={iv.id} className="pnl-card" onClick={() => setDetailId(iv.id)}>
                <div className="pnl-card-top">
                  <AvailBadge status={iv.availability} size="sm" />
                  <div className="pnl-card-actions" onClick={e => e.stopPropagation()}>
                    <button type="button" className="pnl-icon-btn pnl-edit-btn" title="Edit" onClick={() => openEdit(iv)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button type="button" className="pnl-icon-btn pnl-del-btn" title="Delete" onClick={() => setDeleteId(iv.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="pnl-card-cand">
                  <Avatar name={iv.name} color={iv.color} size={48} />
                  <div className="pnl-card-cand-info">
                    <div className="pnl-card-cname">{iv.name}</div>
                    <div className="pnl-card-role">{iv.designation}</div>
                    <div className="pnl-card-client">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                        <path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2z"/>
                      </svg>
                      {iv.company}
                    </div>
                  </div>
                  {rc && (
                    <ScoreRing value={iv.rating} label="Rating" color={rc.color} />
                  )}
                </div>

                <DeptChip dept={iv.department} />

                <div className="pnl-card-divider" />

                <div className="pnl-card-domains">
                  {iv.domains.slice(0, 4).map((d, i) => (
                    <DomainTag key={d} label={d} idx={i} />
                  ))}
                  {iv.domains.length > 4 && (
                    <span className="pnl-domain-more">+{iv.domains.length - 4}</span>
                  )}
                </div>

                <div className="pnl-card-footer">
                  <div className="pnl-card-stat">
                    <span className="pnl-card-stat-val">{iv.experience}y</span>
                    <span className="pnl-card-stat-lbl">Exp.</span>
                  </div>
                  <div className="pnl-card-stat-divider" />
                  <div className="pnl-card-stat">
                    <span className="pnl-card-stat-val">{iv.totalInterviews}</span>
                    <span className="pnl-card-stat-lbl">Interviews</span>
                  </div>
                  <div className="pnl-card-id">{iv.id}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="pnl-pagination">
          <span className="pnl-pg-info">
            Showing <strong>{pageStart + 1}–{Math.min(pageStart + pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> interviewers
          </span>

          <div className="pnl-pg-controls">
            {/* First */}
            <button
              type="button"
              className="pnl-pg-btn"
              disabled={safePage === 1}
              onClick={() => goToPage(1)}
              title="First page"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>

            {/* Prev */}
            <button
              type="button"
              className="pnl-pg-btn"
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              title="Previous"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            {/* Page number buttons */}
            {(() => {
              const pages = []
              const delta = 2
              const left  = Math.max(1, safePage - delta)
              const right = Math.min(totalPages, safePage + delta)

              if (left > 1) {
                pages.push(1)
                if (left > 2) pages.push('...')
              }
              for (let i = left; i <= right; i++) pages.push(i)
              if (right < totalPages) {
                if (right < totalPages - 1) pages.push('...')
                pages.push(totalPages)
              }

              return pages.map((p, i) =>
                p === '...'
                  ? <span key={`dots-${i}`} className="pnl-pg-dots">…</span>
                  : (
                    <button
                      key={p}
                      type="button"
                      className={`pnl-pg-num${p === safePage ? ' pnl-pg-num-active' : ''}`}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  )
              )
            })()}

            {/* Next */}
            <button
              type="button"
              className="pnl-pg-btn"
              disabled={safePage === totalPages}
              onClick={() => goToPage(safePage + 1)}
              title="Next"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>

            {/* Last */}
            <button
              type="button"
              className="pnl-pg-btn"
              disabled={safePage === totalPages}
              onClick={() => goToPage(totalPages)}
              title="Last page"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="pnl-overlay" onClick={() => setDetailId(null)} />
          <div className="pnl-drawer">
            <div className="pnl-drawer-hd">
              <div className="pnl-drawer-title">Interviewer Profile</div>
              <div className="pnl-drawer-hd-right">
                <button type="button" className="pnl-drawer-edit" onClick={() => { setDetailId(null); openEdit(detail) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button type="button" className="pnl-drawer-close" onClick={() => setDetailId(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="pnl-drawer-body">
              {/* Hero */}
              <div className="pnl-dr-hero">
                <Avatar name={detail.name} color={detail.color} size={60} />
                <div className="pnl-dr-hero-info">
                  <div className="pnl-dr-cname">{detail.name}</div>
                  <div className="pnl-dr-role">{detail.designation}</div>
                  <div className="pnl-dr-client-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                      <path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2z"/>
                    </svg>
                    {detail.company}
                  </div>
                </div>
                {detail.rating != null && (() => {
                  const rc = ratingColor(detail.rating)
                  return <ScoreRing value={detail.rating} label="Rating" color={rc.color} />
                })()}
              </div>

              {/* Badges */}
              <div className="pnl-dr-badges">
                <AvailBadge status={detail.availability} />
                <DeptChip dept={detail.department} />
                <span className="pnl-id-badge">{detail.id}</span>
              </div>

              {/* Stats row */}
              <div className="pnl-dr-stat-row">
                <div className="pnl-dr-stat">
                  <span className="pnl-dr-stat-val">{detail.experience}y</span>
                  <span className="pnl-dr-stat-lbl">Experience</span>
                </div>
                <div className="pnl-dr-stat-sep" />
                <div className="pnl-dr-stat">
                  <span className="pnl-dr-stat-val">{detail.totalInterviews}</span>
                  <span className="pnl-dr-stat-lbl">Interviews Done</span>
                </div>
                <div className="pnl-dr-stat-sep" />
                <div className="pnl-dr-stat">
                  {detail.rating != null ? (
                    <>
                      <span className="pnl-dr-stat-val">{detail.rating}</span>
                      <RatingStars rating={detail.rating} />
                    </>
                  ) : (
                    <span className="pnl-dr-stat-val">—</span>
                  )}
                  <span className="pnl-dr-stat-lbl">Avg. Rating</span>
                </div>
              </div>

              {/* Contact */}
              <div className="pnl-dr-section">
                <div className="pnl-dr-section-title">Contact</div>
                <div className="pnl-dr-contact-list">
                  <div className="pnl-dr-contact-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>{detail.email || '—'}</span>
                  </div>
                  <div className="pnl-dr-contact-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>{detail.phone || '—'}</span>
                  </div>
                  <div className="pnl-dr-contact-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Joined {fmtDate(detail.joinedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Domains */}
              <div className="pnl-dr-section">
                <div className="pnl-dr-section-title">Interview Domains</div>
                <div className="pnl-dr-domain-list">
                  {detail.domains.map((d, i) => (
                    <DomainTag key={d} label={d} idx={i} />
                  ))}
                </div>
              </div>

              {/* Notes */}
              {detail.notes && (
                <div className="pnl-dr-section">
                  <div className="pnl-dr-section-title">Notes</div>
                  <div className="pnl-dr-text pnl-dr-notes">{detail.notes}</div>
                </div>
              )}

              {!detail.notes && (
                <div className="pnl-dr-empty-notes">No notes added yet.</div>
              )}
            </div>

            <div className="pnl-drawer-ft">
              <button
                type="button"
                className="pnl-drawer-del-btn"
                onClick={() => { setDetailId(null); setDeleteId(detail.id) }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
                Remove Interviewer
              </button>
              <button
                type="button"
                className="pnl-drawer-edit-full"
                onClick={() => { setDetailId(null); openEdit(detail) }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteId && (() => {
        const iv = interviewers.find(x => x.id === deleteId)
        return (
          <>
            <div className="pnl-overlay pnl-overlay-dark" onClick={() => setDeleteId(null)} />
            <div className="pnl-confirm-modal">
              <div className="pnl-confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div className="pnl-confirm-title">Remove Interviewer?</div>
              <div className="pnl-confirm-sub">
                You are about to remove <strong>{iv?.name}</strong> from the panel.
                This action cannot be undone.
              </div>
              <div className="pnl-confirm-actions">
                <button type="button" className="pnl-confirm-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                <button type="button" className="pnl-confirm-delete" onClick={() => handleDelete(deleteId)}>Yes, Remove</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <>
          <div className="pnl-overlay pnl-overlay-dark" onClick={closeModal} />
          <div className="pnl-modal">
            <div className="pnl-modal-hd">
              <div>
                <div className="pnl-modal-title">
                  {editingId ? 'Edit Interviewer Profile' : 'Add Panel Interviewer'}
                </div>
                <div className="pnl-modal-sub">
                  {editingId ? 'Update interviewer details below.' : 'Fill in the details to register a new panel interviewer.'}
                </div>
              </div>
              <button type="button" className="pnl-modal-close" onClick={closeModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="pnl-modal-body">

              {/* Row 1 — Name + Company */}
              <div className="pnl-form-row">
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Full Name <span className="pnl-req">*</span></label>
                  <input
                    className={`pnl-input${formErrors.name ? ' pnl-input-err' : ''}`}
                    placeholder="e.g. Rahul Verma"
                    value={form.name}
                    onChange={set('name')}
                  />
                  {formErrors.name && <span className="pnl-err">{formErrors.name}</span>}
                </div>
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Company <span className="pnl-req">*</span></label>
                  <input
                    className={`pnl-input${formErrors.company ? ' pnl-input-err' : ''}`}
                    placeholder="e.g. Google"
                    value={form.company}
                    onChange={set('company')}
                  />
                  {formErrors.company && <span className="pnl-err">{formErrors.company}</span>}
                </div>
              </div>

              {/* Row 2 — Designation + Department */}
              <div className="pnl-form-row">
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Designation <span className="pnl-req">*</span></label>
                  <input
                    className={`pnl-input${formErrors.designation ? ' pnl-input-err' : ''}`}
                    placeholder="e.g. Engineering Manager"
                    value={form.designation}
                    onChange={set('designation')}
                  />
                  {formErrors.designation && <span className="pnl-err">{formErrors.designation}</span>}
                </div>
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Department</label>
                  <select className="pnl-input pnl-select" value={form.department} onChange={set('department')}>
                    {DEPT_OPTIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 3 — Email + Phone */}
              <div className="pnl-form-row">
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Email <span className="pnl-req">*</span></label>
                  <input
                    type="email"
                    className={`pnl-input${formErrors.email ? ' pnl-input-err' : ''}`}
                    placeholder="email@company.com"
                    value={form.email}
                    onChange={set('email')}
                  />
                  {formErrors.email && <span className="pnl-err">{formErrors.email}</span>}
                </div>
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Phone</label>
                  <input
                    className="pnl-input"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </div>
              </div>

              {/* Row 4 — Experience + Interviews + Rating */}
              <div className="pnl-form-row">
                <div className="pnl-form-group pnl-fg-3">
                  <label className="pnl-label">Experience (yrs)</label>
                  <input
                    type="number" min={0} max={50}
                    className="pnl-input"
                    placeholder="e.g. 8"
                    value={form.experience}
                    onChange={set('experience')}
                  />
                </div>
                <div className="pnl-form-group pnl-fg-3">
                  <label className="pnl-label">Total Interviews</label>
                  <input
                    type="number" min={0}
                    className="pnl-input"
                    placeholder="e.g. 35"
                    value={form.totalInterviews}
                    onChange={set('totalInterviews')}
                  />
                </div>
                <div className="pnl-form-group pnl-fg-3">
                  <label className="pnl-label">Rating <span className="pnl-optional">(1–5)</span></label>
                  <input
                    type="number" min={1} max={5} step={0.1}
                    className="pnl-input"
                    placeholder="e.g. 4.5"
                    value={form.rating}
                    onChange={set('rating')}
                  />
                </div>
              </div>

              {/* Row 5 — Availability + Joined Date */}
              <div className="pnl-form-row">
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Availability Status</label>
                  <div className="pnl-seg-group">
                    {AVAILABILITY_OPTIONS.map(a => (
                      <button
                        key={a}
                        type="button"
                        className={`pnl-seg${form.availability === a ? ' pnl-seg-active' : ''}`}
                        style={form.availability === a ? {
                          background: AVAILABILITY_CFG[a].bg,
                          color: AVAILABILITY_CFG[a].text,
                          borderColor: AVAILABILITY_CFG[a].dot + '80',
                        } : {}}
                        onClick={() => setForm(f => ({ ...f, availability: a }))}
                      >
                        <span className="pnl-seg-dot" style={{ background: AVAILABILITY_CFG[a].dot }} />
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pnl-form-group pnl-fg-2">
                  <label className="pnl-label">Joined Date</label>
                  <input
                    type="date"
                    className="pnl-input"
                    value={form.joinedDate}
                    onChange={set('joinedDate')}
                  />
                </div>
              </div>

              {/* Row 6 — Domains */}
              <div className="pnl-form-row">
                <div className="pnl-form-group" ref={domainRef}>
                  <label className="pnl-label">Interview Domains <span className="pnl-req">*</span></label>
                  <div className="pnl-iv-input-wrap">
                    <input
                      className={`pnl-input pnl-iv-inp${formErrors.domains ? ' pnl-input-err' : ''}`}
                      placeholder="Type domain and press Enter or pick from suggestions"
                      value={domainInput}
                      onChange={e => { setDomainInput(e.target.value); setDomainSugOpen(true) }}
                      onFocus={() => setDomainSugOpen(true)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDomain() } }}
                    />
                    <button type="button" className="pnl-iv-add-btn" onClick={() => addDomain()}>+</button>
                  </div>
                  {formErrors.domains && <span className="pnl-err">{formErrors.domains}</span>}

                  {domainSugOpen && filteredSuggestions.length > 0 && (
                    <div className="pnl-domain-suggestions">
                      {filteredSuggestions.slice(0, 8).map(d => (
                        <button
                          key={d}
                          type="button"
                          className="pnl-domain-sug-item"
                          onMouseDown={e => { e.preventDefault(); addDomain(d) }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}

                  {form.domains.length > 0 && (
                    <div className="pnl-iv-tags">
                      {form.domains.map((d, i) => (
                        <span
                          key={d}
                          className="pnl-iv-tag"
                          style={{
                            background: domainColor(i) + '18',
                            color: domainColor(i),
                            borderColor: domainColor(i) + '44',
                          }}
                        >
                          {d}
                          <button
                            type="button"
                            className="pnl-iv-tag-rm"
                            onClick={() => removeDomain(d)}
                          >×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 7 — Notes */}
              <div className="pnl-form-row">
                <div className="pnl-form-group">
                  <label className="pnl-label">Notes</label>
                  <textarea
                    className="pnl-textarea"
                    rows={3}
                    placeholder="Availability preferences, special notes..."
                    value={form.notes}
                    onChange={set('notes')}
                  />
                </div>
              </div>

              {/* Avatar color */}
              <div className="pnl-form-row">
                <div className="pnl-form-group">
                  <label className="pnl-label">Avatar Color</label>
                  <div className="pnl-color-picker">
                    {PALETTE.map(c => (
                      <button
                        key={c}
                        type="button"
                        className={`pnl-color-swatch${form.color === c ? ' active' : ''}`}
                        style={{ background: c }}
                        title={c}
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                      />
                    ))}
                    <div className="pnl-color-preview" style={{ background: form.color }}>
                      <span>{mkInitials(form.name || 'Name')}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="pnl-modal-ft">
              <button type="button" className="pnl-modal-cancel" onClick={closeModal}>Cancel</button>
              <button type="button" className="pnl-modal-save" onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Add Interviewer'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
