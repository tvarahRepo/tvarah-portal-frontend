// @ts-nocheck
'use client'
import { useState } from 'react'
import './ClientsPage.css'

// ── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  'Active':   { dot: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
  'On Hold':  { dot: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
  'Inactive': { dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
}

const INDUSTRY_CFG = {
  'Technology':  { bg: '#EEF2FF', text: '#4F46E5' },
  'IT Services': { bg: '#F0FDFA', text: '#0D9488' },
  'E-Commerce':  { bg: '#FFF7ED', text: '#C2410C' },
  'Banking':     { bg: '#EFF6FF', text: '#1D4ED8' },
  'Food Tech':   { bg: '#FFF1F2', text: '#BE123C' },
  'Healthcare':  { bg: '#F0FDF4', text: '#15803D' },
  'Finance':     { bg: '#F5F3FF', text: '#6D28D9' },
  'Consulting':  { bg: '#FEFCE8', text: '#A16207' },
}

const PRIORITY_CFG = {
  Enterprise: { bg: '#EEF2FF', text: '#4F46E5', border: '#C7D2FE' },
  Growth:     { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  Standard:   { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
}

const PARAM_CATEGORY_CFG = {
  'Experience':    { bg: '#EEF2FF', text: '#4F46E5' },
  'Assessment':    { bg: '#F0FDFA', text: '#0D9488' },
  'Soft Skills':   { bg: '#FFF7ED', text: '#C2410C' },
  'Qualification': { bg: '#EFF6FF', text: '#1D4ED8' },
  'Logistics':     { bg: '#F5F3FF', text: '#6D28D9' },
  'Compliance':    { bg: '#FEF2F2', text: '#DC2626' },
  'Compensation':  { bg: '#FEFCE8', text: '#A16207' },
}

const CATEGORY_OPTIONS  = Object.keys(PARAM_CATEGORY_CFG)
const CONDITION_OPTIONS = ['≥ (Min)', '≤ (Max)', '= (Exact)', 'Range', 'Boolean']
const STATUS_OPTIONS    = ['Active', 'On Hold', 'Inactive']
const PRIORITY_OPTIONS  = ['Enterprise', 'Growth', 'Standard']
const INDUSTRY_OPTIONS  = Object.keys(INDUSTRY_CFG)

// ── Default parameters applied to every new client ───────────────────────────

const DEFAULT_PARAMS = [
  { id: 'P001', name: 'Minimum Experience',          category: 'Experience',    condition: '≥ (Min)', threshold: '3 Years',                  active: true  },
  { id: 'P002', name: 'Technical Assessment Score',  category: 'Assessment',    condition: '≥ (Min)', threshold: '75%',                       active: true  },
  { id: 'P003', name: 'Communication Skills Rating', category: 'Soft Skills',   condition: '≥ (Min)', threshold: '4 / 5',                     active: true  },
  { id: 'P004', name: 'Education Qualification',     category: 'Qualification', condition: '= (Exact)', threshold: 'B.Tech / B.E or higher',  active: true  },
  { id: 'P005', name: 'Notice Period',               category: 'Logistics',     condition: '≤ (Max)', threshold: '30 Days',                   active: true  },
  { id: 'P006', name: 'Background Check',            category: 'Compliance',    condition: '= (Exact)', threshold: 'Clear',                   active: true  },
  { id: 'P007', name: 'Expected CTC vs Budget',      category: 'Compensation',  condition: '≤ (Max)', threshold: 'Within 20% of budget',      active: false },
  { id: 'P008', name: 'Coding Test Score',           category: 'Assessment',    condition: '≥ (Min)', threshold: '70%',                       active: true  },
]

function cloneParams(overrides = {}) {
  return DEFAULT_PARAMS.map(p => ({ ...p, ...(overrides[p.id] || {}) }))
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_CLIENTS = [
  {
    id: 'CLT-001', name: 'Google India', industry: 'Technology',
    logo: 'GI', color: '#4285F4',
    location: 'Bengaluru, Karnataka', website: 'google.com',
    contactName: 'Priya Ramesh', contactRole: 'Talent Acquisition Lead',
    contactEmail: 'priya.r@google.com', contactPhone: '+91 98765 43210',
    accountManager: 'Rahul Verma', status: 'Active', priority: 'Enterprise',
    contractStart: '2025-01-01', contractEnd: '2026-12-31',
    activeJobs: 8, candidatesInPipeline: 34, candidatesPlaced: 12,
    openPositions: ['Senior Backend Engineer', 'ML Engineer', 'Product Manager', 'DevOps Lead'],
    notes: 'Preferred vendor for engineering hiring. Focus on Tier 1 college graduates.',
    params: cloneParams({ P002: { threshold: '80%' } }),
  },
  {
    id: 'CLT-002', name: 'Tata Consultancy Services', industry: 'IT Services',
    logo: 'TC', color: '#0054A6',
    location: 'Mumbai, Maharashtra', website: 'tcs.com',
    contactName: 'Arun Sharma', contactRole: 'HR Manager',
    contactEmail: 'arun.s@tcs.com', contactPhone: '+91 99887 76655',
    accountManager: 'Sam Lee', status: 'Active', priority: 'Enterprise',
    contractStart: '2025-03-01', contractEnd: '2026-02-28',
    activeJobs: 15, candidatesInPipeline: 62, candidatesPlaced: 28,
    openPositions: ['Java Developer', 'Business Analyst', 'QA Engineer', 'Cloud Architect', 'Scrum Master'],
    notes: 'Large volume hiring. Batch processing preferred. SLA: 14-day TAT.',
    params: cloneParams({ P001: { threshold: '2 Years' } }),
  },
  {
    id: 'CLT-003', name: 'Amazon', industry: 'E-Commerce',
    logo: 'AM', color: '#FF9900',
    location: 'Hyderabad, Telangana', website: 'amazon.in',
    contactName: 'Sneha Pillai', contactRole: 'Senior Recruiter',
    contactEmail: 'sneha.p@amazon.com', contactPhone: '+91 90001 11222',
    accountManager: 'Vikram Singh', status: 'Active', priority: 'Enterprise',
    contractStart: '2025-02-15', contractEnd: '2027-02-14',
    activeJobs: 11, candidatesInPipeline: 47, candidatesPlaced: 19,
    openPositions: ['SDE II', 'Data Engineer', 'Program Manager', 'Solutions Architect'],
    notes: 'Bar Raiser process mandatory. Leadership Principles alignment is key criteria.',
    params: cloneParams({ P002: { threshold: '80%' }, P005: { threshold: '15 Days' } }),
  },
  {
    id: 'CLT-004', name: 'HDFC Bank', industry: 'Banking',
    logo: 'HB', color: '#004C8F',
    location: 'Mumbai, Maharashtra', website: 'hdfcbank.com',
    contactName: 'Rajan Nair', contactRole: 'AVP – Human Resources',
    contactEmail: 'rajan.n@hdfcbank.com', contactPhone: '+91 91234 56789',
    accountManager: 'Meera Nair', status: 'On Hold', priority: 'Growth',
    contractStart: '2025-04-01', contractEnd: '2026-03-31',
    activeJobs: 4, candidatesInPipeline: 15, candidatesPlaced: 6,
    openPositions: ['Risk Analyst', 'IT Auditor', 'Digital Banking Lead'],
    notes: 'BGV + credit score check mandatory for all roles. Contract on hold pending legal review.',
    params: cloneParams({ P006: { threshold: 'Clear + CIBIL ≥ 750' } }),
  },
  {
    id: 'CLT-005', name: 'Zomato', industry: 'Food Tech',
    logo: 'ZO', color: '#E23744',
    location: 'Gurugram, Haryana', website: 'zomato.com',
    contactName: 'Kavya Reddy', contactRole: 'Head of Talent',
    contactEmail: 'kavya.r@zomato.com', contactPhone: '+91 87654 32109',
    accountManager: 'Ananya Rao', status: 'Active', priority: 'Growth',
    contractStart: '2025-05-01', contractEnd: '2026-04-30',
    activeJobs: 6, candidatesInPipeline: 22, candidatesPlaced: 8,
    openPositions: ['Growth PM', 'Android Engineer', 'Data Scientist', 'SRE'],
    notes: 'Fast-paced startup culture. Strong preference for candidates with startup experience.',
    params: cloneParams({ P005: { threshold: '15 Days' }, P001: { threshold: '2 Years' } }),
  },
  {
    id: 'CLT-006', name: 'Infosys BPM', industry: 'IT Services',
    logo: 'IB', color: '#007CC3',
    location: 'Pune, Maharashtra', website: 'infosys.com',
    contactName: 'Deepa Krishnan', contactRole: 'Talent Partner',
    contactEmail: 'deepa.k@infosys.com', contactPhone: '+91 86543 21098',
    accountManager: 'Deepak Joshi', status: 'Inactive', priority: 'Standard',
    contractStart: '2024-06-01', contractEnd: '2025-05-31',
    activeJobs: 0, candidatesInPipeline: 0, candidatesPlaced: 14,
    openPositions: [],
    notes: 'Contract expired May 2025. Renewal discussions ongoing with procurement team.',
    params: cloneParams(),
  },
]

const EMPTY_CLIENT = {
  name: '', industry: 'Technology', logo: '', color: '#4285F4',
  location: '', website: '', contactName: '', contactRole: '',
  contactEmail: '', contactPhone: '', accountManager: '',
  status: 'Active', priority: 'Growth',
  contractStart: '', contractEnd: '',
  activeJobs: 0, candidatesInPipeline: 0, candidatesPlaced: 0,
  openPositions: [], notes: '', params: cloneParams(),
}

const EMPTY_PARAM = {
  name: '', category: 'Experience', condition: '≥ (Min)', threshold: '', active: true,
}

const COLOR_PALETTE = [
  '#4285F4','#0054A6','#FF9900','#004C8F','#E23744',
  '#007CC3','#1DB954','#7C3AED','#0D9488','#F59E0B',
]

let _nextClientId = SEED_CLIENTS.length + 1
let _nextParamId  = 9
function newClientId() { return `CLT-${String(_nextClientId++).padStart(3,'0')}` }
function newParamId()  { return `P${String(_nextParamId++).padStart(3,'0')}` }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '—'
  const [y,m,day] = d.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${mo[parseInt(m)-1]} ${y}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ClientAvatar({ name, color, size = 38 }) {
  const initials = name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase() || '?'
  return (
    <span className="clt-avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.32 }}>
      {initials}
    </span>
  )
}
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG['Inactive']
  return (
    <span className="clt-badge" style={{ background: c.bg, color: c.text }}>
      <span className="clt-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  )
}
function IndustryTag({ industry }) {
  const c = INDUSTRY_CFG[industry] || { bg: '#F1F5F9', text: '#475569' }
  return <span className="clt-industry-tag" style={{ background: c.bg, color: c.text }}>{industry}</span>
}
function PriorityChip({ priority }) {
  const c = PRIORITY_CFG[priority] || PRIORITY_CFG['Standard']
  return <span className="clt-priority-chip" style={{ background: c.bg, color: c.text, borderColor: c.border }}>{priority}</span>
}
function CategoryTag({ cat }) {
  const c = PARAM_CATEGORY_CFG[cat] || { bg: '#F1F5F9', text: '#475569' }
  return <span className="clt-cat-tag" style={{ background: c.bg, color: c.text }}>{cat}</span>
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients]       = useState(SEED_CLIENTS)
  const [searchQ, setSearchQ]       = useState('')
  const [filterStatus, setFilter]   = useState('All')
  const [detailId, setDetailId]     = useState(null)
  const [drawerTab, setDrawerTab]   = useState('overview') // 'overview' | 'config'
  const [addParamOpen, setAddParam] = useState(false)
  const [paramForm, setParamForm]   = useState(EMPTY_PARAM)
  const [editParamId, setEditParam] = useState(null)
  const [clientModal, setClientModal] = useState(false)
  const [clientForm, setClientForm]   = useState(EMPTY_CLIENT)
  const [deleteClientId, setDeleteClient] = useState(null)

  const detail = clients.find(c => c.id === detailId)

  // ── Derived ─────────────────────────────────────────────────────────────────
  const totalActive    = clients.filter(c => c.status === 'Active').length
  const totalPipeline  = clients.reduce((s, c) => s + c.candidatesInPipeline, 0)
  const totalPlaced    = clients.reduce((s, c) => s + c.candidatesPlaced, 0)
  const totalJobs      = clients.reduce((s, c) => s + c.activeJobs, 0)

  const filtered = clients.filter(c => {
    const okStatus = filterStatus === 'All' || c.status === filterStatus
    const q = searchQ.toLowerCase()
    const okSearch = !q || [c.name, c.industry, c.contactName, c.accountManager, c.location]
      .some(s => s.toLowerCase().includes(q))
    return okStatus && okSearch
  })

  const statCards = [
    { label: 'Total Clients',       value: clients.length,  color: '#4F46E5', bg: '#EEF2FF', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg> },
    { label: 'Active Clients',      value: totalActive,     color: '#15803D', bg: '#F0FDF4', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg> },
    { label: 'Open Positions',      value: totalJobs,       color: '#1D4ED8', bg: '#EFF6FF', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1zm-2 6h2v-2H6v2zm0 4h2v-2H6v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2z"/></svg> },
    { label: 'Candidates Placed',   value: totalPlaced,     color: '#0D9488', bg: '#F0FDFA', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H2zm15-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 8h3a5 5 0 0 0-6.9-4.6A9 9 0 0 1 19 20z"/></svg> },
  ]

  // ── Client CRUD ──────────────────────────────────────────────────────────────
  function openAddClient() { setClientForm({ ...EMPTY_CLIENT, params: cloneParams() }); setClientModal(true) }
  function saveClient() {
    if (!clientForm.name.trim()) return
    setClients(cs => [...cs, { ...clientForm, id: newClientId() }])
    setClientModal(false)
  }
  function deleteClient(id) {
    setClients(cs => cs.filter(c => c.id !== id))
    setDeleteClient(null)
    if (detailId === id) setDetailId(null)
  }

  // ── Parameter CRUD (within a client) ─────────────────────────────────────────
  function updateClientParams(clientId, params) {
    setClients(cs => cs.map(c => c.id === clientId ? { ...c, params } : c))
  }
  function handleSaveParam() {
    if (!paramForm.name.trim() || !paramForm.threshold.trim()) return
    const params = detail.params
    if (editParamId) {
      updateClientParams(detail.id, params.map(p => p.id === editParamId ? { ...paramForm, id: editParamId } : p))
    } else {
      updateClientParams(detail.id, [...params, { ...paramForm, id: newParamId() }])
    }
    setParamForm(EMPTY_PARAM); setAddParam(false); setEditParam(null)
  }
  function handleEditParam(p) {
    setParamForm({ ...p }); setEditParam(p.id); setAddParam(true)
  }
  function handleDeleteParam(pid) {
    updateClientParams(detail.id, detail.params.filter(p => p.id !== pid))
  }
  function toggleParamActive(pid) {
    updateClientParams(detail.id, detail.params.map(p => p.id === pid ? { ...p, active: !p.active } : p))
  }
  function cancelParam() { setParamForm(EMPTY_PARAM); setAddParam(false); setEditParam(null) }

  function setP(f) { return e => setParamForm(prev => ({ ...prev, [f]: e.target.value })) }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="clt-root">

      {/* ── Page Header ── */}
      <div className="clt-page-header">
        <div className="clt-page-header-left">
          <div className="clt-page-header-title">Clients</div>
          <span className="clt-page-header-sub">{totalActive} active · {clients.length} total</span>
        </div>
        <button className="clt-add-btn" onClick={openAddClient}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Client
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="clt-stats">
        {statCards.map(s => (
          <div key={s.label} className="clt-stat-card">
            <div className="clt-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="clt-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="clt-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="clt-toolbar">
        <div className="clt-toolbar-l">
          <div className="clt-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="clt-search" placeholder="Search client, industry, manager..."
              value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            {searchQ && (
              <button className="clt-search-clear" onClick={() => setSearchQ('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <div className="clt-filter-tabs">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button key={s}
                className={`clt-ftab${filterStatus === s ? ' active' : ''}`}
                onClick={() => setFilter(s)}>
                {s}
                {s !== 'All' && <span className="clt-ftab-count">{clients.filter(c => c.status === s).length}</span>}
              </button>
            ))}
          </div>
        </div>
        <span className="clt-count-label">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Client Table ── */}
      <div className="clt-table-wrap">
        <table className="clt-table">
          <thead>
            <tr>
              <th>CLIENT</th>
              <th>INDUSTRY</th>
              <th>CONTACT</th>
              <th>ACCOUNT MGR</th>
              <th>OPEN JOBS</th>
              <th>PIPELINE</th>
              <th>PLACED</th>
              <th>CONTRACT</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th className="clt-th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="clt-empty-row">
                <div className="clt-empty">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 7V3H2v18h20V7H12z"/>
                  </svg>
                  <p>No clients found</p>
                  <button className="clt-add-btn" onClick={openAddClient}>+ Add Client</button>
                </div>
              </td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id} className="clt-tr" onClick={() => { setDetailId(c.id); setDrawerTab('overview') }}>
                <td>
                  <div className="clt-client-cell">
                    <ClientAvatar name={c.name} color={c.color} size={36} />
                    <div>
                      <div className="clt-client-name">{c.name}</div>
                      <div className="clt-client-loc">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity=".45">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {c.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td><IndustryTag industry={c.industry} /></td>
                <td>
                  <div className="clt-contact-cell">
                    <div className="clt-contact-name">{c.contactName}</div>
                    <div className="clt-contact-role">{c.contactRole}</div>
                  </div>
                </td>
                <td>
                  <div className="clt-mgr-cell">
                    <span className="clt-mgr-avatar">{c.accountManager.split(' ').map(w=>w[0]).join('').slice(0,2)}</span>
                    <span className="clt-mgr-name">{c.accountManager}</span>
                  </div>
                </td>
                <td><span className="clt-num clt-num-jobs">{c.activeJobs}</span></td>
                <td><span className="clt-num clt-num-pipe">{c.candidatesInPipeline}</span></td>
                <td><span className="clt-num clt-num-placed">{c.candidatesPlaced}</span></td>
                <td>
                  <div className="clt-contract-cell">
                    <span>{fmtDate(c.contractStart)}</span>
                    <span className="clt-contract-arrow">→</span>
                    <span>{fmtDate(c.contractEnd)}</span>
                  </div>
                </td>
                <td><PriorityChip priority={c.priority} /></td>
                <td><StatusBadge status={c.status} /></td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="clt-row-actions">
                    <button className="clt-icon-btn clt-cfg-btn" title="Configure" onClick={() => { setDetailId(c.id); setDrawerTab('config') }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                    </button>
                    <button className="clt-icon-btn clt-del-btn" title="Delete" onClick={() => setDeleteClient(c.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="clt-overlay" onClick={() => setDetailId(null)} />
          <div className="clt-drawer">

            {/* Drawer header */}
            <div className="clt-drawer-hd">
              <div className="clt-drawer-hd-left">
                <ClientAvatar name={detail.name} color={detail.color} size={40} />
                <div>
                  <div className="clt-drawer-title">{detail.name}</div>
                  <div className="clt-drawer-sub">{detail.industry} · {detail.location}</div>
                </div>
              </div>
              <button className="clt-drawer-close" onClick={() => setDetailId(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Drawer tabs */}
            <div className="clt-drawer-tabs">
              <button className={`clt-dtab${drawerTab==='overview'?' active':''}`} onClick={() => setDrawerTab('overview')}>Overview</button>
              <button className={`clt-dtab${drawerTab==='config'?' active':''}`} onClick={() => setDrawerTab('config')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Configuration
                <span className="clt-dtab-badge">{detail.params.filter(p=>p.active).length}</span>
              </button>
            </div>

            <div className="clt-drawer-body">

              {/* ── OVERVIEW TAB ── */}
              {drawerTab === 'overview' && (
                <>
                  <div className="clt-dr-badges">
                    <StatusBadge status={detail.status} />
                    <PriorityChip priority={detail.priority} />
                    <IndustryTag industry={detail.industry} />
                  </div>

                  {/* KPIs */}
                  <div className="clt-dr-kpis">
                    <div className="clt-dr-kpi">
                      <div className="clt-dr-kpi-val clt-kpi-blue">{detail.activeJobs}</div>
                      <div className="clt-dr-kpi-lbl">Open Jobs</div>
                    </div>
                    <div className="clt-dr-kpi-sep" />
                    <div className="clt-dr-kpi">
                      <div className="clt-dr-kpi-val clt-kpi-purple">{detail.candidatesInPipeline}</div>
                      <div className="clt-dr-kpi-lbl">In Pipeline</div>
                    </div>
                    <div className="clt-dr-kpi-sep" />
                    <div className="clt-dr-kpi">
                      <div className="clt-dr-kpi-val clt-kpi-green">{detail.candidatesPlaced}</div>
                      <div className="clt-dr-kpi-lbl">Placed</div>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="clt-dr-section">
                    <div className="clt-dr-section-title">Point of Contact</div>
                    <div className="clt-dr-contact-card">
                      <div className="clt-dr-contact-avatar">{detail.contactName.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                      <div className="clt-dr-contact-info">
                        <div className="clt-dr-contact-name">{detail.contactName}</div>
                        <div className="clt-dr-contact-role">{detail.contactRole}</div>
                        <div className="clt-dr-contact-links">
                          <a className="clt-dr-contact-link" href={`mailto:${detail.contactEmail}`}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            {detail.contactEmail}
                          </a>
                          <span className="clt-dr-contact-link">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                            {detail.contactPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account + Contract */}
                  <div className="clt-dr-grid">
                    {[
                      { label: 'Account Manager', value: detail.accountManager },
                      { label: 'Website',          value: detail.website },
                      { label: 'Contract Start',   value: fmtDate(detail.contractStart) },
                      { label: 'Contract End',     value: fmtDate(detail.contractEnd) },
                    ].map(r => (
                      <div key={r.label} className="clt-dr-grid-item">
                        <div className="clt-dr-grid-label">{r.label}</div>
                        <div className="clt-dr-grid-value">{r.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Open positions */}
                  {detail.openPositions.length > 0 && (
                    <div className="clt-dr-section">
                      <div className="clt-dr-section-title">Open Positions ({detail.openPositions.length})</div>
                      <div className="clt-dr-positions">
                        {detail.openPositions.map(p => (
                          <span key={p} className="clt-dr-position">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {detail.notes && (
                    <div className="clt-dr-section">
                      <div className="clt-dr-section-title">Notes</div>
                      <div className="clt-dr-notes">{detail.notes}</div>
                    </div>
                  )}
                </>
              )}

              {/* ── CONFIGURATION TAB ── */}
              {drawerTab === 'config' && (
                <>
                  <div className="clt-cfg-header">
                    <div>
                      <div className="clt-cfg-header-title">Candidate Selection Configuration</div>
                      <div className="clt-cfg-header-sub">
                        Define parameters and threshold values used to evaluate candidates for {detail.name}.
                      </div>
                    </div>
                    {!addParamOpen && (
                      <button className="clt-cfg-add-btn" onClick={() => { setParamForm(EMPTY_PARAM); setAddParam(true); setEditParam(null) }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Parameter
                      </button>
                    )}
                  </div>

                  {/* Add / Edit param form */}
                  {addParamOpen && (
                    <div className="clt-param-form">
                      <div className="clt-param-form-title">{editParamId ? 'Edit Parameter' : 'New Parameter'}</div>
                      <div className="clt-pf-row">
                        <div className="clt-pf-group clt-pf-wide">
                          <label className="clt-pf-label">Parameter Name <span className="clt-req">*</span></label>
                          <input className="clt-pf-input" placeholder="e.g. Minimum CGPA"
                            value={paramForm.name} onChange={setP('name')} />
                        </div>
                        <div className="clt-pf-group">
                          <label className="clt-pf-label">Category</label>
                          <select className="clt-pf-input" value={paramForm.category} onChange={setP('category')}>
                            {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="clt-pf-row">
                        <div className="clt-pf-group">
                          <label className="clt-pf-label">Condition</label>
                          <select className="clt-pf-input" value={paramForm.condition} onChange={setP('condition')}>
                            {CONDITION_OPTIONS.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="clt-pf-group clt-pf-wide">
                          <label className="clt-pf-label">Threshold / Value <span className="clt-req">*</span></label>
                          <input className="clt-pf-input" placeholder="e.g. 7.5 CGPA, 70%, Clear"
                            value={paramForm.threshold} onChange={setP('threshold')} />
                        </div>
                        <div className="clt-pf-group clt-pf-narrow">
                          <label className="clt-pf-label">Active</label>
                          <button type="button"
                            className={`clt-toggle-btn${paramForm.active ? ' on' : ''}`}
                            onClick={() => setParamForm(f => ({ ...f, active: !f.active }))}>
                            {paramForm.active ? 'Yes' : 'No'}
                          </button>
                        </div>
                      </div>
                      <div className="clt-pf-actions">
                        <button className="clt-pf-cancel" onClick={cancelParam}>Cancel</button>
                        <button className="clt-pf-save" onClick={handleSaveParam}>
                          {editParamId ? 'Save Changes' : 'Add Parameter'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Parameters table */}
                  <div className="clt-params-wrap">
                    <table className="clt-params-table">
                      <colgroup>
                        <col className="col-param" />
                        <col className="col-cat" />
                        <col className="col-cond" />
                        <col className="col-threshold" />
                        <col className="col-status" />
                        <col className="col-actions" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>PARAMETER</th>
                          <th>CATEGORY</th>
                          <th>CONDITION</th>
                          <th>THRESHOLD</th>
                          <th>STATUS</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {detail.params.length === 0 && (
                          <tr><td colSpan={6} className="clt-params-empty">No parameters configured yet.</td></tr>
                        )}
                        {detail.params.map(p => (
                          <tr key={p.id} className={`clt-param-tr${!p.active ? ' clt-param-inactive' : ''}`}>
                            <td>
                              <div className="clt-param-name">{p.name}</div>
                              <div className="clt-param-id">{p.id}</div>
                            </td>
                            <td><CategoryTag cat={p.category} /></td>
                            <td><span className="clt-condition-badge">{p.condition}</span></td>
                            <td><span className="clt-threshold-val">{p.threshold}</span></td>
                            <td>
                              <button className={`clt-toggle-btn clt-toggle-sm${p.active ? ' on' : ''}`}
                                onClick={() => toggleParamActive(p.id)}>
                                {p.active ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td>
                              <div className="clt-param-actions">
                                <button className="clt-icon-btn clt-edit-btn" title="Edit" onClick={() => handleEditParam(p)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                </button>
                                <button className="clt-icon-btn clt-del-btn" title="Delete" onClick={() => handleDeleteParam(p.id)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="clt-cfg-footer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{color:'#94A3B8',flexShrink:0}}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    <span>Active parameters are applied during candidate screening for all open positions at {detail.name}.</span>
                  </div>
                </>
              )}
            </div>

          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteClientId && (() => {
        const c = clients.find(x => x.id === deleteClientId)
        return (
          <>
            <div className="clt-overlay clt-overlay-dark" onClick={() => setDeleteClient(null)} />
            <div className="clt-confirm-modal">
              <div className="clt-confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div className="clt-confirm-title">Remove Client?</div>
              <div className="clt-confirm-sub">
                You are about to remove <strong>{c?.name}</strong> from the platform. All associated data will be lost.
              </div>
              <div className="clt-confirm-actions">
                <button className="clt-confirm-cancel" onClick={() => setDeleteClient(null)}>Cancel</button>
                <button className="clt-confirm-delete" onClick={() => deleteClient(deleteClientId)}>Yes, Remove</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── Add Client Modal ── */}
      {clientModal && (
        <>
          <div className="clt-overlay clt-overlay-dark" onClick={() => setClientModal(false)} />
          <div className="clt-modal">
            <div className="clt-modal-hd">
              <div>
                <div className="clt-modal-title">Add New Client</div>
                <div className="clt-modal-sub">Register a new client organisation on the platform.</div>
              </div>
              <button className="clt-modal-close" onClick={() => setClientModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="clt-modal-body">
              {[
                [{ label:'Company Name *', field:'name', placeholder:'e.g. Infosys Ltd', half:false }],
                [{ label:'Industry', field:'industry', type:'select', options:INDUSTRY_OPTIONS, half:true },
                 { label:'Location', field:'location', placeholder:'e.g. Bengaluru, Karnataka', half:true }],
                [{ label:'Website', field:'website', placeholder:'e.g. company.com', half:true },
                 { label:'Status', field:'status', type:'select', options:STATUS_OPTIONS, half:true }],
                [{ label:'Contact Person Name', field:'contactName', placeholder:'e.g. Ravi Sharma', half:true },
                 { label:'Contact Role', field:'contactRole', placeholder:'e.g. HR Manager', half:true }],
                [{ label:'Contact Email', field:'contactEmail', placeholder:'e.g. hr@company.com', half:true },
                 { label:'Contact Phone', field:'contactPhone', placeholder:'e.g. +91 9XXXXXXXXX', half:true }],
                [{ label:'Account Manager', field:'accountManager', placeholder:'Recruiter managing this account', half:true },
                 { label:'Priority Tier', field:'priority', type:'select', options:PRIORITY_OPTIONS, half:true }],
                [{ label:'Contract Start', field:'contractStart', type:'date', half:true },
                 { label:'Contract End', field:'contractEnd', type:'date', half:true }],
                [{ label:'Notes', field:'notes', type:'textarea', placeholder:'Internal notes about this client...', half:false }],
              ].map((row, ri) => (
                <div key={ri} className="clt-mf-row">
                  {row.map(f => (
                    <div key={f.field} className={`clt-mf-group${f.half ? ' clt-mf-half' : ''}`}>
                      <label className="clt-mf-label">{f.label}</label>
                      {f.type === 'select' ? (
                        <select className="clt-mf-input" value={clientForm[f.field]}
                          onChange={e => setClientForm(prev => ({ ...prev, [f.field]: e.target.value }))}>
                          {f.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      ) : f.type === 'textarea' ? (
                        <textarea className="clt-mf-textarea" rows={3} placeholder={f.placeholder}
                          value={clientForm[f.field]}
                          onChange={e => setClientForm(prev => ({ ...prev, [f.field]: e.target.value }))} />
                      ) : (
                        <input className="clt-mf-input" type={f.type || 'text'} placeholder={f.placeholder}
                          value={clientForm[f.field]}
                          onChange={e => setClientForm(prev => ({ ...prev, [f.field]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Avatar color */}
              <div className="clt-mf-row">
                <div className="clt-mf-group">
                  <label className="clt-mf-label">Brand Colour</label>
                  <div className="clt-color-picker">
                    {COLOR_PALETTE.map(col => (
                      <button key={col} type="button"
                        className={`clt-color-swatch${clientForm.color === col ? ' active' : ''}`}
                        style={{ background: col }}
                        onClick={() => setClientForm(prev => ({ ...prev, color: col }))} />
                    ))}
                    <div className="clt-color-preview" style={{ background: clientForm.color }}>
                      <span>{(clientForm.name || 'C').charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="clt-modal-ft">
              <button className="clt-modal-cancel" onClick={() => setClientModal(false)}>Cancel</button>
              <button className="clt-modal-save" onClick={saveClient}>Add Client</button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
