export type ITunesEntity = "song";

export type SearchAttribute = "artistTerm" | "songTerm";

export interface SearchTracksParams {
  term: string;
  attribute: SearchAttribute;
  entity?: ITunesEntity;
  limit?: number;
  signal?: AbortSignal;
}

export interface ITunesTrackDTO {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  releaseDate?: string;
  country?: string;
  currency?: string;
  trackPrice?: number;
}

export interface ITunesSearchResponse {
  resultCount: number;
  results: ITunesTrackDTO[];
}
