import React, { TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      fullWidth = true,
      id,
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
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

        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full rounded-frame border bg-white px-3.5 py-2.5 text-body text-navy placeholder:text-navy-400 transition-colors resize-y',
            'focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage',
            'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60',
            hasError
              ? 'border-red-600 focus:ring-red-500 focus:border-red-600'
              : 'border-sage-300 hover:border-navy-400',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
