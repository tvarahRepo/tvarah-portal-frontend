// @ts-nocheck
'use client'
import PipelineStatusCell, { STATUS_LABELS } from '../components/PipelineStatusCell';

const DEMO_CANDIDATES = [
  { name: 'Arjun Mehta',  role: 'Senior Backend Eng.', status: 'SCREENING_PENDING' },
  { name: 'Priya Sharma', role: 'Product Manager',     status: 'PANEL_ASSIGNED' },
  { name: 'Karthik Nair', role: 'Data Scientist',      status: 'CLIENT_ASSIGNED' },
  { name: 'Sneha Mehta',  role: 'UX Designer',         status: 'INTERVIEW_SCHEDULED' },
  { name: 'Ravi Kumar',   role: 'DevOps Engineer',     status: 'CLIENT_INTERVIEW_SELECTED' },
  { name: 'Divya Patel',  role: 'Fullstack Developer', status: 'OFFER_RELEASED' },
  { name: 'Amit Shah',    role: 'iOS Developer',       status: 'JOINED' },
  { name: 'Neha Gupta',   role: 'QA Engineer',         status: 'PANEL_REJECTED' },
];

export default function PipelineDemo() {
  return (
    <div style={{ padding: 32, fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: 4, color: '#1e293b' }}>Candidates — Pipeline Tracker</h2>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Each row shows stage progress + current status</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['Candidate', 'Role', 'Pipeline Progress & Status'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEMO_CANDIDATES.map((c, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{c.name}</td>
              <td style={{ padding: '14px 16px', color: '#64748b', fontSize: 13 }}>{c.role}</td>
              <td style={{ padding: '14px 16px' }}>
                <PipelineStatusCell status={c.status} showStepper={true} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
