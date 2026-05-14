import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, TrackListItem } from "../components";
import { useLibrary } from "../context/LibraryContext";
import { colors } from "../theme/colors";
import type {
  FavoriteTrack,
  RootStackParamList,
  Track,
} from "../types";

type FavoritesScreenNavigation = NativeStackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigation>();
  const { favoritesList, isFavorite, getRating, toggleFavorite } =
    useLibrary();

  const handleSelectTrack = useCallback(
    (track: Track) => {
      navigation.navigate("TrackDetail", { track });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<FavoriteTrack> = useCallback(
    ({ item }) => (
      <TrackListItem
        track={item.track}
        isFavorite={isFavorite(item.track.trackId)}
        rating={getRating(item.track.trackId)}
        onPress={handleSelectTrack}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [getRating, handleSelectTrack, isFavorite, toggleFavorite],
  );

  const keyExtractor = useCallback(
    (item: FavoriteTrack) => String(item.track.trackId),
    [],
  );

  if (favoritesList.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <EmptyState
          icon="♡"
          title="Aucun favori pour l'instant"
          description="Ajoute des morceaux à ta collection depuis l'écran de recherche."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={favoritesList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={Separator}
        initialNumToRender={10}
        windowSize={7}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const Separator: React.FC = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 32,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 84,
  },
});

export default FavoritesScreen;
