// @ts-nocheck
'use client'
import { useState } from 'react';
import './PipelineKanban.css';

const STAGES = [
  { id: 'recruiter_screen',  label: 'Recruiter Screen',  short: 'RS', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'panel_interview',   label: 'Panel Interview',   short: 'PI', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'proposing_to_jd',   label: 'Proposing to JD',  short: 'CL', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'client_screening',  label: 'Client Screening',  short: 'CS', color: '#f97316', bg: '#fff7ed' },
  { id: 'client_interview',  label: 'Client Interview',  short: 'CI', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'offer_letter',      label: 'Offer Letter',      short: 'OL', color: '#10b981', bg: '#ecfdf5' },
  { id: 'final_outcome',     label: 'Final Outcome',     short: 'FO', color: '#6b7280', bg: '#f9fafb' },
];

const STATUS_META = {
  SCREENING_PENDING:         { label: 'Screening Pending',   variant: 'warning', stage: 'recruiter_screen' },
  SCREENING_COMPLETED:       { label: 'Screening Done',      variant: 'success', stage: 'recruiter_screen' },
  PANEL_ASSIGNED:            { label: 'Panel Assigned',      variant: 'info',    stage: 'panel_interview' },
  PANEL_SELECTED:            { label: 'Panel Selected',      variant: 'success', stage: 'panel_interview' },
  PANEL_REJECTED:            { label: 'Panel Rejected',      variant: 'danger',  stage: 'panel_interview' },
  CLIENT_ASSIGNED:           { label: 'Assigned to Client',  variant: 'info',    stage: 'proposing_to_jd' },
  CLIENT_ON_HOLD:            { label: 'On Hold',             variant: 'warning', stage: 'proposing_to_jd' },
  CLIENT_SHORTLISTED:        { label: 'Shortlisted',         variant: 'success', stage: 'client_screening' },
  CLIENT_REJECTED:           { label: 'Rejected',            variant: 'danger',  stage: 'client_screening' },
  INTERVIEW_SCHEDULED:       { label: 'Interview Scheduled', variant: 'info',    stage: 'client_screening' },
  INTERVIEW_RE_SCHEDULED:    { label: 'Rescheduled',         variant: 'warning', stage: 'client_screening' },
  INTERVIEW_CANCELLED:       { label: 'Cancelled',           variant: 'danger',  stage: 'client_screening' },
  CLIENT_INTERVIEW_SELECTED: { label: 'Interview Passed',    variant: 'success', stage: 'client_interview' },
  CLIENT_INTERVIEW_REJECTED: { label: 'Interview Failed',    variant: 'danger',  stage: 'client_interview' },
  OFFER_RELEASED:            { label: 'Offer Released',      variant: 'success', stage: 'offer_letter' },
  OFFER_PENDING:             { label: 'Offer Pending',       variant: 'warning', stage: 'offer_letter' },
  OFFER_ON_HOLD:             { label: 'Offer On Hold',       variant: 'warning', stage: 'offer_letter' },
  JOINED:                    { label: 'Joined',              variant: 'success', stage: 'final_outcome' },
  NOT_JOINED:                { label: 'Not Joined',          variant: 'danger',  stage: 'final_outcome' },
};

const INITIAL_CANDIDATES = [
  { id: 'C-001', name: 'Arjun Mehta',   role: 'Senior Backend Eng.', company: 'Google',       exp: '6.5y', score: 88, notice: '21d', status: 'SCREENING_PENDING' },
  { id: 'C-002', name: 'Priya Sharma',  role: 'Product Manager',     company: 'Wipro',        exp: '8y',   score: 71, notice: '21d', status: 'PANEL_ASSIGNED' },
  { id: 'C-003', name: 'Karthik Nair',  role: 'Data Scientist',      company: 'TCS',          exp: '4y',   score: 79, notice: 'Imm', status: 'CLIENT_ASSIGNED' },
  { id: 'C-004', name: 'Sneha Mehta',   role: 'UX Designer',         company: 'HCL Tech',     exp: '5.5y', score: 62, notice: '60d', status: 'INTERVIEW_SCHEDULED' },
  { id: 'C-005', name: 'Ravi Kumar',    role: 'DevOps Engineer',     company: 'Tech Mahindra',exp: '7y',   score: 84, notice: '90d', status: 'CLIENT_INTERVIEW_SELECTED' },
  { id: 'C-006', name: 'Divya Patel',   role: 'Fullstack Developer', company: 'Mphasis',      exp: '3.5y', score: 55, notice: '45d', status: 'OFFER_RELEASED' },
  { id: 'C-007', name: 'Amit Shah',     role: 'iOS Developer',       company: 'Infosys',      exp: '5y',   score: 90, notice: '30d', status: 'JOINED' },
  { id: 'C-008', name: 'Neha Gupta',    role: 'QA Engineer',         company: 'Cognizant',    exp: '3y',   score: 68, notice: '60d', status: 'PANEL_REJECTED' },
  { id: 'C-009', name: 'Rahul Verma',   role: 'ML Engineer',         company: 'Flipkart',     exp: '4y',   score: 81, notice: '45d', status: 'SCREENING_COMPLETED' },
  { id: 'C-010', name: 'Sunita Rao',    role: 'Business Analyst',    company: 'Accenture',    exp: '6y',   score: 74, notice: '30d', status: 'CLIENT_SHORTLISTED' },
  { id: 'C-011', name: 'Vikram Singh',  role: 'Cloud Architect',     company: 'IBM',          exp: '9y',   score: 92, notice: '90d', status: 'OFFER_PENDING' },
  { id: 'C-012', name: 'Meena Krishnan',role: 'Frontend Dev',        company: 'Zoho',         exp: '2.5y', score: 66, notice: '15d', status: 'CLIENT_ON_HOLD' },
];

