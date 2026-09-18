import React from 'react';
import { CheckCircle2, Landmark, ArrowUpRight, ShieldCheck, Banknote } from 'lucide-react';
import { DbtDisbursementDetails } from '../../types';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface DisbursementCardProps {
  details: DbtDisbursementDetails;
  schemeName: string;
}

export const DisbursementCard: React.FC<DisbursementCardProps> = ({
  details,
  schemeName
}) => {
  return (
    <Card className="border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 via-white to-stone-50 overflow-hidden shadow-xs">
      <CardBody className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                  Direct Benefit Transfer (DBT)
                </span>
                <Badge variant="success" size="sm" dot>
                  Credited
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                ₹{details.amount.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          <div className="text-right sm:text-right text-xs">
            <span className="text-slate-400 block text-[11px]">Disbursed On</span>
            <span className="font-semibold text-slate-800">{details.disbursedDate}</span>
          </div>
        </div>

        {/* Banking and PFMS breakdown grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block mb-0.5">Beneficiary Bank</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Landmark className="w-3.5 h-3.5 text-teal-800" />
              <span>{details.bankName}</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              A/c: {details.accountNumberMasked}
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[11px] block mb-0.5">PFMS Reference</span>
            <span className="font-mono font-bold text-slate-800 break-all">
              {details.transactionReference}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
              Mode: Aadhaar Payment Bridge (APBS)
            </span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200/80 flex flex-col justify-center">
            <div className="flex items-center gap-1 text-emerald-700 font-semibold mb-0.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Ministry Verified</span>
            </div>
            <span className="text-[11px] text-slate-500 leading-tight">
              100% direct central subsidy with zero intermediary deduction.
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
