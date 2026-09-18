import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { ApplicationStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { getTranslatedStatus } from '../../utils/statusTranslation';

interface TimelineStep {
  status: ApplicationStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

interface TimelineViewProps {
  timeline: TimelineStep[];
  currentStatus: ApplicationStatus;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, currentStatus }) => {
  const { t } = useLanguage();

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timeline.map((step, idx) => {
        const isCurrent = step.status === currentStatus;
        const isCompleted = step.completed;
        const isReviewFlag = step.status === 'Under Manual Review' || step.status === 'Deficiency Found';
        const displayLabel = getTranslatedStatus(step.status, t) || step.label;

        return (
          <div key={idx} className="relative group">
            {/* Dot Indicator */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? 'bg-teal-800 border-teal-800 text-white shadow-xs'
                  : isCurrent && isReviewFlag
                  ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                  : isCurrent
                  ? 'bg-white border-teal-800 text-teal-800 ring-4 ring-teal-100'
                  : 'bg-white border-slate-300 text-slate-300'
              }`}
            >
              {isCompleted ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              ) : isReviewFlag && isCurrent ? (
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>

            {/* Step Content */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-white border-teal-700/40 shadow-sm ring-1 ring-teal-700/10'
                  : isCompleted
                  ? 'bg-slate-50/70 border-slate-200/80'
                  : 'bg-stone-50/40 border-slate-200/50 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>{displayLabel}</span>
                  {isCurrent && (
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                      isReviewFlag ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-teal-100 text-teal-900'
                    }`}>
                      {t('apps.statusLabel', 'Current Stage')}
                    </span>
                  )}
                </h4>
                <span className="text-xs font-medium text-slate-400 font-mono">
                  {step.timestamp}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
