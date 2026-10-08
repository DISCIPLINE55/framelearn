import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  eyebrow,
  title,
  subtitle,
  align = 'left',
  dark = false,
  ...props
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 max-w-3xl mb-8',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {eyebrow && (
        <span
          className={cn(
            'text-caption font-bold tracking-widest px-3 py-1 rounded-full',
            dark
              ? 'bg-sage/20 text-sage'
              : 'bg-sage-100 text-navy-800 border border-sage-300'
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'text-h2 font-display font-bold leading-tight',
          dark ? 'text-cream' : 'text-navy'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'text-body-lg leading-relaxed',
            dark ? 'text-cream/80' : 'text-navy-700'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
