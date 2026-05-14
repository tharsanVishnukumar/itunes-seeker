import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AudioPlayerButton,
  FavoriteButton,
  StarRating,
} from "../components";
import { useLibrary } from "../context/LibraryContext";
import { useAudioPreview } from "../hooks/useAudioPreview";
import { colors } from "../theme/colors";
import type {
  RatingValue,
  RootStackParamList,
  Track,
} from "../types";

type TrackDetailRouteProp = RouteProp<RootStackParamList, "TrackDetail">;

const formatDuration = (millis?: number): string | null => {
  if (typeof millis !== "number" || millis <= 0) {
    return null;
  }
  const totalSeconds = Math.round(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const formatYear = (releaseDate?: string): string | null => {
  if (!releaseDate) {
    return null;
  }
  const year = new Date(releaseDate).getFullYear();
  return Number.isFinite(year) ? String(year) : null;
};

const formatPrice = (price?: number, currency?: string): string | null => {
  if (typeof price !== "number" || price <= 0) {
    return null;
  }
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency ?? "EUR",
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency ?? ""}`.trim();
  }
};

const buildLargeArtworkUrl = (url: string): string =>
  url.replace(/\/(\d+)x\1bb/, "/600x600bb");

interface MetaRowProps {
  label: string;
  value: string | null;
}

const MetaRow: React.FC<MetaRowProps> = ({ label, value }) => {
  if (!value) {
    return null;
  }
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
};

const TrackDetailScreen: React.FC = () => {
  const route = useRoute<TrackDetailRouteProp>();
  const track: Track = route.params.track;

  const { isFavorite, toggleFavorite, getRating, setRating } = useLibrary();
  const audio = useAudioPreview(track.previewUrl);

  const artworkUrl = useMemo(
    () => buildLargeArtworkUrl(track.artworkUrl100),
    [track.artworkUrl100],
  );

  const rating = getRating(track.trackId);
  const favorite = isFavorite(track.trackId);

  const handleRate = useCallback(
    (next: RatingValue) => {
      setRating(track.trackId, next);
    },
    [setRating, track.trackId],
  );

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(track);
  }, [toggleFavorite, track]);

  const handleAudioPress = useCallback(() => {
    void audio.toggle();
  }, [audio]);

  const duration = formatDuration(track.trackTimeMillis);
  const year = formatYear(track.releaseDate);
  const price = formatPrice(track.trackPrice, track.currency);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Image
            source={{ uri: artworkUrl }}
            style={styles.artwork}
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.title} numberOfLines={2}>
            {track.trackName}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artistName}
          </Text>
          {track.collectionName ? (
            <Text style={styles.album} numberOfLines={1}>
              {track.collectionName}
            </Text>
          ) : null}
        </View>

        <View style={styles.audioRow}>
          <AudioPlayerButton
            isPlaying={audio.isPlaying}
            isLoading={audio.isLoading}
            disabled={!track.previewUrl}
            error={audio.error}
            onPress={handleAudioPress}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Ma note</Text>
            <FavoriteButton
              isFavorite={favorite}
              onToggle={handleToggleFavorite}
              size={28}
            />
          </View>
          <StarRating value={rating} onChange={handleRate} size={32} spacing={4} />
          <Text style={styles.cardCaption}>
            {rating
              ? `Tu as attribué ${rating} étoile${rating > 1 ? "s" : ""} à ce morceau.`
              : "Touche les étoiles pour attribuer une note."}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Détails</Text>
          <MetaRow label="Genre" value={track.primaryGenreName ?? null} />
          <MetaRow label="Durée" value={duration} />
          <MetaRow label="Année" value={year} />
          <MetaRow label="Prix" value={price} />
          <MetaRow label="Pays" value={track.country ?? null} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  hero: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  artwork: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  artist: {
    marginTop: 4,
    fontSize: 16,
    color: colors.accent,
    fontWeight: "600",
    textAlign: "center",
  },
  album: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  audioRow: {
    alignItems: "center",
    paddingVertical: 12,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardCaption: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  metaLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  metaValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
});

export default TrackDetailScreen;
