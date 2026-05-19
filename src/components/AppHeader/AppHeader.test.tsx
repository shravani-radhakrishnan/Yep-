import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppHeader from '.';

describe('AppHeader', () => {
  it('renders the Yep! logo text', () => {
    render(<AppHeader />);
    expect(screen.getByText('Yep')).toBeInTheDocument();
    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<AppHeader />);
    expect(screen.getByText(/stop overthinking/i)).toBeInTheDocument();
  });
});
