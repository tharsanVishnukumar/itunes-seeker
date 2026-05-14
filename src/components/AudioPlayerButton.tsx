import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";

interface AudioPlayerButtonProps {
  isPlaying: boolean;
  isLoading: boolean;
  disabled?: boolean;
  error?: string | null;
  onPress: () => void;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  isPlaying,
  isLoading,
  disabled = false,
  error,
  onPress,
}) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        disabled={disabled || isLoading}
        accessibilityRole="button"
        accessibilityLabel={
          disabled
            ? "Aperçu audio indisponible"
            : isPlaying
              ? "Mettre en pause l'aperçu"
              : "Lire l'aperçu audio"
        }
        style={({ pressed }) => [
          styles.button,
          disabled ? styles.buttonDisabled : null,
          pressed && !disabled ? styles.buttonPressed : null,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.textInverse} />
        ) : (
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color={colors.textInverse}
          />
        )}
      </Pressable>
      <Text style={styles.caption}>
        {disabled
          ? "Aperçu indisponible"
          : isPlaying
            ? "Lecture en cours"
            : "Aperçu 30 s"}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    backgroundColor: colors.starInactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textMuted,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});
