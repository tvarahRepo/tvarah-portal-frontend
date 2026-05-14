// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from 'react'
import './ReviewJDPage.css'

const COMPANY_COLORS = {
  'Google India': '#4285F4', 'Tata Consultancy Services': '#0054A6',
  'Amazon': '#FF9900', 'HDFC Bank': '#004C8F', 'Zomato': '#E23744',
  'Infosys BPM': '#007CC3', 'Wipro': '#9C27B0', 'Swiggy': '#FC8019',
  'Flipkart': '#2874F0', 'Meesho': '#F43397',
}

const SCORECARD_ROWS = [
  { label: 'Role Clarity',                    type: 'score', value: '9/10' },
  { label: 'Tech Stack Specificity',          type: 'score', value: '8/10' },
  { label: 'Consulting vs Product Alignment', type: 'tag',   value: 'aligned',           tagClass: 'rjd-tag-green', icon: '✅' },
  { label: 'Experience Inflation',            type: 'tag',   value: 'flagged',            tagClass: 'rjd-tag-amber', icon: '⚠️' },
  { label: 'Missing Screening Criteria',      type: 'tag',   value: 'None missing',       tagClass: 'rjd-tag-green', icon: '✅' },
  { label: 'Compensation Signal',             type: 'tag',   value: 'CTC range not specified', tagClass: 'rjd-tag-blue', icon: 'ℹ️' },
]

function companyInitials(name = '') {
  return name.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'TC'
}

function cleanFileName(name = '') {
  return name.replace(/_/g, ' ').replace(/\.(pdf|docx)$/i, '')
}

interface Props {
  company:    string
  fileName:   string
  positions:  string
  onBack:     () => void
  onPublish:  () => void
}

