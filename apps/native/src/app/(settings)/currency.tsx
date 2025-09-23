import ScreenView from "@/components/shared/screen-view";
import { authClient } from "@/lib/auth-client";
import { SUPPORTED_CURRENCIES, useCurrencyPreference } from "@/lib/preferences";
import * as Haptics from "expo-haptics";
import { Redirect, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function CurrencyScreen() {
  const { isPending, data } = authClient.useSession();
  const { currency, setCurrency, loading } = useCurrencyPreference();
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
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Selecciona moneda</Text>
        </View>
        <ScrollView className="flex-1" contentContainerStyle={{ gap: 12 }}>
          {SUPPORTED_CURRENCIES.map((c) => {
            const active = c === currency;
            return (
              <View
                className="flex-row items-center gap-4 bg-white p-3 rounded-2xl justify-between"
                key={c}
              >
                <Text className="text-lg font-medium">{c}</Text>
                <View>
                  <BouncyCheckbox
                    isChecked={active}
                    useBuiltInState={false}
                    size={26}
                    fillColor="#22c55e"
                    unFillColor="#ffffff"
                    iconStyle={{ borderRadius: 8, borderColor: "#22c55e" }}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 8 }}
                    onPress={async () => {
                      console.log("selected", c);
                      Haptics.selectionAsync();
                      await setCurrency(c);
                    }}
                  />
                </View>
              </View>
            );
          })}
          {loading && (
            <Text className="text-center text-gray-500 text-sm">Cargando…</Text>
          )}
        </ScrollView>
      </View>
    </ScreenView>
  );
}

