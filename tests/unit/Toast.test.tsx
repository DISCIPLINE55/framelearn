import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Toast } from '../../src/components/ui/Toast';
import { ToastItem } from '../../src/types';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders success toast with accessible role="status" and polite live region', () => {
    const toast: ToastItem = {
      id: '1',
      type: 'success',
      message: 'Operation completed successfully.',
      createdAt: Date.now(),
    };
    const onDismiss = vi.fn();

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    const toastEl = screen.getByTestId('toast-success');
    expect(toastEl).toBeInTheDocument();
    expect(toastEl).toHaveAttribute('role', 'status');
    expect(toastEl).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
  });

  it('renders error toast with role="alert" and assertive live region', () => {
    const toast: ToastItem = {
      id: '2',
      type: 'error',
      title: 'Action Failed',
      message: 'Could not connect to service.',
      createdAt: Date.now(),
    };
    const onDismiss = vi.fn();

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    const toastEl = screen.getByTestId('toast-error');
    expect(toastEl).toBeInTheDocument();
    expect(toastEl).toHaveAttribute('role', 'alert');
    expect(toastEl).toHaveAttribute('aria-live', 'assertive');
    expect(screen.getByText('Action Failed')).toBeInTheDocument();
    expect(screen.getByText('Could not connect to service.')).toBeInTheDocument();
  });

  it('renders warning, info, and loading toast types with appropriate semantic roles', () => {
    const onDismiss = vi.fn();

    const warningToast: ToastItem = {
      id: '3',
      type: 'warning',
      message: 'Caution: unsaved data.',
      createdAt: Date.now(),
    };
    const { rerender } = render(<Toast toast={warningToast} onDismiss={onDismiss} />);
    expect(screen.getByTestId('toast-warning')).toHaveAttribute('role', 'alert');

    const infoToast: ToastItem = {
      id: '4',
      type: 'info',
      message: 'New documentation available.',
      createdAt: Date.now(),
    };
    rerender(<Toast toast={infoToast} onDismiss={onDismiss} />);
    expect(screen.getByTestId('toast-info')).toHaveAttribute('role', 'status');

    const loadingToast: ToastItem = {
      id: '5',
      type: 'loading',
      message: 'Processing request...',
      createdAt: Date.now(),
    };
    rerender(<Toast toast={loadingToast} onDismiss={onDismiss} />);
    expect(screen.getByTestId('toast-loading')).toHaveAttribute('role', 'status');
  });

  it('calls onDismiss when close button is clicked', () => {
    const toast: ToastItem = {
      id: 'click-dismiss',
      type: 'info',
      message: 'Dismissible notification.',
      createdAt: Date.now(),
    };
    const onDismiss = vi.fn();

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    const closeBtn = screen.getByLabelText('Dismiss notification');
    fireEvent.click(closeBtn);
    expect(onDismiss).toHaveBeenCalledWith('click-dismiss');
  });

  it('auto-dismisses after duration expires', () => {
    const toast: ToastItem = {
      id: 'timer-test',
      type: 'success',
      message: 'Auto dismiss me.',
      duration: 3000,
      createdAt: Date.now(),
    };
    const onDismiss = vi.fn();

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onDismiss).toHaveBeenCalledWith('timer-test');
  });

  it('pauses dismissal timer on mouse enter and resumes on mouse leave', () => {
    const toast: ToastItem = {
      id: 'pause-test',
      type: 'warning',
      message: 'Hover to pause.',
      duration: 4000,
      createdAt: Date.now(),
    };
    const onDismiss = vi.fn();

    render(<Toast toast={toast} onDismiss={onDismiss} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    // Hover mouse to pause
    const toastEl = screen.getByTestId('toast-warning');
    fireEvent.mouseEnter(toastEl);

    // Advance time while hovered
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    // Mouse leave to resume
    fireEvent.mouseLeave(toastEl);

    // Remaining time (~2000ms)
    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(onDismiss).toHaveBeenCalledWith('pause-test');
  });
});
