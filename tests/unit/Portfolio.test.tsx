import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PortfolioGallery } from '../../src/features/portfolio/components/PortfolioGallery';
import { ToastProvider } from '../../src/app/providers/ToastContext';

describe('Interactive Portfolio Feature', () => {
  const renderPortfolio = () => {
    return render(
      <ToastProvider>
        <PortfolioGallery />
      </ToastProvider>
    );
  };

  it('renders category filter buttons with all 6 photography disciplines plus All', () => {
    renderPortfolio();

    expect(screen.getByRole('button', { name: /All Works/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Portraits/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Graduation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Weddings & Events/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Outdoor Photography/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Birthdays & Occasions/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Product Photography/i })).toBeInTheDocument();
  });

  it('filters items when selecting a specific category and marks active state', () => {
    renderPortfolio();

    const portraitsBtn = screen.getByRole('button', { name: /Portraits/i });
    expect(portraitsBtn).toHaveAttribute('aria-pressed', 'false');

    // Click Portraits
    fireEvent.click(portraitsBtn);
    expect(portraitsBtn).toHaveAttribute('aria-pressed', 'true');

    // Check that Portrait photos are visible
    expect(screen.getByRole('button', { name: /Studio Lighting Portrait/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Golden Hour Environmental Portrait/i })).toBeInTheDocument();

    // Check that Wedding photos are not in the filtered grid
    expect(screen.queryByRole('button', { name: /Ceremony Ring Exchange/i })).not.toBeInTheDocument();
  });

  it('allows restoring the full gallery view via reset action', () => {
    renderPortfolio();

    const productBtn = screen.getByRole('button', { name: /Product Photography/i });
    fireEvent.click(productBtn);

    const resetBtn = screen.getByRole('button', { name: /Reset to All Works/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);

    // Full gallery restored
    const allBtn = screen.getByRole('button', { name: /All Works/i });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Studio Lighting Portrait/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ceremony Ring Exchange/i })).toBeInTheDocument();
  });

  it('opens accessible Lightbox modal upon clicking a portfolio photo card', () => {
    renderPortfolio();

    const itemCard = screen.getByRole('button', { name: /Open preview for Studio Lighting Portrait/i });
    fireEvent.click(itemCard);

    // Lightbox modal should be present
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Title and technical metadata
    expect(screen.getByRole('heading', { name: 'Studio Lighting Portrait' })).toBeInTheDocument();
    expect(screen.getByText(/Sony Alpha 7 IV/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio Portrait Session/i)).toBeInTheDocument();
  });

  it('navigates next and previous photos in the Lightbox and closes on Escape', () => {
    renderPortfolio();

    // Open first item
    const itemCard = screen.getByRole('button', { name: /Open preview for Studio Lighting Portrait/i });
    fireEvent.click(itemCard);

    expect(screen.getByRole('heading', { name: 'Studio Lighting Portrait' })).toBeInTheDocument();

    // Click Next button
    const nextBtn = screen.getByLabelText('Next photo');
    fireEvent.click(nextBtn);

    // Now showing second photo (Golden Hour Environmental Portrait)
    expect(screen.getByRole('heading', { name: 'Golden Hour Environmental Portrait' })).toBeInTheDocument();

    // Keyboard ArrowLeft to navigate back
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByRole('heading', { name: 'Studio Lighting Portrait' })).toBeInTheDocument();

    // Keyboard Escape to close Lightbox
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
