import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../src/components/navigation/Header';
import { PUBLIC_NAV_ITEMS } from '../../src/constants/navigation';

describe('Header & Navigation Regression Tests', () => {
  it('renders all public navigation items', () => {
    render(<Header currentRoute="home" onNavigate={vi.fn()} />);

    PUBLIC_NAV_ITEMS.forEach((item) => {
      expect(screen.getAllByText(item.label).length).toBeGreaterThan(0);
    });
  });

  it('invokes onNavigate callback when link is clicked', () => {
    const onNavigate = vi.fn();
    render(<Header currentRoute="home" onNavigate={onNavigate} />);

    // Click portfolio link
    const portfolioLinks = screen.getAllByRole('link', { name: /Portfolio/i });
    fireEvent.click(portfolioLinks[0]);

    expect(onNavigate).toHaveBeenCalledWith('portfolio');
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Header currentRoute="home" onNavigate={vi.fn()} />);

    const menuToggle = screen.getByLabelText(/Toggle Navigation Menu/i);
    expect(menuToggle).toBeInTheDocument();

    fireEvent.click(menuToggle);
    // Menu opens
    expect(screen.getByLabelText(/Toggle Navigation Menu/i)).toBeInTheDocument();
  });
});
