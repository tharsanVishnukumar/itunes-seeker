import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";
import type { RatingValue } from "../types";

interface StarRatingProps {
  value: RatingValue | null;
  onChange?: (next: RatingValue) => void;
  readOnly?: boolean;
  size?: number;
  spacing?: number;
}

const STAR_VALUES: ReadonlyArray<RatingValue> = [1, 2, 3, 4, 5];

const StarRatingComponent: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 20,
  spacing = 2,
}) => {
  const handlePress = useCallback(
    (next: RatingValue) => {
      if (readOnly || !onChange) {
        return;
      }
      onChange(next);
    },
    [onChange, readOnly],
  );

  const accessibilityLabel = value
    ? `Note : ${value} étoile${value > 1 ? "s" : ""} sur 5`
    : "Aucune note attribuée";

  return (
    <View
      style={styles.row}
      accessibilityRole={readOnly ? "text" : "adjustable"}
      accessibilityLabel={accessibilityLabel}
    >
      {STAR_VALUES.map((starValue) => {
        const isFilled = value !== null && starValue <= value;
        const color = isFilled ? colors.star : colors.starInactive;
        const iconName = isFilled ? "star" : "star-outline";
        const marginRight = starValue === 5 ? 0 : spacing;

        if (readOnly) {
          return (
            <View
              key={starValue}
              style={{ marginRight }}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        }

        return (
          <Pressable
            key={starValue}
            onPress={() => handlePress(starValue)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Attribuer ${starValue} étoile${starValue > 1 ? "s" : ""}`}
            style={{ marginRight }}
          >
            <Ionicons name={iconName} size={size} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export const StarRating = memo(StarRatingComponent);
