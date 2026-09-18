import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { UserProfile, StudentDocument } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ReadinessCardProps {
  user: UserProfile | null;
  documents: StudentDocument[];
  hasMismatch?: boolean;
  onOpenJago?: (prompt: string) => void;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  user,
  documents,
  hasMismatch,
  onOpenJago
}) => {
  const { t } = useLanguage();

  // Check checklist items
  const isProfileComplete = Boolean(
    user?.name && user?.dateOfBirth && user?.aadhaarNumber && user?.state && user?.district
  );

  const stDoc = documents.find((d) => d.type === 'caste_certificate');
  const isStVerified = stDoc?.status === 'Verified';

  const incomeDoc = documents.find((d) => d.type === 'income_certificate');
  const isIncomeValid = incomeDoc?.status === 'Verified' && !hasMismatch;

  const bankDoc = documents.find((d) => d.type === 'bank_passbook');
  const isBankSeeded = Boolean(user?.isBankAadhaarSeeded || bankDoc?.status === 'Verified');

  const marksheetDoc = documents.find((d) => d.type === 'marksheet');
  const isAcademicUploaded = marksheetDoc?.status === 'Verified' || marksheetDoc?.status === 'Pending';

  // Calculate score
  const items = [
    { label: t('readiness.checkProfile', 'Student Profile'), done: isProfileComplete, weight: 20 },
    { label: t('readiness.checkCaste', 'ST Caste Certificate'), done: isStVerified, weight: 25 },
    { label: t('readiness.checkIncome', 'Annual Family Income Validation'), done: isIncomeValid, weight: 20 },
    { label: t('readiness.checkBank', 'Bank Account Aadhaar-Seeding (DBT Ready)'), done: isBankSeeded, weight: 20 },
    { label: t('readiness.checkAcademic', 'Academic Qualification Records'), done: isAcademicUploaded, weight: 15 }
  ];

  const score = items.reduce((acc, item) => (item.done ? acc + item.weight : acc), 0);

  // Determine band
  let band = {
    label: t('readiness.readyToApply', 'Ready to Apply'),
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    desc: t('readiness.readyDesc', 'Your profile satisfies all central criteria. Applications will undergo high-speed automated approval.')
  };

  if (score < 50) {
    band = {
      label: t('readiness.notReady', 'Incomplete Profile'),
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      desc: t('readiness.notReadyDesc', 'Missing mandatory documents or incomplete profile. Complete items below.')
    };
  } else if (score < 80 || hasMismatch) {
    band = {
      label: t('readiness.needsAttention', 'Needs Attention'),
      color: 'text-amber-800 bg-amber-50 border-amber-300',
      desc: t('readiness.attentionDesc', 'Minor variance detected. You may submit with a request for manual review.')
    };
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-black text-lg text-slate-900">
              {t('readiness.cardTitle', 'Scholarship Readiness Engine')}
            </h3>
            <span className="text-[11px] font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200/70">
              Automated Pre-Check
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('readiness.cardSubtitle', 'Pre-application evaluation across five core government criteria')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">{score}%</span>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">{t('readiness.score', 'Readiness Score')}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${band.color}`}>
            {band.label}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        {band.desc}
      </p>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Item 1 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">{t('readiness.checkProfile', 'Student Profile')}</p>
            <p className="text-[11px] text-slate-500">Aadhaar, State, District, Sub-tribe</p>
          </div>
          {isProfileComplete ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('readiness.statusDone', 'Done')}
            </span>
          ) : (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {t('readiness.statusPending', 'Incomplete')}
            </span>
          )}
        </div>

        {/* Item 2 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">{t('readiness.checkCaste', 'ST Caste Certificate')}</p>
            <p className="text-[11px] text-slate-500">{user?.stCertificateNumber || 'Verified in e-District'}</p>
          </div>
          {isStVerified ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('readiness.statusValid', 'Verified')}
            </span>
          ) : (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {t('readiness.statusPending', 'Pending')}
            </span>
          )}
        </div>

        {/* Item 3 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">{t('readiness.checkIncome', 'Income Ceiling Check')}</p>
            <p className="text-[11px] text-slate-500">
              {hasMismatch ? 'Variance detected (₹2.0L vs ₹3.5L)' : 'Within limit'}
            </p>
          </div>
          {isIncomeValid ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('readiness.statusValid', 'Valid')}
            </span>
          ) : (
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {t('readiness.statusReview', 'Review')}
            </span>
          )}
        </div>

        {/* Item 4 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">{t('readiness.checkBank', 'Bank Aadhaar Seeding (DBT)')}</p>
            <p className="text-[11px] text-slate-500">NPCI Aadhaar Payment Bridge</p>
          </div>
          {isBankSeeded ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('readiness.statusSeeded', 'Seeded')}
            </span>
          ) : (
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {t('readiness.statusNotSeeded', 'Not Seeded')}
            </span>
          )}
        </div>

        {/* Item 5 */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-slate-800">{t('readiness.checkAcademic', 'Academic Qualification')}</p>
            <p className="text-[11px] text-slate-500">Board Marksheet / Degree</p>
          </div>
          {isAcademicUploaded ? (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('readiness.statusUploaded', 'Uploaded')}
            </span>
          ) : (
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {t('readiness.statusMissing', 'Missing')}
            </span>
          )}
        </div>

        {/* Quick Action Box */}
        <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-teal-950">{t('docs.title', 'Document Wallet')}</p>
            <p className="text-[11px] text-teal-800">{t('docs.digiLockerVault', 'Sync with DigiLocker')}</p>
          </div>
          <Link
            to="/student/documents"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1"
          >
            <span>{t('common.view', 'Manage')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Actionable Recommendations */}
      {hasMismatch && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t('dashboard.actionRequired', 'Recommendation')}: </span>
              {t('mismatch.philosophy', 'An information mismatch is a signal to review — not an automatic rejection.')}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenJago && (
              <button
                onClick={() => onOpenJago(t('jago.qFlagged', 'Explain why my income verification shows a mismatch'))}
                className="px-2.5 py-1 text-xs font-bold bg-white text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-100"
              >
                {t('common.askJago', 'Ask JAGO')}
              </button>
            )}
            <Link
              to="/student/applications"
              className="px-3 py-1 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              {t('apps.viewDetails', 'Review Application')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
