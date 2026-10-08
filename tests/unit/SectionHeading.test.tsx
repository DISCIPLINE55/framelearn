import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeading } from '../../src/components/ui/SectionHeading';

describe('SectionHeading Component', () => {
  it('renders eyebrow badge, title, and subtitle correctly', () => {
    render(
      <SectionHeading
        eyebrow="Eyebrow Text"
        title="Main Section Title"
        subtitle="Subtitle explanation"
      />
    );
    expect(screen.getByText('Eyebrow Text')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Main Section Title' })).toBeInTheDocument();
    expect(screen.getByText('Subtitle explanation')).toBeInTheDocument();
  });
});
