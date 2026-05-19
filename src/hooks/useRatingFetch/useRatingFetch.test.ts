import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRating } from '.';

beforeEach(() => vi.restoreAllMocks());

describe('fetchRating — no API key', () => {
  it('returns empty strings when VITE_CLAUDE_API_KEY is not set', async () => {
    const result = await fetchRating('Dune', 'movie', false);
    expect(result).toEqual({ rating: '', detail: '' });
  });

  it('returns empty strings for fun type regardless of key', async () => {
    const result = await fetchRating('Bowling', 'fun', false);
    expect(result).toEqual({ rating: '', detail: '' });
  });
});

describe('fetchRating — fetch error handling', () => {
  it('returns empty strings when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));
    const result = await fetchRating('Dune', 'movie', false);
    expect(result).toEqual({ rating: '', detail: '' });
  });

  it('returns empty strings when response JSON is malformed', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ content: [{ text: 'not json at all' }] }),
    }));
    const result = await fetchRating('Dune', 'movie', false);
    expect(result).toEqual({ rating: '', detail: '' });
  });

  it('returns empty strings when content array is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({}),
    }));
    const result = await fetchRating('Dune', 'movie', false);
    expect(result).toEqual({ rating: '', detail: '' });
  });
});
