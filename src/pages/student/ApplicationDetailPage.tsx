import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Banknote, 
  ShieldCheck, 
  UserCheck, 
  FileEdit, 
  Clock, 
  Building,
  Sparkles,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimelineView } from '../../components/student/TimelineView';
import { DisbursementCard } from '../../components/student/DisbursementCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { applicationService } from '../../services/applicationService';

export const ApplicationDetailPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const { 
    applications, 
    requestManualReview, 
    refreshApplications,
    openJagoWithPrompt,
    setIsJagoOpen
  } = useApp();

  const app = applications.find((a) => a.id === appId) || applications[0];

  // Fix Info Modal State
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [updatedIncome, setUpdatedIncome] = useState(app?.annualIncome || 200000);
  const [isFixing, setIsFixing] = useState(false);

  // Manual Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState(
    'My declared income of ₹2,00,000 reflects our Tahsildar certified rural agricultural non-taxable earnings. Central tax record includes temporary family medical distress loan.'
  );
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!app) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Application Not Found</h2>
        <Link to="/student/applications" className="text-teal-800 text-sm font-semibold underline mt-2 block">
          Back to Applications
        </Link>
      </div>
    );
  }

  const hasMismatch = app.readinessReport?.hasMismatch;

  const handleFixIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFixing(true);
    try {
      await applicationService.updateApplication(app.id, {
        submittedAnnualIncome: Number(updatedIncome),
        annualIncome: Number(updatedIncome),
        readinessScore: 100,
        readinessReport: {
          overallScore: 100,
          isEligibleToSubmit: true,
          hasMismatch: false,
          summary: 'Annual family income updated by applicant. All 5 criteria cleared with 100% readiness.',
          recommendations: ['Your application is now verified and cleared for automated sanction.'],
          fields: app.readinessReport?.fields?.map((f: any) =>
            f.fieldName === 'annualIncome'
              ? {
                  ...f,
                  submittedValue: `₹${Number(updatedIncome).toLocaleString('en-IN')}`,
                  verifiedValue: `₹${Number(updatedIncome).toLocaleString('en-IN')}`,
                  isMatch: true,
                  explanation: 'Submitted income declaration matches central revenue records.'
                }
              : f
          ) || []
        }
      });
      refreshApplications();
      setIsFixModalOpen(false);
    } finally {
      setIsFixing(false);
    }
  };

  const handleManualReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await requestManualReview(app.id, reviewNote);
      refreshApplications();
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <div>
        <Link
          to="/student/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {app.id}
              </span>
              <span className="text-xs text-slate-500">
                Submitted: {app.submissionDate || new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {app.schemeName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (openJagoWithPrompt) {
                  openJagoWithPrompt('Why is my application flagged?');
                } else {
                  setIsJagoOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-teal-700/30 text-teal-800 text-xs font-semibold hover:bg-teal-50 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ask JAGO About This</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Income Mismatch Banner */}
      {hasMismatch && app.status !== 'Disbursed' && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-base">
                  Verification Discrepancy: Income Cross-Check Variance
                </h3>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-2xl">
                  Submitted Income: <strong>₹{(app.annualIncome || app.submittedAnnualIncome || 200000).toLocaleString('en-IN')}</strong> | Verified Central Source: <strong>₹3,50,000</strong>.
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  <strong>Important Rule:</strong> Under ScholarSetu, discrepancies never result in automatic disqualification. You have the right to edit or appeal.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileEdit className="w-4 h-4 text-teal-800" />}
                onClick={() => setIsFixModalOpen(true)}
              >
                Fix Information
              </Button>

              <Button
                variant="saffron"
                size="sm"
                leftIcon={<UserCheck className="w-4 h-4 text-white" />}
                onClick={() => setIsReviewModalOpen(true)}
              >
                Request Manual Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Review Pending Alert */}
      {app.status === 'Under Manual Review' && (
        <Alert type="warning" title="Application Transferred to District Welfare Officer (DWO)">
          Your request for manual review has been queued. The District Welfare Officer will examine your physical income certificate and Tahsildar affidavit. You will be notified as soon as action is taken.
        </Alert>
      )}

      {/* Disbursed DBT Card */}
      {app.status === 'Disbursed' && app.disbursementDetails && (
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-700" />
            <span>Direct Benefit Transfer (DBT) Release Confirmed</span>
          </h3>
          <DisbursementCard
            details={app.disbursementDetails}
            schemeName={app.schemeName}
          />
        </div>
      )}

      {/* Two Column Layout: Timeline & Verification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Lifecycle Timeline */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Application Lifecycle Tracker" icon={<Clock className="w-5 h-5" />} />
            <CardBody>
              <TimelineView
                timeline={app.timeline || []}
                currentStatus={app.status}
              />
            </CardBody>
          </Card>

          {/* Student Profile Snapshot */}
          <Card>
            <CardHeader title="Beneficiary Data" />
            <CardBody className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{app.studentName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Aadhaar (Masked):</span>
                <span className="font-mono text-slate-800">{app.studentAadhaarMasked || app.aadhaarNumber || 'XXXX-XXXX-8924'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Institution:</span>
                <span className="font-semibold text-slate-800 text-right">{app.institutionName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Course / Branch:</span>
                <span className="font-semibold text-slate-800 text-right">{app.course || app.courseName || 'Degree Course'}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Declared Income:</span>
                <span className="font-bold text-slate-900">₹{(app.annualIncome || app.submittedAnnualIncome || 200000).toLocaleString('en-IN')}/yr</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right 2 Cols: Field-by-field verification results table */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Automated Cross-Verification Engine Audit"
              subtitle={`Current Application Readiness Score: ${app.readinessScore}%`}
              action={
                <Badge variant={app.readinessScore === 100 ? 'success' : 'warning'} size="sm">
                  {app.readinessScore === 100 ? '100% Cleared' : 'Action Required'}
                </Badge>
              }
            />

            <CardBody className="p-0">
              <div className="divide-y divide-slate-200">
                {app.readinessReport?.fields?.map((f: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 transition-colors ${
                      !f.isMatch ? 'bg-amber-50/50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {f.isMatch ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                        <span className="font-bold text-sm text-slate-900">
                          {f.fieldLabel}
                        </span>
                      </div>

                      <Badge variant={f.isMatch ? 'success' : 'warning'} size="sm">
                        {f.isMatch ? 'Source Matched' : 'Variance Detected'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-400 block mb-0.5">Submitted Value:</span>
                        <span className="font-bold text-slate-800">{f.submittedValue}</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] text-slate-400">Verified Value:</span>
                          <span className="text-[10px] text-teal-800 font-medium truncate max-w-[130px]">{f.verificationSource}</span>
                        </div>
                        <span className={`font-bold ${!f.isMatch ? 'text-amber-800' : 'text-slate-800'}`}>
                          {f.verifiedValue}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      <strong className="text-slate-800">Verification Source: </strong>
                      {f.verificationSource} — {f.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Attached Verified Documents list */}
          <Card>
            <CardHeader title="Attached Cryptographic Documents" icon={<FolderLock className="w-5 h-5" />} />
            <CardBody>
              <div className="space-y-2">
                {app.documents?.map((doc: any) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-800" />
                      <div>
                        <span className="font-semibold text-slate-800 block">{doc.title}</span>
                        <span className="text-[11px] text-slate-500">Authority: {doc.issuingAuthority}</span>
                      </div>
                    </div>

                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal: Fix Information */}
      <Modal
        isOpen={isFixModalOpen}
        onClose={() => setIsFixModalOpen(false)}
        title="Update Annual Family Income"
        subtitle="Correct any clerical or gross calculation difference"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsFixModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isFixing}
              onClick={handleFixIncomeSubmit}
            >
              Update & Re-Verify
            </Button>
          </div>
        }
      >
        <form onSubmit={handleFixIncomeSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600">
            If you made a clerical mistake, you can update your declared income to match your verified revenue record (₹3,50,000) or your latest revised Tahsildar certificate.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Revised Annual Family Income (in ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">₹</span>
              <input
                type="number"
                value={updatedIncome}
                onChange={(e) => setUpdatedIncome(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
            <p className="font-semibold">Quick suggestion:</p>
            <p className="mt-0.5">
              To achieve 100% immediate automatic registry clearance, you can align your figure with the central tax record (₹3,50,000). Both ₹2,00,000 and ₹3,50,000 remain well within the Post-Matric ceiling of ₹2,50,000 or Top Class ceiling of ₹6,00,000.
            </p>
            <button
              type="button"
              onClick={() => setUpdatedIncome(350000)}
              className="mt-2 text-xs font-bold text-amber-950 underline"
            >
              Set to ₹3,50,000 (Cross-check match)
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Request Manual Review */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Request District Welfare Officer Manual Review"
        subtitle="Explain your rural non-taxable income certification"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="saffron"
              size="sm"
              isLoading={isSubmittingReview}
              onClick={handleManualReviewSubmit}
            >
              Confirm Manual Review
            </Button>
          </div>
        }
      >
        <form onSubmit={handleManualReviewSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600">
            Submit your clarification for the District Welfare Officer (DWO). Your application retains its date priority and will not be delayed by other automated pipelines.
          </p>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clarification / Explanation Note *
            </label>
            <textarea
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 text-slate-800"
              placeholder="Provide context on why local Tahsildar certificate differs..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