export default function ReviewJDPage({ company, fileName, positions, onBack, onPublish }: Props) {
  const [activeState,   setActiveState]   = useState('Default')
  const [publishOpen,   setPublishOpen]   = useState(false)
  const publishRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) {
        setPublishOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const [jobTitle,    setJobTitle]    = useState(cleanFileName(fileName) || 'Senior React Developer')
  const [numPos,      setNumPos]      = useState(positions || '3')
  const [expMin,      setExpMin]      = useState('4')
  const [expMax,      setExpMax]      = useState('7')
  const [salMin,      setSalMin]      = useState('18')
  const [salMax,      setSalMax]      = useState('28')
  // Section D state
  const [mustSkills,       setMustSkills]       = useState(['React','TypeScript','Node.js','Redux','GraphQL'])
  const [goodSkills,       setGoodSkills]       = useState(['Docker','AWS','Testing'])
  const [targetTypes,      setTargetTypes]      = useState(['SaaS','FinTech','EdTech'])
  const [rules,            setRules]            = useState(['Min 4 yrs React experience','No job-hoppers (< 1yr stays)','Must have led feature releases'])
  const [mustInput,        setMustInput]        = useState('')
  const [goodInput,        setGoodInput]        = useState('')
  const [typeInput,        setTypeInput]        = useState('')
  const [ruleInput,        setRuleInput]        = useState('')
  const [addingRule,       setAddingRule]       = useState(false)

  function addTag(list, setList, input, setInput) {
    const v = input.trim()
    if (v && !list.includes(v)) setList([...list, v])
    setInput('')
  }
  function removeTag(list, setList, item) {
    setList(list.filter(x => x !== item))
  }

  const companyName  = company || 'TechCorp'
  const avatarColor  = COMPANY_COLORS[companyName] || '#6366F1'
  const initials     = companyInitials(companyName)
  const qualityScore = 52
  const scoreMax     = 100
  const scorePct     = (qualityScore / scoreMax) * 100
  const circumference = 2 * Math.PI * 28 // r=28

  return (
    <div className="rjd-root">

      {/* Page header */}
      <div className="rjd-header">
        <div className="rjd-page-title">Review Parsed JD</div>
        <p className="rjd-page-sub">Verify AI-extracted fields, correct if needed, then confirm to publish.</p>
      </div>

      {/* State bar */}
      <div className="rjd-state-bar">
        <span className="rjd-state-label">STATE:</span>
        {['Default', 'Low Score', 'Revision Accepted', 'With Error'].map(s => (
          <button
            key={s}
            className={`rjd-state-pill${activeState === s ? ' active' : ''}`}
            onClick={() => setActiveState(s)}
          >{s}</button>
        ))}
        <div className="rjd-state-bar-actions">
          <button className="rjd-btn-cancel" onClick={onBack}>Cancel</button>
          <div className="rjd-publish-wrap" ref={publishRef}>
            <button className="rjd-btn-publish" onClick={() => setPublishOpen(o => !o)}>
              Actions
              <svg className={`rjd-publish-chevron${publishOpen ? ' open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>
            </button>

            {publishOpen && (
              <div className="rjd-publish-dropdown">
                <button className="rjd-pd-item" onClick={() => { setPublishOpen(false); onBack() }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Confirm &amp; Activate
                </button>
                <button className="rjd-pd-item" onClick={() => { setPublishOpen(false); onBack() }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save as Draft
                </button>
                <button className="rjd-pd-item" onClick={() => setPublishOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit Original JD
                </button>
                <button className="rjd-pd-item rjd-pd-danger" onClick={() => { setPublishOpen(false); onBack() }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sections A + B side by side ── */}
      <div className="rjd-ab-row">

        {/* ── Section A — Job Details ── */}
        <div className="rjd-section rjd-section-a">
          {/* Job Title */}
          <div className="rjd-job-title-wrap">
            <div className="rjd-field-label-sm">JOB TITLE</div>
            <input
              className="rjd-job-title-input"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>

          {/* Single-line info strip */}
          <div className="rjd-info-strip">

            <div className="rjd-info-item">
              <span className="rjd-info-label">COMPANY</span>
              <div className="rjd-company-row">
                <div className="rjd-company-avatar" style={{ background: avatarColor }}>{initials}</div>
                <span className="rjd-company-name">{companyName}</span>
              </div>
            </div>

            <div className="rjd-info-item">
              <span className="rjd-info-label">ARCHETYPE</span>
              <span className="rjd-info-val">Product Engineer</span>
            </div>

            <div className="rjd-info-item">
              <span className="rjd-info-label">POSITIONS</span>
              <input className="rjd-num-input" type="number" min="1"
                value={numPos} onChange={e => setNumPos(e.target.value)} />
            </div>

            <div className="rjd-info-item">
              <span className="rjd-info-label">RECRUITER</span>
              <div className="rjd-recruiter-row">
                <div className="rjd-recruiter-avatar">AK</div>
                <span className="rjd-recruiter-name">Arjun Kumar</span>
              </div>
            </div>

            <div className="rjd-info-item">
              <span className="rjd-info-label">EXPERIENCE</span>
              <div className="rjd-range-row">
                <input className="rjd-range-input" type="number" min="0" value={expMin} onChange={e => setExpMin(e.target.value)} />
                <span className="rjd-range-sep">—</span>
                <input className="rjd-range-input" type="number" min="0" value={expMax} onChange={e => setExpMax(e.target.value)} />
                <span className="rjd-range-unit">yrs</span>
              </div>
            </div>

            <div className="rjd-info-item rjd-info-item-last">
              <span className="rjd-info-label">SALARY (LPA)</span>
              <div className="rjd-range-row">
                <span className="rjd-range-prefix">₹</span>
                <input className="rjd-range-input" type="number" min="0" value={salMin} onChange={e => setSalMin(e.target.value)} />
                <span className="rjd-range-sep">—</span>
                <input className="rjd-range-input" type="number" min="0" value={salMax} onChange={e => setSalMax(e.target.value)} />
                <span className="rjd-range-unit">LPA</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Section B — JD Quality Scorecard ── */}
        <div className="rjd-section rjd-section-b">
          <div className="rjd-section-hd">JD Quality Scorecard</div>

          {/* Circle + rows side by side */}
          <div className="rjd-score-body-row">
            <div className="rjd-score-circle-col">
              <div className="rjd-score-circle-wrap">
                <svg className="rjd-score-svg" viewBox="0 0 72 72" width="64" height="64">
                  <circle className="rjd-score-circle-bg"  cx="36" cy="36" r="28"/>
                  <circle
                    className="rjd-score-circle-val"
                    cx="36" cy="36" r="28"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (scorePct / 100) * circumference}
                  />
                </svg>
                <div>
                  <div className="rjd-score-circle-text">{qualityScore}</div>
                  <div className="rjd-score-circle-max">/{scoreMax}</div>
                </div>
              </div>
              <div className="rjd-score-ai-note">AI-generated · read-only</div>
            </div>

            <div className="rjd-score-rows-grid">
              {SCORECARD_ROWS.map(row => (
                <div key={row.label} className="rjd-score-row">
                  <span className="rjd-score-row-label">{row.label}</span>
                  {row.type === 'score' ? (
                    <span className="rjd-score-row-val">{row.value}</span>
                  ) : (
                    <span className={`rjd-score-tag ${row.tagClass}`}>
                      {row.tagClass === 'rjd-tag-green' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      )}
                      {row.tagClass === 'rjd-tag-amber' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      )}
                      {row.tagClass === 'rjd-tag-blue' && (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      )}
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Section D — Parsed JD Fields ── */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Skills</div>

        <div className="rjd-d-grid">

          {/* Must-Have Skills */}
          <div className="rjd-d-cell">
            <div className="rjd-field-label">MUST-HAVE SKILLS</div>
            <div className="rjd-tag-input-row">
              <input className="rjd-tag-input" placeholder="Add…" value={mustInput}
                onChange={e => setMustInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(mustSkills, setMustSkills, mustInput, setMustInput)} />
              <button className="rjd-tag-add-btn" onClick={() => addTag(mustSkills, setMustSkills, mustInput, setMustInput)}>+</button>
            </div>
            <div className="rjd-chip-list">
              {mustSkills.map(s => (
                <span key={s} className="rjd-chip">{s}<button onClick={() => removeTag(mustSkills, setMustSkills, s)}>×</button></span>
              ))}
            </div>
          </div>

          {/* Good-to-Have Skills */}
          <div className="rjd-d-cell rjd-d-cell-border">
            <div className="rjd-field-label">GOOD-TO-HAVE SKILLS</div>
            <div className="rjd-tag-input-row">
              <input className="rjd-tag-input" placeholder="Add…" value={goodInput}
                onChange={e => setGoodInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(goodSkills, setGoodSkills, goodInput, setGoodInput)} />
              <button className="rjd-tag-add-btn" onClick={() => addTag(goodSkills, setGoodSkills, goodInput, setGoodInput)}>+</button>
            </div>
            <div className="rjd-chip-list">
              {goodSkills.map(s => (
                <span key={s} className="rjd-chip">{s}<button onClick={() => removeTag(goodSkills, setGoodSkills, s)}>×</button></span>
              ))}
            </div>
          </div>

          {/* Target Company Types */}
          <div className="rjd-d-cell rjd-d-cell-top-border">
            <div className="rjd-field-label">TARGET COMPANY TYPES</div>
            <div className="rjd-tag-input-row">
              <input className="rjd-tag-input" placeholder="Add…" value={typeInput}
                onChange={e => setTypeInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(targetTypes, setTargetTypes, typeInput, setTypeInput)} />
              <button className="rjd-tag-add-btn" onClick={() => addTag(targetTypes, setTargetTypes, typeInput, setTypeInput)}>+</button>
            </div>
            <div className="rjd-chip-list">
              {targetTypes.map(s => (
                <span key={s} className="rjd-chip rjd-chip-purple">{s}<button onClick={() => removeTag(targetTypes, setTargetTypes, s)}>×</button></span>
              ))}
            </div>
          </div>

          {/* Non-Negotiable Rules */}
          <div className="rjd-d-cell rjd-d-cell-border rjd-d-cell-top-border">
            <div className="rjd-field-label">NON-NEGOTIABLE RULES</div>
            <div className="rjd-rules-list">
              {rules.map((r, i) => (
                <div key={i} className="rjd-rule-row">
                  <span className="rjd-rule-icon">🚫</span>
                  <span className="rjd-rule-text">{r}</span>
                  <button className="rjd-rule-remove" onClick={() => setRules(rules.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
            </div>
            {addingRule ? (
              <div className="rjd-tag-input-row" style={{marginTop: 8}}>
                <input className="rjd-tag-input" placeholder="Type rule…" value={ruleInput}
                  autoFocus
                  onChange={e => setRuleInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && ruleInput.trim()) { setRules([...rules, ruleInput.trim()]); setRuleInput(''); setAddingRule(false) }
                    if (e.key === 'Escape') { setRuleInput(''); setAddingRule(false) }
                  }} />
              </div>
            ) : (
              <button className="rjd-add-rule-btn" onClick={() => setAddingRule(true)}>+ Add rule</button>
            )}
          </div>


        </div>
      </div>

      {/* ── Section E — Original JD Text ── */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Original JD Text</div>
        <div className="rjd-e-body">
          <p className="rjd-e-text">
            We are looking for a Senior React Developer to join our growing team. The ideal candidate will have strong experience with React ecosystem including hooks, context, and advanced patterns. You will collaborate with design and backend teams to ship high-quality features. Experience with TypeScript is mandatory. Familiarity with GraphQL APIs and state management solutions like Redux or Zustand is a plus. We expect the candidate to take full ownership of frontend features, write clean testable code, and participate in code reviews.
          </p>
          <div className="rjd-e-links">
            <button className="rjd-e-link">View original JD ↓</button>
            <button className="rjd-e-link">Download original PDF</button>
          </div>
        </div>
      </div>


    </div>
  )
}
