import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface EmptyStateProps {
  iconName?: IoniconsName;
  iconColor?: string;
  iconSize?: number;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = "musical-notes-outline",
  iconColor = colors.textMuted,
  iconSize = 56,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.action,
            pressed ? styles.actionPressed : null,
          ]}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  action: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  actionPressed: {
    opacity: 0.8,
  },
  actionLabel: {
    color: colors.textInverse,
    fontWeight: "600",
    fontSize: 14,
  },
});
