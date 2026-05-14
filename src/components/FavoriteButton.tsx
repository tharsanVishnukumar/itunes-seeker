import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Pressable, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: number;
}

const FavoriteButtonComponent: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  size = 24,
}) => {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
      }
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
      ]}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={size}
        color={isFavorite ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.6,
  },
});

export const FavoriteButton = memo(FavoriteButtonComponent);
