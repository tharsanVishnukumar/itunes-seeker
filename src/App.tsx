import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import { LibraryProvider, useLibrary } from "./context/LibraryContext";
import { RootNavigator } from "./navigation/RootNavigator";
import { colors } from "./theme/colors";

const HydrationGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isHydrated } = useLibrary();

  if (!isHydrated) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <LibraryProvider>
        <NavigationContainer>
          <HydrationGate>
            <RootNavigator />
          </HydrationGate>
          <StatusBar style="auto" />
        </NavigationContainer>
      </LibraryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
