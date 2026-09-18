import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'neutral' 
  | 'purple'
  | 'saffron';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500'
    },
    warning: {
      container: 'bg-amber-50 text-amber-900 border-amber-200/80',
      dot: 'bg-amber-500'
    },
    error: {
      container: 'bg-rose-50 text-rose-800 border-rose-200/80',
      dot: 'bg-rose-500'
    },
    info: {
      container: 'bg-sky-50 text-sky-800 border-sky-200/80',
      dot: 'bg-sky-500'
    },
    purple: {
      container: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      dot: 'bg-indigo-500'
    },
    saffron: {
      container: 'bg-orange-50 text-orange-900 border-orange-200/80',
      dot: 'bg-orange-500'
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400'
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap transition-colors ${sizeStyles[size]} ${variantStyles[variant].container} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${variantStyles[variant].dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
