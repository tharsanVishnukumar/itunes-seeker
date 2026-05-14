import type { Track } from "./track";

export type AppTabParamList = {
  Search: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  TrackDetail: {
    track: Track;
  };
};

export type AppTabScreenName = keyof AppTabParamList;
export type RootStackScreenName = keyof RootStackParamList;
