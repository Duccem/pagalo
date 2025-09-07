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

import { useColorScheme } from "@/hooks/useColorScheme";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";

export default function RootLayout() {
  const expoDb = openDatabaseSync("pagalo");
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
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
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}

