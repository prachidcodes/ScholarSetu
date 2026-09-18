import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Banknote, 
  User, 
  Clock, 
  Filter 
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  role: string;
  targetId: string;
  timestamp: string;
  type: 'verification' | 'manual_review' | 'disbursement' | 'system';
  details: string;
}

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    action: 'DWO Manual Review Queue Escalated',
    actor: 'ScholarSetu Rules Engine',
    role: 'Automated System',
    targetId: 'APP-MOTA-2025-0982',
    timestamp: 'Today, 10:14 AM',
    type: 'manual_review',
    details: 'Income variance flagged (₹2,00,000 declared vs ₹3,50,000 tax record). Escalated to District Welfare Officer Ranchi with student affidavit.'
  },
  {
    id: 'log-002',
    action: 'PFMS DBT Batch Direct Credit Released',
    actor: 'Director of Tribal Welfare',
    role: 'Central Sanction Authority',
    targetId: 'BATCH-JH-2025-09',
    timestamp: 'Today, 09:30 AM',
    type: 'disbursement',
    details: 'Sanction order signed for 412 Post-Matric scholars in Ranchi District. Total released: ₹61.80 Lakh via APBS.'
  },
  {
    id: 'log-003',
    action: 'DigiLocker Cryptographic Sync Completed',
    actor: 'Sunita Soren',
    role: 'Beneficiary Student',
    targetId: 'DOC-WALLET-9021',
    timestamp: 'Today, 08:45 AM',
    type: 'verification',
    details: '5 digital certificates verified with UIDAI, Jharkhand e-District, and CBSE. SHA-256 signatures validated.'
  },
  {
    id: 'log-004',
    action: 'Top Class Institute Verification Completed',
    actor: 'AISHE Master API',
    role: 'Accreditation Cross-Check',
    targetId: 'APP-MOTA-2025-0419',
    timestamp: 'Yesterday, 04:20 PM',
    type: 'system',
    details: 'IIT Kharagpur B.Tech course enrolment cross-checked and marked 100% verified.'
  },
  {
    id: 'log-005',
    action: 'National Overseas Scholarship (NOS) Committee Shortlist',
    actor: 'MoTA Overseas Cell',
    role: 'Ministry Review Panel',
    targetId: 'APP-MOTA-2025-1102',
    timestamp: 'Yesterday, 02:15 PM',
    type: 'system',
    details: 'QS World Top 100 unconditional offer letter verified for University of Oxford.'
  }
];

export const AdminActivityPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = AUDIT_LOGS.filter((log) => filter === 'all' || log.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
          <Activity className="w-4 h-4" />
          <span>Security & Compliance Record</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Audit Trail & System Activity
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Immutable log of automated cross-verification runs, administrative reviews, and PFMS disbursement orders.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 font-semibold mr-1">Filter Log:</span>
        {['all', 'manual_review', 'disbursement', 'verification', 'system'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Audit Logs List */}
      <Card>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {filtered.map((log) => (
              <div key={log.id} className="p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {log.targetId}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{log.action}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {log.details}
                </p>

                <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-500">
                  <span>Actor: <strong className="text-slate-700">{log.actor}</strong> ({log.role})</span>
                  <span>Log Ref: <code className="font-mono">{log.id}</code></span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
