// @ts-nocheck
'use client'
import { useState } from 'react'
import './CandidatesPage.css'

// ── Config ────────────────────────────────────────────────────────────────────

const PIPELINE_CFG = {
  'Active':    { dot: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
  'Sourced':   { dot: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' },
  'Backlog':   { dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
  'Shortlisted':{ dot: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' },
  'Flagged':   { dot: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
  'Converted': { dot: '#A855F7', bg: '#FAF5FF', text: '#7E22CE' },
  'Completed': { dot: '#0F172A', bg: '#F1F5F9', text: '#0F172A' },
  'Rejected':  { dot: '#EF4444', bg: '#FEF2F2', text: '#DC2626' },
}

const SCORE_CFG = {
  'Excellent': { color: '#15803D', bg: '#F0FDF4', min: 85 },
  'Good':      { color: '#0D9488', bg: '#F0FDFA', min: 70 },
  'Moderate':  { color: '#B45309', bg: '#FFFBEB', min: 50 },
  'Not a Fit': { color: '#DC2626', bg: '#FEF2F2', min: 0  },
}

const WORK_PREF_CFG = {
  'Open to Relocation': { color: '#15803D', bg: '#F0FDF4' },
  'No Relocation':      { color: '#DC2626', bg: '#FEF2F2' },
  'Remote':             { color: '#6D28D9', bg: '#F5F3FF' },
  'Hybrid':             { color: '#0369A1', bg: '#F0F9FF' },
}

function scoreLabel(s) {
  if (s >= 85) return 'Excellent'
  if (s >= 70) return 'Good'
  if (s >= 50) return 'Moderate'
  return 'Not a Fit'
}

const PIPELINE_OPTIONS  = Object.keys(PIPELINE_CFG)
const WORK_PREF_OPTIONS = Object.keys(WORK_PREF_CFG)
const ROLE_OPTIONS      = ['Senior Backend Eng.','Product Manager','Data Scientist','UX Designer','DevOps Engineer','Fullstack Developer','ML Engineer','Cloud Architect','Business Analyst','QA Engineer']
const COMPANY_OPTIONS   = ['Google','Wipro','TCS','HCL Tech','Tech Mahindra','Mphasis','Infosys','Amazon','Flipkart','Swiggy','Zomato','Microsoft']

// ── Seed Data ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#6366F1','#EC4899','#22C55E','#F59E0B','#14B8A6','#8B5CF6','#F43F5E','#0EA5E9','#10B981','#EF4444','#3B82F6','#A855F7']

const SEED_CANDIDATES = [
  { id:'C-A00031', firstName:'Arjun',  lastName:'Mehta',   role:'Senior Backend Eng.', company:'Google',       phone:'+91 8079089182', location:'Bangalore, India',    exp:6.5, notice:'21d',       score:88, pipeline:'Active',      jobs:2, actions:3,  workPref:'Open to Relocation', color:'#6366F1', starred:false,
    email:'arjun.mehta@gmail.com', skills:['Go','Kubernetes','gRPC','PostgreSQL'], department:'Engineering', salary:'₹32 LPA', created:'2025-01-10' },
  { id:'C-A00032', firstName:'Priya',  lastName:'Sharma',  role:'Product Manager',     company:'Wipro',        phone:'+91 6127912011', location:'Hyderabad, India',    exp:8,   notice:'21d',       score:71, pipeline:'Backlog',     jobs:1, actions:1,  workPref:'No Relocation',      color:'#EC4899', starred:false,
    email:'priya.sharma@outlook.com', skills:['Product Strategy','SQL','Figma'], department:'Product', salary:'₹28 LPA', created:'2025-02-14' },
  { id:'C-A00033', firstName:'Karthik',lastName:'Nair',    role:'Data Scientist',      company:'TCS',          phone:'+91 8917615491', location:'New Delhi, India',    exp:4,   notice:'Immediate', score:79, pipeline:'Sourced',     jobs:3, actions:2,  workPref:'No Relocation',      color:'#22C55E', starred:true,
    email:'karthik.nair@tcs.com', skills:['Python','TensorFlow','Spark','SQL'], department:'Data & Analytics', salary:'₹22 LPA', created:'2025-03-01' },
  { id:'C-A00034', firstName:'Sneha',  lastName:'Mehta',   role:'UX Designer',         company:'HCL Tech',     phone:'+91 8809265058', location:'Noida, India',        exp:5.5, notice:'60d',       score:62, pipeline:'Flagged',     jobs:1, actions:0,  workPref:'Remote',             color:'#F59E0B', starred:false,
    email:'sneha.mehta@hcl.com', skills:['Figma','Sketch','Prototyping','User Research'], department:'Design', salary:'₹18 LPA', created:'2025-01-28' },
  { id:'C-A00035', firstName:'Ravi',   lastName:'Kumar',   role:'DevOps Engineer',     company:'Tech Mahindra',phone:'+91 7880061307', location:'Delhi NCR, India',    exp:7,   notice:'90d',       score:84, pipeline:'Converted',   jobs:1, actions:0,  workPref:'Open to Relocation', color:'#EF4444', starred:false,
    email:'ravi.kumar@techmahindra.com', skills:['Docker','Kubernetes','AWS','Terraform'], department:'Infrastructure', salary:'₹26 LPA', created:'2024-12-05' },
  { id:'C-A00036', firstName:'Divya',  lastName:'Patel',   role:'Fullstack Developer', company:'Mphasis',      phone:'+91 7607982908', location:'San Francisco, USA',  exp:3.5, notice:'45d',       score:55, pipeline:'Completed',   jobs:3, actions:4,  workPref:'Open to Relocation', color:'#8B5CF6', starred:false,
    email:'divya.patel@mphasis.com', skills:['React','Node.js','MongoDB','AWS'], department:'Engineering', salary:'₹20 LPA', created:'2025-02-20' },
  { id:'C-A00037', firstName:'Ankit',  lastName:'Verma',   role:'ML Engineer',         company:'Infosys',      phone:'+91 9812345678', location:'Pune, India',         exp:5,   notice:'30d',       score:91, pipeline:'Shortlisted', jobs:2, actions:2,  workPref:'Hybrid',             color:'#0EA5E9', starred:true,
    email:'ankit.verma@infosys.com', skills:['PyTorch','MLflow','Python','AWS SageMaker'], department:'AI/ML', salary:'₹35 LPA', created:'2025-03-10' },
  { id:'C-A00038', firstName:'Meghna', lastName:'Iyer',    role:'Business Analyst',    company:'Amazon',       phone:'+91 9876543210', location:'Bengaluru, India',    exp:6,   notice:'Immediate', score:76, pipeline:'Active',      jobs:2, actions:1,  workPref:'Hybrid',             color:'#14B8A6', starred:false,
    email:'meghna.iyer@amazon.com', skills:['Power BI','SQL','Stakeholder Management','JIRA'], department:'Operations', salary:'₹24 LPA', created:'2025-01-15' },
  { id:'C-A00039', firstName:'Rohan',  lastName:'Desai',   role:'Cloud Architect',     company:'Flipkart',     phone:'+91 9988776655', location:'Mumbai, India',       exp:9,   notice:'60d',       score:87, pipeline:'Sourced',     jobs:1, actions:3,  workPref:'Open to Relocation', color:'#A855F7', starred:true,
    email:'rohan.desai@flipkart.com', skills:['AWS','Azure','Terraform','Kubernetes','CDK'], department:'Cloud', salary:'₹48 LPA', created:'2024-11-20' },
  { id:'C-A00040', firstName:'Kavita', lastName:'Rao',     role:'QA Engineer',         company:'Swiggy',       phone:'+91 9123456789', location:'Chennai, India',      exp:4,   notice:'15d',       score:68, pipeline:'Backlog',     jobs:0, actions:0,  workPref:'No Relocation',      color:'#10B981', starred:false,
    email:'kavita.rao@swiggy.com', skills:['Selenium','Cypress','API Testing','JIRA'], department:'Quality', salary:'₹16 LPA', created:'2025-02-28' },
  { id:'C-A00041', firstName:'Sahil',  lastName:'Kapoor',  role:'Senior Backend Eng.', company:'Zomato',       phone:'+91 9234567890', location:'Gurugram, India',     exp:7.5, notice:'30d',       score:83, pipeline:'Shortlisted', jobs:3, actions:2,  workPref:'Remote',             color:'#F43F5E', starred:false,
    email:'sahil.kapoor@zomato.com', skills:['Java','Spring Boot','Kafka','Redis','PostgreSQL'], department:'Engineering', salary:'₹38 LPA', created:'2025-03-05' },
  { id:'C-A00042', firstName:'Pooja',  lastName:'Singh',   role:'UX Designer',         company:'Microsoft',    phone:'+91 9345678901', location:'Hyderabad, India',    exp:5,   notice:'Immediate', score:44, pipeline:'Rejected',    jobs:1, actions:0,  workPref:'No Relocation',      color:'#3B82F6', starred:false,
    email:'pooja.singh@microsoft.com', skills:['Figma','Adobe XD','Motion Design'], department:'Design', salary:'₹22 LPA', created:'2024-12-18' },
]

const EMPTY_CANDIDATE = {
  firstName:'', lastName:'', role:'', company:'', phone:'', email:'',
  location:'', exp:0, notice:'30d', score:70, pipeline:'Sourced',
  workPref:'Open to Relocation', department:'', salary:'', skills:[],
  color:'#6366F1', starred:false, jobs:0, actions:0,
}

let _nextId = SEED_CANDIDATES.length + 31
function newCandId() { return `C-A${String(_nextId++).padStart(5,'0')}` }

// ── Helpers ───────────────────────────────────────────────────────────────────

function noticeCls(n) {
  if (!n || n === '—') return 'cnd-notice-grey'
  if (n === 'Immediate') return 'cnd-notice-green'
  const d = parseInt(n)
  if (d <= 30) return 'cnd-notice-red'
  if (d <= 60) return 'cnd-notice-amber'
  return 'cnd-notice-grey'
}

function fmtDate(d) {
  if (!d) return '—'
  const [y,m,day] = d.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${mo[parseInt(m)-1]} ${y}`
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CandAvatar({ c, size = 36 }) {
  const initials = `${c.firstName?.[0]||''}${c.lastName?.[0]||''}`.toUpperCase()
  return (
    <span className="cnd-avatar" style={{ background: c.color, width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </span>
  )
}

function PipelineBadge({ status }) {
  const cfg = PIPELINE_CFG[status] || PIPELINE_CFG['Backlog']
  return (
    <span className="cnd-pipe-badge" style={{ background: cfg.bg, color: cfg.text }}>
      <span className="cnd-pipe-dot" style={{ background: cfg.dot }} />
      {status}
    </span>
  )
}

function ScoreCell({ score }) {
  const lbl = scoreLabel(score)
  const cfg = SCORE_CFG[lbl]
  return (
    <div className="cnd-score-cell">
      <span className="cnd-score-num">{score}</span>
      <span className="cnd-score-lbl" style={{ color: cfg.color }}>{lbl}</span>
    </div>
  )
}

function WorkPrefBadge({ pref }) {
  const cfg = WORK_PREF_CFG[pref] || { color: '#475569', bg: '#F1F5F9' }
  const short = pref === 'Open to Relocation' ? 'Open to Reloc.' : pref
  return <span className="cnd-work-badge" style={{ color: cfg.color }}>{short}</span>
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function CandidatesPage({ jobFilter = null }: { jobFilter?: { designation: string, skills: string[], experience: string } | null }) {
  const [candidates, setCandidates] = useState(SEED_CANDIDATES)
  const [searchQ, setSearchQ]       = useState(jobFilter?.skills?.[0] || '')
  const [filterPipeline, setFilterPipeline] = useState('All')
  const [filterWork, setFilterWork] = useState('All')
  const [detailId, setDetailId]     = useState(null)
  const [candModal, setCandModal]   = useState(false)
  const [candForm, setCandForm]     = useState(EMPTY_CANDIDATE)
  const [editId, setEditId]         = useState(null)
  const [deleteId, setDeleteId]     = useState(null)
  const [skillInput, setSkillInput] = useState('')
  const [page, setPage]             = useState(1)
  const [perPage, setPerPage]       = useState(10)

  const detail = candidates.find(c => c.id === detailId)

  // ── Derived ──────────────────────────────────────────────────────────────────
  const totalActions  = candidates.reduce((s, c) => s + c.actions, 0)
  const totalActive   = candidates.filter(c => c.pipeline === 'Active').length
  const totalShortlisted = candidates.filter(c => c.pipeline === 'Shortlisted').length

  const filtered = candidates.filter(c => {
    const okPipe = filterPipeline === 'All' || c.pipeline === filterPipeline
    const okWork = filterWork === 'All' || c.workPref === filterWork
    const q = searchQ.toLowerCase()
    const okSearch = !q || [c.firstName, c.lastName, c.id, c.role, c.company, c.location, ...c.skills]
      .some(s => (s||'').toLowerCase().includes(q))
    return okPipe && okWork && okSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage   = Math.min(page, totalPages)
  const pageStart  = (safePage - 1) * perPage
  const paginated  = filtered.slice(pageStart, pageStart + perPage)

  function resetPage() { setPage(1) }
  function goTo(p) { setPage(Math.max(1, Math.min(p, totalPages))) }
  function pageNumbers() {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= safePage - 2 && i <= safePage + 2))
        pages.push(i)
      else if (pages[pages.length-1] !== '…') pages.push('…')
    }
    return pages
  }

  const statCards = [
    { label: 'Total Candidates', value: candidates.length, color: '#0D9488', bg: '#F0FDFA',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg> },
    { label: 'Active',           value: totalActive,       color: '#15803D', bg: '#F0FDF4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg> },
    { label: 'Shortlisted',      value: totalShortlisted,  color: '#6D28D9', bg: '#F5F3FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg> },
    { label: 'Action Pending',   value: totalActions,      color: '#DC2626', bg: '#FEF2F2',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> },
  ]

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  function openAdd() { setCandForm({...EMPTY_CANDIDATE}); setEditId(null); setCandModal(true); setSkillInput('') }
  function openEdit(c, e) {
    e?.stopPropagation()
    setCandForm({ firstName:c.firstName, lastName:c.lastName, role:c.role, company:c.company,
      phone:c.phone, email:c.email, location:c.location, exp:c.exp, notice:c.notice,
      score:c.score, pipeline:c.pipeline, workPref:c.workPref, department:c.department,
      salary:c.salary, skills:[...c.skills], color:c.color, starred:c.starred,
      jobs:c.jobs, actions:c.actions })
    setEditId(c.id); setCandModal(true); setSkillInput('')
  }
  function saveCand() {
    if (!candForm.firstName.trim() || !candForm.email.trim()) return
    if (editId) {
      setCandidates(cs => cs.map(c => c.id === editId ? { ...c, ...candForm } : c))
    } else {
      setCandidates(cs => [...cs, { ...candForm, id: newCandId(), created: new Date().toISOString().slice(0,10) }])
    }
    setCandModal(false); setEditId(null)
  }
  function deleteCand(id) {
    setCandidates(cs => cs.filter(c => c.id !== id))
    setDeleteId(null)
    if (detailId === id) setDetailId(null)
  }
  function toggleStar(id, e) {
    e?.stopPropagation()
    setCandidates(cs => cs.map(c => c.id === id ? { ...c, starred: !c.starred } : c))
  }
  function addSkill() {
    const s = skillInput.trim()
    if (s && !candForm.skills.includes(s)) setCandForm(f => ({...f, skills:[...f.skills, s]}))
    setSkillInput('')
  }
  function removeSkill(s) { setCandForm(f => ({...f, skills: f.skills.filter(x=>x!==s)})) }
  function setF(field) { return e => setCandForm(f => ({...f, [field]: e.target.value})) }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="cnd-root">

      {/* ── Page Header ── */}
      <div className="cnd-page-header">
        <div>
          <div className="cnd-page-title">Candidates</div>
          <div className="cnd-page-meta">
            {candidates.length} total
            {totalActions > 0 && <span className="cnd-meta-pending"> · {totalActions} action pending</span>}
          </div>
        </div>
        <button className="cnd-add-btn" onClick={openAdd}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          + Add Candidate
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="cnd-stats">
        {statCards.map(s => (
          <div key={s.label} className="cnd-stat-card">
            <div className="cnd-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="cnd-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="cnd-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="cnd-toolbar">
        <div className="cnd-toolbar-l">
          <span className="cnd-show-label">Show me:</span>

          {/* Pipeline filter tabs */}
          <div className="cnd-status-tabs">
            {['All', ...PIPELINE_OPTIONS].map(p => {
              const cnt = p === 'All' ? candidates.length : candidates.filter(c => c.pipeline === p).length
              return (
                <button key={p}
                  className={`cnd-stab${filterPipeline===p?' active':''}`}
                  onClick={() => { setFilterPipeline(p); resetPage() }}>
                  {p}
                  <span className="cnd-stab-count">{cnt}</span>
                </button>
              )
            })}
          </div>

          {/* Work Pref filter */}
          <select className="cnd-filter-select" value={filterWork}
            onChange={e => { setFilterWork(e.target.value); resetPage() }}>
            <option value="All">Work Pref.</option>
            {WORK_PREF_OPTIONS.map(w => <option key={w}>{w}</option>)}
          </select>

          {filterPipeline !== 'All' || filterWork !== 'All' || searchQ ? (
            <button className="cnd-clear-btn" onClick={() => { setFilterPipeline('All'); setFilterWork('All'); setSearchQ(''); resetPage() }}>
              Clear all filters
            </button>
          ) : null}
        </div>

        <div className="cnd-toolbar-r">
          <div className="cnd-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="cnd-search" placeholder="Search candidates..."
              value={searchQ} onChange={e => { setSearchQ(e.target.value); resetPage() }} />
            {searchQ && (
              <button className="cnd-search-clear" onClick={() => { setSearchQ(''); resetPage() }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          <span className="cnd-count-label">{filtered.length} candidate{filtered.length!==1?'s':''}</span>
        </div>
      </div>

      {/* ── Job filter banner ── */}
      {jobFilter && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          margin: '0 0 10px', padding: '9px 16px',
          background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 10,
          fontSize: 12.5, color: '#4338CA', fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>Finding candidates for <strong>{jobFilter.designation}</strong> · Experience: {jobFilter.experience} · Skills: {jobFilter.skills.slice(0, 3).join(', ')}</span>
        </div>
      )}

      {/* ── Table ── */}
      <div className="cnd-table-wrap">
        <table className="cnd-table">
          <thead>
            <tr>
              <th className="cnd-th-star"></th>
              <th>CANDIDATE</th>
              <th>ROLE</th>
              <th>CONTACT NO.</th>
              <th>LOCATION</th>
              <th>EXP.</th>
              <th>NOTICE</th>
              <th>SCORE</th>
              <th>PIPELINE STATUS</th>
              <th>JOBS</th>
              <th>ACTIONS</th>
              <th>WORK PREF.</th>
              <th className="cnd-th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={13} className="cnd-empty-row">
                <div className="cnd-empty">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <p>No candidates found</p>
                  <button className="cnd-add-btn" onClick={openAdd}>+ Add Candidate</button>
                </div>
              </td></tr>
            )}
            {paginated.map(c => (
              <tr key={c.id} className="cnd-tr" onClick={() => setDetailId(c.id)}>
                {/* Star */}
                <td className="cnd-td-star" onClick={e => toggleStar(c.id, e)}>
                  <svg width="14" height="14" viewBox="0 0 24 24"
                    fill={c.starred ? '#F59E0B' : 'none'}
                    stroke={c.starred ? '#F59E0B' : '#CBD5E1'} strokeWidth="2" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </td>

                {/* Candidate */}
                <td>
                  <div className="cnd-cand-cell">
                    <CandAvatar c={c} size={36} />
                    <div>
                      <div className="cnd-cand-name">{c.firstName} {c.lastName}</div>
                      <div className="cnd-cand-id">{c.id}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td>
                  <div className="cnd-role">{c.role}</div>
                  <div className="cnd-company">@ {c.company}</div>
                </td>

                <td><span className="cnd-phone">{c.phone}</span></td>
                <td><span className="cnd-location">{c.location}</span></td>
                <td><span className="cnd-exp">{c.exp} yrs</span></td>
                <td><span className={`cnd-notice ${noticeCls(c.notice)}`}>{c.notice}</span></td>
                <td><ScoreCell score={c.score} /></td>
                <td>
                  <div className="cnd-pipe-cell">
                    <PipelineBadge status={c.pipeline} />
                    <button className="cnd-pipe-arrow" onClick={e=>e.stopPropagation()} title="Move stage">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </td>
                <td>
                  {c.jobs > 0
                    ? <span className="cnd-jobs-badge">{c.jobs} Job{c.jobs>1?'s':''}</span>
                    : <span className="cnd-jobs-none">—</span>}
                </td>
                <td>
                  {c.actions > 0
                    ? <span className="cnd-actions-badge">{c.actions} Action{c.actions>1?'s':''}</span>
                    : <span className="cnd-actions-none">—</span>}
                </td>
                <td><WorkPrefBadge pref={c.workPref} /></td>
                <td onClick={e=>e.stopPropagation()}>
                  <div className="cnd-row-actions">
                    <button className="cnd-icon-btn cnd-edit-btn" title="Edit" onClick={e=>openEdit(c,e)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="cnd-icon-btn cnd-del-btn" title="Delete" onClick={e=>{e.stopPropagation();setDeleteId(c.id)}}>
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

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="cnd-pagination">
          <div className="cnd-pg-left">
            <span className="cnd-pg-info">
              Showing <strong>{pageStart+1}–{Math.min(pageStart+perPage, filtered.length)}</strong> of <strong>{filtered.length}</strong>
            </span>
            <div className="cnd-pg-per">
              Rows per page:
              <select className="cnd-pg-select" value={perPage}
                onChange={e=>{setPerPage(Number(e.target.value));setPage(1)}}>
                {[5,10,20,50].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="cnd-pg-right">
            <button className="cnd-pg-btn" disabled={safePage===1} onClick={()=>goTo(safePage-1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            {pageNumbers().map((p,i) =>
              p==='…'
                ? <span key={`e${i}`} className="cnd-pg-ellipsis">…</span>
                : <button key={p} className={`cnd-pg-num${safePage===p?' cnd-pg-active':''}`} onClick={()=>goTo(p)}>{p}</button>
            )}
            <button className="cnd-pg-btn" disabled={safePage===totalPages} onClick={()=>goTo(safePage+1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="cnd-overlay" onClick={() => setDetailId(null)} />
          <div className="cnd-drawer">
            <div className="cnd-drawer-hd">
              <div className="cnd-drawer-hd-left">
                <CandAvatar c={detail} size={44} />
                <div>
                  <div className="cnd-drawer-title">{detail.firstName} {detail.lastName}</div>
                  <div className="cnd-drawer-sub">{detail.role} @ {detail.company} · {detail.id}</div>
                </div>
              </div>
              <div className="cnd-drawer-hd-right">
                <button className="cnd-drawer-edit-btn" onClick={e=>openEdit(detail,e)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button className="cnd-drawer-close" onClick={() => setDetailId(null)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cnd-drawer-body">
              {/* Status row */}
              <div className="cnd-dr-badges">
                <PipelineBadge status={detail.pipeline} />
                <WorkPrefBadge pref={detail.workPref} />
              </div>

              {/* Score + KPIs */}
              <div className="cnd-dr-kpis">
                <div className="cnd-dr-kpi">
                  <div className="cnd-dr-kpi-val" style={{color: SCORE_CFG[scoreLabel(detail.score)].color}}>{detail.score}</div>
                  <div className="cnd-dr-kpi-lbl">Score · {scoreLabel(detail.score)}</div>
                </div>
                <div className="cnd-dr-kpi-sep"/>
                <div className="cnd-dr-kpi">
                  <div className="cnd-dr-kpi-val" style={{color:'#0D9488'}}>{detail.exp} yrs</div>
                  <div className="cnd-dr-kpi-lbl">Experience</div>
                </div>
                <div className="cnd-dr-kpi-sep"/>
                <div className="cnd-dr-kpi">
                  <div className={`cnd-dr-kpi-val ${noticeCls(detail.notice)}`}>{detail.notice}</div>
                  <div className="cnd-dr-kpi-lbl">Notice Period</div>
                </div>
                <div className="cnd-dr-kpi-sep"/>
                <div className="cnd-dr-kpi">
                  <div className="cnd-dr-kpi-val" style={{color:'#6366F1'}}>{detail.jobs}</div>
                  <div className="cnd-dr-kpi-lbl">Jobs Applied</div>
                </div>
              </div>

              {/* Contact */}
              <div className="cnd-dr-section">
                <div className="cnd-dr-section-title">Contact & Identity</div>
                <div className="cnd-dr-grid">
                  {[
                    { label:'Candidate ID', value:detail.id,        mono:true },
                    { label:'Email',        value:detail.email,     mono:true },
                    { label:'Phone',        value:detail.phone                },
                    { label:'Location',     value:detail.location             },
                    { label:'Department',   value:detail.department           },
                    { label:'Salary Exp.',  value:detail.salary||'—'          },
                  ].map(r=>(
                    <div key={r.label} className="cnd-dr-grid-item">
                      <div className="cnd-dr-grid-label">{r.label}</div>
                      <div className={`cnd-dr-grid-value${r.mono?' cnd-mono':''}`}>{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {detail.skills.length > 0 && (
                <div className="cnd-dr-section">
                  <div className="cnd-dr-section-title">Skills</div>
                  <div className="cnd-dr-skills">
                    {detail.skills.map(s=><span key={s} className="cnd-dr-skill">{s}</span>)}
                  </div>
                </div>
              )}

              {/* Added on */}
              {detail.created && (
                <div className="cnd-dr-section">
                  <div className="cnd-dr-section-title">Timeline</div>
                  <div className="cnd-dr-grid-item" style={{background:'#F8FAFC',borderRadius:8,padding:'10px 12px'}}>
                    <div className="cnd-dr-grid-label">Added On</div>
                    <div className="cnd-dr-grid-value">{fmtDate(detail.created)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Add / Edit Modal ── */}
      {candModal && (
        <>
          <div className="cnd-overlay cnd-overlay-dark" onClick={() => setCandModal(false)} />
          <div className="cnd-modal">
            <div className="cnd-modal-hd">
              <div>
                <div className="cnd-modal-title">{editId ? 'Edit Candidate' : 'Add Candidate'}</div>
                <div className="cnd-modal-sub">{editId ? 'Update candidate profile.' : 'Register a new candidate.'}</div>
              </div>
              <button className="cnd-modal-close" onClick={() => setCandModal(false)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="cnd-modal-body">
              {/* Avatar */}
              <div className="cnd-avatar-row">
                <CandAvatar c={{...candForm, firstName:candForm.firstName||'C', lastName:candForm.lastName||''}} size={52} />
                <div className="cnd-color-picker">
                  {AVATAR_COLORS.map(col=>(
                    <button key={col} type="button"
                      className={`cnd-color-swatch${candForm.color===col?' active':''}`}
                      style={{background:col}}
                      onClick={()=>setCandForm(f=>({...f,color:col}))} />
                  ))}
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">First Name <span className="cnd-req">*</span></label>
                  <input className="cnd-mf-input" placeholder="First name" value={candForm.firstName} onChange={setF('firstName')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Last Name</label>
                  <input className="cnd-mf-input" placeholder="Last name" value={candForm.lastName} onChange={setF('lastName')} />
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group cnd-mf-wide">
                  <label className="cnd-mf-label">Email <span className="cnd-req">*</span></label>
                  <input className="cnd-mf-input" type="email" placeholder="email@domain.com" value={candForm.email} onChange={setF('email')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Phone</label>
                  <input className="cnd-mf-input" placeholder="+91 XXXXX XXXXX" value={candForm.phone} onChange={setF('phone')} />
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Role / Designation</label>
                  <input className="cnd-mf-input" placeholder="e.g. Senior Backend Eng." value={candForm.role} onChange={setF('role')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Current Company</label>
                  <input className="cnd-mf-input" placeholder="e.g. Google" value={candForm.company} onChange={setF('company')} />
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Location</label>
                  <input className="cnd-mf-input" placeholder="City, Country" value={candForm.location} onChange={setF('location')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Department</label>
                  <input className="cnd-mf-input" placeholder="e.g. Engineering" value={candForm.department} onChange={setF('department')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Experience (yrs)</label>
                  <input className="cnd-mf-input" type="number" step="0.5" min="0" value={candForm.exp} onChange={e=>setCandForm(f=>({...f,exp:parseFloat(e.target.value)||0}))} />
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Notice Period</label>
                  <input className="cnd-mf-input" placeholder="e.g. 30d, Immediate" value={candForm.notice} onChange={setF('notice')} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Score (0–100)</label>
                  <input className="cnd-mf-input" type="number" min="0" max="100" value={candForm.score} onChange={e=>setCandForm(f=>({...f,score:parseInt(e.target.value)||0}))} />
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Salary Expectation</label>
                  <input className="cnd-mf-input" placeholder="e.g. ₹25 LPA" value={candForm.salary} onChange={setF('salary')} />
                </div>
              </div>
              <div className="cnd-mf-row">
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Pipeline Status</label>
                  <select className="cnd-mf-input" value={candForm.pipeline} onChange={setF('pipeline')}>
                    {PIPELINE_OPTIONS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="cnd-mf-group">
                  <label className="cnd-mf-label">Work Preference</label>
                  <select className="cnd-mf-input" value={candForm.workPref} onChange={setF('workPref')}>
                    {WORK_PREF_OPTIONS.map(w=><option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              {/* Skills */}
              <div className="cnd-mf-group" style={{marginBottom:14}}>
                <label className="cnd-mf-label">Skills</label>
                <div className="cnd-skill-row">
                  <input className="cnd-mf-input" placeholder="Type skill and press Enter"
                    value={skillInput} onChange={e=>setSkillInput(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&addSkill()} />
                  <button className="cnd-skill-add-btn" onClick={addSkill}>+</button>
                </div>
                {candForm.skills.length > 0 && (
                  <div className="cnd-skill-chips">
                    {candForm.skills.map(s=>(
                      <span key={s} className="cnd-skill-chip">
                        {s}<button onClick={()=>removeSkill(s)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="cnd-modal-ft">
              <button className="cnd-modal-cancel" onClick={()=>setCandModal(false)}>Cancel</button>
              <button className="cnd-modal-save" onClick={saveCand}>{editId?'Save Changes':'Add Candidate'}</button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (() => {
        const c = candidates.find(x=>x.id===deleteId)
        return (
          <>
            <div className="cnd-overlay cnd-overlay-dark" onClick={()=>setDeleteId(null)} />
            <div className="cnd-confirm-modal">
              <div className="cnd-confirm-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div className="cnd-confirm-title">Delete Candidate?</div>
              <div className="cnd-confirm-sub">Remove <strong>{c?.firstName} {c?.lastName}</strong> ({c?.id}) permanently?</div>
              <div className="cnd-confirm-actions">
                <button className="cnd-confirm-cancel" onClick={()=>setDeleteId(null)}>Cancel</button>
                <button className="cnd-confirm-delete" onClick={()=>deleteCand(deleteId)}>Yes, Delete</button>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}
