// @ts-nocheck
'use client'
import { useState } from 'react'
import './JobsPage.css'

// ── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  'Open':             { dot: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
  'Partially Filled': { dot: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
  'Closed':           { dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
  'On-Hold':          { dot: '#EF4444', bg: '#FEF2F2', text: '#DC2626' },
}

const PRIORITY_CFG = {
  'Urgent':   { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'High':     { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Medium':   { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'Normal':   { bg: '#F0F9FF', text: '#0369A1', border: '#BAE6FD' },
}

const EXP_OPTIONS     = ['0–1 years','1–3 years','3–5 years','3–6 years','4–6 years','4–8 years','5–8 years','8+ years','10+ years','11+ years','15+ years']
const STATUS_OPTIONS  = ['Open','Partially Filled','Closed','On-Hold']
const PRIORITY_OPTIONS = ['Normal','Medium','High','Urgent']
const TYPE_OPTIONS    = ['Full-Time','Part-Time','Contract','Internship']
const WORK_OPTIONS    = ['On-Site','Remote','Hybrid']

const COMPANY_COLORS = {
  'Google India':              '#4285F4',
  'Tata Consultancy Services': '#0054A6',
  'Amazon':                    '#FF9900',
  'HDFC Bank':                 '#004C8F',
  'Zomato':                    '#E23744',
  'Infosys BPM':               '#007CC3',
  'Wipro':                     '#9C27B0',
  'Swiggy':                    '#FC8019',
  'Flipkart':                  '#2874F0',
  'Meesho':                    '#F43397',
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SEED_JOBS = [
  {
    id: 'JD-00001', company: 'Google India',
    designation: 'Senior Backend Engineer',
    experience: '5–8 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 2, filled: 0, status: 'Open', priority: 'Urgent',
    skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis'],
    location: 'Bengaluru', department: 'Engineering',
    salary: '₹40–55 LPA',
    pipeline: { applied: 34, shortlisted: 12, offered: 2 },
    posted: '2026-04-05', deadline: '2026-06-30',
    description: 'Build and scale high-throughput distributed systems for Google India\'s core infrastructure team.',
    accountManager: 'Rahul Verma',
  },
  {
    id: 'JD-00002', company: 'Google India',
    designation: 'ML Engineer',
    experience: '4–6 years', type: 'Full-Time', mode: 'On-Site',
    openings: 2, filled: 1, status: 'Partially Filled', priority: 'High',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLflow', 'BigQuery'],
    location: 'Bengaluru', department: 'AI/ML',
    salary: '₹45–60 LPA',
    pipeline: { applied: 28, shortlisted: 9, offered: 1 },
    posted: '2026-04-05', deadline: '2026-05-31',
    description: 'Design and deploy ML models powering Google India\'s recommendation and search systems.',
    accountManager: 'Rahul Verma',
  },
  {
    id: 'JD-00003', company: 'Tata Consultancy Services',
    designation: 'Java Developer',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 5, filled: 2, status: 'Partially Filled', priority: 'High',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Oracle DB', 'Docker'],
    location: 'Mumbai', department: 'Engineering',
    salary: '₹12–18 LPA',
    pipeline: { applied: 62, shortlisted: 18, offered: 4 },
    posted: '2026-04-10', deadline: '2026-07-15',
    description: 'Develop enterprise-grade Java microservices for banking and financial services clients.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00004', company: 'Tata Consultancy Services',
    designation: 'Cloud Architect',
    experience: '8+ years', type: 'Full-Time', mode: 'Hybrid',
    openings: 2, filled: 0, status: 'Open', priority: 'Urgent',
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevSecOps'],
    location: 'Hyderabad', department: 'Cloud & Infra',
    salary: '₹35–48 LPA',
    pipeline: { applied: 19, shortlisted: 6, offered: 0 },
    posted: '2026-04-12', deadline: '2026-06-12',
    description: 'Architect cloud solutions for Fortune 500 enterprise clients across AWS and Azure platforms.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00005', company: 'Amazon',
    designation: 'SDE II',
    experience: '4–8 years', type: 'Full-Time', mode: 'On-Site',
    openings: 3, filled: 1, status: 'Partially Filled', priority: 'High',
    skills: ['Java', 'Distributed Systems', 'AWS', 'DynamoDB', 'React'],
    location: 'Hyderabad', department: 'Engineering',
    salary: '₹35–50 LPA',
    pipeline: { applied: 47, shortlisted: 15, offered: 3 },
    posted: '2026-04-08', deadline: '2026-06-08',
    description: 'Build and own features on Amazon\'s Seller Experience platform at global scale.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00006', company: 'Amazon',
    designation: 'Data Engineer',
    experience: '3–6 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 2, filled: 0, status: 'Open', priority: 'Medium',
    skills: ['Python', 'Spark', 'Redshift', 'Airflow', 'SQL'],
    location: 'Bengaluru', department: 'Data',
    salary: '₹25–38 LPA',
    pipeline: { applied: 31, shortlisted: 10, offered: 0 },
    posted: '2026-04-15', deadline: '2026-07-01',
    description: 'Design large-scale data pipelines to power Amazon\'s business intelligence and analytics.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00007', company: 'HDFC Bank',
    designation: 'Risk Analyst',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 2, filled: 2, status: 'Closed', priority: 'Normal',
    skills: ['Python', 'Risk Modelling', 'SAS', 'Excel', 'SQL'],
    location: 'Mumbai', department: 'Risk Management',
    salary: '₹14–20 LPA',
    pipeline: { applied: 15, shortlisted: 5, offered: 2 },
    posted: '2026-03-01', deadline: '2026-04-30',
    description: 'Develop credit and market risk models for HDFC Bank\'s retail lending portfolio.',
    accountManager: 'Meera Nair',
  },
  {
    id: 'JD-00008', company: 'Zomato',
    designation: 'Product Manager – Growth',
    experience: '4–6 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 1, filled: 0, status: 'Open', priority: 'High',
    skills: ['Product Strategy', 'SQL', 'A/B Testing', 'Figma', 'Analytics'],
    location: 'Gurugram', department: 'Product',
    salary: '₹28–40 LPA',
    pipeline: { applied: 22, shortlisted: 7, offered: 0 },
    posted: '2026-04-18', deadline: '2026-06-30',
    description: 'Own growth strategy and experimentation across Zomato\'s consumer app.',
    accountManager: 'Ananya Rao',
  },
  {
    id: 'JD-00009', company: 'Zomato',
    designation: 'Android Engineer',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 2, filled: 0, status: 'On-Hold', priority: 'Medium',
    skills: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Firebase'],
    location: 'Gurugram', department: 'Engineering',
    salary: '₹22–32 LPA',
    pipeline: { applied: 18, shortlisted: 4, offered: 0 },
    posted: '2026-03-20', deadline: '2026-05-20',
    description: 'Build delightful Android experiences for 20M+ daily active Zomato users.',
    accountManager: 'Ananya Rao',
  },
  {
    id: 'JD-00010', company: 'Tata Consultancy Services',
    designation: 'Scrum Master',
    experience: '5–8 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 3, filled: 1, status: 'Partially Filled', priority: 'Normal',
    skills: ['Agile', 'Scrum', 'JIRA', 'Confluence', 'SAFe'],
    location: 'Chennai', department: 'Delivery',
    salary: '₹18–26 LPA',
    pipeline: { applied: 24, shortlisted: 8, offered: 1 },
    posted: '2026-04-02', deadline: '2026-06-15',
    description: 'Facilitate agile ceremonies and continuous improvement across multiple scrum teams.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00011', company: 'Amazon',
    designation: 'Solutions Architect',
    experience: '8+ years', type: 'Full-Time', mode: 'Hybrid',
    openings: 1, filled: 0, status: 'Open', priority: 'Urgent',
    skills: ['AWS', 'Solution Design', 'Networking', 'Security', 'Cost Optimisation'],
    location: 'Hyderabad', department: 'AWS',
    salary: '₹50–70 LPA',
    pipeline: { applied: 11, shortlisted: 3, offered: 0 },
    posted: '2026-04-20', deadline: '2026-07-31',
    description: 'Guide enterprise customers to adopt AWS services and design scalable cloud architectures.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00012', company: 'Google India',
    designation: 'Product Manager',
    experience: '5–8 years', type: 'Full-Time', mode: 'On-Site',
    openings: 1, filled: 1, status: 'Closed', priority: 'Normal',
    skills: ['Product Management', 'Data Analysis', 'Roadmapping', 'Stakeholder Mgmt'],
    location: 'Bengaluru', department: 'Product',
    salary: '₹45–65 LPA',
    pipeline: { applied: 20, shortlisted: 6, offered: 1 },
    posted: '2026-02-10', deadline: '2026-04-10',
    description: 'Lead product strategy and execution for Google India\'s consumer products.',
    accountManager: 'Rahul Verma',
  },
]

const EMPTY_JOB = {
  company: 'Google India', designation: '', experience: '3–5 years',
  type: 'Full-Time', mode: 'Hybrid', openings: 1, status: 'Open',
  priority: 'Medium', skills: [], location: 'Bengaluru',
  department: '', salary: '', description: '', accountManager: '',
  pipeline: { applied: 0, shortlisted: 0, offered: 0 },
  posted: new Date().toISOString().slice(0,10), deadline: '',
}

let _nextJobNum = SEED_JOBS.length + 1
function newJobId() { return `JD-${String(_nextJobNum++).padStart(5,'0')}` }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '—'
  const [y,m,day] = d.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)}/${mo[parseInt(m)-1]}/${y}`
}

function companyInitials(name) {
  return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase()
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CompanyAvatar({ name, size = 32 }) {
  const color = COMPANY_COLORS[name] || '#6366F1'
  return (
    <span className="jb-co-avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.32 }}>
      {companyInitials(name)}
    </span>
  )
}

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG['Open']
  return (
    <span className="jb-status-badge" style={{ background: c.bg, color: c.text }}>
      <span className="jb-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  )
}

function PriorityChip({ priority }) {
  const c = PRIORITY_CFG[priority] || PRIORITY_CFG['Normal']
  return (
    <span className="jb-priority-chip" style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      {priority}
    </span>
  )
}

function PipelineBadges({ pipeline }) {
  return (
    <div className="jb-pipeline-badges">
      <span className="jb-pipe-badge jb-pipe-applied" title="Applied">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
        {pipeline.applied}
      </span>
      <span className="jb-pipe-badge jb-pipe-shortlisted" title="Shortlisted">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
        {pipeline.shortlisted}
      </span>
      <span className="jb-pipe-badge jb-pipe-offered" title="Offered">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
        {pipeline.offered}
      </span>
    </div>
  )
}

function SkillTags({ skills, max = 3 }) {
  const shown = skills.slice(0, max)
  const extra = skills.length - max
  return (
    <div className="jb-skill-tags">
      {shown.map(s => <span key={s} className="jb-skill-tag">{s}</span>)}
      {extra > 0 && <span className="jb-skill-more">+{extra}</span>}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs]             = useState(SEED_JOBS)
  const [searchQ, setSearchQ]       = useState('')
  const [filterStatus, setFilter]   = useState('All')
  const [viewMode, setViewMode]     = useState('table') // 'table' | 'grid'
  const [detailId, setDetailId]     = useState(null)
  const [jobModal, setJobModal]     = useState(false)
  const [jobForm, setJobForm]       = useState(EMPTY_JOB)
  const [editJobId, setEditJobId]   = useState(null)
  const [deleteJobId, setDeleteJobId] = useState(null)
  const [skillInput, setSkillInput] = useState('')
  const [page, setPage]             = useState(1)
  const [perPage, setPerPage]       = useState(10)

  const detail = jobs.find(j => j.id === detailId)

  // ── Derived ──────────────────────────────────────────────────────────────────
  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j=>j.status===s).length }), {})

  const filtered = jobs.filter(j => {
    const okStatus = filterStatus === 'All' || j.status === filterStatus
    const q = searchQ.toLowerCase()
    const okSearch = !q || [j.id, j.designation, j.company, j.department, j.location, ...j.skills]
      .some(s => (s||'').toLowerCase().includes(q))
    return okStatus && okSearch
  })

  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage    = Math.min(page, totalPages)
  const pageStart   = (safePage - 1) * perPage
  const paginated   = filtered.slice(pageStart, pageStart + perPage)

  function resetPage() { setPage(1) }
  function goTo(p)     { setPage(Math.max(1, Math.min(p, totalPages))) }

  // build visible page numbers: always show first, last, current ±2, with ellipsis
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

  const totalPipeline = { applied: 0, shortlisted: 0, offered: 0 }
  jobs.forEach(j => {
    totalPipeline.applied     += j.pipeline.applied
    totalPipeline.shortlisted += j.pipeline.shortlisted
    totalPipeline.offered     += j.pipeline.offered
  })

  const statCards = [
    { label: 'Total Positions',   value: jobs.length,         color: '#3B82F6', bg: '#EFF6FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1z"/></svg> },
    { label: 'Open',              value: counts['Open'] || 0,  color: '#15803D', bg: '#F0FDF4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg> },
    { label: 'Total Applied',     value: totalPipeline.applied, color: '#6366F1', bg: '#EEF2FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H2zm15-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 8h3a5 5 0 0 0-6.9-4.6A9 9 0 0 1 19 20z"/></svg> },
    { label: 'Offered',           value: totalPipeline.offered, color: '#0D9488', bg: '#F0FDFA',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg> },
  ]

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  function openAdd() { setJobForm({ ...EMPTY_JOB }); setEditJobId(null); setJobModal(true); setSkillInput('') }
  function openEdit(j, e) {
    e?.stopPropagation()
    setJobForm({
      company: j.company, designation: j.designation, experience: j.experience,
      type: j.type, mode: j.mode, openings: j.openings, status: j.status,
      priority: j.priority, skills: [...j.skills], location: j.location,
      department: j.department, salary: j.salary, description: j.description,
      accountManager: j.accountManager, pipeline: { ...j.pipeline },
      posted: j.posted, deadline: j.deadline,
    })
    setEditJobId(j.id)
    setJobModal(true)
    setSkillInput('')
  }
  function saveJob() {
    if (!jobForm.designation.trim()) return
    if (editJobId) {
      setJobs(js => js.map(j => j.id === editJobId ? { ...j, ...jobForm } : j))
    } else {
      setJobs(js => [...js, { ...jobForm, id: newJobId() }])
    }
    setJobModal(false); setEditJobId(null)
  }
  function deleteJob(id) {
    setJobs(js => js.filter(j => j.id !== id))
    setDeleteJobId(null)
    if (detailId === id) setDetailId(null)
  }
  function addSkill() {
    const s = skillInput.trim()
    if (s && !jobForm.skills.includes(s)) {
      setJobForm(f => ({ ...f, skills: [...f.skills, s] }))
    }
    setSkillInput('')
  }
  function removeSkill(s) { setJobForm(f => ({ ...f, skills: f.skills.filter(x=>x!==s) })) }
  function setF(field) { return e => setJobForm(f => ({ ...f, [field]: e.target.value })) }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="jb-root">

      {/* ── Page Header ── */}
      <div className="jb-page-header">
        <div className="jb-page-header-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{color:'#3B82F6'}}>
            <path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1z"/>
          </svg>
          <div className="jb-page-header-title">Positions</div>
        </div>

        <button className="jb-add-btn" onClick={openAdd}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Position
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="jb-stats">
        {statCards.map(s => (
          <div key={s.label} className="jb-stat-card">
            <div className="jb-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="jb-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="jb-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="jb-toolbar">
        <div className="jb-toolbar-l">
          <div className="jb-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="jb-search" placeholder="Search by JD ID, Role and Company..."
              value={searchQ} onChange={e => { setSearchQ(e.target.value); resetPage() }} />
            {searchQ && (
              <button className="jb-search-clear" onClick={() => setSearchQ('')}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Status filter tabs — next to search */}
          <div className="jb-status-tabs">
            <button className={`jb-stab${filterStatus==='All'?' active':''}`}
              onClick={() => { setFilter('All'); resetPage() }}>
              All <span className="jb-stab-count">{jobs.length}</span>
            </button>
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`jb-stab${filterStatus===s?' active':''}`}
                onClick={() => { setFilter(s); resetPage() }}>
                {s} <span className="jb-stab-count">{counts[s]||0}</span>
              </button>
            ))}
            <button
              className={`jb-view-toggle${viewMode==='grid'?' jb-view-active':''}`}
              onClick={() => setViewMode(m => m==='table'?'grid':'table')}
              title="Grid view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          </div>

          <button className="jb-tool-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter
          </button>
          <button className="jb-tool-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
            </svg>
            Display
          </button>
        </div>
        <span className="jb-count-label">{filtered.length} position{filtered.length!==1?'s':''}</span>
      </div>

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="jb-table-wrap">
          <table className="jb-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>COMPANY NAME</th>
                <th>OPENINGS</th>
                <th>DESIGNATION</th>
                <th>EXPERIENCE</th>
                <th>SKILLS</th>
                <th>PIPELINE</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>POSTED DATE</th>
                <th className="jb-th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={13} className="jb-empty-row">
                  <div className="jb-empty">
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    </svg>
                    <p>No positions found</p>
                    <button className="jb-add-btn" onClick={openAdd}>+ New Position</button>
                  </div>
                </td></tr>
              )}
              {paginated.map((j, idx) => (
                <tr key={j.id} className="jb-tr" onClick={() => setDetailId(j.id)}>
                  <td><span className="jb-id-badge">{j.id}</span></td>
                  <td>
                    <div className="jb-company-cell">
                      <CompanyAvatar name={j.company} size={28} />
                      <span className="jb-company-name">{j.company}</span>
                    </div>
                  </td>
                  <td>
                    <span className="jb-openings">
                      <span className="jb-openings-filled">{j.filled}</span>
                      <span className="jb-openings-sep">/</span>
                      <span className="jb-openings-total">{j.openings}</span>
                    </span>
                  </td>
                  <td><span className="jb-designation">{j.designation}</span></td>
                  <td><span className="jb-exp-tag">{j.experience}</span></td>
                  <td><SkillTags skills={j.skills} max={3} /></td>
                  <td><PipelineBadges pipeline={j.pipeline} /></td>
                  <td><PriorityChip priority={j.priority} /></td>
                  <td><StatusBadge status={j.status} /></td>
                  <td><span className="jb-date">{fmtDate(j.posted)}</span></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div className="jb-row-actions">
                      <button className="jb-icon-btn jb-edit-btn" title="Edit" onClick={e=>openEdit(j,e)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="jb-icon-btn jb-del-btn" title="Delete" onClick={e=>{e.stopPropagation();setDeleteJobId(j.id)}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
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

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        <div className="jb-grid">
          {paginated.map(j => (
            <div key={j.id} className="jb-grid-card" onClick={() => setDetailId(j.id)}>
              <div className="jb-gc-top">
                <CompanyAvatar name={j.company} size={36} />
                <div className="jb-gc-company">
                  <div className="jb-gc-name">{j.company}</div>
                  <div className="jb-gc-id">{j.id}</div>
                </div>
                <StatusBadge status={j.status} />
              </div>
              <div className="jb-gc-title">{j.designation}</div>
              <div className="jb-gc-meta">
                <span className="jb-gc-meta-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity=".5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {j.location}
                </span>
                <span className="jb-gc-meta-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity=".5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {j.experience}
                </span>
                <span className="jb-gc-meta-item">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity=".5"><path d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>
                  {j.filled}/{j.openings} filled
                </span>
              </div>
              <SkillTags skills={j.skills} max={4} />
              <div className="jb-gc-footer">
                <PipelineBadges pipeline={j.pipeline} />
                <PriorityChip priority={j.priority} />
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="jb-empty" style={{gridColumn:'1/-1'}}>
              <p>No positions found</p>
            </div>
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="jb-pagination">
          <div className="jb-pg-left">
            <span className="jb-pg-info">
              Showing <strong>{pageStart + 1}–{Math.min(pageStart + perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong> positions
            </span>
            <div className="jb-pg-per-page">
              Rows per page:
              <select className="jb-pg-per-select" value={perPage}
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}>
                {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="jb-pg-right">
            {/* Prev */}
            <button className="jb-pg-btn" disabled={safePage === 1} onClick={() => goTo(safePage - 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Page numbers */}
            {pageNumbers().map((p, i) =>
              p === '…'
                ? <span key={`ellipsis-${i}`} className="jb-pg-ellipsis">…</span>
                : <button key={p}
                    className={`jb-pg-num${safePage === p ? ' jb-pg-active' : ''}`}
                    onClick={() => goTo(p)}>
                    {p}
                  </button>
            )}

            {/* Next */}
            <button className="jb-pg-btn" disabled={safePage === totalPages} onClick={() => goTo(safePage + 1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="jb-overlay" onClick={() => setDetailId(null)} />
          <div className="jb-drawer">
            <div className="jb-drawer-hd">
              <div className="jb-drawer-hd-left">
                <CompanyAvatar name={detail.company} size={42} />
                <div>
                  <div className="jb-drawer-title">{detail.designation}</div>
                  <div className="jb-drawer-sub">{detail.company} · {detail.id}</div>
                </div>
              </div>
              <div className="jb-drawer-hd-right">
                <button className="jb-drawer-edit-btn" onClick={e=>openEdit(detail,e)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button className="jb-drawer-close" onClick={() => setDetailId(null)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="jb-drawer-body">
              {/* Badges row */}
              <div className="jb-dr-badges">
                <StatusBadge status={detail.status} />
                <PriorityChip priority={detail.priority} />
                <span className="jb-dr-type-badge">{detail.type}</span>
                <span className="jb-dr-type-badge">{detail.mode}</span>
              </div>

              {/* Pipeline KPIs */}
              <div className="jb-dr-kpis">
                <div className="jb-dr-kpi">
                  <div className="jb-dr-kpi-val" style={{color:'#3B82F6'}}>{detail.pipeline.applied}</div>
                  <div className="jb-dr-kpi-lbl">Applied</div>
                </div>
                <div className="jb-dr-kpi-sep"/>
                <div className="jb-dr-kpi">
                  <div className="jb-dr-kpi-val" style={{color:'#F59E0B'}}>{detail.pipeline.shortlisted}</div>
                  <div className="jb-dr-kpi-lbl">Shortlisted</div>
                </div>
                <div className="jb-dr-kpi-sep"/>
                <div className="jb-dr-kpi">
                  <div className="jb-dr-kpi-val" style={{color:'#15803D'}}>{detail.pipeline.offered}</div>
                  <div className="jb-dr-kpi-lbl">Offered</div>
                </div>
                <div className="jb-dr-kpi-sep"/>
                <div className="jb-dr-kpi">
                  <div className="jb-dr-kpi-val" style={{color:'#6366F1'}}>{detail.filled}/{detail.openings}</div>
                  <div className="jb-dr-kpi-lbl">Filled</div>
                </div>
              </div>

              {/* Job details grid */}
              <div className="jb-dr-section">
                <div className="jb-dr-section-title">Job Details</div>
                <div className="jb-dr-grid">
                  {[
                    { label: 'Designation',   value: detail.designation },
                    { label: 'Department',    value: detail.department  },
                    { label: 'Experience',    value: detail.experience  },
                    { label: 'Salary Range',  value: detail.salary || '—' },
                    { label: 'Location',      value: detail.location    },
                    { label: 'Work Mode',     value: detail.mode        },
                    { label: 'Employment',    value: detail.type        },
                    { label: 'Account Mgr',  value: detail.accountManager || '—' },
                    { label: 'Posted',        value: fmtDate(detail.posted) },
                    { label: 'Deadline',      value: fmtDate(detail.deadline) || '—' },
                  ].map(r => (
                    <div key={r.label} className="jb-dr-grid-item">
                      <div className="jb-dr-grid-label">{r.label}</div>
                      <div className="jb-dr-grid-value">{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="jb-dr-section">
                <div className="jb-dr-section-title">Required Skills</div>
                <div className="jb-dr-skills">
                  {detail.skills.map(s => <span key={s} className="jb-dr-skill">{s}</span>)}
                </div>
              </div>

              {/* Description */}
              {detail.description && (
                <div className="jb-dr-section">
                  <div className="jb-dr-section-title">Job Description</div>
                  <div className="jb-dr-desc">{detail.description}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Add / Edit Modal ── */}
      {jobModal && (
        <>
          <div className="jb-overlay jb-overlay-dark" onClick={() => setJobModal(false)} />
          <div className="jb-modal">
            <div className="jb-modal-hd">
              <div>
                <div className="jb-modal-title">{editJobId ? 'Edit Position' : 'New Position'}</div>
                <div className="jb-modal-sub">{editJobId ? 'Update job details.' : 'Create a new job opening.'}</div>
              </div>
              <button className="jb-modal-close" onClick={() => setJobModal(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="jb-modal-body">
              <div className="jb-mf-row">
                <div className="jb-mf-group jb-mf-wide">
                  <label className="jb-mf-label">Designation <span className="jb-req">*</span></label>
                  <input className="jb-mf-input" placeholder="e.g. Senior Backend Engineer" value={jobForm.designation} onChange={setF('designation')} />
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Company</label>
                  <select className="jb-mf-input" value={jobForm.company} onChange={setF('company')}>
                    {Object.keys(COMPANY_COLORS).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="jb-mf-row">
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Department</label>
                  <input className="jb-mf-input" placeholder="e.g. Engineering" value={jobForm.department} onChange={setF('department')} />
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Location</label>
                  <input className="jb-mf-input" placeholder="e.g. Bengaluru" value={jobForm.location} onChange={setF('location')} />
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Openings</label>
                  <input className="jb-mf-input" type="number" min="1" value={jobForm.openings} onChange={e => setJobForm(f=>({...f,openings:parseInt(e.target.value)||1}))} />
                </div>
              </div>
              <div className="jb-mf-row">
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Experience</label>
                  <select className="jb-mf-input" value={jobForm.experience} onChange={setF('experience')}>
                    {EXP_OPTIONS.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Employment Type</label>
                  <select className="jb-mf-input" value={jobForm.type} onChange={setF('type')}>
                    {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Work Mode</label>
                  <select className="jb-mf-input" value={jobForm.mode} onChange={setF('mode')}>
                    {WORK_OPTIONS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="jb-mf-row">
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Status</label>
                  <select className="jb-mf-input" value={jobForm.status} onChange={setF('status')}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Priority</label>
                  <select className="jb-mf-input" value={jobForm.priority} onChange={setF('priority')}>
                    {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Salary Range</label>
                  <input className="jb-mf-input" placeholder="e.g. ₹20–30 LPA" value={jobForm.salary} onChange={setF('salary')} />
                </div>
              </div>
              <div className="jb-mf-row">
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Posted Date</label>
                  <input className="jb-mf-input" type="date" value={jobForm.posted} onChange={setF('posted')} />
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Deadline</label>
                  <input className="jb-mf-input" type="date" value={jobForm.deadline} onChange={setF('deadline')} />
                </div>
                <div className="jb-mf-group">
                  <label className="jb-mf-label">Account Manager</label>
                  <input className="jb-mf-input" placeholder="e.g. Rahul Verma" value={jobForm.accountManager} onChange={setF('accountManager')} />
                </div>
              </div>
              {/* Skills */}
              <div className="jb-mf-group" style={{marginBottom:14}}>
                <label className="jb-mf-label">Required Skills</label>
                <div className="jb-skill-input-row">
                  <input className="jb-mf-input" placeholder="Type skill and press Enter or +"
                    value={skillInput} onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()} />
                  <button className="jb-skill-add-btn" onClick={addSkill}>+</button>
                </div>
                {jobForm.skills.length > 0 && (
                  <div className="jb-skill-chips">
                    {jobForm.skills.map(s => (
                      <span key={s} className="jb-skill-chip">
                        {s}
                        <button onClick={() => removeSkill(s)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Description */}
              <div className="jb-mf-group">
                <label className="jb-mf-label">Job Description</label>
                <textarea className="jb-mf-textarea" rows={3} placeholder="Brief description of the role..."
                  value={jobForm.description} onChange={setF('description')} />
              </div>
            </div>
            <div className="jb-modal-ft">
              <button className="jb-modal-cancel" onClick={() => setJobModal(false)}>Cancel</button>
              <button className="jb-modal-save" onClick={saveJob}>{editJobId ? 'Save Changes' : 'Create Position'}</button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteJobId && (() => {
        const j = jobs.find(x => x.id === deleteJobId)
        return (
          <>
            <div className="jb-overlay jb-overlay-dark" onClick={() => setDeleteJobId(null)} />
            <div className="jb-confirm-modal">
              <div className="jb-confirm-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div className="jb-confirm-title">Delete Position?</div>
              <div className="jb-confirm-sub">Remove <strong>{j?.designation}</strong> at <strong>{j?.company}</strong>? This cannot be undone.</div>
              <div className="jb-confirm-actions">
                <button className="jb-confirm-cancel" onClick={() => setDeleteJobId(null)}>Cancel</button>
                <button className="jb-confirm-delete" onClick={() => deleteJob(deleteJobId)}>Yes, Delete</button>
              </div>
            </div>
          </>
        )
      })()}

    </div>
  )
}
