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

import { AnimationScreen } from "@/components/shared/animation-splash";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SplashScreen from "expo-splash-screen";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import migrations from "../../drizzle/migrations";
import { useColorScheme } from "@/lib/use-color-scheme";
import * as SecureStore from "expo-secure-store";
import { authClient } from "@/lib/auth-client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const expoDb = openDatabaseSync("pagalo");
  const db = drizzle(expoDb);
  const { success } = useMigrations(db, migrations);
  const { colorScheme, setColorScheme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const { isPending, data } = authClient.useSession();
  const [appReady, setAppReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    const loadTHeme = async () => {
      const storedTheme = await SecureStore.getItemAsync("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        setColorScheme(storedTheme);
      }
    };
    if (loaded && success && !isPending) {
      SplashScreen.hide();
      loadTHeme();
      setAppReady(true);
    }
  }, [loaded, isPending, success]);

  if (!appReady && !animationFinished) {
    // Async font loading only occurs in development.
    return (
      <AnimationScreen
        appReady={appReady}
        finish={(isCanceled: boolean) => {
          if (!isCanceled) {
            setAnimationFinished(true);
          }
        }}
      />
    );
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
              <Stack.Protected guard={!!data?.session}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(receipt)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(settings)"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />

              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar
              style={colorScheme === "dark" ? "dark" : "light"}
              backgroundColor="transparent"
            />
          </Animated.View>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
