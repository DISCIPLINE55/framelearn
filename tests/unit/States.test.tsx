import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadingState } from '../../src/components/ui/LoadingState';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ErrorState } from '../../src/components/ui/ErrorState';

describe('Application Feedback States', () => {
  it('renders LoadingState with accessible loading status', () => {
    render(<LoadingState title="Loading Test" />);
    expect(screen.getByText('Loading Test')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders EmptyState with custom CTA', () => {
    const handleAction = vi.fn();
    render(<EmptyState title="Empty Test" actionLabel="Create Item" onAction={handleAction} />);
    const ctaBtn = screen.getByRole('button', { name: /create item/i });
    expect(ctaBtn).toBeInTheDocument();
    fireEvent.click(ctaBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders ErrorState with retry trigger', () => {
    const handleRetry = vi.fn();
    render(<ErrorState title="Error Occurred" onRetry={handleRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
