import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import FavoritesScreen from "../screens/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen";
import TrackDetailScreen from "../screens/TrackDetailScreen";
import { colors } from "../theme/colors";
import type { AppTabParamList, RootStackParamList } from "../types";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const Tabs = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

interface TabIconProps {
  name: "search" | "heart";
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, focused, color, size }) => {
  const iconName: IoniconsName = focused
    ? (name as IoniconsName)
    : (`${name}-outline` as IoniconsName);
  return <Ionicons name={iconName} size={size} color={color} />;
};

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
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="search" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favoris",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon name="heart" focused={focused} color={color} size={size} />
          ),
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
