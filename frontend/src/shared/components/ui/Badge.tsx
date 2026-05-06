import type { HTMLAttributes } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-primary-50 text-primary-700 ring-primary-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-600/20',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-primary-500',
  neutral: 'bg-slate-500',
};

export default function Badge({ className = '', variant = 'neutral', dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1 rounded-full
        text-xs font-medium
        ring-1 ring-inset
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />
      )}
      {children}
    </span>
  );
}