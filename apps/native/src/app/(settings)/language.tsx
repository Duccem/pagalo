import ScreenView from "@/components/shared/screen-view";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_LABELS,
  useLanguagePreference,
} from "@/lib/preferences";
import { useColorScheme } from "@/lib/use-color-scheme";
import * as Haptics from "expo-haptics";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { t } from "@/lib/i18n";

export default function LanguageScreen() {
  const { colorScheme } = useColorScheme();
  const { isPending, data } = authClient.useSession();
  const { language, setLanguage, loading } = useLanguagePreference();
  if (isPending) return null;
  if (!data) return <Redirect href="/(auth)/welcome" />;

  return (
    <ScreenView>
      <View className="flex-1 px-6 gap-8 pb-8">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            className="pr-4"
          >
            <ArrowLeft
              size={28}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-foreground">
            {t("settings.selectLanguage")}
          </Text>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
          {SUPPORTED_LANGUAGES.map((lng) => {
            const active = lng === language;
            return (
              <View
                className="flex-row items-center gap-4 bg-card p-3 rounded-2xl justify-between"
                key={lng}
              >
                <View className="flex-row items-center gap-3">
                  {active ? (
                    <Check size={18} color="#22c55e" />
                  ) : (
                    <View className="w-[18px] h-[18px] rounded-sm border border-muted-foreground/40" />
                  )}
                  <Text className="text-lg font-medium text-foreground">
                    {SUPPORTED_LANGUAGES_LABELS[lng]}
                  </Text>
                </View>
                <View>
                  <BouncyCheckbox
                    isChecked={active}
                    useBuiltInState={false}
                    size={26}
                    fillColor="#22c55e"
                    unFillColor={colorScheme === "dark" ? "#1c1c1c" : "#ffffff"}
                    iconStyle={{ borderRadius: 8, borderColor: "#22c55e" }}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 8 }}
                    onPress={async () => {
                      Haptics.selectionAsync();
                      await setLanguage(lng);
                    }}
                  />
                </View>
              </View>
            );
          })}
          {loading && (
            <Text className="text-center text-gray-500 text-sm">
              {t("common.loading")}
            </Text>
          )}
        </ScrollView>
      </View>
    </ScreenView>
  );
}

