import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AddItemForm from '.';

describe('AddItemForm', () => {
  it('renders the add button', () => {
    render(<AddItemForm placeholder="Add…" hint="hint" onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('renders the hint text', () => {
    render(<AddItemForm placeholder="Add…" hint="IMDb rating loads automatically" onAdd={vi.fn()} />);
    expect(screen.getByText('IMDb rating loads automatically')).toBeInTheDocument();
  });

  it('calls onAdd with the typed value on button click', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm placeholder="Add…" hint="hint" onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), 'Inception');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith('Inception');
  });

  it('calls onAdd when Enter is pressed', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm placeholder="Add…" hint="hint" onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), 'Dune{Enter}');
    expect(onAdd).toHaveBeenCalledWith('Dune');
  });

  it('clears the input after adding', async () => {
    render(<AddItemForm placeholder="Add…" hint="hint" onAdd={vi.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'Movie{Enter}');
    expect(input.value).toBe('');
  });

  it('does not call onAdd for whitespace-only input', async () => {
    const onAdd = vi.fn();
    render(<AddItemForm placeholder="Add…" hint="hint" onAdd={onAdd} />);
    await userEvent.type(screen.getByRole('textbox'), '   {Enter}');
    expect(onAdd).not.toHaveBeenCalled();
  });
});
