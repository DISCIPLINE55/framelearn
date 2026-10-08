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
            className="text-small font-semibold text-navy flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-700">*</span>}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3.5 text-navy-600 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              'h-11 w-full rounded-frame border bg-white px-3.5 py-2 text-body text-navy placeholder:text-navy-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage',
              'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError
                ? 'border-red-600 focus:ring-red-500 focus:border-red-600'
                : 'border-sage-300 hover:border-navy-400',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-navy-600 pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {hasError && (
          <p className="text-caption text-red-700 font-medium">{errorText}</p>
        )}
        {!hasError && helperText && (
          <p className="text-caption text-navy-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
