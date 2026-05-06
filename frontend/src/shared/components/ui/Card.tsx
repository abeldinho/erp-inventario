import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const variantStyles: Record<string, string> = {
  default: 'bg-white shadow-card',
  bordered: 'bg-white border border-slate-200',
  elevated: 'bg-white shadow-card-hover',
};

const paddingStyles: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl transition-all duration-200
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;