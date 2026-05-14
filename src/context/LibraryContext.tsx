import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  loadFavorites,
  loadRatings,
  saveFavorites,
  saveRatings,
} from "../storage";
import type {
  FavoriteTrack,
  FavoritesRecord,
  RatingValue,
  RatingsRecord,
  Track,
} from "../types";

interface LibraryContextValue {
  isHydrated: boolean;
  favorites: FavoritesRecord;
  ratings: RatingsRecord;
  favoritesList: FavoriteTrack[];
  isFavorite: (trackId: number) => boolean;
  toggleFavorite: (track: Track) => void;
  getRating: (trackId: number) => RatingValue | null;
  setRating: (trackId: number, value: RatingValue) => void;
  removeRating: (trackId: number) => void;
}

const LibraryContext = createContext<LibraryContextValue | undefined>(undefined);

interface LibraryProviderProps {
  children: React.ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoritesRecord>({});
  const [ratings, setRatings] = useState<RatingsRecord>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([loadFavorites(), loadRatings()])
      .then(([loadedFavorites, loadedRatings]) => {
        if (!isMounted) {
          return;
        }
        setFavorites(loadedFavorites);
        setRatings(loadedRatings);
      })
      .catch((error) => {
        console.warn("[LibraryProvider] hydration failed", error);
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrated(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isFavorite = useCallback(
    (trackId: number) => Boolean(favorites[String(trackId)]),
    [favorites],
  );

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites((current) => {
      const key = String(track.trackId);
      const next: FavoritesRecord = { ...current };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = { track, addedAt: new Date().toISOString() };
      }
      void saveFavorites(next);
      return next;
    });
  }, []);

  const getRating = useCallback(
    (trackId: number): RatingValue | null => {
      const entry = ratings[String(trackId)];
      return entry ? entry.rating : null;
    },
    [ratings],
  );

  const setRating = useCallback((trackId: number, value: RatingValue) => {
    setRatings((current) => {
      const next: RatingsRecord = { ...current };
      next[String(trackId)] = {
        trackId,
        rating: value,
        updatedAt: new Date().toISOString(),
      };
      void saveRatings(next);
      return next;
    });
  }, []);

  const removeRating = useCallback((trackId: number) => {
    setRatings((current) => {
      const key = String(trackId);
      if (!current[key]) {
        return current;
      }
      const next: RatingsRecord = { ...current };
      delete next[key];
      void saveRatings(next);
      return next;
    });
  }, []);

  const favoritesList = useMemo<FavoriteTrack[]>(() => {
    return Object.values(favorites).sort((a, b) =>
      b.addedAt.localeCompare(a.addedAt),
    );
  }, [favorites]);

  const value = useMemo<LibraryContextValue>(
    () => ({
      isHydrated,
      favorites,
      ratings,
      favoritesList,
      isFavorite,
      toggleFavorite,
      getRating,
      setRating,
      removeRating,
    }),
    [
      isHydrated,
      favorites,
      ratings,
      favoritesList,
      isFavorite,
      toggleFavorite,
      getRating,
      setRating,
      removeRating,
    ],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextValue => {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return ctx;
};
