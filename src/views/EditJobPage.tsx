// @ts-nocheck
'use client'
import { useState } from 'react'
import './ReviewJDPage.css'

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

const EXP_OPTIONS      = ['0–1 years','1–3 years','3–5 years','3–6 years','4–6 years','4–8 years','5–8 years','8+ years','10+ years','11+ years','15+ years']
const STATUS_OPTIONS   = ['Open','Partially Filled','Closed','On-Hold']
const PRIORITY_OPTIONS = ['Normal','Medium','High','Urgent']
const TYPE_OPTIONS     = ['Full-Time','Part-Time','Contract','Internship']
const WORK_OPTIONS     = ['On-Site','Remote','Hybrid']

interface Props {
  job: any
  onBack: () => void
  onSave: (updatedJob: any) => void
  isNew?: boolean
}

export default function EditJobPage({ job, onBack, onSave, isNew = false }: Props) {
  const j = job || {}

  // Section A — Job Details
  const [designation,    setDesignation]    = useState(j.designation    || '')
  const [company,        setCompany]        = useState(j.company        || 'Google India')
  const [department,     setDepartment]     = useState(j.department     || '')
  const [location,       setLocation]       = useState(j.location       || '')
  const [openings,       setOpenings]       = useState(j.openings       ?? 1)
  const [experience,     setExperience]     = useState(j.experience     || '3–5 years')
  const [mode,           setMode]           = useState(j.mode           || 'Hybrid')
  const [type,           setType]           = useState(j.type           || 'Full-Time')
  const [salary,         setSalary]         = useState(j.salary         || '')

  // Section B — Status & Priority
  const [status,         setStatus]         = useState(j.status         || 'Open')
  const [priority,       setPriority]       = useState(j.priority       || 'Normal')
  const [posted,         setPosted]         = useState(j.posted         || new Date().toISOString().slice(0, 10))
  const [deadline,       setDeadline]       = useState(j.deadline       || '')
  const [accountManager, setAccountManager] = useState(j.accountManager || '')

  // Section C — Skills
  const [mustSkills,  setMustSkills]  = useState<string[]>(j.skills     || [])
  const [goodSkills,  setGoodSkills]  = useState<string[]>(j.goodSkills || [])
  const [mustInput,   setMustInput]   = useState('')
  const [goodInput,   setGoodInput]   = useState('')

  // Section D — Description
  const [description, setDescription] = useState(j.description || '')

  function addTag(list, setList, input, setInput) {
    const v = input.trim()
    if (v && !list.includes(v)) setList([...list, v])
    setInput('')
  }
  function removeTag(list, setList, item) {
    setList(list.filter(x => x !== item))
  }

  function handleSave() {
    onSave({
      ...j,
      designation,
      company,
      department,
      location,
      openings,
      experience,
      mode,
      type,
      salary,
      status,
      priority,
      posted,
      deadline,
      accountManager,
      skills: mustSkills,
      goodSkills,
      description,
    })
  }

  const avatarColor = COMPANY_COLORS[company] || '#6366F1'
  const initials    = company.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TC'

  return (
    <div className="rjd-root">

      {/* Page header */}
      <div className="rjd-header">
        <div className="rjd-page-title">Edit Job</div>
        <p className="rjd-page-sub">Update job details and save changes.</p>
      </div>

      {/* State bar */}
      <div className="rjd-state-bar">
        <div className="rjd-state-bar-actions" style={{ marginLeft: 0, width: '100%', justifyContent: 'flex-end' }}>
          <button className="rjd-btn-cancel" onClick={onBack}>Cancel</button>
          <button className="rjd-btn-publish" style={{ width: 'auto' }} onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      {/* ── Section A — Job Details ── */}
      <div className="rjd-section">
        {/* Job Title */}
        <div className="rjd-job-title-wrap">
          <div className="rjd-field-label-sm">JOB TITLE</div>
          <input
            className="rjd-job-title-input"
            placeholder="e.g. Senior Backend Engineer"
            value={designation}
            onChange={e => setDesignation(e.target.value)}
          />
        </div>

        {/* Info strip */}
        <div className="rjd-info-strip">

          <div className="rjd-info-item">
            <span className="rjd-info-label">COMPANY</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={company}
              onChange={e => setCompany(e.target.value)}
            >
              {Object.keys(COMPANY_COLORS).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">DEPARTMENT</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0', width: '100%',
              }}
              placeholder="e.g. Engineering"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            />
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">LOCATION</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0', width: '100%',
              }}
              placeholder="e.g. Bengaluru"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">POSITIONS</span>
            <input
              className="rjd-num-input"
              type="number"
              min="1"
              value={openings}
              onChange={e => setOpenings(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">EXPERIENCE</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={experience}
              onChange={e => setExperience(e.target.value)}
            >
              {EXP_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">WORK MODE</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={mode}
              onChange={e => setMode(e.target.value)}
            >
              {WORK_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">EMPLOYMENT TYPE</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={type}
              onChange={e => setType(e.target.value)}
            >
              {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="rjd-info-item rjd-info-item-last">
            <span className="rjd-info-label">SALARY</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0', width: '100%',
              }}
              placeholder="e.g. ₹20–30 LPA"
              value={salary}
              onChange={e => setSalary(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* ── Section B — Status & Priority ── */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Status &amp; Priority</div>

        <div className="rjd-info-strip">

          <div className="rjd-info-item">
            <span className="rjd-info-label">STATUS</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">PRIORITY</span>
            <select
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13, fontWeight: 600, color: '#0F172A', fontFamily: 'inherit',
                cursor: 'pointer',
              }}
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">POSTED DATE</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0',
              }}
              type="date"
              value={posted}
              onChange={e => setPosted(e.target.value)}
            />
          </div>

          <div className="rjd-info-item">
            <span className="rjd-info-label">DEADLINE</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0',
              }}
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
            />
          </div>

          <div className="rjd-info-item rjd-info-item-last">
            <span className="rjd-info-label">ACCOUNT MANAGER</span>
            <input
              style={{
                border: 'none', borderBottom: '1.5px solid #E2E8F0', outline: 'none',
                background: 'transparent', fontSize: 13, fontWeight: 600, color: '#0F172A',
                fontFamily: 'inherit', padding: '2px 0', width: '100%',
              }}
              placeholder="e.g. Rahul Verma"
              value={accountManager}
              onChange={e => setAccountManager(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* ── Section C — Skills ── */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Skills</div>

        <div className="rjd-d-grid">

          {/* Must-Have Skills */}
          <div className="rjd-d-cell">
            <div className="rjd-field-label">MUST-HAVE SKILLS</div>
            <div className="rjd-tag-input-row">
              <input
                className="rjd-tag-input"
                placeholder="Add…"
                value={mustInput}
                onChange={e => setMustInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(mustSkills, setMustSkills, mustInput, setMustInput)}
              />
              <button className="rjd-tag-add-btn" onClick={() => addTag(mustSkills, setMustSkills, mustInput, setMustInput)}>+</button>
            </div>
            <div className="rjd-chip-list">
              {mustSkills.map(s => (
                <span key={s} className="rjd-chip">
                  {s}
                  <button onClick={() => removeTag(mustSkills, setMustSkills, s)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Good-to-Have Skills */}
          <div className="rjd-d-cell rjd-d-cell-border">
            <div className="rjd-field-label">GOOD-TO-HAVE SKILLS</div>
            <div className="rjd-tag-input-row">
              <input
                className="rjd-tag-input"
                placeholder="Add…"
                value={goodInput}
                onChange={e => setGoodInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag(goodSkills, setGoodSkills, goodInput, setGoodInput)}
              />
              <button className="rjd-tag-add-btn" onClick={() => addTag(goodSkills, setGoodSkills, goodInput, setGoodInput)}>+</button>
            </div>
            <div className="rjd-chip-list">
              {goodSkills.map(s => (
                <span key={s} className="rjd-chip rjd-chip-plain">
                  {s}
                  <button onClick={() => removeTag(goodSkills, setGoodSkills, s)}>×</button>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Section D — Description ── */}
      <div className="rjd-section">
        <div className="rjd-section-hd">Description</div>
        <div style={{ padding: '16px 22px 20px' }}>
          <textarea
            className="jb-mf-textarea"
            style={{
              width: '100%', minHeight: 100, border: '1.5px solid #E2E8F0',
              borderRadius: 8, padding: 10, fontSize: 13, fontFamily: 'inherit',
              outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
            placeholder="Brief description of the role…"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </div>

    </div>
  )
}
