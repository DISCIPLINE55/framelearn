import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('renders correctly with title, message, and accessible attributes when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Delete Photo Session?"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmLabel="Confirm Delete"
        cancelLabel="Keep Session"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Delete Photo Session?')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this session? This action cannot be undone.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm Delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep Session' })).toBeInTheDocument();
  });

  it('invokes onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Proceed with changes?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('invokes onCancel when cancel button or close button is clicked', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Proceed with changes?"
        cancelLabel="Discard"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: 'Discard' });
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);

    // Also test close X button
    rerender(
      <ConfirmDialog
        isOpen={true}
        title="Confirm Action"
        message="Proceed with changes?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('invokes onCancel when Escape key is pressed', () => {
    const onCancel = vi.fn();

    render(
      <ConfirmDialog
        isOpen={true}
        title="Escape Key Test"
        message="Press Escape to cancel."
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
