// @ts-nocheck
'use client'
import React, { useState, useRef, useEffect } from 'react'
import './JobsPage.css'
import ReviewJDPage from './ReviewJDPage'
import ViewJobPage from './ViewJobPage'
import EditJobPage from './EditJobPage'

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
    qualityScore: 52,
    skills: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL', 'Redis'],
    goodSkills: ['Docker', 'AWS', 'Testing'],
    targetTypes: ['Product', 'SaaS', 'FinTech'],
    rules: ['Min 5 yrs Go experience', 'Must have managed production systems at scale', 'No job-hoppers (< 1yr stays)'],
    location: 'Bengaluru', department: 'Engineering',
    salary: '₹40–55 LPA',
    pipeline: { applied: 34, shortlisted: 12, offered: 2 },
    posted: '2026-04-05', deadline: '2026-06-30',
    description: 'We are looking for a Senior Backend Engineer to build and scale high-throughput distributed systems for Google India\'s core infrastructure team. You will design, develop, and maintain critical services handling millions of requests per second. The ideal candidate brings deep expertise in Go, strong fundamentals in distributed systems, and experience operating services on Kubernetes at scale. You will collaborate closely with SREs and product teams to define reliability targets, drive performance improvements, and contribute to architecture decisions. Strong communication skills and a bias for writing clean, well-tested code are essential.',
    accountManager: 'Rahul Verma',
  },
  {
    id: 'JD-00002', company: 'Google India',
    designation: 'ML Engineer',
    experience: '4–6 years', type: 'Full-Time', mode: 'On-Site',
    openings: 2, filled: 1, status: 'Partially Filled', priority: 'High',
    qualityScore: 38,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLflow', 'BigQuery'],
    location: 'Bengaluru', department: 'AI/ML',
    salary: '₹45–60 LPA',
    pipeline: { applied: 28, shortlisted: 9, offered: 1 },
    posted: '2026-04-05', deadline: '2026-05-31',
    description: 'We are hiring an ML Engineer to design, train, and deploy machine learning models that power Google India\'s recommendation and search systems. You will work on the full ML lifecycle — from data exploration and feature engineering to model evaluation, deployment, and monitoring. Proficiency with TensorFlow or PyTorch is required, and experience with BigQuery and MLflow pipelines is a strong advantage. You will partner with data scientists, product managers, and software engineers to translate business problems into scalable ML solutions that serve hundreds of millions of users.',
    accountManager: 'Rahul Verma',
  },
  {
    id: 'JD-00003', company: 'Tata Consultancy Services',
    designation: 'Java Developer',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 5, filled: 2, status: 'Partially Filled', priority: 'High',
    qualityScore: 28,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Oracle DB', 'Docker'],
    location: 'Mumbai', department: 'Engineering',
    salary: '₹12–18 LPA',
    pipeline: { applied: 62, shortlisted: 18, offered: 4 },
    posted: '2026-04-10', deadline: '2026-07-15',
    description: 'TCS is looking for a Java Developer to build and maintain enterprise-grade microservices for our banking and financial services clients. You will work in agile squads delivering robust REST APIs using Spring Boot, with deployment on Docker and Kubernetes. Strong understanding of Oracle DB and hands-on experience with CI/CD pipelines are required. The role involves close coordination with onshore architects and client stakeholders, so good communication skills and the ability to deliver under timelines are critical.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00004', company: 'Tata Consultancy Services',
    designation: 'Cloud Architect',
    experience: '8+ years', type: 'Full-Time', mode: 'Hybrid',
    openings: 5, filled: 5, status: 'Open', priority: 'Urgent',
    qualityScore: 55,
    skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes', 'DevSecOps'],
    location: 'Hyderabad', department: 'Cloud & Infra',
    salary: '₹35–48 LPA',
    pipeline: { applied: 19, shortlisted: 6, offered: 0 },
    posted: '2026-04-12', deadline: '2026-06-12',
    description: 'We are seeking a Cloud Architect to design and deliver cloud transformation solutions for Fortune 500 enterprise clients across AWS and Azure. You will lead technical solutioning workshops, define infrastructure-as-code standards using Terraform, and ensure security and compliance across multi-cloud environments. Experience with DevSecOps practices and Kubernetes orchestration is mandatory. You will mentor junior engineers and act as the primary technical point of contact for client engagements, translating complex requirements into actionable architecture blueprints.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00005', company: 'Amazon',
    designation: 'SDE II',
    experience: '4–8 years', type: 'Full-Time', mode: 'On-Site',
    openings: 4, filled: 0, status: 'Partially Filled', priority: 'High',
    qualityScore: 41,
    skills: ['Java', 'Distributed Systems', 'AWS', 'DynamoDB', 'React'],
    location: 'Hyderabad', department: 'Engineering',
    salary: '₹35–50 LPA',
    pipeline: { applied: 47, shortlisted: 15, offered: 3 },
    posted: '2026-04-08', deadline: '2026-06-08',
    description: 'Amazon is hiring an SDE II to build and own features on the Seller Experience platform serving millions of third-party sellers globally. You will design scalable distributed services using Java, DynamoDB, and AWS, and contribute to both backend APIs and React-based seller dashboards. The ideal candidate has a strong grasp of system design, writes high-quality, testable code, and thrives in a fast-paced environment. You are expected to take ownership of features end-to-end — from design doc to production deployment and on-call support.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00006', company: 'Amazon',
    designation: 'Data Engineer',
    experience: '3–6 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 2, filled: 2, status: 'Open', priority: 'Medium',
    qualityScore: 33,
    skills: ['Python', 'Spark', 'Redshift', 'Airflow', 'SQL'],
    location: 'Bengaluru', department: 'Data',
    salary: '₹25–38 LPA',
    pipeline: { applied: 31, shortlisted: 10, offered: 0 },
    posted: '2026-04-15', deadline: '2026-07-01',
    description: 'We are looking for a Data Engineer to design, build, and maintain large-scale data pipelines that power Amazon\'s business intelligence and analytics capabilities. You will work with Python, Apache Spark, and Airflow to ingest, transform, and serve petabyte-scale datasets into Redshift. Experience optimising SQL queries and working with streaming data is a plus. You will partner with data scientists and analysts across business units to understand data requirements and deliver reliable, well-documented pipelines with strong data quality guarantees.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00007', company: 'HDFC Bank',
    designation: 'Risk Analyst',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 6, filled: 2, status: 'Closed', priority: 'Normal',
    qualityScore: 47,
    skills: ['Python', 'Risk Modelling', 'SAS', 'Excel', 'SQL'],
    location: 'Mumbai', department: 'Risk Management',
    salary: '₹14–20 LPA',
    pipeline: { applied: 15, shortlisted: 5, offered: 2 },
    posted: '2026-03-01', deadline: '2026-04-30',
    description: 'HDFC Bank is looking for a Risk Analyst to develop and validate credit and market risk models for its retail lending portfolio. You will apply statistical techniques using Python and SAS to assess default probabilities, monitor model performance, and prepare regulatory reports. A solid understanding of RBI guidelines and Basel norms is preferred. You will work closely with the credit policy team and present risk findings to senior leadership, so strong analytical thinking and clear written communication are essential to this role.',
    accountManager: 'Meera Nair',
  },
  {
    id: 'JD-00008', company: 'Zomato',
    designation: 'Product Manager – Growth',
    experience: '4–6 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 3, filled: 1, status: 'Open', priority: 'High',
    qualityScore: 31,
    skills: ['Product Strategy', 'SQL', 'A/B Testing', 'Figma', 'Analytics'],
    location: 'Gurugram', department: 'Product',
    salary: '₹28–40 LPA',
    pipeline: { applied: 22, shortlisted: 7, offered: 0 },
    posted: '2026-04-18', deadline: '2026-06-30',
    description: 'Zomato is looking for a Product Manager – Growth to own experimentation and growth strategy across its consumer app. You will define, prioritise, and ship features that drive user acquisition, retention, and order frequency. Proficiency in SQL and A/B testing frameworks is expected — you should be comfortable pulling your own data and making decisions grounded in metrics. You will work closely with engineering, design, and data science teams, manage a roadmap aligned to company OKRs, and communicate progress clearly to senior leadership.',
    accountManager: 'Ananya Rao',
  },
  {
    id: 'JD-00009', company: 'Zomato',
    designation: 'Android Engineer',
    experience: '3–5 years', type: 'Full-Time', mode: 'On-Site',
    openings: 2, filled: 0, status: 'On-Hold', priority: 'Medium',
    qualityScore: 44,
    skills: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Firebase'],
    location: 'Gurugram', department: 'Engineering',
    salary: '₹22–32 LPA',
    pipeline: { applied: 18, shortlisted: 4, offered: 0 },
    posted: '2026-03-20', deadline: '2026-05-20',
    description: 'We are hiring an Android Engineer to build delightful, high-performance experiences for Zomato\'s 20M+ daily active users. You will develop features using Kotlin and Jetpack Compose, following an MVVM architecture with Coroutines for async operations and Firebase for analytics and crash reporting. You are expected to take ownership of the full feature lifecycle — from design review and implementation to testing, release, and monitoring. A passion for UI quality, app performance, and writing clean, maintainable code is a must.',
    accountManager: 'Ananya Rao',
  },
  {
    id: 'JD-00010', company: 'Tata Consultancy Services',
    designation: 'Scrum Master',
    experience: '5–8 years', type: 'Full-Time', mode: 'Hybrid',
    openings: 3, filled: 1, status: 'Partially Filled', priority: 'Normal',
    qualityScore: 39,
    skills: ['Agile', 'Scrum', 'JIRA', 'Confluence', 'SAFe'],
    location: 'Chennai', department: 'Delivery',
    salary: '₹18–26 LPA',
    pipeline: { applied: 24, shortlisted: 8, offered: 1 },
    posted: '2026-04-02', deadline: '2026-06-15',
    description: 'TCS is seeking an experienced Scrum Master to facilitate agile ceremonies and drive continuous improvement across multiple scrum teams. You will coach teams on agile best practices, remove impediments, and ensure delivery cadence aligns with client commitments. Experience with SAFe at the programme level is a strong advantage. You will maintain JIRA boards, produce sprint metrics, and coordinate dependencies across teams. The ideal candidate is a servant-leader with strong interpersonal skills who can navigate complex client environments and foster a culture of accountability and collaboration.',
    accountManager: 'Sam Lee',
  },
  {
    id: 'JD-00011', company: 'Amazon',
    designation: 'Solutions Architect',
    experience: '8+ years', type: 'Full-Time', mode: 'Hybrid',
    openings: 1, filled: 0, status: 'Open', priority: 'Urgent',
    qualityScore: 57,
    skills: ['AWS', 'Solution Design', 'Networking', 'Security', 'Cost Optimisation'],
    location: 'Hyderabad', department: 'AWS',
    salary: '₹50–70 LPA',
    pipeline: { applied: 11, shortlisted: 3, offered: 0 },
    posted: '2026-04-20', deadline: '2026-07-31',
    description: 'Amazon Web Services is looking for a Solutions Architect to guide enterprise customers in adopting AWS services and designing cloud-native architectures that are secure, resilient, and cost-efficient. You will lead technical discovery sessions, produce architecture diagrams and Well-Architected reviews, and present recommendations to C-level stakeholders. Deep expertise across AWS networking, compute, and security services is required. You will also contribute to pre-sales engagements, working alongside account teams to win strategic deals by demonstrating the technical value of AWS solutions.',
    accountManager: 'Vikram Singh',
  },
  {
    id: 'JD-00012', company: 'Google India',
    designation: 'Product Manager',
    experience: '5–8 years', type: 'Full-Time', mode: 'On-Site',
    openings: 1, filled: 1, status: 'Closed', priority: 'Normal',
    qualityScore: 49,
    skills: ['Product Management', 'Data Analysis', 'Roadmapping', 'Stakeholder Mgmt'],
    location: 'Bengaluru', department: 'Product',
    salary: '₹45–65 LPA',
    pipeline: { applied: 20, shortlisted: 6, offered: 1 },
    posted: '2026-02-10', deadline: '2026-04-10',
    description: 'Google India is hiring a Product Manager to lead strategy and execution for key consumer products. You will define the product vision, build and maintain a prioritised roadmap, and work cross-functionally with engineering, design, data, and marketing teams to deliver impactful features. Comfort with data-driven decision-making, experience running structured experiments, and strong stakeholder management skills are essential. You will represent the voice of the user in all product decisions and communicate product strategy clearly to both technical teams and executive leadership.',
    accountManager: 'Rahul Verma',
  },
]

