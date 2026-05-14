import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  View,
  type ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchITunesTracks, ITunesRequestAbortedError } from "../api";
import {
  EmptyState,
  SearchBar,
  TrackListItem,
  TrackListItemSkeleton,
} from "../components";
import { useLibrary } from "../context/LibraryContext";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { colors } from "../theme/colors";
import type { RootStackParamList, SearchAttribute, Track } from "../types";

type SearchScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigation>();
  const { isFavorite, getRating, toggleFavorite } = useLibrary();

  const [term, setTerm] = useState("");
  const [attribute, setAttribute] = useState<SearchAttribute>("artistTerm");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedTerm = useDebouncedValue(term, 400);
  const trimmedTerm = debouncedTerm.trim();

  useEffect(() => {
    if (!trimmedTerm) {
      setTracks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchITunesTracks({
      term: trimmedTerm,
      attribute,
      signal: controller.signal,
    })
      .then((results) => {
        if (cancelled) {
          return;
        }
        setTracks(results);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled || err instanceof ITunesRequestAbortedError) {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur inattendue est survenue";
        setError(message);
        setTracks([]);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trimmedTerm, attribute]);

  const handleSelectTrack = useCallback(
    (track: Track) => {
      Keyboard.dismiss();
      navigation.navigate("TrackDetail", { track });
    },
    [navigation],
  );

  const handleToggleFavorite = useCallback(
    (track: Track) => {
      toggleFavorite(track);
    },
    [toggleFavorite],
  );

  const renderItem: ListRenderItem<Track> = useCallback(
    ({ item }) => (
      <TrackListItem
        track={item}
        isFavorite={isFavorite(item.trackId)}
        rating={getRating(item.trackId)}
        onPress={handleSelectTrack}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [getRating, handleSelectTrack, handleToggleFavorite, isFavorite],
  );

  const keyExtractor = useCallback(
    (item: Track) => String(item.trackId),
    [],
  );

  const listContent = useMemo(() => {
    if (isLoading) {
      return (
        <View style={styles.skeletonList}>
          {SKELETON_KEYS.map((key) => (
            <TrackListItemSkeleton key={key} />
          ))}
        </View>
      );
    }

    if (error) {
      return (
        <EmptyState
          iconName="cloud-offline-outline"
          iconColor={colors.error}
          title="Impossible de joindre iTunes"
          description={error}
          actionLabel="Réessayer"
          onAction={() => setTerm((value) => `${value}`)}
        />
      );
    }

    if (!trimmedTerm) {
      return (
        <EmptyState
          iconName="musical-notes-outline"
          title="Lance une recherche"
          description="Explore l'immense catalogue iTunes par artiste ou par titre."
        />
      );
    }

    if (tracks.length === 0) {
      return (
        <EmptyState
          iconName="search-outline"
          title="Aucun morceau trouvé"
          description={`Aucun résultat pour « ${trimmedTerm} ». Essaie un autre terme.`}
        />
      );
    }

    return (
      <FlatList
        data={tracks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        initialNumToRender={10}
        windowSize={7}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
      />
    );
  }, [
    error,
    isLoading,
    keyExtractor,
    renderItem,
    tracks,
    trimmedTerm,
  ]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SearchBar
        value={term}
        onChangeValue={setTerm}
        attribute={attribute}
        onChangeAttribute={setAttribute}
      />
      <View style={styles.body}>{listContent}</View>
    </SafeAreaView>
  );
};

const Separator: React.FC = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 84,
  },
  skeletonList: {
    paddingTop: 8,
  },
});

export default SearchScreen;
