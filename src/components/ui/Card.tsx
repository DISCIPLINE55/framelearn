import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'soft' | 'navy' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-frame transition-shadow overflow-hidden';

  const variants = {
    default: 'bg-white border-2 border-sage-300 shadow-subtle hover:shadow-elevated',
    soft: 'bg-cream border-2 border-sage-400 shadow-subtle',
    navy: 'bg-navy text-cream border-2 border-navy-800 shadow-elevated',
    outline: 'bg-transparent border-2 border-sage-400',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 pb-3 flex flex-col gap-1', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3 className={cn('text-h3 text-navy font-display font-bold tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardSubtitle: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-small text-navy-800 font-medium', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-6 pt-2 text-body text-navy-900', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn(
      'p-6 pt-3 border-t-2 border-sage-300 bg-surface-light/60 flex items-center justify-between gap-4 text-navy-900 font-medium',
      className
    )}
    {...props}
  >
    {children}
  </div>
);
