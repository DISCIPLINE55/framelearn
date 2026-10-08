import React from 'react';
import { StateProps } from '../../types';
import { cn } from '../../utils/cn';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps extends StateProps {
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No content available',
  message = 'There are currently no items to display in this view.',
  actionLabel,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-frame border-2 border-dashed border-navy-800 min-h-[260px]',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-navy font-bold border-2 border-navy-800 mb-4 shadow-subtle">
        {icon || <FolderOpen className="w-7 h-7 text-navy stroke-[2.5]" />}
      </div>
      <h4 className="text-h3 font-display font-bold text-navy mb-1.5">{title}</h4>
      <p className="text-body font-medium text-navy-900 max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
