import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import type { SearchAttribute } from "../types";

interface SearchBarProps {
  value: string;
  onChangeValue: (next: string) => void;
  attribute: SearchAttribute;
  onChangeAttribute: (next: SearchAttribute) => void;
  placeholder?: string;
}

interface AttributeOption {
  key: SearchAttribute;
  label: string;
}

const ATTRIBUTE_OPTIONS: ReadonlyArray<AttributeOption> = [
  { key: "artistTerm", label: "Artiste" },
  { key: "songTerm", label: "Titre" },
];

const SearchBarComponent: React.FC<SearchBarProps> = ({
  value,
  onChangeValue,
  attribute,
  onChangeAttribute,
  placeholder,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={colors.textMuted}
          style={styles.searchGlyph}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeValue}
          placeholder={
            placeholder ??
            (attribute === "artistTerm"
              ? "Rechercher un artiste…"
              : "Rechercher un titre…")
          }
          placeholderTextColor={colors.textMuted}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Champ de recherche iTunes"
        />
      </View>
      <View style={styles.segmented} accessibilityRole="tablist">
        {ATTRIBUTE_OPTIONS.map((option) => {
          const isActive = option.key === attribute;
          return (
            <Pressable
              key={option.key}
              onPress={() => onChangeAttribute(option.key)}
              style={[
                styles.pill,
                isActive ? styles.pillActive : styles.pillInactive,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Rechercher par ${option.label}`}
            >
              <Text
                style={[
                  styles.pillLabel,
                  isActive ? styles.pillLabelActive : styles.pillLabelInactive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchGlyph: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  segmented: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  pillLabelActive: {
    color: colors.textInverse,
  },
  pillLabelInactive: {
    color: colors.text,
  },
});

export const SearchBar = memo(SearchBarComponent);
