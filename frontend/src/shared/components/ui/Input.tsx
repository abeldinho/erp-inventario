import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5
            bg-white border rounded-lg
            text-slate-900 placeholder:text-slate-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-slate-200 focus:border-primary-500'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;