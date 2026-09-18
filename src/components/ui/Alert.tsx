import React, { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  action,
  className = ''
}) => {
  const configs: Record<AlertType, { bg: string; border: string; text: string; icon: ReactNode }> = {
    info: {
      bg: 'bg-sky-50/80',
      border: 'border-sky-200',
      text: 'text-sky-900',
      icon: <Info className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
    },
    success: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
    },
    warning: {
      bg: 'bg-amber-50/90',
      border: 'border-amber-300',
      text: 'text-amber-950',
      icon: <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
    },
    error: {
      bg: 'bg-rose-50/80',
      border: 'border-rose-200',
      text: 'text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
    }
  };

  const config = configs[type];

  return (
    <div className={`p-4 rounded-xl border ${config.bg} ${config.border} ${className}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="flex-1 text-sm leading-relaxed">
          {title && <h4 className={`font-semibold mb-1 ${config.text}`}>{title}</h4>}
          <div className={`${config.text} opacity-90`}>{children}</div>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  );
};
