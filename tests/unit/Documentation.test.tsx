import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DocumentationHub } from '../../src/features/docs/DocumentationHub';
import { DOCUMENTATION_REGISTRY } from '../../src/features/docs/docsData';
import { ToastProvider } from '../../src/app/providers/ToastContext';

describe('Central Documentation Hub', () => {
  const renderDocs = () => {
    return render(
      <ToastProvider>
        <DocumentationHub />
      </ToastProvider>
    );
  };

  it('contains all 14 required authoritative specifications in registry', () => {
    expect(DOCUMENTATION_REGISTRY.length).toBe(14);

    const filenames = DOCUMENTATION_REGISTRY.map((d) => d.filename);
    expect(filenames).toContain('docs/README.md');
    expect(filenames).toContain('docs/PROJECT_OVERVIEW.md');
    expect(filenames).toContain('docs/REQUIREMENTS.md');
    expect(filenames).toContain('docs/DEVELOPMENT_ROADMAP.md');
    expect(filenames).toContain('docs/IMPLEMENTATION_LOG.md');
    expect(filenames).toContain('docs/ARCHITECTURE.md');
    expect(filenames).toContain('docs/DESIGN_SYSTEM.md');
    expect(filenames).toContain('docs/NOTIFICATION_STANDARD.md');
    expect(filenames).toContain('docs/DATABASE_DESIGN.md');
    expect(filenames).toContain('docs/SECURITY_AND_PRIVACY.md');
    expect(filenames).toContain('docs/TESTING_AND_QA.md');
    expect(filenames).toContain('docs/COST_AND_BUDGET.md');
    expect(filenames).toContain('docs/DECISION_LOG.md');
    expect(filenames).toContain('docs/LECTURER_REVIEW_LOG.md');
  });

  it('renders documentation hub UI with document list and active reader', () => {
    renderDocs();

    expect(screen.getByRole('heading', { name: 'Central Documentation Hub' })).toBeInTheDocument();
    expect(screen.getByText(/14 Authoritative Documents/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search specifications...')).toBeInTheDocument();
  });

  it('allows selecting a document and displaying its content in the reader', () => {
    renderDocs();

    // Click Notification Standard document button
    const notifBtn = screen.getByRole('button', { name: /7\. Notification Standard/i });
    fireEvent.click(notifBtn);

    // Verify active heading and content
    expect(screen.getByRole('heading', { name: '7. Notification Standard' })).toBeInTheDocument();
    expect(screen.getByText('docs/NOTIFICATION_STANDARD.md')).toBeInTheDocument();
    expect(screen.getByText(/Zero Browser-Native Dialog Rule/i)).toBeInTheDocument();
  });

  it('filters documents by search query', () => {
    renderDocs();

    const searchInput = screen.getByPlaceholderText('Search specifications...');
    fireEvent.change(searchInput, { target: { value: 'Budget' } });

    expect(screen.getByText(/11\. Development Costs & Budget/i)).toBeInTheDocument();
    expect(screen.queryByText(/7\. Notification Standard/i)).not.toBeInTheDocument();
  });

  it('triggers copy and export functions', async () => {
    renderDocs();

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    const copyBtn = screen.getByRole('button', { name: /Copy markdown/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Verify export buttons exist
    expect(screen.getByRole('button', { name: /Download markdown document/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Complete Bundle/i })).toBeInTheDocument();
  });
});
