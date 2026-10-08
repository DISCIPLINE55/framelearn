import React, { ButtonHTMLAttributes } from 'react';
import { ButtonVariant, ComponentSize } from '../../types';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ComponentSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:pointer-events-none disabled:opacity-50 rounded-frame active:scale-[0.98]';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-navy text-cream hover:bg-navy-800 shadow-subtle',
      secondary: 'bg-sage text-navy hover:bg-sage-600 font-semibold shadow-subtle',
      outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-cream',
      ghost: 'text-navy hover:bg-sage-100 hover:text-navy-900',
      danger: 'bg-red-800 text-white hover:bg-red-900',
    };

    const sizes: Record<ComponentSize, string> = {
      sm: 'h-9 px-3.5 text-small gap-1.5',
      md: 'h-11 px-5 text-body gap-2',
      lg: 'h-13 px-7 text-body-lg gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