const EMPTY_JOB = {
  company: 'Google India', designation: '', experience: '3–5 years',
  type: 'Full-Time', mode: 'Hybrid', openings: 1, status: 'Open',
  priority: 'Medium', skills: [], location: 'Bengaluru',
  department: '', salary: '', description: '', accountManager: '',
  qualityScore: 0,
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

function QualityScore({ score, max = 60 }) {
  const color = score >= 50 ? '#15803D' : score >= 35 ? '#2563EB' : '#DC2626'
  return (
    <div className="jb-qs-wrap">
      <span className="jb-qs-value" style={{ color }}>{score}</span>
      <span className="jb-qs-max">/{max}</span>
    </div>
  )
}

function PositionsFill({ filled, openings }) {
  const pct = openings > 0 ? Math.round((filled / openings) * 100) : 0
  const full = filled === openings && openings > 0
  const barColor = full ? '#15803D' : pct >= 50 ? '#6366F1' : '#6366F1'
  return (
    <div className="jb-pos-wrap">
      <div className="jb-pos-text">
        {filled}/{openings} filled{full && <span className="jb-pos-check">✓</span>}
      </div>
      <div className="jb-pos-bar-track">
        <div className="jb-pos-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function JobsPage({ onReviewModeChange = null, reviewMode = false, onJobViewChange = null, onFindCandidates = null }: { onReviewModeChange?: ((v: boolean) => void) | null, reviewMode?: boolean, onJobViewChange?: ((name: string | null) => void) | null, onFindCandidates?: ((filter: any) => void) | null }) {
  const [jobs, setJobs]             = useState(SEED_JOBS)
  const [searchQ, setSearchQ]       = useState('')
  const [filterStatus, setFilter]   = useState('All')
  const [viewMode, setViewMode]     = useState('table') // 'table' | 'grid'
  const [detailId, setDetailId]     = useState(null)
  const [jobModal, setJobModal]       = useState(false)
  const [jobForm, setJobForm]         = useState(EMPTY_JOB)
  const [editJobId, setEditJobId]     = useState(null)
  const [editJobPage, setEditJobPage] = useState(false)
  const [deleteJobId, setDeleteJobId] = useState(null)
  const [skillInput, setSkillInput]   = useState('')
  const [userRole, setUserRole]     = useState<string | null>(null)
  const [parsingModal, setParsingModal] = useState(false)
  const [parsingStep, setParsingStep]   = useState(0) // 0=reading, 1=extracting, 2=scoring, 3=done
  const [reviewJD,    setReviewJD]      = useState(false)
  const [viewJobId,   setViewJobId]     = useState(null)
  const [uploadModal, setUploadModal] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploadDrag, setUploadDrag]   = useState(false)
  const [uploadTab, setUploadTab]     = useState<'file'|'paste'>('file')
  const [pasteText, setPasteText]     = useState('')
  const [uploadCompany, setUploadCompany]     = useState('')
  const [uploadRecruiter, setUploadRecruiter] = useState('')
  const [uploadPositions, setUploadPositions] = useState('')
  const [uploadStatus, setUploadStatus]       = useState('draft')
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [page, setPage]             = useState(1)
  const [perPage, setPerPage]       = useState(10)

  const detail = jobs.find(j => j.id === detailId)
  const isRecruiter = userRole === 'recruiter'

  useEffect(() => {
    if (!parsingModal) return
    setParsingStep(0)
    const t1 = setTimeout(() => setParsingStep(1), 1200)
    const t2 = setTimeout(() => setParsingStep(2), 2600)
    const t3 = setTimeout(() => setParsingStep(3), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [parsingModal])

  useEffect(() => {
    if (parsingStep !== 3 || !parsingModal) return
    const t = setTimeout(() => { setParsingModal(false); setReviewJD(true); onReviewModeChange?.(true) }, 1800)
    return () => clearTimeout(t)
  }, [parsingStep, parsingModal])

  useEffect(() => {
    if (!reviewMode) { setReviewJD(false); setViewJobId(null) }
  }, [reviewMode])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    fetch('/api/v1/users/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.role) setUserRole(data.role) })
      .catch(() => {})
  }, [])

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
  function openAdd() { setUploadFiles([]); setUploadModal(true) }
  function openAddForm() {
    setUploadModal(false)
    setParsingStep(0)
    setParsingModal(true)
  }
  function finishParsing() {
    setParsingModal(false)
    setReviewJD(true)
    onReviewModeChange?.(true)
  }

  function handleUploadFiles(files: FileList | null) {
    if (!files) return
    const valid = Array.from(files).filter(f =>
      (f.type === 'application/pdf' || f.name.endsWith('.docx')) && f.size <= 10 * 1024 * 1024
    )
    setUploadFiles(prev => {
      const combined = [...prev, ...valid]
      return combined.slice(0, 10)
    })
  }
  function openEdit(j, e) {
    e?.stopPropagation()
    setEditJobId(j.id)
    setEditJobPage(true)
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
    if (viewJobId === id) { setViewJobId(null); onJobViewChange?.(null) }
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
  if (editJobPage) {
    return (
      <EditJobPage
        job={editJobId ? jobs.find(j => j.id === editJobId) : { ...EMPTY_JOB }}
        isNew={!editJobId}
        onBack={() => { setEditJobPage(false); setEditJobId(null) }}
        onSave={(updated) => {
          if (editJobId) {
            setJobs(js => js.map(j => j.id === editJobId ? { ...j, ...updated } : j))
          } else {
            setJobs(js => [...js, { ...updated, id: newJobId() }])
          }
          setEditJobPage(false); setEditJobId(null)
        }}
      />
    )
  }

  const viewJob = jobs.find(j => j.id === viewJobId)
  if (viewJob) {
    return (
      <ViewJobPage
        job={viewJob}
        isRecruiter={isRecruiter}
        onBack={() => { setViewJobId(null); onJobViewChange?.(null) }}
        onEdit={j => { setViewJobId(null); onJobViewChange?.(null); openEdit(j, { stopPropagation: () => {} }) }}
        onFindCandidates={onFindCandidates}
      />
    )
  }

  if (reviewJD) {
    return (
      <ReviewJDPage
        company={uploadCompany}
        fileName={uploadFiles[0]?.name || ''}
        positions={uploadPositions}
        onBack={() => { setReviewJD(false); onReviewModeChange?.(false) }}
        onPublish={() => {
          setReviewJD(false)
          onReviewModeChange?.(false)
          setJobForm({ ...EMPTY_JOB, company: uploadCompany || 'Google India' })
          setEditJobId(null); setJobModal(true); setSkillInput('')
        }}
      />
    )
  }

  return (
    <div className="jb-root">

      {/* ── Page Header ── */}
      <div className="jb-page-header">
        <div className="jb-page-header-left">
          <div>
            <div className="jb-page-header-title">Jobs</div>
            <p className="jb-page-header-meta">
              {jobs.length} total · <span className="jb-page-header-meta-pending">{jobs.filter(j => j.priority === 'Urgent').length} urgent</span>
            </p>
          </div>
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
                <th>JOB TITLE</th>
                <th>COMPANY NAME</th>
                <th>STATUS</th>
                <th>QUALITY SCORE</th>
                <th>POSITIONS</th>
                <th>EXPERIENCE</th>
                <th>WORK MODE</th>
                <th>POSTED DATE</th>
                <th className="jb-th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="jb-empty-row">
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
                <tr key={j.id} className="jb-tr" onClick={() => { setViewJobId(j.id); onJobViewChange?.(j.designation) }}>
                  <td><span className="jb-id-badge">{j.id}</span></td>
                  <td><span className="jb-designation">{j.designation}</span></td>
                  <td>
                    <div className="jb-company-cell">
                      <CompanyAvatar name={j.company} size={28} />
                      <span className="jb-company-name">{j.company}</span>
                    </div>
                  </td>
                  <td><StatusBadge status={j.status} /></td>
                  <td><QualityScore score={j.qualityScore} /></td>
                  <td><PositionsFill filled={j.filled} openings={j.openings} /></td>
                  <td><span className="jb-exp-tag">{j.experience}</span></td>
                  <td><span className={`jb-mode-badge jb-mode-${j.mode.toLowerCase().replace('-','')}`}>{j.mode}</span></td>
                  <td><span className="jb-date">{fmtDate(j.posted)}</span></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div className="jb-row-actions">
                      <button
                        className={`jb-icon-btn jb-edit-btn${isRecruiter ? ' jb-action-disabled' : ''}`}
                        title={isRecruiter ? 'Not permitted' : 'Edit'}
                        disabled={isRecruiter}
                        onClick={e => !isRecruiter && openEdit(j, e)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className={`jb-icon-btn jb-del-btn${isRecruiter ? ' jb-action-disabled' : ''}`}
                        title={isRecruiter ? 'Not permitted' : 'Delete'}
                        disabled={isRecruiter}
                        onClick={e => { e.stopPropagation(); if (!isRecruiter) setDeleteJobId(j.id) }}
                      >
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
            <div key={j.id} className="jb-grid-card" onClick={() => { setViewJobId(j.id); onJobViewChange?.(j.designation) }}>
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
                <button className="jb-drawer-edit-btn" onClick={e=>openEdit(detail,e)} disabled={isRecruiter} style={isRecruiter ? {opacity:0.4,cursor:'not-allowed'} : {}}>
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

      {/* ── Upload JD Modal ── */}
      {uploadModal && (
        <>
          <div className="jb-overlay jb-overlay-dark" onClick={() => setUploadModal(false)} />
          <div className="jb-upload-modal">

            {/* Header */}
            <div className="jb-upload-modal-hd">
              <div>
                <div className="jb-upload-modal-title">Add Job Description</div>
                <div className="jb-upload-modal-sub">Upload or paste a JD — Tvarah AI will parse and structure it for you.</div>
              </div>
              <button className="jb-upload-cancel-btn" onClick={() => setUploadModal(false)}>
                × Cancel
              </button>
            </div>

            <div className="jb-upload-modal-body">

              {/* ── Section A ── */}
              <div className="jb-upload-section">
                <div className="jb-upload-section-label">SECTION A — JD SOURCE INPUT</div>

                {/* Tabs */}
                <div className="jb-upload-tabs">
                  <button
                    className={`jb-upload-tab${uploadTab === 'file' ? ' active' : ''}`}
                    onClick={() => setUploadTab('file')}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload File
                  </button>
                  <button
                    className={`jb-upload-tab${uploadTab === 'paste' ? ' active' : ''}`}
                    onClick={() => setUploadTab('paste')}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                    Paste Text
                  </button>
                </div>

                {/* Upload tab content */}
                {uploadTab === 'file' && (
                  <>
                    {uploadFiles.length === 0 ? (
                      <div
                        className={`jb-upload-dropzone${uploadDrag ? ' jb-upload-dropzone--drag' : ''}`}
                        onClick={() => uploadInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setUploadDrag(true) }}
                        onDragLeave={() => setUploadDrag(false)}
                        onDrop={e => { e.preventDefault(); setUploadDrag(false); handleUploadFiles(e.dataTransfer.files) }}
                      >
                        <div className="jb-upload-dropzone-icon-wrap">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <div className="jb-upload-dropzone-text">Drop your JD here, or click to browse</div>
                        <div className="jb-upload-dropzone-sub">Accepted formats: PDF or DOCX</div>
                        <input
                          ref={uploadInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          multiple
                          style={{ display: 'none' }}
                          onChange={e => handleUploadFiles(e.target.files)}
                        />
                      </div>
                    ) : (
                      <div className="jb-uploaded-file-card">
                        <div className="jb-uploaded-file-card-left">
                          <div className="jb-uploaded-file-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                          <div>
                            <div className="jb-uploaded-file-name">{uploadFiles[0].name}</div>
                            <div className="jb-uploaded-file-size">{(uploadFiles[0].size / 1024).toFixed(1)} KB</div>
                          </div>
                        </div>
                        <button className="jb-uploaded-replace-btn" onClick={() => { setUploadFiles([]); uploadInputRef.current?.click() }}>
                          Remove / Replace
                        </button>
                        <input
                          ref={uploadInputRef}
                          type="file"
                          accept=".pdf,.docx"
                          multiple
                          style={{ display: 'none' }}
                          onChange={e => handleUploadFiles(e.target.files)}
                        />
                      </div>
                    )}

                    {uploadFiles.length === 0 && (
                      <button className="jb-upload-demo-link" onClick={() => {
                        setUploadFiles([new File(['demo'], 'Senior_React_Developer_JD.pdf', { type: 'application/pdf' })])
                      }}>
                        → Demo: simulate file upload
                      </button>
                    )}
                  </>
                )}

                {/* Paste tab content */}
                {uploadTab === 'paste' && (
                  <textarea
                    className="jb-upload-paste-area"
                    placeholder="Paste the full job description text here…"
                    value={pasteText}
                    onChange={e => setPasteText(e.target.value)}
                    rows={8}
                  />
                )}
              </div>

              {/* ── Section B ── */}
              <div className="jb-upload-section">
                <div className="jb-upload-section-label">SECTION B — BASIC CONTEXT FIELDS</div>
                <div className="jb-upload-section-hint">AI cannot reliably extract these from JD text — please fill manually.</div>

                <div className="jb-upload-fields-grid">
                  <div className="jb-upload-field-group">
                    <label className="jb-upload-field-label">Company / Account <span className="jb-req">*</span></label>
                    <input className="jb-upload-field-input" placeholder="" value={uploadCompany} onChange={e => setUploadCompany(e.target.value)} />
                    <span className="jb-upload-field-hint">Maps to client_id → clients.</span>
                  </div>
                  <div className="jb-upload-field-group">
                    <label className="jb-upload-field-label">Assign to Recruiter</label>
                    <input className="jb-upload-field-input" placeholder="" value={uploadRecruiter} onChange={e => setUploadRecruiter(e.target.value)} />
                    <span className="jb-upload-field-hint">Defaults to self</span>
                  </div>
                  <div className="jb-upload-field-group">
                    <label className="jb-upload-field-label">
                      Number of Positions
                      <span className="jb-upload-warn-badge">⚠️ #1</span>
                    </label>
                    <input className="jb-upload-field-input" placeholder="e.g. 3" value={uploadPositions} onChange={e => setUploadPositions(e.target.value)} />
                    <span className="jb-upload-field-hint">total_positions — confirm column exists</span>
                  </div>
                  <div className="jb-upload-field-group">
                    <label className="jb-upload-field-label">Initial Status</label>
                    <input className="jb-upload-field-input" placeholder="" value={uploadStatus} onChange={e => setUploadStatus(e.target.value)} />
                    <span className="jb-upload-field-hint">status ENUM — default: draft</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="jb-upload-modal-ft">
              <button className="jb-modal-cancel" onClick={() => setUploadModal(false)}>Cancel</button>
              <button className="jb-modal-save jb-parse-btn" onClick={openAddForm}
                disabled={uploadTab === 'file' ? uploadFiles.length === 0 : pasteText.trim().length === 0}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                </svg>
                Parse JD
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Parsing In Progress Modal ── */}
      {parsingModal && (
        <>
          <div className="jb-overlay jb-overlay-dark" />
          <div className="jb-parsing-modal">

            {/* Stepper */}
            <div className="jb-parsing-stepper">
              {['JD Listing', 'Upload JD', 'Parsing...', 'Review & Confirm', 'JD Detail'].map((s, i) => (
                <div key={s} className={`jb-pstep${i === 2 ? ' active' : i < 2 ? ' done' : ''}`}>
                  {i < 2 && <span className="jb-pstep-check">✓</span>}
                  <span className="jb-pstep-label">{s}</span>
                  {i < 4 && <span className="jb-pstep-arrow">›</span>}
                </div>
              ))}
            </div>

            {/* State pills */}
            <div className="jb-parsing-state-row">
              <span className="jb-parsing-label">STATE:</span>
              <span className={`jb-parsing-pill jb-parsing-pill-processing${parsingStep < 3 ? ' active' : ''}`}>
                {parsingStep < 3 ? 'Processing' : 'Done'}
              </span>
              <span className="jb-parsing-pill jb-parsing-pill-error">Error</span>
            </div>

            {/* Main card */}
            <div className="jb-parsing-card">
              {/* Spinner */}
              <div className="jb-parsing-spinner-wrap">
                <div className={`jb-parsing-spinner${parsingStep === 3 ? ' jb-parsing-spinner-done' : ''}`} />
                <div className="jb-parsing-spinner-logo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" fill="#6366F1"/>
                    <circle cx="12" cy="10" r="3" fill="#4F46E5"/>
                  </svg>
                </div>
              </div>

              <div className="jb-parsing-title">
                {parsingStep < 3 ? 'Tvarah AI is reading your JD…' : 'JD parsed successfully!'}
              </div>
              <div className="jb-parsing-subtitle">
                {parsingStep < 3
                  ? 'This usually takes 3–5 seconds. Please don\'t close this tab.'
                  : 'Review and confirm the extracted fields below.'}
              </div>

              {/* Step pills */}
              <div className="jb-parsing-steps">
                {[
                  { label: 'Reading JD text',  step: 0 },
                  { label: 'Extracting fields', step: 1 },
                  { label: 'Scoring quality',   step: 2 },
                ].map(({ label, step }) => {
                  const done    = parsingStep > step
                  const current = parsingStep === step
                  return (
                    <div key={label} className={`jb-pspill${done ? ' done' : current ? ' active' : ''}`}>
                      {done    && <span>✓</span>}
                      {current && <span className="jb-pspill-dots">••</span>}
                      {label}
                    </div>
                  )
                })}
              </div>

              {/* Extracted preview */}
              {parsingStep >= 1 && (
                <div className="jb-parsing-preview">
                  <div className="jb-parsing-preview-logo">TC</div>
                  <span className="jb-parsing-preview-company">{uploadCompany || 'TechCorp'}</span>
                  <span className="jb-parsing-preview-sep">|</span>
                  <span className="jb-parsing-preview-role">
                    {uploadFiles[0]?.name.replace(/_/g,' ').replace(/\.pdf|\.docx/i,'') || 'Senior React Developer'}
                  </span>
                </div>
              )}

              {/* CTA / Links */}
              {parsingStep === 3 ? (
                <button className="jb-parsing-review-btn" onClick={() => { setParsingModal(false); setReviewJD(true); onReviewModeChange?.(true) }}>
                  Review Parsed JD →
                </button>
              ) : (
                <div className="jb-parsing-links">
                  <button className="jb-parsing-link-ghost" onClick={() => setParsingModal(false)}>
                    Cancel / Go Back — JD will be saved as Draft
                  </button>
                  <button className="jb-parsing-link-demo" onClick={() => { setParsingModal(false); setReviewJD(true); onReviewModeChange?.(true) }}>
                    → Demo: skip to Review &amp; Confirm
                  </button>
                </div>
              )}
            </div>

          </div>
        </>
      )}

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
