import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Banknote, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  ShieldAlert,
  Building,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { scholarshipService } from '../../services/scholarshipService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';

export const SchemeDetailPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const { schemes, applications } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const scheme = schemes.find((s) => s.id === schemeId);

  if (!scheme) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Scholarship Scheme Not Found</h2>
        <Link to="/student/scholarships" className="text-teal-800 text-sm font-semibold underline mt-2 block">
          Return to Schemes
        </Link>
      </div>
    );
  }

  const eligibility = scholarshipService.checkEligibility(scheme, user);
  const existingApp = applications.find((a) => a.schemeId === scheme.id);

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumb */}
      <div>
        <Link
          to="/student/scholarships"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Schemes</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-slate-500">{scheme.code}</span>
              <Badge variant="saffron" size="sm">{scheme.fundingType}</Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {scheme.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {scheme.ministry}
            </p>
          </div>

          {/* Action Button */}
          <div>
            {existingApp ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(`/student/applications/${existingApp.id}`)}
              >
                Track Your Application
              </Button>
            ) : eligibility.isEligible ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate(`/student/apply/${scheme.id}`)}
              >
                Apply for this Scheme
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                disabled
              >
                Cannot Apply (Ineligible)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Eligibility Status Alert */}
      {eligibility.isEligible ? (
        <Alert type="success" title="You are Eligible to Apply!">
          {eligibility.recommendation}
        </Alert>
      ) : eligibility.isBlockedByOneScholarshipRule ? (
        <Alert type="warning" title="Application Blocked: One-Scholarship Rule">
          {eligibility.recommendation}
        </Alert>
      ) : (
        <Alert type="error" title="Criteria Incomplete">
          {eligibility.recommendation}
        </Alert>
      )}

      {/* Main Grid: Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Benefits */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Scheme Overview & Scope" icon={<FileText className="w-5 h-5" />} />
            <CardBody className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>{scheme.fullDescription || scheme.shortDescription}</p>
              
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-teal-800" />
                  <span>Financial Assistance Breakdown</span>
                </h4>
                <p className="text-slate-800 font-medium">
                  {scheme.financialAssistance}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Benefits & Coverage Breakdown" icon={<GraduationCap className="w-5 h-5" />} />
            <CardBody>
              <ul className="space-y-2.5">
                {scheme.benefits.map((benefit: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">{benefit.title}: </span>
                      <span>{benefit.amountOrDescription}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Mandatory Verification Documents" icon={<ShieldCheck className="w-5 h-5" />} />
            <CardBody>
              <p className="text-xs text-slate-500 mb-3">
                All documents can be fetched directly from your linked DigiLocker Document Wallet with zero manual photocopying.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scheme.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-2.5 text-xs font-medium text-slate-800">
                    <FileText className="w-4 h-4 text-teal-800 flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right 1 Col: Key Metadata & Deadlines */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Key Specifications" />
            <CardBody className="space-y-4 text-xs divide-y divide-slate-100">
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-500">Target Academic Level:</span>
                <span className="font-bold text-slate-800">{scheme.targetAudience}</span>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500">Annual Income Ceiling:</span>
                <span className="font-bold text-slate-800">
                  {scheme.maxAnnualIncome > 0 ? `≤ ₹${(scheme.maxAnnualIncome / 100000).toFixed(1)} Lakh` : 'No Income Limit'}
                </span>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500">Beneficiary Criteria:</span>
                <span className="font-bold text-teal-800">Scheduled Tribe (ST)</span>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500">Centre : State Sharing:</span>
                <span className="font-bold text-slate-800">{scheme.fundingType}</span>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <span className="text-slate-500">Application Deadline:</span>
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{scheme.applicationDeadline}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* DigiLocker Notice */}
          <div className="p-4 bg-teal-50/80 rounded-xl border border-teal-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>DigiLocker Seamless Apply</span>
            </div>
            <p className="text-teal-800/90 leading-relaxed">
              Your ST Certificate and Aadhaar are already in your wallet. When applying, you can import them with one click.
            </p>
            <Link to="/student/documents" className="font-bold text-teal-900 underline block pt-1">
              Manage Document Wallet →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
