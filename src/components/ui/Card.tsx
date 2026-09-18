import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  onClick,
  hoverEffect = false
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs transition-all ${
        hoverEffect ? 'hover:border-teal-600/40 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}> = ({ title, subtitle, action, className = '', icon }) => (
  <div className={`p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 ${className}`}>
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5 text-teal-800">{icon}</div>}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export const CardBody: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => <div className={`p-5 sm:p-6 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`p-4 sm:px-6 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-3 ${className}`}>
    {children}
  </div>
);
