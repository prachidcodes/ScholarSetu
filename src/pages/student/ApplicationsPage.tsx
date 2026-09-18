import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  Banknote
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslatedStatus } from '../../utils/statusTranslation';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ApplicationsPage: React.FC = () => {
  const { applications } = useApp();
  const { t } = useLanguage();

  const getStatusBadge = (status: string) => {
    const translated = getTranslatedStatus(status, t);
    switch (status) {
      case 'Disbursed':
        return <Badge variant="success" dot>{translated}</Badge>;
      case 'Sanctioned':
        return <Badge variant="purple" dot>{translated}</Badge>;
      case 'Under Manual Review':
        return <Badge variant="warning" dot>{translated}</Badge>;
      case 'Under Verification':
        return <Badge variant="info" dot>{translated}</Badge>;
      case 'Deficiency Found':
        return <Badge variant="error" dot>{translated}</Badge>;
      default:
        return <Badge variant="neutral" dot>{translated}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-teal-800 mb-1">
            <FileText className="w-4 h-4" />
            <span>{t('apps.title', 'Ministry Application Tracker')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('apps.title', 'My Scholarship Applications')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            {t('apps.subtitle', 'Live lifecycle tracking across automated verification, District Welfare Officer manual review, Sanction order, and DBT release.')}
          </p>
        </div>

        <Link to="/student/scholarships">
          <Button variant="outline" size="sm">
            {t('apps.applyAnother', 'Apply for Another Scheme')}
          </Button>
        </Link>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => {
          const hasMismatch = app.readinessReport?.hasMismatch;

          return (
            <Card key={app.id} className="hover:border-teal-700/40 transition-all shadow-xs">
              <CardBody className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80">
                        {app.id}
                      </span>
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-slate-400">
                        {t('apps.submittedOn', 'Submitted')}: {app.submissionDate || new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">
                      {app.schemeName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span><strong>{t('apps.institutionLabel', 'Institution')}:</strong> {app.institutionName}</span>
                      <span><strong>{t('apps.courseLabel', 'Course')}:</strong> {app.course || app.courseName}</span>
                      <span><strong>{t('apps.incomeLabel', 'Income')}:</strong> ₹{(app.annualIncome || app.submittedAnnualIncome || 0).toLocaleString('en-IN')}/yr</span>
                    </div>

                    {/* Mismatch Alert Tag */}
                    {hasMismatch && app.status !== 'Disbursed' && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-300">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>{t('mismatch.flagNotice', 'Discrepancy: Income Verification Query')} ({t('readiness.score', 'Readiness')}: {app.readinessScore}%)</span>
                      </div>
                    )}

                    {/* Disbursement Tag */}
                    {app.status === 'Disbursed' && app.disbursementDetails && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-300">
                        <Banknote className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        <span>{t('dashboard.dbtReceived', 'DBT Credited')}: ₹{app.disbursementDetails.amount.toLocaleString('en-IN')} on {app.disbursementDetails.disbursedDate}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Action Button */}
                  <div className="flex items-center gap-3 lg:self-center">
                    <Link
                      to={`/student/applications/${app.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold transition-colors shadow-xs"
                    >
                      <span>{t('apps.viewDetails', 'Track Lifecycle')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}

        {applications.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold text-sm">{t('apps.noApplications', 'No applications submitted yet.')}</p>
            <Link to="/student/scholarships" className="mt-2 text-xs font-bold text-teal-800 underline block">
              {t('nav.schemes', 'Browse and apply for 5 Ministry Schemes')} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
