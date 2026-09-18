import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  Building, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  ArrowRight,
  RotateCcw,
  Send,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export const AdminVerificationPage: React.FC = () => {
  const { applications, adminResolveReview } = useApp();

  // Find the primary demo case with variance (Sunita Soren)
  const targetApp = applications.find(
    (a) => a.id === 'APP-MOTA-2025-0982' || a.readinessReport?.hasMismatch
  ) || applications[0];

  const [remarks, setRemarks] = useState(
    'Tahsildar physical non-taxable agricultural certificate verified as authentic. Income variance cleared under Rule 14(b) for tribal rural produce.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [resolutionSuccess, setResolutionSuccess] = useState<string | null>(null);

  const handleAction = async (decision: 'Approve' | 'Request More Info' | 'Sanction') => {
    if (!targetApp) return;
    setIsProcessing(true);
    setResolutionSuccess(null);
    try {
      await adminResolveReview(targetApp.id, decision, remarks);
      setResolutionSuccess(
        decision === 'Approve'
          ? 'Application variance resolved and approved. Readiness Score set to 100%.'
          : decision === 'Sanction'
          ? 'Application sanctioned and Direct Benefit Transfer (DBT) scheduled.'
          : 'Supplemental certificate request sent to student.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-amber-700 mb-1">
          <CheckSquare className="w-4 h-4" />
          <span>Application Readiness & Resolution Engine</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          District Welfare Officer (DWO) Resolution Workbench
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          ScholarSetu core resolution pipeline. Welfare officers review automated registry flags and exercise discretion to resolve data discrepancies without rejecting tribal students.
        </p>
      </div>

      {resolutionSuccess && (
        <Alert type="success" title="Administrative Resolution Stamped">
          {resolutionSuccess} Check student application tracking view to see immediate real-time synchronization.
        </Alert>
      )}

      {/* Target Application Dossier Grid */}
      {targetApp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: The Discrepancy & Student Dossier */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-300">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Active Discrepancy Review: {targetApp.studentName}</span>
                  </div>
                }
                subtitle={`Application ID: ${targetApp.id} • Scheme: ${targetApp.schemeName}`}
                action={
                  <Badge variant={targetApp.status === 'Disbursed' ? 'success' : targetApp.readinessReport?.hasMismatch ? 'warning' : 'info'} size="sm">
                    {targetApp.status}
                  </Badge>
                }
              />

              <CardBody className="space-y-6">
                {/* Student Clarification Highlight Box */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-amber-700" />
                    <span>Applicant Submitted Clarification</span>
                  </div>
                  <p className="text-xs text-amber-900 font-medium italic leading-relaxed">
                    "{targetApp.readinessReport?.manualReviewNote || 'My declared income of ₹2,00,000 reflects our Tahsildar certified rural agricultural non-taxable earnings. Central tax record includes temporary family medical distress loan.'}"
                  </p>
                </div>

                {/* Field-by-Field Audit Results */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Automated Registry Cross-Checks (Readiness Score: {targetApp.readinessScore}%)
                  </h4>

                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                    {targetApp.readinessReport?.fields?.map((f: any, idx: number) => (
                      <div key={idx} className={`p-4 ${!f.isMatch ? 'bg-amber-50/60' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{f.fieldLabel}</span>
                          <Badge variant={f.isMatch ? 'success' : 'warning'} size="sm">
                            {f.isMatch ? 'Verified Match' : 'Discrepancy Detected'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <span className="text-[10px] text-slate-400 block">Submitted by Student:</span>
                            <span className="font-bold text-slate-800">{f.submittedValue}</span>
                          </div>
                          <div className="p-2 bg-white rounded border border-slate-200">
                            <span className="text-[10px] text-slate-400 block">Verified Central Source ({f.verificationSource}):</span>
                            <span className={`font-bold ${!f.isMatch ? 'text-amber-800' : 'text-slate-800'}`}>
                              {f.verifiedValue}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attached Physical Certificate Status */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Verified Digital Certificates on Record
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-800" />
                        <div>
                          <span className="font-semibold text-slate-800 block">ST Caste Certificate</span>
                          <span className="text-[10px] text-slate-500">JH-ST-2023-88219 (Santhal)</span>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Valid</Badge>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-800" />
                        <div>
                          <span className="font-semibold text-slate-800 block">Revenue Income Certificate</span>
                          <span className="text-[10px] text-slate-500">JH/REV/2024/7712 (Tahsildar)</span>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Valid</Badge>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right 1 Col: Welfare Officer Action Console */}
          <div className="space-y-6">
            <Card className="border-teal-800/30">
              <CardHeader
                title="Welfare Officer Determination"
                subtitle="Select administrative action"
                icon={<UserCheck className="w-5 h-5 text-teal-800" />}
              />
              <CardBody className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Regulatory Remarks *
                  </label>
                  <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 bg-white text-slate-800"
                    placeholder="Enter reason for variance waiver or clarification requirement..."
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Remarks will be stamped on the student's digital dossier and audit trail.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    isLoading={isProcessing}
                    onClick={() => handleAction('Approve')}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Approve Variance & Clear
                  </Button>

                  <Button
                    variant="saffron"
                    size="md"
                    className="w-full"
                    isLoading={isProcessing}
                    onClick={() => handleAction('Sanction')}
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    Generate Sanction Order (DBT)
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    className="w-full text-slate-600"
                    isLoading={isProcessing}
                    onClick={() => handleAction('Request More Info')}
                  >
                    Request Supplemental Affidavit
                  </Button>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">MoTA Rule 14(b) Directive:</p>
                  <p>
                    "No Scheduled Tribe student shall suffer scholarship cancellation solely on automated database mismatches where physical revenue documentation is validated by the District Welfare Officer."
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Quick Stats on Queue */}
            <Card className="p-4 bg-slate-50 text-xs space-y-2">
              <h4 className="font-bold text-slate-800">State DWO Performance Metrics</h4>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Average Resolution Time:</span>
                <span className="font-bold text-teal-800">1.8 Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Manual Variance Approval Rate:</span>
                <span className="font-bold text-slate-800">92.4%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Rejection Prevention Rate:</span>
                <span className="font-bold text-emerald-700">100% Zero-Drop</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
