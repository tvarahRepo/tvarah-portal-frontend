// @ts-nocheck
'use client'
import React from 'react'
import './ReviewJDPage.css'

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

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function companyInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TC'
}

interface Props {
  job: any
  onBack: () => void
  onEdit?: (job: any) => void
  isRecruiter?: boolean
  onFindCandidates?: ((filter: any) => void) | null
}

export default function ViewJobPage({ job, onBack, onEdit, isRecruiter = false, onFindCandidates = null }: Props) {
  if (!job) return null

  const statusCfg   = STATUS_CFG[job.status]    || STATUS_CFG['Closed']
  const priorityCfg = PRIORITY_CFG[job.priority] || PRIORITY_CFG['Normal']
  const avatarColor = COMPANY_COLORS[job.company] || '#6366F1'
  const initials    = companyInitials(job.company)
  const scoreMax    = 100
  const scorePct    = Math.min(100, Math.round((job.qualityScore / scoreMax) * 100))
  const circumference = 2 * Math.PI * 28

  const PIPELINE_ROWS = [
    { label: 'Applied',      value: job.pipeline.applied,      color: '#3B82F6' },
    { label: 'Shortlisted',  value: job.pipeline.shortlisted,  color: '#F59E0B' },
    { label: 'Offered',      value: job.pipeline.offered,      color: '#15803D' },
    { label: 'Filled',       value: `${job.filled}/${job.openings}`, color: '#6366F1' },
    { label: 'JD Score',     value: `${job.qualityScore}/${scoreMax}`, color: scorePct >= 70 ? '#22C55E' : scorePct >= 40 ? '#F59E0B' : '#EF4444' },
    { label: 'Priority',     value: job.priority,              color: priorityCfg.text },
  ]

  return (
    <div className="rjd-root">

      {/* Combined header + actions row */}
      <div className="vjp-top-bar">
        <div className="vjp-hd-row">
          <div className="vjp-hd-avatar" style={{ background: avatarColor }}>{initials}</div>
          <div className="vjp-hd-body">
            <div className="vjp-hd-title-row">
              <span className="vjp-hd-name">{job.designation}</span>
              <span className="vjp-status-chip" style={{ background: statusCfg.bg, color: statusCfg.text }}>
                <span className="vjp-status-dot" style={{ background: statusCfg.dot }} />
                {job.status}
              </span>
              <span className="vjp-hd-dept-chip">{job.department}</span>
            </div>
            <div className="vjp-hd-sub">{job.company} · {job.location}</div>
          </div>
        </div>
        <div className="vjp-top-bar-actions">
          <button className="vjp-btn-upload" onClick={() => onEdit?.(job)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload / Replace JD
          </button>
          <button className="vjp-btn-pause">Pause JD</button>
          <button className="vjp-btn-find" onClick={() => onFindCandidates?.({ designation: job.designation, skills: job.skills, experience: job.experience })}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Find Candidates
          </button>
        </div>
      </div>

      {/* Section A — Job Details card */}
      <div className="rjd-ab-row">
        <div className="rjd-section rjd-section-a">

          {/* Overview header */}
          <div className="rjd-section-hd">Job Overview</div>

          {/* Metadata strip */}
          <div className="rjd-info-strip">
            <div className="rjd-info-item">
              <span className="rjd-info-label">CLIENT</span>
              <div className="rjd-company-row">
                <div className="rjd-company-avatar" style={{ background: avatarColor }}>{initials}</div>
                <span className="rjd-company-name">{job.company}</span>
              </div>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">ASSIGNED RECRUITER</span>
              <div className="rjd-recruiter-row">
                <div className="rjd-recruiter-avatar">AK</div>
                <span className="rjd-recruiter-name">{job.accountManager || 'Arjun Kumar'}</span>
              </div>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">DATE ADDED</span>
              <span className="rjd-info-val">{fmtDate(job.posted)}</span>
            </div>
            <div className="rjd-info-item rjd-info-item-last">
              <span className="rjd-info-label">LAST UPDATED</span>
              <span className="rjd-info-val">{fmtDate(job.deadline)}</span>
            </div>
          </div>

          {/* Role Details strip */}
          <div className="rjd-info-strip" style={{ borderTop: '1px solid #F1F5F9' }}>
            <div className="rjd-info-item">
              <span className="rjd-info-label">DEPARTMENT</span>
              <span className="rjd-info-val">{job.department}</span>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">LOCATION</span>
              <span className="rjd-info-val">{job.location}</span>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">EXPERIENCE</span>
              <span className="rjd-info-val">{job.experience}</span>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">EMPLOYMENT</span>
              <span className="rjd-info-val">{job.type}</span>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">WORK MODE</span>
              <span className="rjd-info-val">{job.mode}</span>
            </div>
            <div className="rjd-info-item">
              <span className="rjd-info-label">OPENINGS</span>
              <span className="rjd-info-val">{job.openings} <span style={{ color: '#94A3B8', fontWeight: 500 }}>({job.filled} filled)</span></span>
            </div>
            <div className="rjd-info-item rjd-info-item-last">
              <span className="rjd-info-label">SALARY</span>
              <span className="rjd-info-val">{job.salary || '—'}</span>
            </div>
          </div>
        </div>

        {/* Section B — Pipeline & Score */}
        <div className="rjd-section rjd-section-b">
          <div className="rjd-section-hd">Pipeline & Score</div>

          <div className="rjd-score-body-row">
            <div className="rjd-score-circle-col">
              <div className="rjd-score-circle-wrap">
                <svg className="rjd-score-svg" viewBox="0 0 72 72" width="64" height="64">
                  <circle className="rjd-score-circle-bg" cx="36" cy="36" r="28" />
                  <circle
                    className="rjd-score-circle-val"
                    cx="36" cy="36" r="28"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (scorePct / 100) * circumference}
                  />
                </svg>
                <div>
                  <div className="rjd-score-circle-text">{job.qualityScore}</div>
                  <div className="rjd-score-circle-max">/{scoreMax}</div>
                </div>
              </div>
              <div className="rjd-score-ai-note">JD Quality Score</div>
            </div>

            <div className="rjd-score-rows-grid">
              {PIPELINE_ROWS.map(row => (
                <div key={row.label} className="rjd-score-row">
                  <span className="rjd-score-row-label">{row.label}</span>
                  <span className="rjd-score-row-val" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Skills</div>
        <div className="rjd-d-grid">

          {/* Must-Have Skills */}
          <div className="rjd-d-cell">
            <div className="rjd-field-label">MUST-HAVE SKILLS</div>
            <div className="rjd-chip-list" style={{ marginTop: 10 }}>
              {job.skills?.map(s => (
                <span key={s} className="rjd-chip rjd-chip-plain">{s}</span>
              ))}
            </div>
          </div>

          {/* Good-To-Have Skills */}
          <div className="rjd-d-cell rjd-d-cell-border">
            <div className="rjd-field-label">GOOD-TO-HAVE SKILLS</div>
            <div className="rjd-chip-list" style={{ marginTop: 10 }}>
              {(job.goodSkills || []).map(s => (
                <span key={s} className="rjd-chip rjd-chip-plain">{s}</span>
              ))}
            </div>
          </div>

          {/* Target Company Types */}
          <div className="rjd-d-cell rjd-d-cell-top-border">
            <div className="rjd-field-label">TARGET COMPANY TYPES</div>
            <div className="rjd-chip-list" style={{ marginTop: 10 }}>
              {(job.targetTypes || []).map(s => (
                <span key={s} className="rjd-chip rjd-chip-purple">{s}</span>
              ))}
            </div>
          </div>

          {/* Non-Negotiable Rules */}
          <div className="rjd-d-cell rjd-d-cell-border rjd-d-cell-top-border">
            <div className="rjd-field-label">NON-NEGOTIABLE RULES</div>
            <div className="rjd-rules-list" style={{ marginTop: 10 }}>
              {(job.rules || []).map(r => (
                <div key={r} className="rjd-rule-row">
                  <svg className="rjd-rule-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  <span className="rjd-rule-text">{r}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Candidate Pipeline */}
      {(() => {
        const total       = job.pipeline.applied
        const shortlisted = job.pipeline.shortlisted
        const called      = Math.round(shortlisted * 0.65)
        const panelSched  = Math.round(shortlisted * 0.33)
        const panelDone   = Math.round(shortlisted * 0.25)
        const clientRound = Math.round(shortlisted * 0.17)
        const offered     = job.pipeline.offered
        const joined      = 0
        const rejected    = Math.max(0, shortlisted - offered - joined - clientRound)
        const filledPct   = job.openings > 0 ? Math.round((job.filled / job.openings) * 100) : 0
        const ACTIVITY    = [3, 7, 5, 11, 8, 6, 9]
        const DAYS        = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        const maxAct      = Math.max(...ACTIVITY)
        const STATS = [
          { label: 'Total',        value: total,       color: '#0F172A' },
          { label: 'Shortlisted',  value: shortlisted, color: '#0F172A' },
          { label: 'Called',       value: called,      color: '#0F172A' },
          { label: 'Panel Sched.', value: panelSched,  color: '#0F172A' },
          { label: 'Panel Done',   value: panelDone,   color: '#0F172A' },
          { label: 'Client Round', value: clientRound, color: '#0F172A' },
          { label: 'Offered',      value: offered,     color: '#0F172A' },
          { label: 'Joined',       value: joined,      color: '#22C55E' },
          { label: 'Rejected',     value: rejected,    color: '#EF4444', highlight: true },
        ]
        return (
          <div className="rjd-section">
            {/* Section header row */}
            <div className="vjp-pipeline-hd">
              <span className="rjd-section-hd" style={{ border: 'none', padding: 0 }}>Candidate Pipeline</span>
              <div className="vjp-pipeline-positions">
                <span className="vjp-pipeline-pos-label">Positions:</span>
                <span className="vjp-pipeline-pos-val">{job.filled}/{job.openings} filled</span>
                <div className="vjp-pipeline-bar-track">
                  <div className="vjp-pipeline-bar-fill" style={{ width: `${filledPct}%` }} />
                </div>
                <span className="vjp-pipeline-pct">{filledPct}%</span>
              </div>
            </div>

            {/* KPI stats row */}
            <div className="vjp-pipeline-stats">
              {STATS.map(s => (
                <div key={s.label} className={`vjp-pipeline-stat${s.highlight ? ' vjp-pipeline-stat-danger' : ''}`}>
                  <div className="vjp-pipeline-stat-val" style={{ color: s.color }}>{s.value}</div>
                  <div className="vjp-pipeline-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 7-day activity chart */}
            <div className="vjp-activity-wrap">
              <div className="vjp-activity-title">
                7-day candidate activity
              </div>
              <div className="vjp-activity-chart">
                {ACTIVITY.map((v, i) => (
                  <div key={i} className="vjp-activity-col">
                    <div className="vjp-activity-bar-wrap">
                      <div className="vjp-activity-bar" style={{ height: `${Math.round((v / maxAct) * 100)}%` }} />
                    </div>
                    <div className="vjp-activity-day">{DAYS[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Original JD Text */}
      {job.description && (
        <div className="rjd-section">
          <div className="rjd-section-hd">Original JD Text</div>
          <div className="rjd-e-body">
            <p className="rjd-e-text">{job.description}</p>
            <div className="rjd-e-links">
              <a className="rjd-e-link" href="#">
                View original JD
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 3 }}><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
              </a>
              <a className="rjd-e-link" href="#">Download original PDF</a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
