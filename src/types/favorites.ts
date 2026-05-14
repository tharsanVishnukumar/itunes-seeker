import type { Track } from "./track";

export interface FavoriteTrack {
  track: Track;
  addedAt: string;
}

export type FavoritesRecord = Record<string, FavoriteTrack>;
