import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/button";
import { t } from "@/lib/i18n";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex h-full items-center justify-center bg-gray-200 py-5 flex-1">
      <View className="flex items-center justify-center p-5">
        <View className="w-full justify-center items-center size-24">
          <Image
            source={require("@/assets/images/logo-green.png")}
            className="w-24"
            resizeMode="contain"
          />
        </View>
        <View className="flex flex-row items-center justify-start w-full mt-10 ">
          <Text className="text-2xl font-bold text-black  text-start">
            Welcome =)
          </Text>
        </View>
        <Text className="text-lg text-gray-700 mt-5 px-8 text-center">
          {t("home.tagline")}
        </Text>
        <LottieView
          style={{
            width: 300,
            height: 300,
          }}
          source={require("@/assets/animations/fists.json")}
          autoPlay
          loop={true}
        />
      </View>
      <View className="w-full px-5 gap-4">
        <Button action={() => router.push("/(auth)/sign-in" as any)}>
          <Text className="text-base text-white font-semibold">
            {t("actions.signInWithEmail")}
          </Text>
        </Button>

        <Button
          variant="black"
          action={() => router.push("/(auth)/sign-up" as any)}
        >
          <Text className="text-base font-semibold text-white">
            {t("auth.createAccount")}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

