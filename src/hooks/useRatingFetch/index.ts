import type { CategoryType } from '../../lib/types';

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY ?? '';

const PROMPTS: Record<string, (name: string, isRestaurant: boolean) => string> = {
  movie: (name) =>
    `For the movie "${name}", reply ONLY with JSON (no markdown):\n{"rating":"⭐ 8.4 / 10","detail":"Genre · Runtime · Year"}\nReal IMDb data. Empty strings if unknown.`,
  place: (name, isRestaurant) =>
    `For the ${isRestaurant ? 'restaurant' : 'place'} "${name}", reply ONLY with JSON (no markdown):\n{"rating":"⭐ 4.5 / 5","detail":"Type · Price · City"}\nReal data. Empty strings if unknown.`,
};

export async function fetchRating(
  name: string,
  type: CategoryType,
  isRestaurant: boolean,
): Promise<{ rating: string; detail: string }> {
  if (!API_KEY || type === 'fun') return { rating: '', detail: '' };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: PROMPTS[type](name, isRestaurant) }],
      }),
    });
    const d = await res.json();
    const raw = (d.content?.[0]?.text ?? '{}').replace(/```[a-z]*|```/g, '').trim();
    const info = JSON.parse(raw);
    return { rating: info.rating ?? '', detail: info.detail ?? '' };
  } catch {
    return { rating: '', detail: '' };
  }
}
