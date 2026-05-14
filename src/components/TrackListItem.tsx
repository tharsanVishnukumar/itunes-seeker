import React, { memo, useCallback } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import type { RatingValue, Track } from "../types";
import { FavoriteButton } from "./FavoriteButton";
import { StarRating } from "./StarRating";

interface TrackListItemProps {
  track: Track;
  isFavorite: boolean;
  rating: RatingValue | null;
  onPress: (track: Track) => void;
  onToggleFavorite: (track: Track) => void;
}

const TrackListItemComponent: React.FC<TrackListItemProps> = ({
  track,
  isFavorite,
  rating,
  onPress,
  onToggleFavorite,
}) => {
  const handlePress = useCallback(() => {
    onPress(track);
  }, [onPress, track]);

  const handleFavoriteToggle = useCallback(() => {
    onToggleFavorite(track);
  }, [onToggleFavorite, track]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${track.trackName} par ${track.artistName}`}
      style={({ pressed }) => [
        styles.container,
        pressed ? styles.containerPressed : null,
      ]}
    >
      <Image
        source={{ uri: track.artworkUrl100 }}
        style={styles.artwork}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {track.trackName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {track.artistName}
        </Text>
        <View style={styles.starsRow}>
          <StarRating value={rating} readOnly size={14} spacing={1} />
        </View>
      </View>
      <FavoriteButton isFavorite={isFavorite} onToggle={handleFavoriteToggle} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  containerPressed: {
    backgroundColor: colors.surface,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  middle: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
  },
  starsRow: {
    marginTop: 6,
  },
});

export const TrackListItem = memo(TrackListItemComponent);
