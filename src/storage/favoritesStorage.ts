import AsyncStorage from "@react-native-async-storage/async-storage";

import type { FavoritesRecord } from "../types";
import { STORAGE_KEYS } from "./keys";

export const loadFavorites = async (): Promise<FavoritesRecord> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as FavoritesRecord;
  } catch (error) {
    console.warn("[favoritesStorage] load failed", error);
    return {};
  }
};

export const saveFavorites = async (
  record: FavoritesRecord,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.favorites,
      JSON.stringify(record),
    );
  } catch (error) {
    console.warn("[favoritesStorage] save failed", error);
  }
};
