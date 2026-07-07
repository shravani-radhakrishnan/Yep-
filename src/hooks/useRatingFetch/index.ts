import type { CategoryType } from '../../lib/types';

// ── Shared result type ────────────────────────────────────────────────────────

interface RatingResult {
  rating: string;
  detail: string;
}

// ── Provider interface — swap providers by implementing this ──────────────────

interface PlaceProvider {
  fetchInfo(name: string, isRestaurant: boolean): Promise<RatingResult>;
}

// ── Movie provider: TMDB (free) ───────────────────────────────────────────────

const TMDB_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 14: 'Fantasy', 27: 'Horror', 9648: 'Mystery',
  10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

async function fetchMovieInfo(name: string, apiKey: string): Promise<RatingResult> {
  const res  = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(name)}&page=1`);
  const data = await res.json();
  const movie = data.results?.[0];
  if (!movie) return { rating: '', detail: '' };

  const score  = movie.vote_average ? `⭐ ${movie.vote_average.toFixed(1)} / 10` : '';
  const year   = movie.release_date?.slice(0, 4) ?? '';
  const genre  = TMDB_GENRES[movie.genre_ids?.[0]] ?? '';
  return { rating: score, detail: [genre, year].filter(Boolean).join(' · ') };
}

// ── Place provider: Foursquare (free tier) ────────────────────────────────────

class FoursquareProvider implements PlaceProvider {
  constructor(private apiKey: string) {}

  async fetchInfo(name: string): Promise<RatingResult> {
    const res  = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(name)}&limit=1`,
      { headers: { Authorization: this.apiKey, Accept: 'application/json' } },
    );
    const data = await res.json();
    const place = data.results?.[0];
    if (!place) return { rating: '', detail: '' };

    const category = place.categories?.[0]?.name ?? '';
    const area     = place.location?.neighborhood ?? place.location?.locality ?? '';
    return { rating: '', detail: [category, area].filter(Boolean).join(' · ') };
  }
}

// ── Place provider: Nominatim / OpenStreetMap (completely free, no key) ───────

class NominatimProvider implements PlaceProvider {
  async fetchInfo(name: string): Promise<RatingResult> {
    const res  = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Yep-App/1.0' } },
    );
    const data  = await res.json();
    const place = data?.[0];
    if (!place) return { rating: '', detail: '' };

    const type = place.type?.replace(/_/g, ' ') ?? '';
    const city = place.display_name?.split(',')[1]?.trim() ?? '';
    return { rating: '', detail: [type, city].filter(Boolean).join(' · ') };
  }
}

// ── Place provider: Google Places (swap in when ready) ────────────────────────
// To switch: set VITE_GOOGLE_PLACES_API_KEY in .env.local, change activePlaceProvider below.
//
// class GooglePlacesProvider implements PlaceProvider {
//   constructor(private apiKey: string) {}
//   async fetchInfo(name: string, isRestaurant: boolean): Promise<RatingResult> {
//     const res  = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(name)}&key=${this.apiKey}`);
//     const data = await res.json();
//     const place = data.results?.[0];
//     if (!place) return { rating: '', detail: '' };
//     const score  = place.rating ? `⭐ ${place.rating} / 5` : '';
//     const type   = place.types?.[0]?.replace(/_/g, ' ') ?? '';
//     return { rating: score, detail: [type, place.formatted_address?.split(',')[0]].filter(Boolean).join(' · ') };
//   }
// }

// ── Active provider — change this one line to switch APIs ─────────────────────

const FOURSQUARE_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY ?? '';
const TMDB_KEY       = import.meta.env.VITE_TMDB_API_KEY ?? '';

const activePlaceProvider: PlaceProvider = FOURSQUARE_KEY
  ? new FoursquareProvider(FOURSQUARE_KEY)
  : new NominatimProvider();

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchRating(
  name: string,
  type: CategoryType,
  isRestaurant: boolean,
): Promise<RatingResult> {
  if (type === 'fun') return { rating: '', detail: '' };
  try {
    return type === 'movie' && TMDB_KEY
      ? await fetchMovieInfo(name, TMDB_KEY)
      : await activePlaceProvider.fetchInfo(name, isRestaurant);
  } catch {
    return { rating: '', detail: '' };
  }
}
