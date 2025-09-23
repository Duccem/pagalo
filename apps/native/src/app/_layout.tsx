import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../../global.css";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator, useColorScheme } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import migrations from "../../drizzle/migrations";

export default function RootLayout() {
  const expoDb = openDatabaseSync("pagalo");
  const db = drizzle(expoDb);
  const { success: _s } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      <SQLiteProvider
        databaseName="pagalo"
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(300)}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(receipt)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(settings)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" backgroundColor="#f3f4f6" />
          </Animated.View>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

