// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import './TaskPage.css'

// ── Logged-in recruiter ──────────────────────────────────────────────────────

const ME = {
  name: 'Rahul Verma',
  role: 'Senior Recruiter',
  team: 'Engineering Hiring',
  company: 'Tvarah Technologies',
  color: '#4F46E5',
  tasksOwned: 25,
}

// ── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  'Todo':        { dot: '#94A3B8', bg: '#F1F5F9', text: '#475569' },
  'In Progress': { dot: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' },
  'Done':        { dot: '#22C55E', bg: '#F0FDF4', text: '#15803D' },
  'Overdue':     { dot: '#EF4444', bg: '#FEF2F2', text: '#DC2626' },
  'On Hold':     { dot: '#F59E0B', bg: '#FFFBEB', text: '#B45309' },
}

const PRIORITY_CFG = {
  'Critical': { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', icon: '🔴' },
  'High':     { color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', icon: '🟠' },
  'Medium':   { color: '#CA8A04', bg: '#FEFCE8', border: '#FDE68A', icon: '🟡' },
  'Low':      { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', icon: '🟢' },
}

const TYPE_CFG = {
  'Follow-up Call':      { bg: '#EEF2FF', text: '#4F46E5', icon: '📞' },
  'Technical Interview': { bg: '#F0FDF4', text: '#15803D', icon: '💻' },
  'HR Round':            { bg: '#FFF1F2', text: '#BE123C', icon: '🤝' },
  'Document Collection': { bg: '#FFFBEB', text: '#B45309', icon: '📄' },
  'Reference Check':     { bg: '#F0FDFA', text: '#0D9488', icon: '🔍' },
  'Offer Letter':        { bg: '#FDF4FF', text: '#7E22CE', icon: '📋' },
  'Onboarding':          { bg: '#ECFDF5', text: '#065F46', icon: '🚀' },
  'Background Check':    { bg: '#FFF7ED', text: '#C2410C', icon: '🔒' },
  'Assessment Test':     { bg: '#EFF6FF', text: '#1D4ED8', icon: '📝' },
  'Salary Negotiation':  { bg: '#F5F3FF', text: '#6D28D9', icon: '💰' },
}

const STATUS_OPTIONS    = Object.keys(STATUS_CFG)
const PRIORITY_OPTIONS  = Object.keys(PRIORITY_CFG)
const TYPE_OPTIONS      = Object.keys(TYPE_CFG)
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25]

const ASSIGNEES = [
  'Rahul Verma', 'Sam Lee', 'Vikram Singh', 'Ananya Rao',
  'Deepak Joshi', 'Meera Nair', 'Arjun Kapoor', 'Priya Mehta',
]

// ── Seed data ────────────────────────────────────────────────────────────────

const SEED = [
  // ── Rahul Verma's tasks (logged-in recruiter) ──────────────────────────────
  {
    id: 'TSK-001', title: 'Schedule technical interview round 2',
    candidateName: 'Arjun Mehta',     candidateColor: '#4F7FFF', candidateRole: 'Senior Backend Eng.',
    assignedTo: 'Rahul Verma', type: 'Technical Interview',
    priority: 'High',   status: 'In Progress',
    dueDate: '2026-05-10', createdDate: '2026-05-01',
    description: 'Set up round 2 with the panel. Send Zoom link and calendar invite to all participants.',
    tags: ['urgent', 'interview'], notes: 'Candidate prefers afternoon slots.',
  },
  {
    id: 'TSK-002', title: 'Reference check — 2 previous employers',
    candidateName: 'Deepak Joshi',    candidateColor: '#0D9488', candidateRole: 'SRE',
    assignedTo: 'Rahul Verma', type: 'Reference Check',
    priority: 'High',   status: 'In Progress',
    dueDate: '2026-05-11', createdDate: '2026-05-03',
    description: 'Call two previous employers. Verify tenure, role and performance.',
    tags: ['reference', 'verification'], notes: 'Contacted first reference. Second pending.',
  },
  {
    id: 'TSK-003', title: 'Collect salary slips for BGV',
    candidateName: 'Mohit Agarwal',   candidateColor: '#84CC16', candidateRole: 'Engineering Dir.',
    assignedTo: 'Rahul Verma', type: 'Document Collection',
    priority: 'High',   status: 'On Hold',
    dueDate: '2026-05-14', createdDate: '2026-05-03',
    description: 'Request last 3 months salary slips and bank statement for background verification.',
    tags: ['docs', 'bgv'], notes: 'Candidate raised confidentiality concerns.',
  },
  {
    id: 'TSK-004', title: 'Verify educational certificates',
    candidateName: 'Sonia Gupta',     candidateColor: '#8B5CF6', candidateRole: 'Frontend Dev',
    assignedTo: 'Rahul Verma', type: 'Document Collection',
    priority: 'Medium', status: 'Done',
    dueDate: '2026-05-06', createdDate: '2026-04-29',
    description: 'Collect and verify degree certificates, mark sheets and professional certifications.',
    tags: ['docs', 'verification'], notes: 'Verified on May 5.',
  },
  {
    id: 'TSK-005', title: 'Salary negotiation call',
    candidateName: 'Vikram Singh',    candidateColor: '#10B981', candidateRole: 'Cloud Architect',
    assignedTo: 'Rahul Verma', type: 'Salary Negotiation',
    priority: 'Critical', status: 'Todo',
    dueDate: '2026-05-09', createdDate: '2026-05-04',
    description: 'Discuss revised compensation. Aim to close within offered range.',
    tags: ['offer', 'negotiation'], notes: 'Candidate asked for 12 LPA. Budget is 11 LPA.',
  },
  {
    id: 'TSK-006', title: 'Send offer letter for approval',
    candidateName: 'Ravi Kumar',      candidateColor: '#EF4444', candidateRole: 'DevOps Engineer',
    assignedTo: 'Rahul Verma', type: 'Offer Letter',
    priority: 'Critical', status: 'In Progress',
    dueDate: '2026-05-08', createdDate: '2026-04-28',
    description: 'Prepare and send offer letter draft to hiring manager. Include compensation breakdown.',
    tags: ['offer', 'urgent'], notes: 'Candidate has competing offer expiring May 10.',
  },
  {
    id: 'TSK-007', title: 'Follow-up after 3 days of no response',
    candidateName: 'Rohan Das',       candidateColor: '#DC2626', candidateRole: 'Backend Eng. III',
    assignedTo: 'Rahul Verma', type: 'Follow-up Call',
    priority: 'Medium', status: 'Overdue',
    dueDate: '2026-05-04', createdDate: '2026-04-30',
    description: 'Candidate went silent after round 2. Attempt contact via phone, email, and WhatsApp.',
    tags: ['follow-up'], notes: '3 unanswered calls.',
  },
  {
    id: 'TSK-008', title: 'Review assessment test scores',
    candidateName: 'Sneha Mehta',     candidateColor: '#F59E0B', candidateRole: 'UX Designer',
    assignedTo: 'Rahul Verma', type: 'Assessment Test',
    priority: 'Low',    status: 'Overdue',
    dueDate: '2026-05-03', createdDate: '2026-04-27',
    description: 'Candidate submitted design assessment. Review scores and share feedback with hiring team.',
    tags: ['assessment'], notes: 'Score: 72/100. Review pending.',
  },
  {
    id: 'TSK-009', title: 'Panel interview coordination — Round 3',
    candidateName: 'Ananya Rao',      candidateColor: '#F59E0B', candidateRole: 'Product Designer',
    assignedTo: 'Rahul Verma', type: 'Technical Interview',
    priority: 'High',   status: 'Todo',
    dueDate: '2026-05-13', createdDate: '2026-05-04',
    description: 'Coordinate 3-person panel for system design round. Book conference room and send Zoom link.',
    tags: ['panel', 'interview'], notes: '',
  },
  {
    id: 'TSK-010', title: 'Post-offer joining confirmation',
    candidateName: 'Divya Krishnan',  candidateColor: '#F97316', candidateRole: 'Frontend Architect',
    assignedTo: 'Rahul Verma', type: 'Follow-up Call',
    priority: 'Medium', status: 'Done',
    dueDate: '2026-05-05', createdDate: '2026-04-28',
    description: 'Confirm joining date, mode of joining and travel/relocation requirements.',
    tags: ['joining', 'confirmation'], notes: 'Confirmed joining on May 19.',
  },
  {
    id: 'TSK-011', title: 'Initiate background verification',
    candidateName: 'Divya Patel',     candidateColor: '#6366F1', candidateRole: 'Fullstack Developer',
    assignedTo: 'Rahul Verma', type: 'Background Check',
    priority: 'High',   status: 'Done',
    dueDate: '2026-05-05', createdDate: '2026-04-25',
    description: 'Initiate BGV via third-party vendor. Share candidate details securely.',
    tags: ['bgv', 'compliance'], notes: 'BGV completed successfully on May 4.',
  },
  {
    id: 'TSK-012', title: 'Mock interview prep call',
    candidateName: 'Kiran Reddy',     candidateColor: '#D97706', candidateRole: 'Data Engineering Lead',
    assignedTo: 'Rahul Verma', type: 'Follow-up Call',
    priority: 'Low',    status: 'Todo',
    dueDate: '2026-05-15', createdDate: '2026-05-04',
    description: 'Optional prep call to align candidate on what to expect in the final round.',
    tags: ['coaching', 'prep'], notes: '',
  },
  // ── Other team members' tasks ──────────────────────────────────────────────
  {
    id: 'TSK-013', title: 'Collect updated resume & portfolio',
    candidateName: 'Priya Sharma',    candidateColor: '#EC4899', candidateRole: 'Product Manager',
    assignedTo: 'Sam Lee', type: 'Document Collection',
    priority: 'Medium', status: 'Todo',
    dueDate: '2026-05-12', createdDate: '2026-05-02',
    description: 'Request latest resume, portfolio links, and work samples before the design round.',
    tags: ['docs'], notes: '',
  },
  {
    id: 'TSK-014', title: 'Conduct HR round',
    candidateName: 'Karthik Nair',    candidateColor: '#10B981', candidateRole: 'Data Scientist',
    assignedTo: 'Meera Nair', type: 'HR Round',
    priority: 'Medium', status: 'Todo',
    dueDate: '2026-05-14', createdDate: '2026-05-02',
    description: 'Final HR round — assess culture fit, compensation expectations and notice period.',
    tags: ['hr', 'final'], notes: 'Candidate expects 15% hike.',
  },
  {
    id: 'TSK-015', title: 'Prepare onboarding kit',
    candidateName: 'Amit Shah',       candidateColor: '#1A2B4A', candidateRole: 'iOS Developer',
    assignedTo: 'Meera Nair', type: 'Onboarding',
    priority: 'Medium', status: 'Todo',
    dueDate: '2026-05-20', createdDate: '2026-05-03',
    description: 'Prepare laptop, ID card, access credentials and onboarding docs for joining date.',
    tags: ['onboarding'], notes: 'Joining date: May 22.',
  },
  {
    id: 'TSK-016', title: 'Schedule initial screening call',
    candidateName: 'Pooja Iyer',      candidateColor: '#DB2777', candidateRole: 'ML Engineer',
    assignedTo: 'Deepak Joshi', type: 'Follow-up Call',
    priority: 'Low',    status: 'Done',
    dueDate: '2026-05-04', createdDate: '2026-04-30',
    description: 'Initial screening call — discuss profile, expectations and role details.',
    tags: ['screening'], notes: 'Candidate cleared. Moving to technical round.',
  },
  {
    id: 'TSK-017', title: 'Collect NOC from current employer',
    candidateName: 'Rahul Nanda',     candidateColor: '#0284C7', candidateRole: 'Backend Engineer',
    assignedTo: 'Sam Lee', type: 'Document Collection',
    priority: 'High',   status: 'On Hold',
    dueDate: '2026-05-15', createdDate: '2026-05-03',
    description: 'Candidate needs NOC from current employer before offer can be processed.',
    tags: ['docs', 'compliance'], notes: 'Candidate says employer will take 2 weeks.',
  },
  {
    id: 'TSK-018', title: 'Extend offer deadline by 3 days',
    candidateName: 'Arjun Kapoor',    candidateColor: '#F43F5E', candidateRole: 'iOS Tech Lead',
    assignedTo: 'Meera Nair', type: 'Offer Letter',
    priority: 'Critical', status: 'In Progress',
    dueDate: '2026-05-07', createdDate: '2026-05-05',
    description: 'Candidate requested extension. Update offer validity and inform hiring manager.',
    tags: ['offer', 'urgent'], notes: 'Extension approved by Director.',
  },
  {
    id: 'TSK-019', title: 'Send assessment test link',
    candidateName: 'Nikhil Sharma',   candidateColor: '#0284C7', candidateRole: 'Cloud Architect',
    assignedTo: 'Ananya Rao', type: 'Assessment Test',
    priority: 'Low',    status: 'Done',
    dueDate: '2026-05-05', createdDate: '2026-05-01',
    description: 'Share 90-minute online coding test link from HackerRank. Deadline: 48 hours.',
    tags: ['assessment'], notes: 'Candidate scored 88/100.',
  },
  {
    id: 'TSK-020', title: 'Final HR discussion & offer confirmation',
    candidateName: 'Kavitha Menon',   candidateColor: '#16A34A', candidateRole: 'Android Lead',
    assignedTo: 'Meera Nair', type: 'HR Round',
    priority: 'High',   status: 'In Progress',
    dueDate: '2026-05-11', createdDate: '2026-05-04',
    description: 'Final discussion on compensation, benefits, joining date and role expectations.',
    tags: ['hr', 'final', 'offer'], notes: '',
  },
  {
    id: 'TSK-021', title: 'Coordinate onboarding with IT team',
    candidateName: 'Deepak Joshi',    candidateColor: '#0D9488', candidateRole: 'SRE',
    assignedTo: 'Vikram Singh', type: 'Onboarding',
    priority: 'Medium', status: 'Todo',
    dueDate: '2026-05-22', createdDate: '2026-05-05',
    description: 'Share joining date and role details with IT team for laptop and system access setup.',
    tags: ['onboarding', 'it'], notes: '',
  },
  {
    id: 'TSK-022', title: 'Counteroffer discussion',
    candidateName: 'Priya Mehta',     candidateColor: '#8B5CF6', candidateRole: 'Principal Engineer',
    assignedTo: 'Sam Lee', type: 'Salary Negotiation',
    priority: 'Critical', status: 'In Progress',
    dueDate: '2026-05-09', createdDate: '2026-05-05',
    description: 'Candidate received counteroffer from current employer. Evaluate if we can match or exceed.',
    tags: ['counteroffer', 'urgent'], notes: 'Must close before May 9.',
  },
  {
    id: 'TSK-023', title: 'Security clearance documentation',
    candidateName: 'Harsh Vardhan',   candidateColor: '#4F46E5', candidateRole: 'Security Engineer',
    assignedTo: 'Vikram Singh', type: 'Background Check',
    priority: 'High',   status: 'Todo',
    dueDate: '2026-05-18', createdDate: '2026-05-05',
    description: 'Collect and verify security clearance documents required for client engagement.',
    tags: ['security', 'compliance'], notes: '',
  },
  {
    id: 'TSK-024', title: 'Schedule behavioural interview',
    candidateName: 'Lakshmi Prasad',  candidateColor: '#0891B2', candidateRole: 'Data Science Mgr',
    assignedTo: 'Deepak Joshi', type: 'Technical Interview',
    priority: 'Low',    status: 'Todo',
    dueDate: '2026-05-16', createdDate: '2026-05-04',
    description: 'Schedule behavioural interview. Share STAR framework brief.',
    tags: ['interview', 'behavioural'], notes: '',
  },
  {
    id: 'TSK-025', title: 'Send regret letter',
    candidateName: 'Aditya Nair',     candidateColor: '#059669', candidateRole: 'SRE Lead',
    assignedTo: 'Sam Lee', type: 'Follow-up Call',
    priority: 'Low',    status: 'Done',
    dueDate: '2026-05-06', createdDate: '2026-05-02',
    description: 'Candidate did not clear final round. Send professional regret communication with feedback.',
    tags: ['rejection', 'closure'], notes: 'Letter sent on May 5.',
  },
]

const EMPTY_FORM = {
  title: '', candidateName: '', candidateColor: '#4F7FFF', candidateRole: '',
  assignedTo: '', type: 'Follow-up Call', priority: 'Medium', status: 'Todo',
  dueDate: '', description: '', tags: [], notes: '',
}

const CANDIDATE_PALETTE = [
  '#4F7FFF','#EC4899','#10B981','#F59E0B',
  '#EF4444','#6366F1','#0D9488','#F43F5E',
  '#8B5CF6','#1A2B4A','#0284C7','#DB2777',
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function mkInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}
function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${parseInt(day)} ${mo[parseInt(m)-1]} ${y}`
}
function isOverdue(task) {
  if (task.status === 'Done') return false
  return task.dueDate && new Date(task.dueDate) < new Date()
}
function dueDelta(d, status) {
  if (!d || status === 'Done') return null
  const diff = Math.round((new Date(d) - new Date()) / 86400000)
  if (diff < 0)   return { label: `${Math.abs(diff)}d overdue`, cls: 'tsk-due-overdue' }
  if (diff === 0) return { label: 'Due today',     cls: 'tsk-due-today' }
  if (diff <= 3)  return { label: `${diff}d left`, cls: 'tsk-due-soon' }
  return           { label: `${diff}d left`,        cls: 'tsk-due-ok' }
}
let _nextId = SEED.length + 1
function newId() { return `TSK-${String(_nextId++).padStart(3, '0')}` }

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status, size = 'md' }) {
  const c = STATUS_CFG[status] || STATUS_CFG['Todo']
  return (
    <span className={`tsk-badge tsk-badge-${size}`} style={{ background: c.bg, color: c.text }}>
      <span className="tsk-badge-dot" style={{ background: c.dot }} />
      {status}
    </span>
  )
}
function PriorityChip({ priority }) {
  const c = PRIORITY_CFG[priority] || PRIORITY_CFG['Medium']
  return (
    <span className="tsk-priority-chip" style={{ background: c.bg, color: c.color, borderColor: c.border }}>
      {c.icon} {priority}
    </span>
  )
}
function TypeBadge({ type }) {
  const c = TYPE_CFG[type] || { bg: '#F1F5F9', text: '#475569', icon: '📌' }
  return (
    <span className="tsk-type-badge" style={{ background: c.bg, color: c.text }}>
      <span>{c.icon}</span> {type}
    </span>
  )
}
function CandAvatar({ name, color, size = 32 }) {
  return (
    <span className="tsk-avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}>
      {mkInitials(name)}
    </span>
  )
}
function TagChip({ label }) {
  return <span className="tsk-tag">#{label}</span>
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TaskPage() {
  const [tasks, setTasks]                   = useState(SEED)
  const [filterStatus, setFilterStatus]     = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterCand, setFilterCand]         = useState('All')
  const [filterType, setFilterType]         = useState('All')
  const [myTasksOnly, setMyTasksOnly]       = useState(true)   // default: recruiter's own tasks
  const [searchQ, setSearchQ]               = useState('')
  const [viewMode, setView]                 = useState('table')
  const [sortKey, setSortKey]               = useState('dueDate')
  const [sortAsc, setSortAsc]               = useState(true)
  const [page, setPage]                     = useState(1)
  const [pageSize, setPageSize]             = useState(10)
  const [modalOpen, setModalOpen]           = useState(false)
  const [editingId, setEditingId]           = useState(null)
  const [form, setForm]                     = useState(EMPTY_FORM)
  const [formErrors, setFormErrors]         = useState({})
  const [deleteId, setDeleteId]             = useState(null)
  const [detailId, setDetailId]             = useState(null)
  const [tagInput, setTagInput]             = useState('')

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setDetailId(null); setModalOpen(false) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // ── Derived ───────────────────────────────────────────────────────────────

  // Tasks scoped to the view: recruiter's own OR full team
  const scopedTasks      = myTasksOnly ? tasks.filter(t => t.assignedTo === ME.name) : tasks
  const uniqueCandidates = [...new Set(scopedTasks.map(t => t.candidateName))].sort()

  // Banner KPIs always from recruiter's own tasks
  const myTasks          = tasks.filter(t => t.assignedTo === ME.name)
  const myDone           = myTasks.filter(t => t.status === 'Done').length
  const myOverdue        = myTasks.filter(t => isOverdue(t) || t.status === 'Overdue').length
  const myActiveCands    = new Set(myTasks.filter(t => t.status !== 'Done').map(t => t.candidateName)).size
  const myCompletionPct  = myTasks.length ? Math.round((myDone / myTasks.length) * 100) : 0

  const filtered = scopedTasks
    .filter(t => {
      const okStatus   = filterStatus   === 'All' || t.status        === filterStatus
      const okPriority = filterPriority === 'All' || t.priority      === filterPriority
      const okCand     = filterCand     === 'All' || t.candidateName === filterCand
      const okType     = filterType     === 'All' || t.type          === filterType
      const q = searchQ.toLowerCase()
      const okSearch   = !q || [t.title, t.candidateName, t.assignedTo, t.type, ...t.tags]
        .some(s => s.toLowerCase().includes(q))
      return okStatus && okPriority && okCand && okType && okSearch
    })
    .sort((a, b) => {
      let av = a[sortKey] ?? '', bv = b[sortKey] ?? ''
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortAsc ? -1 : 1
      if (av > bv) return sortAsc ? 1 : -1
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage   = Math.min(page, totalPages)
  const pageStart  = (safePage - 1) * pageSize
  const paginated  = filtered.slice(pageStart, pageStart + pageSize)

  function goToPage(p) { setPage(Math.max(1, Math.min(p, totalPages))) }
  function resetPage()  { setPage(1) }

  // Stat cards reflect the current view scope
  const scopedDone     = scopedTasks.filter(t => t.status === 'Done').length
  const scopedOverdue  = scopedTasks.filter(t => isOverdue(t) || t.status === 'Overdue').length
  const scopedCands    = new Set(scopedTasks.filter(t => t.status !== 'Done').map(t => t.candidateName)).size
  const scopedInProg   = scopedTasks.filter(t => t.status === 'In Progress').length

  const statCards = [
    {
      label: 'My Tasks', value: myTasksOnly ? scopedTasks.length : myTasks.length,
      color: '#4F46E5', bg: '#EEF2FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"/></svg>,
    },
    {
      label: 'In Progress', value: scopedInProg,
      color: '#1D4ED8', bg: '#EFF6FF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8 8 0 0 1 4.07 11H5a1 1 0 0 1 0 2 6 6 0 0 0 5 5.92zm0-9.86A6 6 0 0 0 7.07 12H6a1 1 0 0 1 0-2 8 8 0 0 1 7-7.93V3a1 1 0 0 1 2 0v.07A8 8 0 0 1 19.93 11H19a1 1 0 0 1 0-2 6 6 0 0 0-6-5.93z"/></svg>,
    },
    {
      label: 'Overdue', value: scopedOverdue,
      color: '#DC2626', bg: '#FEF2F2',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    },
    {
      label: 'Completed', value: scopedDone,
      color: '#15803D', bg: '#F0FDF4',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>,
    },
  ]

  // ── CRUD ──────────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, assignedTo: myTasksOnly ? ME.name : '' })
    setFormErrors({})
    setTagInput(''); setModalOpen(true)
  }
  function openEdit(t) {
    setEditingId(t.id); setForm({ ...t, tags: [...t.tags] })
    setFormErrors({}); setTagInput(''); setModalOpen(true)
  }
  function closeModal() { setModalOpen(false); setEditingId(null) }

  function validate() {
    const e = {}
    if (!form.title.trim())         e.title         = 'Task title is required'
    if (!form.candidateName.trim()) e.candidateName = 'Candidate name is required'
    if (!form.assignedTo.trim())    e.assignedTo    = 'Assigned-to is required'
    if (!form.dueDate)              e.dueDate       = 'Due date is required'
    return e
  }
  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    if (editingId) {
      setTasks(ts => ts.map(x => x.id === editingId ? { ...form, id: editingId, tags: [...form.tags] } : x))
    } else {
      setTasks(ts => [...ts, { ...form, id: newId(), createdDate: new Date().toISOString().slice(0,10), tags: [...form.tags] }])
    }
    closeModal()
  }
  function handleDelete(id) {
    setTasks(ts => ts.filter(x => x.id !== id))
    setDeleteId(null)
    if (detailId === id) setDetailId(null)
  }
  function quickDone(id) {
    setTasks(ts => ts.map(x => x.id === id
      ? { ...x, status: x.status === 'Done' ? 'In Progress' : 'Done' }
      : x
    ))
  }
  function addTag() {
    const v = tagInput.trim().replace(/^#/, '').toLowerCase()
    if (v && !form.tags.includes(v)) setForm(f => ({ ...f, tags: [...f.tags, v] }))
    setTagInput('')
  }
  function removeTag(tag) { setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) })) }
  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }
  function toggleSort(key) {
    if (sortKey === key) setSortAsc(a => !a)
    else { setSortKey(key); setSortAsc(true) }
    resetPage()
  }

  const detail = tasks.find(t => t.id === detailId)

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="tsk-root">

      {/* ── Page header ── */}
      <div className="tsk-page-header">
        <div className="tsk-page-header-left">
          <div className="tsk-page-header-title">
            {myTasksOnly ? 'My Tasks' : 'Team Tasks'}
          </div>
          {myOverdue > 0 && myTasksOnly && (
            <span className="tsk-overdue-alert">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {myOverdue} overdue
            </span>
          )}
          <div className="tsk-view-tabs">
            <button
              type="button"
              className={`tsk-view-tab${myTasksOnly ? ' tsk-view-tab-active' : ''}`}
              onClick={() => { setMyTasksOnly(true); resetPage() }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 8a7 7 0 0 1 14 0H5z"/>
              </svg>
              My Tasks
              <span className="tsk-view-tab-count">{myTasks.length}</span>
            </button>
            <button
              type="button"
              className={`tsk-view-tab${!myTasksOnly ? ' tsk-view-tab-active' : ''}`}
              onClick={() => { setMyTasksOnly(false); resetPage() }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H2zm15-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 8h3a5 5 0 0 0-6.9-4.6A9 9 0 0 1 19 20z"/>
              </svg>
              Team View
              <span className="tsk-view-tab-count">{tasks.length}</span>
            </button>
          </div>
        </div>
        <div className="tsk-page-header-right">
          <div className="tsk-progress-pill">
            <div className="tsk-progress-pill-bar">
              <div className="tsk-progress-pill-fill" style={{ width: `${myCompletionPct}%` }} />
            </div>
            <span className="tsk-progress-pill-label">{myCompletionPct}% done</span>
          </div>
          <button className="tsk-export-btn" type="button">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="tsk-add-btn" type="button" onClick={openAdd}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="tsk-stats">
        {statCards.map(s => (
          <div key={s.label} className="tsk-stat-card">
            <div className="tsk-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="tsk-stat-body">
              <div className="tsk-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="tsk-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="tsk-toolbar">
        <div className="tsk-toolbar-l">
          {/* Search */}
          <div className="tsk-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="tsk-search" placeholder="Search task, candidate, type..."
              value={searchQ} onChange={e => { setSearchQ(e.target.value); resetPage() }} />
            {searchQ && (
              <button className="tsk-search-clear" type="button" onClick={() => { setSearchQ(''); resetPage() }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="tsk-filter-tabs">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button key={s} type="button"
                className={`tsk-ftab${filterStatus === s ? ' tsk-ftab-active' : ''}`}
                onClick={() => { setFilterStatus(s); resetPage() }}>
                {s}
                {s !== 'All' && <span className="tsk-ftab-count">{tasks.filter(t => t.status === s).length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="tsk-toolbar-r">
          {/* Task type filter */}
          <select className="tsk-select-filter" value={filterType}
            onChange={e => { setFilterType(e.target.value); resetPage() }}>
            <option value="All">All Types</option>
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>

          {/* Candidate filter */}
          <select className="tsk-select-filter" value={filterCand}
            onChange={e => { setFilterCand(e.target.value); resetPage() }}>
            <option value="All">All Candidates</option>
            {uniqueCandidates.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* Priority filter */}
          <select className="tsk-select-filter" value={filterPriority}
            onChange={e => { setFilterPriority(e.target.value); resetPage() }}>
            <option value="All">All Priorities</option>
            {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
          </select>

          {/* View toggle */}
          <div className="tsk-view-toggle">
            <button type="button" className={`tsk-vt-btn${viewMode==='table'?' active':''}`} onClick={() => setView('table')} title="Table view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button type="button" className={`tsk-vt-btn${viewMode==='cards'?' active':''}`} onClick={() => setView('cards')} title="Card view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          </div>
          <span className="tsk-count-label">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <select className="tsk-page-size-select" value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); resetPage() }}>
            {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      {/* ── Table view ── */}
      {viewMode === 'table' && (
        <div className="tsk-table-wrap">
          <table className="tsk-table">
            <thead>
              <tr>
                <th className="tsk-th-sort" onClick={() => toggleSort('id')}>
                  ID {sortKey==='id' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-sort" onClick={() => toggleSort('title')}>
                  TASK {sortKey==='title' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-sort" onClick={() => toggleSort('candidateName')}>
                  CANDIDATE {sortKey==='candidateName' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th>TYPE</th>
                <th className="tsk-th-sort" onClick={() => toggleSort('assignedTo')}>
                  OWNER {sortKey==='assignedTo' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-sort" onClick={() => toggleSort('priority')}>
                  PRIORITY {sortKey==='priority' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-sort" onClick={() => toggleSort('dueDate')}>
                  DUE DATE {sortKey==='dueDate' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-sort" onClick={() => toggleSort('status')}>
                  STATUS {sortKey==='status' && <span className="tsk-sort-arrow">{sortAsc?'↑':'↓'}</span>}
                </th>
                <th className="tsk-th-actions">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="tsk-empty-row">
                    <div className="tsk-empty">
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
                      </svg>
                      <p>No tasks found</p>
                      <button type="button" className="tsk-add-btn" onClick={openAdd}>+ Add Task</button>
                    </div>
                  </td>
                </tr>
              )}
              {paginated.map(t => {
                const dd = dueDelta(t.dueDate, t.status)
                return (
                  <tr key={t.id} className={`tsk-tr${t.status === 'Done' ? ' tsk-tr-done' : ''}`} onClick={() => setDetailId(t.id)}>
                    <td><span className="tsk-id-badge">{t.id}</span></td>
                    <td>
                      <div className="tsk-title-cell">
                        <span className={`tsk-title-text${t.status === 'Done' ? ' tsk-title-struck' : ''}`}>{t.title}</span>
                        <div className="tsk-tag-row">
                          {t.tags.slice(0,2).map(tag => <TagChip key={tag} label={tag} />)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="tsk-cand-cell">
                        <CandAvatar name={t.candidateName} color={t.candidateColor} size={30} />
                        <div>
                          <div className="tsk-cand-name">{t.candidateName}</div>
                          <div className="tsk-cand-role">{t.candidateRole}</div>
                        </div>
                      </div>
                    </td>
                    <td><TypeBadge type={t.type} /></td>
                    <td>
                      <div className="tsk-assignee-cell">
                        <span className="tsk-assignee-avatar">{mkInitials(t.assignedTo)}</span>
                        <span className="tsk-assignee-name">{t.assignedTo}</span>
                      </div>
                    </td>
                    <td><PriorityChip priority={t.priority} /></td>
                    <td>
                      <div className="tsk-date-cell">
                        <span className="tsk-date-val">{fmtDate(t.dueDate)}</span>
                        {dd && <span className={`tsk-due-chip ${dd.cls}`}>{dd.label}</span>}
                      </div>
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="tsk-row-actions">
                        <button
                          type="button"
                          className={`tsk-check-btn${t.status === 'Done' ? ' tsk-check-done' : ''}`}
                          title={t.status === 'Done' ? 'Mark undone' : 'Mark done'}
                          onClick={() => quickDone(t.id)}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </button>
                        <button type="button" className="tsk-icon-btn tsk-edit-btn" title="Edit" onClick={() => openEdit(t)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button type="button" className="tsk-icon-btn tsk-del-btn" title="Delete" onClick={() => setDeleteId(t.id)}>
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
        <div className="tsk-cards-grid">
          {paginated.length === 0 && (
            <div className="tsk-empty tsk-empty-cards">
              <p>No tasks found</p>
              <button type="button" className="tsk-add-btn" onClick={openAdd}>+ Add Task</button>
            </div>
          )}
          {paginated.map(t => {
            const dd = dueDelta(t.dueDate, t.status)
            const sc = STATUS_CFG[t.status] || STATUS_CFG['Todo']
            return (
              <div key={t.id} className="tsk-card" style={{ borderLeftColor: sc.dot }}
                onClick={() => setDetailId(t.id)}>
                <div className="tsk-card-top">
                  <StatusBadge status={t.status} size="sm" />
                  <div className="tsk-card-actions" onClick={e => e.stopPropagation()}>
                    <button type="button" className="tsk-icon-btn tsk-edit-btn" onClick={() => openEdit(t)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button type="button" className="tsk-icon-btn tsk-del-btn" onClick={() => setDeleteId(t.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="tsk-card-title">{t.title}</div>
                <TypeBadge type={t.type} />
                <div className="tsk-card-divider" />
                <div className="tsk-card-cand">
                  <CandAvatar name={t.candidateName} color={t.candidateColor} size={26} />
                  <div>
                    <div className="tsk-card-cname">{t.candidateName}</div>
                    <div className="tsk-card-crole">{t.candidateRole}</div>
                  </div>
                </div>
                <div className="tsk-card-meta">
                  <div className="tsk-card-meta-row">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" opacity="0.4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{t.assignedTo}</span>
                  </div>
                  <div className="tsk-card-meta-row">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
                      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{fmtDate(t.dueDate)}</span>
                    {dd && <span className={`tsk-due-chip ${dd.cls}`}>{dd.label}</span>}
                  </div>
                </div>
                <div className="tsk-card-footer">
                  <PriorityChip priority={t.priority} />
                  <span className="tsk-card-id">{t.id}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="tsk-pagination">
          <span className="tsk-pg-info">
            Showing <strong>{pageStart + 1}–{Math.min(pageStart + pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> tasks
          </span>
          <div className="tsk-pg-controls">
            <button type="button" className="tsk-pg-btn" disabled={safePage === 1} onClick={() => goToPage(1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
            <button type="button" className="tsk-pg-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {(() => {
              const pages = [], delta = 2
              const left  = Math.max(1, safePage - delta)
              const right = Math.min(totalPages, safePage + delta)
              if (left > 1) { pages.push(1); if (left > 2) pages.push('...') }
              for (let i = left; i <= right; i++) pages.push(i)
              if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages) }
              return pages.map((p, i) =>
                p === '...'
                  ? <span key={`d${i}`} className="tsk-pg-dots">…</span>
                  : <button key={p} type="button" className={`tsk-pg-num${p===safePage?' tsk-pg-num-active':''}`} onClick={() => goToPage(p)}>{p}</button>
              )
            })()}
            <button type="button" className="tsk-pg-btn" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <button type="button" className="tsk-pg-btn" disabled={safePage === totalPages} onClick={() => goToPage(totalPages)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detail && (
        <>
          <div className="tsk-overlay" onClick={() => setDetailId(null)} />
          <div className="tsk-drawer">
            <div className="tsk-drawer-hd">
              <div className="tsk-drawer-title">Task Details</div>
              <div className="tsk-drawer-hd-right">
                <button type="button" className="tsk-drawer-edit" onClick={() => { setDetailId(null); openEdit(detail) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit
                </button>
                <button type="button" className="tsk-drawer-close" onClick={() => setDetailId(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="tsk-drawer-body">
              <div className="tsk-dr-hero">
                <div className="tsk-dr-type-icon">{TYPE_CFG[detail.type]?.icon || '📌'}</div>
                <div className="tsk-dr-hero-info">
                  <div className="tsk-dr-title">{detail.title}</div>
                  <div className="tsk-dr-type-name">{detail.type}</div>
                </div>
              </div>
              <div className="tsk-dr-badges">
                <StatusBadge status={detail.status} />
                <PriorityChip priority={detail.priority} />
                <span className="tsk-id-badge">{detail.id}</span>
              </div>
              <div className="tsk-dr-section">
                <div className="tsk-dr-section-title">Candidate</div>
                <div className="tsk-dr-cand-row">
                  <CandAvatar name={detail.candidateName} color={detail.candidateColor} size={40} />
                  <div>
                    <div className="tsk-dr-cname">{detail.candidateName}</div>
                    <div className="tsk-dr-crole">{detail.candidateRole || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="tsk-dr-grid">
                {[
                  { label: 'Owner',   value: detail.assignedTo },
                  { label: 'Due Date', value: fmtDate(detail.dueDate) },
                  { label: 'Created',  value: fmtDate(detail.createdDate) },
                  { label: 'Priority', value: detail.priority },
                ].map(r => (
                  <div key={r.label} className="tsk-dr-grid-item">
                    <div className="tsk-dr-grid-label">{r.label}</div>
                    <div className="tsk-dr-grid-value">{r.value}</div>
                  </div>
                ))}
              </div>
              {detail.status !== 'Done' && detail.dueDate && (() => {
                const dd = dueDelta(detail.dueDate, detail.status)
                return dd && (
                  <div className={`tsk-dr-due-banner ${dd.cls}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {dd.label}
                  </div>
                )
              })()}
              {detail.description && (
                <div className="tsk-dr-section">
                  <div className="tsk-dr-section-title">Description</div>
                  <div className="tsk-dr-text">{detail.description}</div>
                </div>
              )}
              {detail.tags.length > 0 && (
                <div className="tsk-dr-section">
                  <div className="tsk-dr-section-title">Tags</div>
                  <div className="tsk-dr-tags">{detail.tags.map(tag => <TagChip key={tag} label={tag} />)}</div>
                </div>
              )}
              {detail.notes && (
                <div className="tsk-dr-section">
                  <div className="tsk-dr-section-title">Notes</div>
                  <div className="tsk-dr-text tsk-dr-notes">{detail.notes}</div>
                </div>
              )}
              {!detail.description && !detail.notes && (
                <div className="tsk-dr-empty">No description or notes added.</div>
              )}
            </div>
            <div className="tsk-drawer-ft">
              <button type="button" className="tsk-drawer-del-btn" onClick={() => { setDetailId(null); setDeleteId(detail.id) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                </svg>
                Delete
              </button>
              <button
                type="button"
                className={`tsk-drawer-done-btn${detail.status === 'Done' ? ' tsk-drawer-done-active' : ''}`}
                onClick={() => quickDone(detail.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {detail.status === 'Done' ? 'Mark Undone' : 'Mark Done'}
              </button>
              <button type="button" className="tsk-drawer-edit-full" onClick={() => { setDetailId(null); openEdit(detail) }}>
                Edit Task
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (() => {
        const t = tasks.find(x => x.id === deleteId)
        return (
          <>
            <div className="tsk-overlay tsk-overlay-dark" onClick={() => setDeleteId(null)} />
            <div className="tsk-confirm-modal">
              <div className="tsk-confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </div>
              <div className="tsk-confirm-title">Delete Task?</div>
              <div className="tsk-confirm-sub">
                You are about to delete <strong>"{t?.title}"</strong> for{' '}
                <strong>{t?.candidateName}</strong>. This cannot be undone.
              </div>
              <div className="tsk-confirm-actions">
                <button type="button" className="tsk-confirm-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                <button type="button" className="tsk-confirm-delete" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              </div>
            </div>
          </>
        )
      })()}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <>
          <div className="tsk-overlay tsk-overlay-dark" onClick={closeModal} />
          <div className="tsk-modal">
            <div className="tsk-modal-hd">
              <div>
                <div className="tsk-modal-title">{editingId ? 'Edit Task' : 'Add New Task'}</div>
                <div className="tsk-modal-sub">{editingId ? 'Update task details below.' : 'Create a task for a candidate in your pipeline.'}</div>
              </div>
              <button type="button" className="tsk-modal-close" onClick={closeModal}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="tsk-modal-body">

              {/* Title */}
              <div className="tsk-form-row">
                <div className="tsk-form-group">
                  <label className="tsk-label">Task Title <span className="tsk-req">*</span></label>
                  <input className={`tsk-input${formErrors.title?' tsk-input-err':''}`}
                    placeholder="e.g. Schedule technical interview" value={form.title} onChange={set('title')} />
                  {formErrors.title && <span className="tsk-err">{formErrors.title}</span>}
                </div>
              </div>

              {/* Candidate Name + Role */}
              <div className="tsk-form-row">
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Candidate Name <span className="tsk-req">*</span></label>
                  <input className={`tsk-input${formErrors.candidateName?' tsk-input-err':''}`}
                    placeholder="e.g. Arjun Mehta" value={form.candidateName} onChange={set('candidateName')} />
                  {formErrors.candidateName && <span className="tsk-err">{formErrors.candidateName}</span>}
                </div>
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Candidate Role</label>
                  <input className="tsk-input" placeholder="e.g. Backend Engineer"
                    value={form.candidateRole} onChange={set('candidateRole')} />
                </div>
              </div>

              {/* Type + Owner */}
              <div className="tsk-form-row">
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Task Type</label>
                  <select className="tsk-input tsk-select" value={form.type} onChange={set('type')}>
                    {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Owner <span className="tsk-req">*</span></label>
                  <input className={`tsk-input${formErrors.assignedTo?' tsk-input-err':''}`}
                    placeholder="Recruiter responsible"
                    value={form.assignedTo} onChange={set('assignedTo')}
                    list="tsk-assignees-list" />
                  <datalist id="tsk-assignees-list">
                    {ASSIGNEES.map(a => <option key={a} value={a} />)}
                  </datalist>
                  {formErrors.assignedTo && <span className="tsk-err">{formErrors.assignedTo}</span>}
                </div>
              </div>

              {/* Priority + Status */}
              <div className="tsk-form-row">
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Priority</label>
                  <div className="tsk-seg-group">
                    {PRIORITY_OPTIONS.map(p => {
                      const c = PRIORITY_CFG[p]
                      return (
                        <button key={p} type="button"
                          className={`tsk-seg${form.priority===p?' tsk-seg-active':''}`}
                          style={form.priority===p ? { background: c.bg, color: c.color, borderColor: c.border } : {}}
                          onClick={() => setForm(f => ({ ...f, priority: p }))}>
                          {c.icon} {p}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Status</label>
                  <select className="tsk-input tsk-select" value={form.status} onChange={set('status')}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Due Date + Avatar Color */}
              <div className="tsk-form-row">
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Due Date <span className="tsk-req">*</span></label>
                  <input type="date" className={`tsk-input${formErrors.dueDate?' tsk-input-err':''}`}
                    value={form.dueDate} onChange={set('dueDate')} />
                  {formErrors.dueDate && <span className="tsk-err">{formErrors.dueDate}</span>}
                </div>
                <div className="tsk-form-group tsk-fg-2">
                  <label className="tsk-label">Candidate Avatar Color</label>
                  <div className="tsk-color-picker">
                    {CANDIDATE_PALETTE.map(c => (
                      <button key={c} type="button"
                        className={`tsk-color-swatch${form.candidateColor===c?' active':''}`}
                        style={{ background: c }} onClick={() => setForm(f => ({ ...f, candidateColor: c }))} />
                    ))}
                    <div className="tsk-color-preview" style={{ background: form.candidateColor }}>
                      <span>{mkInitials(form.candidateName || 'C')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="tsk-form-row">
                <div className="tsk-form-group">
                  <label className="tsk-label">Description</label>
                  <textarea className="tsk-textarea" rows={3}
                    placeholder="Task details, instructions, context..."
                    value={form.description} onChange={set('description')} />
                </div>
              </div>

              {/* Tags */}
              <div className="tsk-form-row">
                <div className="tsk-form-group">
                  <label className="tsk-label">Tags</label>
                  <div className="tsk-tag-input-wrap">
                    <input className="tsk-input tsk-tag-inp"
                      placeholder="Type tag and press Enter"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
                    <button type="button" className="tsk-tag-add-btn" onClick={addTag}>+</button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="tsk-tag-list">
                      {form.tags.map(tag => (
                        <span key={tag} className="tsk-tag tsk-tag-removable">
                          #{tag}
                          <button type="button" className="tsk-tag-rm" onClick={() => removeTag(tag)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="tsk-form-row">
                <div className="tsk-form-group">
                  <label className="tsk-label">Notes</label>
                  <textarea className="tsk-textarea" rows={2}
                    placeholder="Internal notes, reminders..."
                    value={form.notes} onChange={set('notes')} />
                </div>
              </div>

            </div>
            <div className="tsk-modal-ft">
              <button type="button" className="tsk-modal-cancel" onClick={closeModal}>Cancel</button>
              <button type="button" className="tsk-modal-save" onClick={handleSave}>
                {editingId ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
