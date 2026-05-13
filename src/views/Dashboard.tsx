// @ts-nocheck
'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '../hooks/useCurrentUser'
import EditProfileModal from '../components/EditProfileModal'
import '../components/EditProfileModal.css'
import './Dashboard.css'
import PanelPage from './PanelPage'
import TaskPage from './TaskPage'
import ClientsPage from './ClientsPage'
import UsersPage from './UsersPage'
import JobsPage from './JobsPage'
import CandidatesPage from './CandidatesPage'
import PipelineFunnel from './PipelineFunnel'

const OVERVIEW_NAV = [
  {
    id: 'Dashboard', iconBg: '#EEF2FF', iconBgDark: 'rgba(99,102,241,0.18)', iconColor: '#6366F1',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>,
  },
  {
    id: 'Clients', iconBg: '#EEF2FF', iconBgDark: 'rgba(79,70,229,0.18)', iconColor: '#4F46E5',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>,
  },
  {
    id: 'Jobs', iconBg: '#EFF6FF', iconBgDark: 'rgba(59,130,246,0.18)', iconColor: '#3B82F6',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1zm-4 5v1h16v-1H4zm0 3v4h16v-4H4z"/></svg>,
  },
  {
    id: 'Candidates', iconBg: '#F0FDFA', iconBgDark: 'rgba(13,148,136,0.18)', iconColor: '#0D9488',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>,
  },

  {
    id: 'Tasks', iconBg: '#F0FDF4', iconBgDark: 'rgba(22,163,74,0.18)', iconColor: '#16A34A',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
  },
  {
    id: 'Panel', iconBg: '#FFF1F2', iconBgDark: 'rgba(244,63,94,0.18)', iconColor: '#F43F5E',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
  },
  {
    id: 'Users', iconBg: '#F0F9FF', iconBgDark: 'rgba(14,165,233,0.18)', iconColor: '#0EA5E9',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  },
]


const OTHERS_NAV = [
  {
    id: 'Notes', iconBg: '#FFF7ED', iconBgDark: 'rgba(249,115,22,0.18)', iconColor: '#F97316',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9l-6-6V5zm2 0v13h5v-5h5v-1H7V7h10V5H5zm12 9h-3v3l3-3z"/></svg>,
  },
  {
    id: 'Agents', iconBg: '#F0F9FF', iconBgDark: 'rgba(3,105,161,0.18)', iconColor: '#0EA5E9', beta: true,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 1 6 6v1h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a6 6 0 0 1-12 0h-1a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h1V8a6 6 0 0 1 6-6zm0 2a4 4 0 0 0-4 4v3h8V8a4 4 0 0 0-4-4zm-1 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/></svg>,
  },
]

