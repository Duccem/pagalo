import ScreenView from "@/components/shared/screen-view";
import { authClient } from "@/lib/auth-client";
import {
  useCurrencyPreference,
  useNotificationPreferences,
  useShareMessagePreference,
} from "@/lib/preferences";
import { useColorScheme } from "@/lib/use-color-scheme";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { Redirect, router } from "expo-router";
import {
  ArrowLeft,
  ChevronRight,
  Info,
  LogOut,
  Moon,
  SunMedium,
} from "lucide-react-native";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { t } from "@/lib/i18n";

const Index = () => {
  const { isPending, data } = authClient.useSession();
  const { toggleColorScheme, isDarkColorScheme, colorScheme } =
    useColorScheme();
  const { currency, loading: loadingCurrency } = useCurrencyPreference();
  const { shareMessage, loading: loadingShareMessage } =
    useShareMessagePreference();
  const _not = useNotificationPreferences();
  if (isPending) return null;
  if (!data) {
    return <Redirect href={"/(auth)/welcome"} />;
  }
  const version = Constants?.expoConfig?.version ?? "1.0.0";

  const handleSignOut = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await authClient.signOut();
    } catch {
      Alert.alert(t("common.error"), t("settings.signOutError"));
    }
  };

  const saveTheme = async (newTheme: "light" | "dark") => {
    await SecureStore.setItemAsync("theme", newTheme);
  };

  return (
    <ScreenView>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
      >
        <View className="gap-10">
          <View className="w-full flex-row justify-between items-center pt-2">
            <TouchableOpacity
              className="flex-row items-center gap-4"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.back();
              }}
            >
              <ArrowLeft
                size={30}
                className="text-foreground"
                color={colorScheme === "dark" ? "white" : "black"}
              />
              <Text className="text-xl text-foreground">
                {t("common.back")}
              </Text>
            </TouchableOpacity>
            <Text className="text-lg font-medium text-foreground">
              {t("settings.title")}
            </Text>
          </View>
          {/* User Card */}
          <Pressable
            className="w-full bg-card rounded-2xl p-4 flex-row items-center gap-4 shadow-sm"
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/(settings)/profile" as any);
            }}
          >
            <View className="size-16 rounded-2xl bg-green-400 overflow-hidden">
              <Image
                src={
                  data?.user.image ?? "https://ui-avatars.com/api/?name=User"
                }
                resizeMethod="auto"
                className="h-full w-full"
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-semibold text-foreground"
                numberOfLines={1}
              >
                {data?.user.name || t("common.user")}
              </Text>
              <Text className="text-muted-foreground text-sm" numberOfLines={1}>
                {data?.user.email}
              </Text>
            </View>
            <ChevronRight
              size={24}
              className="text-foreground"
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Pressable>

          {/* Preferences */}
          <View className="gap-4">
            <Text className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("settings.preferences")}
            </Text>
            <View className="bg-card rounded-2xl divide-y overflow-hidden">
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  {isDarkColorScheme ? (
                    <Moon
                      size={20}
                      className="text-foreground"
                      color={"white"}
                    />
                  ) : (
                    <SunMedium size={20} className="text-foreground" />
                  )}
                  <Text className="text-base text-foreground">
                    {t("settings.darkMode")}
                  </Text>
                </View>
                <Switch
                  value={isDarkColorScheme}
                  onValueChange={() => {
                    Haptics.selectionAsync();
                    toggleColorScheme();
                    saveTheme(isDarkColorScheme ? "light" : "dark");
                  }}
                />
              </View>
              {/* Currency preference */}
              <Pressable
                className="flex-row items-center justify-between p-4"
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push("/(settings)/currency");
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-base text-foreground">
                    {t("settings.currency")}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-muted-foreground">
                    {loadingCurrency ? "..." : currency}
                  </Text>
                  <ChevronRight
                    size={18}
                    className="text-foreground"
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </View>
              </Pressable>
              {/* Share message preference */}
              <Pressable
                className="flex-row items-center justify-between p-4"
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push("/(settings)/share-message" as any);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-base text-foreground">
                    {t("settings.shareMessage")}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 max-w-[55%]">
                  <Text
                    className="text-sm font-medium text-muted-foreground"
                    numberOfLines={1}
                  >
                    {loadingShareMessage
                      ? "..."
                      : (shareMessage || "").length > 28
                      ? `${shareMessage.slice(0, 20)}…`
                      : shareMessage || t("common.empty")}
                  </Text>
                  <ChevronRight
                    size={18}
                    className="text-foreground"
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Notifications Preferences */}
          {/* <View className="gap-4">
            <Text className="text-xs uppercase text-muted-foreground tracking-wider">
              Notifications
            </Text>
            <View className="bg-card rounded-2xl overflow-hidden divide-y">
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <Bell
                    size={20}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-base text-foreground">
                    Enable notifications
                  </Text>
                </View>
                <Switch
                  value={generalEnabled}
                  onValueChange={() => {
                    Haptics.selectionAsync();
                    const newVal = !generalEnabled;
                    setGeneralEnabled(newVal);
                    if (newVal) {
                      pushMockNotification(
                        "Notifications enabled",
                        "We'll remind you about pending payments here."
                      );
                    }
                  }}
                />
              </View>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-1 pr-4">
                  <Text className="text-base text-foreground">
                    Payment reminders
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Get nudges so everyone pays their part.
                  </Text>
                </View>
                <Switch
                  value={remindersEnabled}
                  onValueChange={() => {
                    Haptics.selectionAsync();
                    const newVal = !remindersEnabled;
                    setRemindersEnabled(newVal);
                    if (newVal && generalEnabled) {
                      pushMockNotification(
                        "Reminder examples",
                        "You'll start seeing payment reminder mocks."
                      );
                    }
                  }}
                  disabled={!generalEnabled}
                />
              </View>
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-1 pr-4">
                  <Text className="text-base text-foreground">
                    Product news & tips
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Occasional updates to help you get more out of Pagalo.
                  </Text>
                </View>
                <Switch
                  value={newsEnabled}
                  onValueChange={() => {
                    Haptics.selectionAsync();
                    const newVal = !newsEnabled;
                    setNewsEnabled(newVal);
                    if (newVal && generalEnabled) {
                      pushMockNotification(
                        "News examples",
                        "You'll start seeing product update mocks."
                      );
                    }
                  }}
                  disabled={!generalEnabled}
                />
              </View>
              <Pressable
                className="flex-row items-center justify-between p-4"
                onPress={() => {
                  Haptics.selectionAsync();
                  router.push("/(settings)/notifications" as any);
                }}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-base text-foreground">
                    View notifications
                  </Text>
                </View>
                <ChevronRight
                  size={18}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </Pressable>
            </View>
          </View> */}

          {/* Account */}
          <View className="gap-4">
            <Text className="text-xs uppercase text-muted-foreground tracking-wider">
              {t("settings.account")}
            </Text>
            <View className="bg-card rounded-2xl overflow-hidden">
              <Pressable
                className="flex-row items-center justify-between p-4"
                onPress={handleSignOut}
              >
                <View className="flex-row items-center gap-3">
                  <LogOut size={20} color="#dc2626" />
                  <Text className="text-base text-red-600">
                    {t("settings.signOut")}
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </Pressable>
            </View>
          </View>

          {/* About */}
          <View className="gap-4 mb-4">
            <Text className="text-xs uppercase text-muted-foreground tracking-wider">
              {t("settings.about")}
            </Text>
            <View className="bg-card rounded-2xl overflow-hidden">
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center gap-3">
                  <Info
                    size={20}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
                  <Text className="text-base text-foreground">
                    {t("settings.version")}
                  </Text>
                </View>
                <Text className="text-muted-foreground text-sm">{version}</Text>
              </View>
              <View className="flex-row items-center justify-between px-4 pb-4">
                <Text className="text-xs text-muted-foreground">
                  {t("settings.buildId")}:{" "}
                  {Constants?.nativeBuildVersion ?? "dev"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default Index;
