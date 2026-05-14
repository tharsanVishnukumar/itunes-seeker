import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RatingsRecord } from "../types";
import { STORAGE_KEYS } from "./keys";

export const loadRatings = async (): Promise<RatingsRecord> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ratings);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as RatingsRecord;
  } catch (error) {
    console.warn("[ratingsStorage] load failed", error);
    return {};
  }
};

export const saveRatings = async (record: RatingsRecord): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ratings,
      JSON.stringify(record),
    );
  } catch (error) {
    console.warn("[ratingsStorage] save failed", error);
  }
};
