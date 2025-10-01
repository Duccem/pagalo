import google from "@/assets/google.png";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/(tabs)",
      },
      {
        onSuccess: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await authClient.getSession();
          setLoading(false);
        },
        onError: (error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert("Login error", error.error.message);
          console.warn("Auth signIn error", error.error.message);
          setLoading(false);
        },
      }
    );
  };

  if (isPending) return null;
  if (session) {
    return <Redirect href={"/(tabs)"} />;
  }

  return (
    <SafeAreaView className="flex h-full items-center justify-center bg-gray-200 py-5 flex-1">
      <View className="flex items-center justify-center p-5">
        <View className="flex flex-row items-center justify-start w-full mt-10 ">
          <Text className="text-2xl font-bold text-black  text-start">
            Welcome =)
          </Text>
        </View>
        <Text className="text-lg text-gray-700 mt-5 px-8 text-center">
          Dont worry about the mess of calculate the division of the bill, we
          will do it for you!
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
      <View className="w-full px-5">
        <TouchableOpacity
          className="w-full p-2 rounded-full h-20 gap-6 border flex flex-row items-center justify-center bg-white"
          onPress={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Image source={google} className="size-8" resizeMode="contain" />
          )}
          <Text className="text-lg font-semibold">
            {loading ? "Iniciando..." : "Continuar con Google"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