const CANDIDATES = [
  {
    id: 'C-A00031', name: 'Arjun Mehta', initials: 'A', color: '#4F7FFF',
    role: 'Senior Backend Eng.', company: 'Google',
    contact: '+91 8079089182', location: 'Bangalore, India',
    exp: '6.5 yrs', notice: '21d', noticeType: 'urgent',
    score: 88, scoreLabel: 'Good', scoreDot: '#22C55E',
    status: 'Active', jobs: 2, actionsCount: 3, actionsType: 'actions',
    workPref: 'Open to reloc...', workPrefColor: '#16A34A',
  },
  {
    id: 'C-A00032', name: 'Priya Sharma', initials: 'P', color: '#EC4899',
    role: 'Product Manager', company: 'Wipro',
    contact: '+91 6127912011', location: 'Hyderabad, India',
    exp: '8 yrs', notice: '21d', noticeType: 'urgent',
    score: 71, scoreLabel: 'Moderate', scoreDot: '#F59E0B',
    status: 'Backlog', jobs: 1, actionsCount: 1, actionsType: 'pending',
    workPref: 'No Relocation', workPrefColor: '#EC4899',
  },
  {
    id: 'C-A00033', name: 'Karthik Nair', initials: 'K', color: '#10B981',
    role: 'Data Scientist', company: 'TCS',
    contact: '+91 8917615491', location: 'New Delhi, India',
    exp: '4 yrs', notice: 'Immediate', noticeType: 'immediate',
    score: 79, scoreLabel: 'Good', scoreDot: '#22C55E',
    status: 'Sourced', jobs: 3, actionsCount: 2, actionsType: 'actions',
    workPref: 'No Relocation', workPrefColor: '#EC4899',
  },
  {
    id: 'C-A00034', name: 'Sneha Mehta', initials: 'S', color: '#F59E0B',
    role: 'UX Designer', company: 'HCL Tech',
    contact: '+91 8809265058', location: 'Noida, India',
    exp: '5.5 yrs', notice: '60d', noticeType: 'normal',
    score: 62, scoreLabel: 'Moderate', scoreDot: '#F59E0B',
    status: 'Flagged', jobs: 1, actionsCount: 0, actionsType: null,
    workPref: 'Remote', workPrefColor: '#16A34A',
  },
  {
    id: 'C-A00035', name: 'Ravi Kumar', initials: 'R', color: '#EF4444',
    role: 'DevOps Engineer', company: 'Tech Mahindra',
    contact: '+91 7880061307', location: 'Delhi NCR, India',
    exp: '7 yrs', notice: '90d', noticeType: 'normal',
    score: 84, scoreLabel: 'Good', scoreDot: '#22C55E',
    status: 'Converted', jobs: 1, actionsCount: 0, actionsType: null,
    workPref: 'Open to reloc...', workPrefColor: '#16A34A',
  },
  {
    id: 'C-A00036', name: 'Divya Patel', initials: 'D', color: '#6366F1',
    role: 'Fullstack Developer', company: 'Mphasis',
    contact: '+91 7607982908', location: 'San Francisco, USA',
    exp: '3.5 yrs', notice: '45d', noticeType: 'moderate',
    score: 55, scoreLabel: 'Not a Fit', scoreDot: '#EF4444',
    status: 'Completed', jobs: 3, actionsCount: 4, actionsType: 'actions',
    workPref: 'Open to reloc...', workPrefColor: '#16A34A',
  },
]

const STATUS_CONFIG = {
  Active:    { dot: '#22C55E', bg: '#F0FDF4', text: '#16A34A' },
  Backlog:   { dot: '#9CA3AF', bg: '#F3F4F6', text: '#6B7280' },
  Sourced:   { dot: '#3B82F6', bg: '#EFF6FF', text: '#2563EB' },
  Flagged:   { dot: '#F97316', bg: '#FFF7ED', text: '#EA580C' },
  Converted: { dot: '#8B5CF6', bg: '#F5F3FF', text: '#7C3AED' },
  Completed: { dot: '#374151', bg: '#F3F4F6', text: '#374151' },
}

// ── Overview dashboard data ─────────────────────────────────────────────────

const OV_STATS = [
  {
    label: 'Total', value: '18', delta: '+2', up: true,
    color: '#1A2B4A', bg: '#EEF2FF',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0H2zm15-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 8h3a5 5 0 0 0-6.9-4.6A9 9 0 0 1 19 20z"/></svg>,
  },
  {
    label: 'Active', value: '14', delta: '+3', up: true,
    color: '#2D5499', bg: '#EFF6FF',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  },
  {
    label: 'Dropped', value: '4', delta: '1', up: false,
    color: '#dc2626', bg: '#FEF2F2',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>,
  },
  {
    label: 'Join Rate', value: '11%', delta: '+2%', up: true,
    color: '#1E3D6E', bg: '#DBEAFE',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>,
  },
  {
    label: 'Offer→Join', value: '67%', delta: '+5%', up: true,
    color: '#4472C4', bg: '#EEF4FF',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
  },
  {
    label: 'Avg. Time to Recruit', value: '24d', delta: '3d', up: false,
    color: '#8B5CF6', bg: '#F5F3FF',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
  },
]

