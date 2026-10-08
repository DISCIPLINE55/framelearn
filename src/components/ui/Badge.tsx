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
    navy: 'bg-navy text-cream shadow-sm',
    sage: 'bg-sage text-navy font-bold shadow-sm',
    cream: 'bg-cream text-navy border-2 border-navy-800 font-bold',
    outline: 'border-2 border-navy text-navy bg-white font-bold',
  };

  const sizes: Record<ComponentSize, string> = {
    sm: 'px-2.5 py-0.5 text-caption',
    md: 'px-3 py-1 text-small',
    lg: 'px-4 py-1.5 text-body font-bold',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
