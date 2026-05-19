import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Item } from '../../lib/types';
import PickModal from '.';

const item: Item = {
  id: 'm1',
  name: 'Dune: Part Two',
  rating: '⭐ 8.5 / 10',
  detail: 'Sci-Fi · 2h 46m · 2024',
  status: 'new',
  picks: 1,
};

const defaultProps = {
  item,
  categoryLabel: 'Movies',
  onFeedback: vi.fn(),
  onClose: vi.fn(),
  onReroll: vi.fn(),
};

describe('PickModal — visibility', () => {
  it('has show class when item is not null', () => {
    const { container } = render(<PickModal {...defaultProps} />);
    expect(container.firstChild).toHaveClass('show');
  });

  it('does not have show class when item is null', () => {
    const { container } = render(<PickModal {...defaultProps} item={null} />);
    expect(container.firstChild).not.toHaveClass('show');
  });
});

describe('PickModal — content', () => {
  it('renders the item name', () => {
    render(<PickModal {...defaultProps} />);
    expect(screen.getByText('Dune: Part Two')).toBeInTheDocument();
  });

  it('renders the rating', () => {
    render(<PickModal {...defaultProps} />);
    expect(screen.getByText('⭐ 8.5 / 10')).toBeInTheDocument();
  });

  it('renders the detail', () => {
    render(<PickModal {...defaultProps} />);
    expect(screen.getByText('Sci-Fi · 2h 46m · 2024')).toBeInTheDocument();
  });

  it('shows "First time picking this" when picks = 1', () => {
    render(<PickModal {...defaultProps} />);
    expect(screen.getByText(/First time picking this/)).toBeInTheDocument();
  });

  it('shows suggested count when picks > 1', () => {
    render(<PickModal {...defaultProps} item={{ ...item, picks: 5 }} />);
    expect(screen.getByText(/Suggested 5×/)).toBeInTheDocument();
  });

  it('renders the category label in uppercase', () => {
    render(<PickModal {...defaultProps} categoryLabel="Movies" />);
    expect(screen.getByText('MOVIES')).toBeInTheDocument();
  });
});

describe('PickModal — interactions', () => {
  it('calls onFeedback("done") when Yes button is clicked', async () => {
    const onFeedback = vi.fn();
    render(<PickModal {...defaultProps} onFeedback={onFeedback} />);
    await userEvent.click(screen.getByText(/Yes, we did/));
    expect(onFeedback).toHaveBeenCalledWith('done');
  });

  it('calls onFeedback("skip") when Nope button is clicked', async () => {
    const onFeedback = vi.fn();
    render(<PickModal {...defaultProps} onFeedback={onFeedback} />);
    await userEvent.click(screen.getByText(/Nope, skipped/));
    expect(onFeedback).toHaveBeenCalledWith('skip');
  });

  it('calls onClose when Remind me later is clicked', async () => {
    const onClose = vi.fn();
    render(<PickModal {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByText(/Remind me later/));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onReroll when Pick something else is clicked', async () => {
    const onReroll = vi.fn();
    render(<PickModal {...defaultProps} onReroll={onReroll} />);
    await userEvent.click(screen.getByText(/PICK SOMETHING ELSE/));
    expect(onReroll).toHaveBeenCalled();
  });
});
