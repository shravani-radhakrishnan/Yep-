import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Item } from '../../lib/types';
import ItemCard from '.';

const base: Item = {
  id: 'i1',
  name: 'Oppenheimer',
  rating: '⭐ 8.9 / 10',
  detail: 'Biography · 3h · 2023',
  status: 'new',
  picks: 0,
};

describe('ItemCard — display', () => {
  it('renders the item name', () => {
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Oppenheimer')).toBeInTheDocument();
  });

  it('renders the rating', () => {
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('⭐ 8.9 / 10')).toBeInTheDocument();
  });

  it('renders the detail', () => {
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Biography · 3h · 2023')).toBeInTheDocument();
  });

  it('shows "fetching…" when loading is true', () => {
    render(<ItemCard item={base} loading={true} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('fetching…')).toBeInTheDocument();
  });

  it('hides rating while loading', () => {
    render(<ItemCard item={base} loading={true} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('⭐ 8.9 / 10')).not.toBeInTheDocument();
  });

  it('shows picks count when picks > 0', () => {
    render(<ItemCard item={{ ...base, picks: 4 }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('picked 4×')).toBeInTheDocument();
  });

  it('hides picks count when picks is 0', () => {
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText(/picked/)).not.toBeInTheDocument();
  });
});

describe('ItemCard — status badges', () => {
  it('shows "not tried" badge for new status', () => {
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('not tried')).toBeInTheDocument();
  });

  it('shows "done ✓" badge for done status', () => {
    render(<ItemCard item={{ ...base, status: 'done' }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('done ✓')).toBeInTheDocument();
  });

  it('shows "skipped" badge for skip status', () => {
    render(<ItemCard item={{ ...base, status: 'skip' }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('skipped')).toBeInTheDocument();
  });
});

describe('ItemCard — actions', () => {
  it('calls onMark(id, done) when ✓ button is clicked', async () => {
    const onMark = vi.fn();
    render(<ItemCard item={base} loading={false} onMark={onMark} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('✓'));
    expect(onMark).toHaveBeenCalledWith('i1', 'done');
  });

  it('calls onMark(id, skip) when ✕ button is clicked', async () => {
    const onMark = vi.fn();
    render(<ItemCard item={base} loading={false} onMark={onMark} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('✕'));
    expect(onMark).toHaveBeenCalledWith('i1', 'skip');
  });

  it('calls onDelete(id) when × button is clicked', async () => {
    const onDelete = vi.fn();
    render(<ItemCard item={base} loading={false} onMark={vi.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByText('×'));
    expect(onDelete).toHaveBeenCalledWith('i1');
  });

  it('hides ✓ done button for items already done', () => {
    render(<ItemCard item={{ ...base, status: 'done' }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('hides ✕ skip button for items already skipped', () => {
    render(<ItemCard item={{ ...base, status: 'skip' }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('✕')).not.toBeInTheDocument();
  });

  it('shows ↺ reset button for non-new items', () => {
    render(<ItemCard item={{ ...base, status: 'done' }} loading={false} onMark={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('↺')).toBeInTheDocument();
  });

  it('calls onMark(id, new) when ↺ reset is clicked', async () => {
    const onMark = vi.fn();
    render(<ItemCard item={{ ...base, status: 'done' }} loading={false} onMark={onMark} onDelete={vi.fn()} />);
    await userEvent.click(screen.getByText('↺'));
    expect(onMark).toHaveBeenCalledWith('i1', 'new');
  });
});
