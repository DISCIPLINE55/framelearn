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
            className="text-small font-bold text-navy flex items-center gap-1"
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
            'w-full rounded-frame border-2 bg-white px-3.5 py-2.5 text-body font-medium text-navy placeholder:text-navy-800/60 transition-colors resize-y',
            'focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage',
            'disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60',
            hasError
              ? 'border-red-700 focus:ring-red-600 focus:border-red-700'
              : 'border-sage-400 hover:border-navy-800',
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
