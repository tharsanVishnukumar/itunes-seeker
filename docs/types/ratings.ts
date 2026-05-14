export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface TrackRating {
  trackId: number;
  rating: RatingValue;
  updatedAt: string;
}

export type RatingsRecord = Record<string, TrackRating>;
