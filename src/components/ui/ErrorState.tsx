import React from 'react';
import { StateProps } from '../../types';
import { cn } from '../../utils/cn';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps extends StateProps {
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An unexpected error occurred',
  message = 'We were unable to load the requested information. Please try again or contact support if the issue persists.',
  actionLabel = 'Try Again',
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-red-50 rounded-frame border-2 border-red-300 min-h-[260px]',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-800 mb-4 shadow-subtle border border-red-300">
        <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
      </div>
      <h4 className="text-h3 font-display font-bold text-navy mb-1.5">{title}</h4>
      <p className="text-body font-medium text-navy-950 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4 stroke-[2.5]" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
