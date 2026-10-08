import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../src/components/ui/Badge';

describe('Badge Component', () => {
  it('renders badge text with sage green brand styling', () => {
    render(<Badge variant="sage">Sage Tag</Badge>);
    const badge = screen.getByText('Sage Tag');
    expect(badge).toBeInTheDocument();
    expect(badge.parentElement).toHaveClass('badge-sage');
  });
});
