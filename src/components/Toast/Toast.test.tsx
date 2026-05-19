import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Toast from '.';

describe('Toast', () => {
  it('renders the message text', () => {
    render(<Toast message="Item added!" />);
    expect(screen.getByText('Item added!')).toBeInTheDocument();
  });

  it('has the show class when message is non-empty', () => {
    const { container } = render(<Toast message="Hello" />);
    expect(container.firstChild).toHaveClass('show');
  });

  it('does not have the show class when message is empty', () => {
    const { container } = render(<Toast message="" />);
    expect(container.firstChild).not.toHaveClass('show');
  });
});
