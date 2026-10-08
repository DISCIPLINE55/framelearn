import React, { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      options,
      fullWidth = true,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const hasError = Boolean(errorText);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-small font-bold text-navy flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-700">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={cn(
              'h-11 w-full rounded-frame border-2 bg-white px-3.5 py-2 pr-10 text-body font-medium text-navy transition-colors appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage',
              'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60',
              hasError
                ? 'border-red-700 focus:ring-red-600 focus:border-red-700'
                : 'border-sage-400 hover:border-navy-800',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="text-navy font-medium">
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 text-navy-800 pointer-events-none flex items-center">
            <ChevronDown className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>

        {hasError && (
          <p className="text-caption text-red-700 font-bold">{errorText}</p>
        )}
        {!hasError && helperText && (
          <p className="text-caption text-navy-800 font-medium">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
