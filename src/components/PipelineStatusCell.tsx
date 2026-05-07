import React from 'react'
import './PipelineStatusCell.css'

type Variant = 'warning' | 'success' | 'info' | 'danger' | 'default'

interface Stage {
  id: string
  label: string
  short: string
  statuses: string[]
  color: string
}

interface StatusMeta {
  label: string
  variant: Variant
}

export const STAGES: Stage[] = [
  { id: 'recruiter_screen', label: 'Recruiter Screen', short: 'RS', statuses: ['SCREENING_PENDING', 'SCREENING_COMPLETED'], color: '#3b82f6' },
  { id: 'panel_interview',  label: 'Panel Interview',  short: 'PI', statuses: ['PANEL_ASSIGNED', 'PANEL_SELECTED', 'PANEL_REJECTED'], color: '#8b5cf6' },
  { id: 'proposing_to_jd', label: 'Proposing to JD',  short: 'CL', statuses: ['CLIENT_ASSIGNED', 'CLIENT_ON_HOLD'], color: '#f59e0b' },
  { id: 'client_screening', label: 'Client Screening', short: 'CS', statuses: ['CLIENT_SHORTLISTED', 'CLIENT_REJECTED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_RE_SCHEDULED', 'INTERVIEW_CANCELLED'], color: '#f97316' },
  { id: 'client_interview', label: 'Client Interview', short: 'CI', statuses: ['CLIENT_INTERVIEW_SELECTED', 'CLIENT_INTERVIEW_REJECTED'], color: '#ec4899' },
  { id: 'offer_letter',     label: 'Offer Letter',     short: 'OL', statuses: ['OFFER_RELEASED', 'OFFER_PENDING', 'OFFER_ON_HOLD'], color: '#10b981' },
  { id: 'final_outcome',    label: 'Final Outcome',    short: 'FO', statuses: ['JOINED', 'NOT_JOINED'], color: '#6b7280' },
]

export const STATUS_LABELS: Record<string, StatusMeta> = {
  SCREENING_PENDING:         { label: 'Screening Pending',   variant: 'warning' },
  SCREENING_COMPLETED:       { label: 'Screening Done',      variant: 'success' },
  PANEL_ASSIGNED:            { label: 'Panel Assigned',      variant: 'info' },
  PANEL_SELECTED:            { label: 'Panel Selected',      variant: 'success' },
  PANEL_REJECTED:            { label: 'Panel Rejected',      variant: 'danger' },
  CLIENT_ASSIGNED:           { label: 'Assigned to Client',  variant: 'info' },
  CLIENT_ON_HOLD:            { label: 'On Hold',             variant: 'warning' },
  CLIENT_SHORTLISTED:        { label: 'Shortlisted',         variant: 'success' },
  CLIENT_REJECTED:           { label: 'Client Rejected',     variant: 'danger' },
  INTERVIEW_SCHEDULED:       { label: 'Interview Scheduled', variant: 'info' },
  INTERVIEW_RE_SCHEDULED:    { label: 'Rescheduled',         variant: 'warning' },
  INTERVIEW_CANCELLED:       { label: 'Cancelled',           variant: 'danger' },
  CLIENT_INTERVIEW_SELECTED: { label: 'Interview Passed',    variant: 'success' },
  CLIENT_INTERVIEW_REJECTED: { label: 'Interview Failed',    variant: 'danger' },
  OFFER_RELEASED:            { label: 'Offer Released',      variant: 'success' },
  OFFER_PENDING:             { label: 'Offer Pending',       variant: 'warning' },
  OFFER_ON_HOLD:             { label: 'Offer On Hold',       variant: 'warning' },
  JOINED:                    { label: 'Joined',              variant: 'success' },
  NOT_JOINED:                { label: 'Not Joined',          variant: 'danger' },
}

const REJECTED_STATUSES = new Set(['PANEL_REJECTED', 'CLIENT_REJECTED', 'CLIENT_INTERVIEW_REJECTED', 'NOT_JOINED', 'INTERVIEW_CANCELLED'])

export function getStageIndex(status: string): number {
  return STAGES.findIndex(s => s.statuses.includes(status))
}

interface PipelineStatusCellProps {
  status: string
  showStepper?: boolean
}

export default function PipelineStatusCell({ status, showStepper = true }: PipelineStatusCellProps) {
  const stageIndex = getStageIndex(status)
  const stage = STAGES[stageIndex]
  const meta: StatusMeta = STATUS_LABELS[status] ?? { label: status, variant: 'default' }
  const rejected = REJECTED_STATUSES.has(status)

  return (
    <div className="psc-root">
      {showStepper && (
        <div className="psc-stepper">
          {STAGES.map((s, i) => {
            const isDone = i < stageIndex
            const isActive = i === stageIndex
            const isDropped = rejected && i === stageIndex
            return (
              <React.Fragment key={s.id}>
                <div
                  className={`psc-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''} ${isDropped ? 'rejected' : ''}`}
                  style={{ '--dot-color': s.color } as React.CSSProperties}
                  title={s.label}
                />
                {i < STAGES.length - 1 && (
                  <div
                    className={`psc-line ${isDone ? 'done' : ''}`}
                    style={{ '--line-color': STAGES[i].color } as React.CSSProperties}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      )}
      <div className="psc-badges">
        {stage && (
          <span className="psc-stage-badge" style={{ background: stage.color + '18', color: stage.color, borderColor: stage.color + '40' }}>
            {stage.label}
          </span>
        )}
        <span className={`psc-status-badge psc-status-${meta.variant}`}>
          {meta.label}
        </span>
      </div>
    </div>
  )
}