const OV_CLIENTS = [
  { id: 'CL-01', name: 'Google',       industry: 'Technology',    profiles: 12, jds: 8,  status: 'Active',   color: '#4285F4' },
  { id: 'CL-02', name: 'Infosys',      industry: 'IT Services',   profiles: 8,  jds: 15, status: 'Active',   color: '#007CC2' },
  { id: 'CL-03', name: 'Wipro',        industry: 'IT Services',   profiles: 5,  jds: 4,  status: 'On Hold',  color: '#9C27B0' },
  { id: 'CL-04', name: 'HCL Tech',     industry: 'Technology',    profiles: 9,  jds: 6,  status: 'Active',   color: '#1976D2' },
  { id: 'CL-05', name: 'Accenture',    industry: 'Consulting',    profiles: 14, jds: 11, status: 'Active',   color: '#A100FF' },
  { id: 'CL-06', name: 'TCS',          industry: 'IT Services',   profiles: 7,  jds: 9,  status: 'Inactive', color: '#002B5C' },
]

const OV_JDS = [
  { id: 'JD-01', title: 'Senior Backend Engineer', dept: 'Engineering',   openings: 2, applicants: 34, active: 20, rejected: 8,  daysOpen: 12, urgency: 'high'   },
  { id: 'JD-02', title: 'Product Manager',         dept: 'Product',       openings: 1, applicants: 21, active: 14, rejected: 4,  daysOpen: 8,  urgency: 'medium' },
  { id: 'JD-03', title: 'Data Scientist',          dept: 'Analytics',     openings: 2, applicants: 45, active: 28, rejected: 11, daysOpen: 5,  urgency: 'low'    },
  { id: 'JD-04', title: 'UX Designer',             dept: 'Design',        openings: 1, applicants: 18, active: 9,  rejected: 6,  daysOpen: 20, urgency: 'high'   },
  { id: 'JD-05', title: 'DevOps Engineer',         dept: 'Infrastructure', openings: 1, applicants: 27, active: 18, rejected: 5,  daysOpen: 3,  urgency: 'low'    },
  { id: 'JD-06', title: 'Fullstack Developer',     dept: 'Engineering',   openings: 3, applicants: 52, active: 33, rejected: 14, daysOpen: 15, urgency: 'medium' },
]