function scoreColor(score) {
  if (score >= 80) return { color: '#15803d', bg: '#dcfce7' };
  if (score >= 65) return { color: '#a16207', bg: '#fef9c3' };
  return { color: '#dc2626', bg: '#fee2e2' };
}

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = ['#3b82f6','#8b5cf6','#f97316','#ec4899','#10b981','#f59e0b','#06b6d4','#6366f1'];
function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function CandidateCard({ candidate, stage, onStatusChange, onDragStart }) {
  const meta = STATUS_META[candidate.status];
  const sc = scoreColor(candidate.score);
  const av = avatarColor(candidate.name);
  const stageStatuses = Object.entries(STATUS_META)
    .filter(([, v]) => v.stage === stage.id)
    .map(([k]) => k);

  return (
    <div
      className="kb-card"
      draggable
      onDragStart={e => onDragStart(e, candidate.id)}
    >
      <div className="kb-card-header">
        <div className="kb-avatar" style={{ background: av }}>{initials(candidate.name)}</div>
        <div className="kb-card-info">
          <div className="kb-card-name">{candidate.name}</div>
          <div className="kb-card-role">{candidate.role}</div>
          <div className="kb-card-company">@ {candidate.company}</div>
        </div>
        <div className="kb-card-score" style={{ color: sc.color, background: sc.bg }}>{candidate.score}</div>
      </div>

      <div className="kb-card-meta">
        <span className="kb-chip">Exp: {candidate.exp}</span>
        <span className="kb-chip">Notice: {candidate.notice}</span>
        <span className="kb-chip kb-chip-id">{candidate.id}</span>
      </div>

      <div className="kb-card-footer">
        <select
          className={`kb-status-select kb-status-${meta?.variant ?? 'default'}`}
          value={candidate.status}
          onChange={e => onStatusChange(candidate.id, e.target.value)}
          onClick={e => e.stopPropagation()}
        >
          {stageStatuses.map(s => (
            <option key={s} value={s}>{STATUS_META[s].label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function PipelineKanban() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = candidates.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  function handleStatusChange(id, newStatus) {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  }

  function handleDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e, stageId) {
    e.preventDefault();
    if (!dragId) return;
    const stage = STAGES.find(s => s.id === stageId);
    const defaultStatus = Object.entries(STATUS_META).find(([, v]) => v.stage === stageId)?.[0];
    if (defaultStatus) {
      setCandidates(prev => prev.map(c => c.id === dragId ? { ...c, status: defaultStatus } : c));
    }
    setDragId(null);
    setDragOver(null);
  }

  const totalByStage = (stageId) =>
    filtered.filter(c => STATUS_META[c.status]?.stage === stageId).length;

  return (
    <div className="kb-root">
      <div className="kb-topbar">
        <div>
          <h2 className="kb-title">Pipeline Board</h2>
          <p className="kb-subtitle">{candidates.length} candidates across {STAGES.length} stages</p>
        </div>
        <input
          className="kb-search"
          placeholder="Search candidate or role…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="kb-board">
        {STAGES.map(stage => {
          const cards = filtered.filter(c => STATUS_META[c.status]?.stage === stage.id);
          const isOver = dragOver === stage.id;
          return (
            <div
              key={stage.id}
              className={`kb-column ${isOver ? 'kb-column-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(stage.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, stage.id)}
            >
              <div className="kb-col-header" style={{ borderTopColor: stage.color }}>
                <div className="kb-col-title-row">
                  <span className="kb-col-dot" style={{ background: stage.color }} />
                  <span className="kb-col-label">{stage.label}</span>
                </div>
                <span className="kb-col-count" style={{ background: stage.color + '18', color: stage.color }}>
                  {cards.length}
                </span>
              </div>

              <div className="kb-col-body">
                {cards.length === 0 && (
                  <div className="kb-empty">Drop here</div>
                )}
                {cards.map(c => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    stage={stage}
                    onStatusChange={handleStatusChange}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
