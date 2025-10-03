import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../../global.css";

import { AnimationScreen } from "@/components/shared/animation-splash";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useColorScheme } from "@/lib/use-color-scheme";
import RootRouter from "@/components/routers/root";
import { SessionProvider } from "@/components/shared/session-provider";
import { useMigrate } from "@/lib/db/use-database";
// Initialize i18n as early as possible
import "@/lib/i18n";
import { LanguageProvider } from "@/components/shared/language-provider";

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const { success } = useMigrate();
  const { colorScheme, loadTHeme } = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      try {
        await loadTHeme();
      } catch (error) {
        console.warn(error);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (loaded && success) {
      setAppReady(true);
    }
  }, [loaded, success]);

  if (!appReady && !loaded && !success) {
    return (
      <AnimationScreen
        appReady={appReady}
        finish={(_isCanceled: boolean) => {}}
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
          <Animated.View
            style={{ flex: 1, position: "relative" }}
            entering={FadeIn.duration(300)}
          >
            <SessionProvider>
              <LanguageProvider>
                <RootRouter />
              </LanguageProvider>
            </SessionProvider>
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
