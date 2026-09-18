import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  FileEdit, 
  UserCheck, 
  ArrowRight,
  Loader2,
  Info,
  ShieldAlert
} from 'lucide-react';
import { ApplicationReadinessReport } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';

interface ReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ApplicationReadinessReport;
  onFixInformation: () => void;
  onRequestManualReview: (note: string) => Promise<void>;
  onSubmitDirectly?: () => void;
}

export const ReadinessModal: React.FC<ReadinessModalProps> = ({
  isOpen,
  onClose,
  report,
  onFixInformation,
  onRequestManualReview,
  onSubmitDirectly
}) => {
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showManualReviewInput, setShowManualReviewInput] = useState(false);
  const [manualReviewNote, setManualReviewNote] = useState(
    'My declared income of ₹2,00,000 reflects our Tahsildar certified rural agricultural non-taxable earnings. Central tax record includes temporary family medical distress loan.'
  );

  const handleManualReviewSubmit = async () => {
    setIsSubmittingReview(true);
    try {
      await onRequestManualReview(manualReviewNote);
      setShowManualReviewInput(false);
      onClose();
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (score >= 60) return 'text-amber-800 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-800" />
          <span>Application Readiness & Registry Verification Report</span>
        </div>
      }
      subtitle="ScholarSetu automated cross-verification engine results"
      maxWidth="3xl"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
          <div className="text-xs text-slate-500 text-left">
            <span>Critical Rule: </span>
            <strong className="text-slate-700">A data variance never rejects an application.</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {report.hasMismatch ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileEdit className="w-4 h-4 text-teal-800" />}
                  onClick={() => {
                    onClose();
                    onFixInformation();
                  }}
                >
                  Fix Information
                </Button>

                <Button
                  variant="saffron"
                  size="sm"
                  leftIcon={<UserCheck className="w-4 h-4 text-white" />}
                  onClick={() => setShowManualReviewInput(true)}
                >
                  Request Manual Review
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  if (onSubmitDirectly) onSubmitDirectly();
                }}
              >
                Proceed to Submit
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Score & Summary Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center font-bold flex-shrink-0 ${getScoreColor(report.overallScore)}`}>
            <span className="text-2xl leading-none">{report.overallScore}%</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Readiness</span>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h4 className="font-bold text-slate-900 text-base">
                {report.hasMismatch ? 'Verification Complete (Variance Detected)' : '100% Verification Cleared'}
              </h4>
              <Badge variant={report.hasMismatch ? 'warning' : 'success'} size="sm">
                {report.hasMismatch ? 'Action Required' : 'Ready for Sanction'}
              </Badge>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.summary}
            </p>
          </div>
        </div>

        {/* Mismatch Explanatory Alert (Demo Scenario) */}
        {report.hasMismatch && (
          <Alert type="warning" title="Discrepancy Resolution Protocol">
            ScholarSetu cross-checks government registries (UIDAI, e-District, UDISE+, Income Tax) in real time. Because income from rural agriculture or unorganized sectors may not match central corporate IT returns, you can either edit your input or request a <strong>Manual Review</strong> by the District Welfare Officer (DWO).
          </Alert>
        )}

        {/* Field-by-Field Verification Results Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Field-by-Field Registry Cross-Checks
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
            {report.fields.map((field, idx) => (
              <div
                key={idx}
                className={`p-4 transition-colors ${
                  !field.isMatch ? 'bg-amber-50/60' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {field.isMatch ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                    <span className="font-semibold text-sm text-slate-900">
                      {field.fieldLabel}
                    </span>
                  </div>

                  <Badge variant={field.isMatch ? 'success' : 'warning'} size="sm">
                    {field.isMatch ? 'Match' : 'Mismatch Found'}
                  </Badge>
                </div>

                {/* Values comparison row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Submitted Value:</span>
                    <span className="font-bold text-slate-800">{field.submittedValue}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-semibold text-slate-400">Verified Source Value:</span>
                      <span className="text-[10px] text-teal-800 font-medium truncate max-w-[140px]">{field.verificationSource}</span>
                    </div>
                    <span className={`font-bold ${!field.isMatch ? 'text-amber-700' : 'text-slate-800'}`}>
                      {field.verifiedValue}
                    </span>
                  </div>
                </div>

                {/* Plain-language explanation */}
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-700">Explanation: </strong>
                  {field.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Review Clarification Prompt Modal Trigger */}
        {showManualReviewInput && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <UserCheck className="w-4 h-4" />
              <span>Submit Request for Manual Review</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Please provide a brief clarification or note for the District Welfare Officer (DWO). You may reference your Tahsildar rural certificate number.
            </p>
            <textarea
              value={manualReviewNote}
              onChange={(e) => setManualReviewNote(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 rounded-lg border border-amber-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-600"
              placeholder="Enter explanation for the welfare officer..."
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManualReviewInput(false)}
              >
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
          </div>
        )}
      </div>
    </Modal>
  );
};