const OV_TOP_CANDIDATES = [
  { id: 'T-01', name: 'Amit Shah',      role: 'iOS Developer',    score: 90, stage: 'Joined',         avatar: '#1A2B4A' },
  { id: 'T-02', name: 'Vikram Singh',   role: 'Cloud Architect',  score: 92, stage: 'Offer Pending',  avatar: '#2D5499' },
  { id: 'T-03', name: 'Rahul Verma',    role: 'ML Engineer',      score: 81, stage: 'Screening Done', avatar: '#4472C4' },
  { id: 'T-04', name: 'Ravi Kumar',     role: 'DevOps Engineer',  score: 84, stage: 'Offer Letter',   avatar: '#6B9BD2' },
  { id: 'T-05', name: 'Deepak Joshi',   role: 'SRE',              score: 85, stage: 'Offer On Hold',  avatar: '#1E3D6E' },
  { id: 'T-06', name: 'Arjun Mehta',    role: 'Backend Engineer', score: 88, stage: 'Panel Interview',avatar: '#9DC3E6' },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function scoreColor(s) {
  if (s >= 80) return { color: '#15803d', bg: '#dcfce7' }
  if (s >= 65) return { color: '#a16207', bg: '#fef9c3' }
  return { color: '#dc2626', bg: '#fee2e2' }
}

// ── OverviewDashboard component ─────────────────────────────────────────────

function OverviewDashboard({ darkMode }) {

  return (
    <div className="ov-root">

      {/* ── Stat cards ── */}
      <div className="ov-stats">
        {OV_STATS.map(s => (
          <div key={s.label} className="ov-stat-card">
            <div className="ov-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="ov-stat-body">
              <div className="ov-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="ov-stat-label">{s.label}</div>
            </div>
            <div className={`ov-stat-delta${s.up ? ' ov-delta-up' : ' ov-delta-dn'}`}>
              {s.up ? '↑' : '↓'} {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row: Jobs List + Calendar ── */}
      <div className="ov-mid">

        {/* Funnel View */}
        <div className="ov-card ov-funnel-card">
          <PipelineFunnel />
        </div>

      </div>

      {/* ── Bottom row: Candidate List · JD List · Top Candidates ── */}
      <div className="ov-bottom-row">

        {/* Client List */}
        <div className="ov-card ov-bottom-card">
          <div className="ov-card-hd">
            <span className="ov-card-title">Client List</span>
            <span className="ov-card-count">{OV_CLIENTS.length}</span>
          </div>
          <div className="ov-list-body">
            {OV_CLIENTS.slice(0, 5).map(cl => (
              <div key={cl.id} className="ov-list-row">
                <div className="ov-list-avatar" style={{ background: cl.color }}>{cl.name.slice(0, 2).toUpperCase()}</div>
                <div className="ov-list-info">
                  <div className="ov-list-name">{cl.name}</div>
                  <div className="ov-list-sub">{cl.industry}</div>
                </div>
                <div className="ov-list-right">
                  <span className="ov-client-jds" title="Job Descriptions">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1z"/></svg>
                    {cl.jds}
                  </span>
                  <span className="ov-client-profiles" title="Candidates">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    {cl.profiles}
                  </span>
                  <span className={`ov-client-status ov-client-status-${cl.status.toLowerCase().replace(' ', '-')}`}>{cl.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JD List */}
        <div className="ov-card ov-bottom-card">
          <div className="ov-card-hd">
            <span className="ov-card-title">JD List</span>
            <span className="ov-card-count">{OV_JDS.length}</span>
          </div>
          <div className="ov-list-body">
            {OV_JDS.slice(0, 5).map(jd => (
              <div key={jd.id} className="ov-list-row">
                <div className="ov-jd-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6V5a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2zm2 0h8V5a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1z"/></svg>
                </div>
                <div className="ov-list-info">
                  <div className="ov-list-name">{jd.title}</div>
                  <div className="ov-list-sub">{jd.dept} · {jd.openings} opening{jd.openings > 1 ? 's' : ''}</div>
                </div>
                <div className="ov-list-right">
                  <span className={`ov-urgency-dot ov-urgency-${jd.urgency}`} />
                  <div className="ov-jd-stats">
                    <span className="ov-jd-stat ov-jd-stat-total" title="Total Applied">{jd.applicants}</span>
                    <span className="ov-jd-stat-sep">·</span>
                    <span className="ov-jd-stat ov-jd-stat-active" title="Active">{jd.active}</span>
                    <span className="ov-jd-stat-sep">·</span>
                    <span className="ov-jd-stat ov-jd-stat-rejected" title="Rejected">{jd.rejected}</span>
                  </div>
                  <span className="ov-jd-days">{jd.daysOpen}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Candidates */}
        <div className="ov-card ov-bottom-card">
          <div className="ov-card-hd">
            <span className="ov-card-title">Top Candidates</span>
            <span className="ov-card-count">{OV_TOP_CANDIDATES.length}</span>
          </div>
          <div className="ov-list-body">
            {OV_TOP_CANDIDATES.slice(0, 5).map((c, i) => {
              const sc = scoreColor(c.score)
              return (
                <div key={c.id} className="ov-list-row">
                  <span className="ov-rank-num">{i + 1}</span>
                  <div className="ov-list-avatar" style={{ background: c.avatar }}>{initials(c.name)}</div>
                  <div className="ov-list-info">
                    <div className="ov-list-name">{c.name}</div>
                    <div className="ov-list-sub">{c.role}</div>
                  </div>
                  <div className="ov-list-right">
                    <span className="ov-list-stage">{c.stage}</span>
                    <span className="ov-list-score" style={{ color: sc.color, background: sc.bg }}>{c.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Helper components ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Backlog
  return (
    <span className="db-status-badge" style={{ background: cfg.bg, color: cfg.text }}>
      <span className="db-status-dot" style={{ background: cfg.dot }} />
      {status}
    </span>
  )
}

function ScoreCell({ score, label, dot }) {
  return (
    <div className="db-score-cell">
      <span className="db-score-num">{score}</span>
      <div className="db-score-sub">
        <span className="db-score-dot" style={{ background: dot }} />
        <span className="db-score-label">{label}</span>
      </div>
    </div>
  )
}

function ActionsBadge({ count, type }) {
  if (!count || !type) return <span className="db-no-action">—</span>
  const styles = type === 'pending'
    ? { color: '#EA580C', background: '#FFF7ED' }
    : { color: '#DC2626', background: '#FEF2F2' }
  return (
    <span className="db-actions-badge" style={styles}>
      {type === 'pending' ? `${count} pending` : `${count} Actions`}
    </span>
  )
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [selectedClientName, setSelectedClientName] = useState(null)
  const [clientsResetKey, setClientsResetKey] = useState(0)
  const [jobsReviewMode, setJobsReviewMode] = useState(false)
  const [jobsViewJobName, setJobsViewJobName] = useState<string | null>(null)
  const [candidatesJobFilter, setCandidatesJobFilter] = useState<any>(null)
  const [starred, setStarred] = useState({})
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
  const [signingOut, setSigningOut] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const profileTriggerRef = useRef(null)
  const router = useRouter()
  const { user, initials, fullName, avatarSrc, setUser } = useCurrentUser()
  const [avatarImgErr, setAvatarImgErr] = useState(false)

  useEffect(() => { setAvatarImgErr(false) }, [avatarSrc])

  const handleSignOut = useCallback(async () => {
    setSigningOut(true)
    const refreshToken = localStorage.getItem('refresh_token')
    const accessToken = localStorage.getItem('access_token')
    try {
      if (refreshToken) {
        await fetch('/backend/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ refreshToken }),
        })
      }
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('remember_email')
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    function handleClick(e) {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        profileTriggerRef.current && !profileTriggerRef.current.contains(e.target)
      ) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function openProfile() {
    if (profileTriggerRef.current) {
      const rect = profileTriggerRef.current.getBoundingClientRect()
      setPopupPos({ top: rect.bottom + 8, left: rect.left })
    }
    setProfileOpen(v => !v)
  }

  function handleNavClick(item) {
    setActiveNav(item)
    setSelectedClientName(null)
    setClientsResetKey(k => k + 1)
    setJobsReviewMode(false)
    setJobsViewJobName(null)
  }

  function NavItem({ id, label, iconBg, iconBgDark, iconColor, icon, isActive, onClick, beta, isAvatar, isSubItem }) {
    const boxBg = (darkMode && !isActive) ? iconBgDark : iconBg
    return (
      <button
        className={`db-nav-item${isActive ? ' db-nav-active' : ''}${isSubItem ? ' db-nav-sub' : ''}`}
        onClick={onClick}
        title={collapsed ? (label || id) : undefined}
      >
        {isSubItem && !collapsed && <span className="db-sub-connector" />}
        <span
          className={`db-icon-box${isAvatar ? ' db-icon-box-avatar' : ''}`}
          style={{ background: boxBg, color: iconColor }}
        >
          {icon}
        </span>
        {!collapsed && <span className="db-nav-label">{label || id}</span>}
        {!collapsed && beta && <span className="db-beta-badge">Beta</span>}
      </button>
    )
  }

  return (
    <>
    <div className={`db-root${darkMode ? ' db-dark' : ''}`}>

      {/* ── Profile popup (fixed, outside sidebar overflow) ── */}
      {profileOpen && (
        <div
          ref={profileRef}
          className="db-profile-popup"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <div className="db-pp-banner">
            <div className="db-pp-banner-bg" />
            <button className="db-pp-close" onClick={() => setProfileOpen(false)} title="Close">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {avatarSrc && !avatarImgErr
              ? <img src={avatarSrc} alt={fullName} className="db-pp-avatar" onError={() => setAvatarImgErr(true)} />
              : null}
            <span className="db-pp-avatar-fallback" style={{ display: !avatarSrc || avatarImgErr ? 'flex' : 'none' }}>{initials}</span>
            <span className="db-pp-online-badge">● Online</span>
          </div>

          <div className="db-pp-identity">
            <div className="db-pp-name">{fullName}</div>
            <div className="db-pp-role">{user?.role ?? '—'} · Tvarah</div>
          </div>

          <div className="db-pp-stats">
            {[{ label: 'Roles', value: '12' }, { label: 'Candidates', value: '142' }, { label: 'Placed', value: '38' }].map(s => (
              <div key={s.label} className="db-pp-stat">
                <div className="db-pp-stat-val">{s.value}</div>
                <div className="db-pp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="db-pp-divider" />

          <div className="db-pp-info">
            {[
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, text: user?.email ?? '—' },
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16v.92z"/></svg>, text: user?.phoneNumber ?? '—' },
              { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, text: user?.location ?? '—' },
            ].map((row, i) => (
              <div key={i} className="db-pp-info-row">
                <span className="db-pp-info-icon">{row.icon}</span>
                <span className="db-pp-info-text">{row.text}</span>
              </div>
            ))}
          </div>

          <div className="db-pp-divider" />

          <div className="db-pp-actions">
            <button className="db-pp-action-btn" onClick={() => { setProfileOpen(false); setEditProfileOpen(true) }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </button>
            <button className="db-pp-action-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Settings
            </button>
            <button className="db-pp-action-btn db-pp-signout" onClick={handleSignOut} disabled={signingOut}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}

      {/* ── Floating sidebar toggle ── */}
      <button
        className={`db-float-toggle${collapsed ? ' db-float-toggle-collapsed' : ''}`}
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
        </svg>
      </button>

      {/* ── Sidebar ── */}
      <aside className={`db-sidebar${collapsed ? ' db-collapsed' : ''}`}>

        <div className="db-sidebar-hd">
          <button className="db-profile-trigger" ref={profileTriggerRef} onClick={openProfile}>
            <div className="db-profile-pic">
              {avatarSrc && !avatarImgErr
                ? <img src={avatarSrc} alt={fullName} className="db-profile-pic-img" onError={() => setAvatarImgErr(true)} />
                : null}
              <span className="db-profile-pic-fallback" style={{ display: !avatarSrc || avatarImgErr ? 'flex' : 'none' }}>{initials}</span>
            </div>
            {!collapsed && (
              <div className="db-profile-info">
                <div className="db-profile-name">{fullName}</div>
                <div className="db-profile-role">{user?.role ?? '—'}</div>
              </div>
            )}
          </button>
        </div>

        <nav className="db-nav">
          {!collapsed && <div className="db-section-hd">Overview</div>}
          {collapsed && <div className="db-section-sep" />}
          {OVERVIEW_NAV.map(item => (
            <NavItem key={item.id} {...item} label={item.id} isActive={activeNav === item.id} onClick={() => handleNavClick(item.id)} />
          ))}


          {!collapsed && <div className="db-section-hd">Others</div>}
          {collapsed && <div className="db-section-sep" />}
          {OTHERS_NAV.map(item => (
            <NavItem key={item.id} {...item} label={item.id} isActive={activeNav === item.id} onClick={() => handleNavClick(item.id)} />
          ))}
        </nav>

        <div className="db-sidebar-bottom">
          {!collapsed && (
            <div className="db-plan-card">
              <div className="db-plan-top">
                <span className="db-plan-name">Basic Plan</span>
                <span className="db-plan-count">↑ 4/10</span>
              </div>
              <div className="db-plan-bar"><div className="db-plan-fill" /></div>
              <div className="db-plan-trial">🚀 Trial ends in 4 days</div>
              <div className="db-plan-desc">
                Free trial of the <u>Basic</u> plan on <u>monthly</u> billing.
              </div>
            </div>
          )}
          <NavItem
            id="Help" label="Help & Support"
            iconBg="#FFF7ED" iconBgDark="rgba(249,115,22,0.15)" iconColor="#F97316"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>}
            isActive={false} onClick={() => {}}
          />
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="db-breadcrumb">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            {(activeNav && activeNav !== 'Dashboard') ? (
              <>
                <span className="db-bc-seg" style={{cursor:'pointer'}} onClick={() => { setActiveNav('Dashboard'); setSelectedClientName(null); setClientsResetKey(k => k + 1); setJobsReviewMode(false); setJobsViewJobName(null) }}>Dashboard</span>
                <span className="db-bc-div">/</span>
                {selectedClientName ? (
                  <>
                    <span className="db-bc-seg" style={{cursor:'pointer'}} onClick={() => { setSelectedClientName(null); setClientsResetKey(k => k + 1) }}>{activeNav}</span>
                    <span className="db-bc-div">/</span>
                    <span className="db-bc-cur">{selectedClientName}</span>
                  </>
                ) : jobsReviewMode ? (
                  <>
                    <span className="db-bc-seg" style={{cursor:'pointer'}} onClick={() => setJobsReviewMode(false)}>{activeNav}</span>
                    <span className="db-bc-div">/</span>
                    <span className="db-bc-cur">Review JD</span>
                  </>
                ) : jobsViewJobName ? (
                  <>
                    <span className="db-bc-seg" style={{cursor:'pointer'}} onClick={() => { setJobsViewJobName(null); setJobsReviewMode(false) }}>{activeNav}</span>
                    <span className="db-bc-div">/</span>
                    <span className="db-bc-cur">{jobsViewJobName}</span>
                  </>
                ) : (
                  <span className="db-bc-cur">{activeNav}</span>
                )}
              </>
            ) : (
              <span className="db-bc-cur">Dashboard</span>
            )}
          </div>
          <div className="db-topbar-right">
            <button className="db-tb-icon db-darkmode-toggle" onClick={() => setDarkMode(v => !v)} title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm0-5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 18a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1zm9-9h1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2zM2 12a1 1 0 0 1 1-1h1a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm15.66-6.07.7-.71a1 1 0 1 1 1.42 1.42l-.71.7a1 1 0 1 1-1.41-1.41zm-12.73 12.72-.7.71a1 1 0 1 1-1.42-1.42l.71-.7a1 1 0 1 1 1.41 1.41zm12.02 1.42.71.7a1 1 0 1 1-1.42 1.42l-.7-.71a1 1 0 1 1 1.41-1.41zM4.93 6.34l-.71-.7A1 1 0 1 1 5.64 4.2l.7.71a1 1 0 1 1-1.41 1.41z"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
            <button className="db-tb-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="db-tb-icon db-tb-bell">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="db-bell-dot" />
            </button>
            <button className="db-tb-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
            <button className="db-pulse-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Pulse Assist
            </button>
          </div>
        </header>

        <div className="db-content">
          {activeNav === 'Dashboard' && (
            <OverviewDashboard darkMode={darkMode} />
          )}

          {activeNav === 'Panel' && (
            <div className="db-component-wrap"><PanelPage /></div>
          )}

          {activeNav === 'Tasks' && (
            <div className="db-component-wrap"><TaskPage /></div>
          )}

          {activeNav === 'Clients' && (
            <div className="db-component-wrap"><ClientsPage onClientSelect={setSelectedClientName} resetKey={clientsResetKey} /></div>
          )}

          {activeNav === 'Users' && (
            <div className="db-component-wrap"><UsersPage /></div>
          )}

          {activeNav === 'Jobs' && (
            <div className="db-component-wrap"><JobsPage
  onReviewModeChange={setJobsReviewMode}
  reviewMode={jobsReviewMode || !!jobsViewJobName}
  onJobViewChange={name => setJobsViewJobName(name)}
  onFindCandidates={filter => {
    setCandidatesJobFilter(filter)
    setJobsViewJobName(null)
    setJobsReviewMode(false)
    setActiveNav('Candidates')
  }}
/></div>
          )}

          {activeNav === 'Candidates' && (
            <div className="db-component-wrap"><CandidatesPage jobFilter={candidatesJobFilter} /></div>
          )}

          {activeNav !== 'Dashboard' && activeNav !== 'Panel' && activeNav !== 'Tasks' && activeNav !== 'Clients' && activeNav !== 'Users' && activeNav !== 'Jobs' && activeNav !== 'Candidates' && (
            <div className="db-candidates-wrap">
              <div className="db-page-hd">
                <div>
                  <h1 className="db-page-title">Candidates</h1>
                  <p className="db-page-meta">142 total · <span className="db-meta-pending">10 action pending</span></p>
                </div>
                <button className="db-add-btn">+ Add Candidate</button>
              </div>

              <div className="db-filters">
                <div className="db-filters-l">
                  <span className="db-show-label">Show me:</span>
                  <button className="db-chip db-chip-sel">
                    Active
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {['Role / Title', 'Pipeline Status', 'Score Bucket', 'Notice Period'].map(f => (
                    <button key={f} className="db-chip">
                      {f}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                  ))}
                  <button className="db-add-filter-btn">+ Add Filter</button>
                </div>
                <div className="db-filters-r">
                  <button className="db-clear-btn">Clear all filter</button>
                  <div className="db-search-box">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input className="db-search-inp" placeholder="Search..." />
                  </div>
                  <button className="db-cols-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th className="db-th-star" />
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
                      <th>WORK PREF...</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANDIDATES.map(c => (
                      <tr key={c.id} className="db-tr">
                        <td className="db-td-star">
                          <button
                            className={`db-star${starred[c.id] ? ' db-star-on' : ''}`}
                            onClick={() => setStarred(s => ({ ...s, [c.id]: !s[c.id] }))}
                          >
                            {starred[c.id] ? '★' : '☆'}
                          </button>
                        </td>
                        <td>
                          <div className="db-cand-cell">
                            <div className="db-avatar" style={{ background: c.color }}>{c.initials}</div>
                            <div>
                              <div className="db-cand-name">{c.name}</div>
                              <div className="db-cand-id">{c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="db-role-name">{c.role}</div>
                          <div className="db-role-co">@ {c.company}</div>
                        </td>
                        <td className="db-td-contact">{c.contact}</td>
                        <td className="db-td-loc">{c.location}</td>
                        <td className="db-td-exp">{c.exp}</td>
                        <td>
                          <span className={`db-notice db-notice-${c.noticeType}`}>{c.notice}</span>
                        </td>
                        <td>
                          <ScoreCell score={c.score} label={c.scoreLabel} dot={c.scoreDot} />
                        </td>
                        <td>
                          <div className="db-pipe-cell">
                            <StatusBadge status={c.status} />
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
                          </div>
                        </td>
                        <td>
                          <button className="db-jobs-btn">{c.jobs} Jobs</button>
                        </td>
                        <td>
                          <ActionsBadge count={c.actionsCount} type={c.actionsType} />
                        </td>
                        <td style={{ color: c.workPrefColor, fontSize: 13, fontWeight: 500 }}>
                          {c.workPref}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    {editProfileOpen && user && (
      <EditProfileModal
        user={user}
        onClose={() => setEditProfileOpen(false)}
        onSaved={updated => { setUser(updated); setEditProfileOpen(false) }}
      />
    )}
    </>
  )
}
