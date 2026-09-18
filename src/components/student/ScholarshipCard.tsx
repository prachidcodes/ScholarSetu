import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Banknote,
  ShieldAlert
} from 'lucide-react';
import { ScholarshipScheme, UserProfile } from '../../types';
import { scholarshipService } from '../../services/scholarshipService';
import { Badge } from '../ui/Badge';
import { Card, CardBody, CardFooter } from '../ui/Card';

interface ScholarshipCardProps {
  scheme: ScholarshipScheme;
  user: UserProfile | null;
  applicationStatus?: string;
  applicationId?: string;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scheme,
  user,
  applicationStatus,
  applicationId
}) => {
  const eligibility = scholarshipService.checkEligibility(scheme, user);

  const getFundingBadge = (funding: string) => {
    switch (funding) {
      case '100% Central':
        return <Badge variant="saffron" size="sm">100% Central</Badge>;
      case '60:40 Centre-State':
        return <Badge variant="neutral" size="sm">60:40 Centre-State</Badge>;
      default:
        return <Badge variant="info" size="sm">Centrally Sponsored</Badge>;
    }
  };

  return (
    <Card className="flex flex-col h-full hover:border-teal-700/50 hover:shadow-md transition-all">
      <CardBody className="flex-1 flex flex-col p-5 sm:p-6">
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            {scheme.code}
          </span>
          {getFundingBadge(scheme.fundingType)}
        </div>

        {/* Scheme Title */}
        <h3 className="font-display font-bold text-lg text-slate-900 leading-snug mb-2 group-hover:text-teal-800 transition-colors">
          {scheme.name}
        </h3>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 flex-1 line-clamp-3">
          {scheme.shortDescription}
        </p>

        {/* Financial assistance highlight */}
        <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/80 mb-4">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-xs mb-1">
            <Banknote className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Financial Assistance:</span>
          </div>
          <p className="text-xs text-slate-800 font-medium line-clamp-2">
            {scheme.financialAssistance}
          </p>
        </div>

        {/* Eligibility & One-Scholarship Policy Status */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Your Eligibility:</span>
            {eligibility.isEligible ? (
              <Badge variant="success" size="sm" dot>
                Eligible
              </Badge>
            ) : eligibility.isBlockedByOneScholarshipRule ? (
              <Badge variant="warning" size="sm" dot>
                Blocked (Rule)
              </Badge>
            ) : (
              <Badge variant="error" size="sm" dot>
                Not Eligible
              </Badge>
            )}
          </div>

          {/* If already applied, show current application badge */}
          {applicationStatus && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Current Status:</span>
              <Badge 
                variant={
                  applicationStatus === 'Disbursed' ? 'success' :
                  applicationStatus === 'Sanctioned' ? 'purple' :
                  applicationStatus === 'Under Manual Review' || applicationStatus === 'Deficiency Found' ? 'warning' : 'info'
                }
                size="sm"
              >
                {applicationStatus}
              </Badge>
            </div>
          )}

          {/* Income ceiling */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Income Ceiling:</span>
            <span className="font-semibold text-slate-700">
              {scheme.maxAnnualIncome > 0 ? `≤ ₹${(scheme.maxAnnualIncome / 100000).toFixed(1)} Lakh/yr` : 'No Income Limit'}
            </span>
          </div>
        </div>

        {/* One Scholarship Rule explanation notice if blocked */}
        {eligibility.isBlockedByOneScholarshipRule && (
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] leading-tight flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>One-Scholarship Rule: You cannot avail this while enrolled in {eligibility.activeSchemeName}.</span>
          </div>
        )}
      </CardBody>

      <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/student/scholarships/${scheme.id}`}
          className="text-xs font-semibold text-slate-600 hover:text-teal-800 transition-colors"
        >
          View Details
        </Link>

        {applicationId ? (
          <Link
            to={`/student/applications/${applicationId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-colors shadow-xs"
          >
            <span>Track Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : eligibility.isEligible ? (
          <Link
            to={`/student/apply/${scheme.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-colors shadow-xs"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            disabled
            title={eligibility.recommendation}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-500 text-xs font-semibold cursor-not-allowed"
          >
            <span>Apply Now</span>
          </button>
        )}
      </CardFooter>
    </Card>
  );
};
