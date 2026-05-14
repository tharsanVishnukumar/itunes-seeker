import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import FavoritesScreen from "../screens/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen";
import TrackDetailScreen from "../screens/TrackDetailScreen";
import { colors } from "../theme/colors";
import type { AppTabParamList, RootStackParamList } from "../types";

const Tabs = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface TabIconProps {
  glyph: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ glyph, focused }) => (
  <View style={styles.tabIconWrapper}>
    <Text
      style={[
        styles.tabIconGlyph,
        { color: focused ? colors.accent : colors.textMuted },
      ]}
    >
      {glyph}
    </Text>
  </View>
);

const TabsNavigator: React.FC = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Recherche",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon glyph="🔎" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favoris",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon glyph="♥" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TrackDetail"
        component={TrackDetailScreen}
        options={({ route }) => ({
          title: route.params.track.trackName,
          headerBackTitle: "Retour",
          presentation: "card",
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconGlyph: {
    fontSize: 20,
  },
});
