import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const hasError = Boolean(errorText);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-small font-bold text-navy flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-700">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-navy-800 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              'h-11 w-full rounded-frame border-2 bg-white px-3.5 py-2 text-body font-medium text-navy placeholder:text-navy-800/60 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage',
              'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError
                ? 'border-red-700 focus:ring-red-600 focus:border-red-700'
                : 'border-sage-400 hover:border-navy-800',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-navy-800 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';
