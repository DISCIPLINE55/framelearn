import React, { HTMLAttributes } from 'react';
import { BadgeVariant, ComponentSize } from '../../types';
import { cn } from '../../utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: ComponentSize;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'sage',
  size = 'md',
  icon,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-bold rounded-full tracking-wide transition-colors';

  const variants: Record<BadgeVariant, string> = {
    navy: 'bg-navy text-white shadow-sm',
    sage: 'bg-sage text-navy-950 shadow-sm',
    cream: 'bg-cream text-navy-950 border-2 border-navy-950',
    outline: 'border-2 border-navy-950 text-navy-950 bg-white',
  };

  const sizes: Record<ComponentSize, string> = {
    sm: 'px-2.5 py-0.5 text-caption',
    md: 'px-3 py-1 text-small',
    lg: 'px-4 py-1.5 text-body',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="text-current flex items-center">{icon}</span>}
      <span className="text-current">{children}</span>
    </span>
  );
};
