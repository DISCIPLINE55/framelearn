import React from 'react';
import { StateProps } from '../../types';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps extends StateProps {
  variant?: 'spinner' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading content...',
  message = 'Please wait while we prepare your information.',
  variant = 'spinner',
  className,
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={cn('w-full flex flex-col gap-4 p-6 bg-white rounded-frame border-2 border-sage-300 animate-pulse', className)}>
        <div className="h-6 bg-sage-200 rounded-md w-1/3" />
        <div className="h-4 bg-sage-200/80 rounded-md w-2/3" />
        <div className="h-24 bg-sage-100 rounded-frame w-full mt-2" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-8 bg-sage-200 rounded-frame w-24" />
          <div className="h-8 bg-sage-200 rounded-frame w-32" />
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center bg-white rounded-frame border-2 border-sage-300 min-h-[220px]',
        className
      )}
    >
      <Loader2 className="w-10 h-10 text-sage stroke-[2.5] animate-spin mb-4" />
      <h4 className="text-h3 font-display font-bold text-navy mb-1">{title}</h4>
      <p className="text-body font-medium text-navy-900 max-w-md">{message}</p>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
