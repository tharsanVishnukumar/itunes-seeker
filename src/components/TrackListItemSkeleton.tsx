import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";

export const TrackListItemSkeleton: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={styles.artwork} />
      <View style={styles.middle}>
        <View style={[styles.line, styles.lineTitle]} />
        <View style={[styles.line, styles.lineSubtitle]} />
        <View style={[styles.line, styles.lineStars]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  middle: {
    flex: 1,
    marginLeft: 12,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  lineTitle: {
    width: "70%",
  },
  lineSubtitle: {
    width: "50%",
    marginTop: 8,
  },
  lineStars: {
    width: "30%",
    marginTop: 8,
    height: 10,
  },
});
