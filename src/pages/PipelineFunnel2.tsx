// @ts-nocheck
'use client'
import { useState } from 'react';
import './PipelineFunnel.css';

const STAGES = [
  { id: 'recruiter_screen',  label: 'Recruiter Screen',   color: '#0C2B1F' },
  { id: 'panel_interview',   label: 'Panel Interview',    color: '#1B4A36' },
  { id: 'proposing_to_jd',   label: 'Proposing to JD',   color: '#287A52' },
  { id: 'client_screening',  label: 'Client Screening',   color: '#38A870' },
  { id: 'client_interview',  label: 'Client Interview',   color: '#60C495' },
  { id: 'offer_letter',      label: 'Offer Letter',       color: '#92D8B8' },
  { id: 'final_outcome',     label: 'Final Outcome',      color: '#C8EED8' },
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

const CANDIDATES = [
  { id: 'C-001', name: 'Arjun Mehta',    role: 'Senior Backend Eng.', company: 'Google',        exp: '6.5y', score: 88, status: 'SCREENING_PENDING' },
  { id: 'C-002', name: 'Priya Sharma',   role: 'Product Manager',     company: 'Wipro',         exp: '8y',   score: 71, status: 'PANEL_ASSIGNED' },
  { id: 'C-003', name: 'Karthik Nair',   role: 'Data Scientist',      company: 'TCS',           exp: '4y',   score: 79, status: 'CLIENT_ASSIGNED' },
  { id: 'C-004', name: 'Sneha Mehta',    role: 'UX Designer',         company: 'HCL Tech',      exp: '5.5y', score: 62, status: 'INTERVIEW_SCHEDULED' },
  { id: 'C-005', name: 'Ravi Kumar',     role: 'DevOps Engineer',     company: 'Tech Mahindra', exp: '7y',   score: 84, status: 'CLIENT_INTERVIEW_SELECTED' },
  { id: 'C-006', name: 'Divya Patel',    role: 'Fullstack Developer', company: 'Mphasis',       exp: '3.5y', score: 55, status: 'OFFER_RELEASED' },
  { id: 'C-007', name: 'Amit Shah',      role: 'iOS Developer',       company: 'Infosys',       exp: '5y',   score: 90, status: 'JOINED' },
  { id: 'C-008', name: 'Neha Gupta',     role: 'QA Engineer',         company: 'Cognizant',     exp: '3y',   score: 68, status: 'PANEL_REJECTED' },
  { id: 'C-009', name: 'Rahul Verma',    role: 'ML Engineer',         company: 'Flipkart',      exp: '4y',   score: 81, status: 'SCREENING_COMPLETED' },
  { id: 'C-010', name: 'Sunita Rao',     role: 'Business Analyst',    company: 'Accenture',     exp: '6y',   score: 74, status: 'CLIENT_SHORTLISTED' },
  { id: 'C-011', name: 'Vikram Singh',   role: 'Cloud Architect',     company: 'IBM',           exp: '9y',   score: 92, status: 'OFFER_PENDING' },
  { id: 'C-012', name: 'Meena Krishnan', role: 'Frontend Dev',        company: 'Zoho',          exp: '2.5y', score: 66, status: 'CLIENT_ON_HOLD' },
  { id: 'C-013', name: 'Sanjay Pillai',  role: 'Android Dev',         company: 'Samsung',       exp: '5y',   score: 77, status: 'PANEL_SELECTED' },
  { id: 'C-014', name: 'Kavya Nair',     role: 'Data Engineer',       company: 'Mu Sigma',      exp: '3y',   score: 69, status: 'NOT_JOINED' },
  { id: 'C-015', name: 'Deepak Joshi',   role: 'SRE',                 company: 'Adobe',         exp: '6y',   score: 85, status: 'OFFER_ON_HOLD' },
  { id: 'C-016', name: 'Ananya Iyer',    role: 'Scrum Master',        company: 'Capgemini',     exp: '7y',   score: 73, status: 'CLIENT_INTERVIEW_REJECTED' },
  { id: 'C-017', name: 'Rohit Tiwari',   role: 'Network Engineer',    company: 'HCL',           exp: '4y',   score: 61, status: 'CLIENT_REJECTED' },
  { id: 'C-018', name: 'Pooja Desai',    role: 'Java Developer',      company: 'Persistent',    exp: '5y',   score: 78, status: 'INTERVIEW_RE_SCHEDULED' },
];

const AVATAR_COLORS = ['#0C2B1F','#1B4A36','#287A52','#38A870','#60C495','#92D8B8','#C8EED8'];
function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function scoreColor(s) {
  if (s >= 80) return { color: '#15803d', bg: '#dcfce7' };
  if (s >= 65) return { color: '#a16207', bg: '#fef9c3' };
  return { color: '#dc2626', bg: '#fee2e2' };
}

const REJECTED_STATUSES = new Set(['PANEL_REJECTED','CLIENT_REJECTED','CLIENT_INTERVIEW_REJECTED','NOT_JOINED','INTERVIEW_CANCELLED']);

export default function PipelineFunnel2() {
  const [activeStage, setActiveStage] = useState(null);

  const countByStage = STAGES.map(s =>
    CANDIDATES.filter(c => STATUS_META[c.status]?.stage === s.id).length
  );
  const maxCount = Math.max(...countByStage, 1);

  const conversionRates = countByStage.map((count, i) => {
    if (i === 0) return 100;
    const prev = countByStage[i - 1];
    return prev > 0 ? Math.round((count / prev) * 100) : 0;
  });

  const drillCandidates = activeStage
    ? CANDIDATES.filter(c => STATUS_META[c.status]?.stage === activeStage)
    : [];

  const activeStageData = STAGES.find(s => s.id === activeStage);

  const totalActive = CANDIDATES.filter(c => !REJECTED_STATUSES.has(c.status)).length;
  const totalDropped = CANDIDATES.filter(c => REJECTED_STATUSES.has(c.status)).length;
  const joinRate = Math.round((countByStage[6] / CANDIDATES.length) * 100);
  const offerToJoin = countByStage[5] > 0 ? Math.round((countByStage[6] / countByStage[5]) * 100) : 0;

  return (
    <div className="pf-root">
      {/* Header */}
      <div className="pf-topbar">
        <div>
          <h2 className="pf-title">Pipeline Funnel</h2>
          <p className="pf-subtitle">Click any stage to see candidates · {CANDIDATES.length} total in pipeline</p>
        </div>
        <div className="pf-kpis">
          <div className="pf-kpi">
            <span className="pf-kpi-val" style={{ color: '#0C2B1F' }}>{CANDIDATES.length}</span>
            <span className="pf-kpi-label">Total</span>
          </div>
          <div className="pf-kpi">
            <span className="pf-kpi-val" style={{ color: '#287A52' }}>{totalActive}</span>
            <span className="pf-kpi-label">Active</span>
          </div>
          <div className="pf-kpi">
            <span className="pf-kpi-val" style={{ color: '#38A870' }}>{totalDropped}</span>
            <span className="pf-kpi-label">Dropped</span>
          </div>
          <div className="pf-kpi">
            <span className="pf-kpi-val" style={{ color: '#1B4A36' }}>{joinRate}%</span>
            <span className="pf-kpi-label">Join Rate</span>
          </div>
          <div className="pf-kpi">
            <span className="pf-kpi-val" style={{ color: '#60C495' }}>{offerToJoin}%</span>
            <span className="pf-kpi-label">Offer→Join</span>
          </div>
        </div>
      </div>

      <div className="pf-body">
        {/* Funnel */}
        <div className="pf-funnel">
          {STAGES.map((stage, i) => {
            const count = countByStage[i];
            const barWidth = Math.max((count / maxCount) * 100, 8);
            const conv = conversionRates[i];
            const isActive = activeStage === stage.id;
            const isDropOff = i > 0 && count < countByStage[i - 1];

            return (
              <div key={stage.id} className="pf-stage-row">
                {/* Conversion arrow between stages */}
                {i > 0 && (
                  <div className="pf-conversion-row">
                    <div className="pf-conv-line" />
                    <span className={`pf-conv-badge ${conv < 50 ? 'pf-conv-low' : conv < 80 ? 'pf-conv-mid' : 'pf-conv-high'}`}>
                      {conv}% passed
                    </span>
                    <div className="pf-conv-line" />
                  </div>
                )}

                {/* Stage bar */}
                <button
                  className={`pf-bar-wrap ${isActive ? 'pf-bar-active' : ''}`}
                  onClick={() => setActiveStage(isActive ? null : stage.id)}
                  type="button"
                >
                  <span className="pf-stage-label">{stage.label}</span>
                  <div className="pf-bar-track">
                    <div
                      className="pf-bar-fill"
                      style={{
                        width: `${barWidth}%`,
                        background: stage.color,
                        boxShadow: isActive ? `0 0 0 2px ${stage.color}44` : 'none',
                      }}
                    >
                      <span className="pf-bar-count">{count}</span>
                    </div>
                    {isDropOff && (
                      <span className="pf-drop-indicator" title={`${countByStage[i-1] - count} dropped`}>
                        −{countByStage[i-1] - count}
                      </span>
                    )}
                  </div>
                  <span className="pf-bar-pct">{Math.round((count / CANDIDATES.length) * 100)}%</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Drill-down panel */}
        <div className={`pf-drill ${activeStage ? 'pf-drill-open' : ''}`}>
          {activeStage ? (
            <>
              <div className="pf-drill-header" style={{ borderLeftColor: activeStageData?.color }}>
                <div>
                  <div className="pf-drill-title">{activeStageData?.label}</div>
                  <div className="pf-drill-count">{drillCandidates.length} candidate{drillCandidates.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="pf-drill-close" onClick={() => setActiveStage(null)}>✕</button>
              </div>

              <div className="pf-drill-list">
                {drillCandidates.length === 0 && (
                  <div className="pf-drill-empty">No candidates at this stage</div>
                )}
                {drillCandidates.map(c => {
                  const meta = STATUS_META[c.status];
                  const sc = scoreColor(c.score);
                  const av = avatarColor(c.name);
                  return (
                    <div key={c.id} className="pf-drill-card">
                      <div className="pf-drill-avatar" style={{ background: av }}>{initials(c.name)}</div>
                      <div className="pf-drill-info">
                        <div className="pf-drill-name">{c.name}</div>
                        <div className="pf-drill-role">{c.role} · {c.company}</div>
                        <div className="pf-drill-meta">
                          <span className={`pf-status-pill pf-status-${meta?.variant}`}>{meta?.label}</span>
                          <span className="pf-exp-chip">Exp {c.exp}</span>
                        </div>
                      </div>
                      <div className="pf-drill-score" style={{ color: sc.color, background: sc.bg }}>{c.score}</div>
                    </div>
                  );
                })}
              </div>

              {/* Status breakdown within stage */}
              <div className="pf-status-breakdown">
                <div className="pf-breakdown-title">Status breakdown</div>
                {Object.entries(STATUS_META)
                  .filter(([, v]) => v.stage === activeStage)
                  .map(([key, meta]) => {
                    const cnt = drillCandidates.filter(c => c.status === key).length;
                    if (cnt === 0) return null;
                    return (
                      <div key={key} className="pf-breakdown-row">
                        <span className={`pf-breakdown-dot pf-status-dot-${meta.variant}`} />
                        <span className="pf-breakdown-label">{meta.label}</span>
                        <span className="pf-breakdown-cnt">{cnt}</span>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <div className="pf-drill-hint">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span>Click a stage to see candidates</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
