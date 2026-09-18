import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FolderLock, 
  AlertTriangle, 
  Banknote, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { ScholarshipCard } from '../../components/student/ScholarshipCard';
import { DisbursementCard } from '../../components/student/DisbursementCard';
import { ReadinessCard } from '../../components/student/ReadinessCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { 
    applications, 
    documents, 
    schemes, 
    activeDemoApplication, 
    openJagoWithPrompt,
    setIsJagoOpen
  } = useApp();
  const navigate = useNavigate();

  // Find disbursed application for the DBT card
  const disbursedApp = applications.find((a) => a.status === 'Disbursed');

  // Check if active demo application has mismatch
  const hasMismatch = activeDemoApplication?.readinessReport?.hasMismatch;

  // Calculate statistics
  const verifiedDocsCount = documents.filter((d) => d.status === 'Verified').length;
  const inProgressAppsCount = applications.filter((a) => a.status !== 'Disbursed' && a.status !== 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 rounded">
                {t('dashboard.verifiedScholar', 'Verified ST Scholar')}
              </span>
              <span className="text-xs text-teal-200">
                {user?.category || 'ST'} ({user?.subTribe || 'Santhal'}) • {user?.state || 'Jharkhand'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('dashboard.welcome', 'Namaste')}, {user?.name || 'Sunita Soren'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl leading-relaxed">
              {t('dashboard.welcomeSubtitle', 'Welcome to ScholarSetu, the unified tribal scholarship gateway. Your documents are synced with DigiLocker and cross-checked against central registries.')}
            </p>
          </div>

          {/* Profile Completion Dial / Pill */}
          <div className="bg-teal-950/70 border border-teal-700/50 rounded-xl p-4 flex items-center gap-4 flex-shrink-0">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-teal-900"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 * (1 - 0.9)}
                  className="text-amber-400"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-bold text-xs">90%</span>
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">{t('readiness.score', 'Profile Readiness')}</p>
              <p className="text-[11px] text-teal-200">Aadhaar & ST Verified</p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Scholarship Readiness Engine Summary Card */}
      <ReadinessCard
        user={user}
        documents={documents}
        hasMismatch={hasMismatch}
        onOpenJago={openJagoWithPrompt}
      />

      {/* Flagged Application Warning Alert (Demo Scenario) */}
      {hasMismatch && activeDemoApplication && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                    {t('dashboard.actionRequired', 'Action Required')}: {activeDemoApplication.schemeName}
                  </h3>
                  <Badge variant="warning" size="sm">{t('readiness.score', 'Score')}: {activeDemoApplication.readinessScore}%</Badge>
                </div>
                <p className="text-xs text-amber-900 mt-1 leading-relaxed max-w-2xl">
                  {t('mismatch.philosophy', 'Automated revenue verification detected a difference between your declared income and central records. An information mismatch is a signal to review — never an automatic rejection.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => {
                  if (openJagoWithPrompt) {
                    openJagoWithPrompt(t('jago.qFlagged', 'Why is my application flagged?'));
                  } else {
                    setIsJagoOpen(true);
                  }
                }}
                className="px-3 py-2 rounded-lg bg-white border border-amber-300 text-amber-950 text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('common.askJago', 'Ask JAGO')}</span>
              </button>

              <Link
                to={`/student/applications/${activeDemoApplication.id}`}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{t('mismatch.resolveAction', 'Resolve Issue')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Key Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('dashboard.actionRequired', 'Pending Actions')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {hasMismatch ? '1 Flagged' : '0 Pending'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{t('readiness.statusReview', 'Income verification review')}</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('dashboard.activeApplications', 'Active Applications')}</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {inProgressAppsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{t('status.underVerification', 'Under verification / review')}</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('dashboard.dbtReceived', 'DBT Received')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            ₹15,000
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{t('apps.paymentMode', 'Direct to Aadhaar Bank A/c')}</p>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">{t('dashboard.documentWallet', 'DigiLocker Wallet')}</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {verifiedDocsCount} {t('status.verified', 'Verified')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Aadhaar, ST, Marksheets</p>
        </Card>
      </div>

      {/* Disbursed DBT Highlight Card (if student has past disbursement) */}
      {disbursedApp && disbursedApp.disbursementDetails && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-700" />
              <span>{t('dashboard.dbtReceived', 'Central DBT Disbursement')}</span>
            </h2>
            <Link
              to={`/student/applications/${disbursedApp.id}`}
              className="text-xs text-teal-800 font-semibold hover:underline"
            >
              {t('common.view', 'View Sanction Order')}
            </Link>
          </div>
          <DisbursementCard
            details={disbursedApp.disbursementDetails}
            schemeName={disbursedApp.schemeName}
          />
        </div>
      )}

      {/* 5 Central Scholarship Schemes Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              {t('schemes.heading', 'Ministry of Tribal Affairs — 5 Core Schemes')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('schemes.subheading', 'Unified platform eligibility evaluated automatically against your ST profile')}
            </p>
          </div>

          <Link
            to="/student/scholarships"
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-900"
          >
            <span>{t('nav.schemes', 'Explore All 5 Schemes')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => {
            const existingApp = applications.find((a) => a.schemeId === scheme.id);
            return (
              <ScholarshipCard
                key={scheme.id}
                scheme={scheme}
                user={user}
                applicationStatus={existingApp?.status}
                applicationId={existingApp?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
