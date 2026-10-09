import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BackToTop } from '../../src/components/navigation/BackToTop';

describe('BackToTop Component', () => {
  beforeEach(() => {
    // Reset window scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    // Mock matchMedia for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('remains hidden when page scroll is below threshold', () => {
    render(<BackToTop threshold={300} />);
    const button = screen.queryByRole('button', { name: /back to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('renders and becomes visible when scroll exceeds threshold', () => {
    render(<BackToTop threshold={300} />);
    window.scrollY = 400;
    fireEvent.scroll(window);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  it('triggers window.scrollTo when clicked', () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;
    render(<BackToTop threshold={300} />);
    window.scrollY = 400;
    fireEvent.scroll(window);
    const button = screen.getByRole('button', { name: /back to top/i });
    fireEvent.click(button);
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
