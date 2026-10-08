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
    'inline-flex items-center gap-1.5 font-bold rounded-full tracking-wide transition-colors shadow-xs';

  const variants: Record<BadgeVariant, string> = {
    navy: 'badge-navy',
    sage: 'badge-sage',
    cream: 'badge-cream',
    outline: 'badge-outline',
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
