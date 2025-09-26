import google from "@/assets/google.png";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
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
  const [loading, setLoading] = React.useState(false);
  const [lastError, setLastError] = React.useState<string | null>(null);
  const handleLogin = async () => {
    if (loading) return;
    setLastError(null);
    setLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/(tabs)",
      });
      // Refresh session to get updated user info
      await authClient.getSession();
      router.replace("/(tabs)");
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = e?.message || "Fallo el inicio de sesión";
      setLastError(msg);
      Alert.alert("Login error", msg);
      console.warn("Auth signIn error", e);
    } finally {
      setLoading(false);
    }
  };
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
        {lastError && (
          <Text className="text-red-600 text-xs mt-3 text-center">
            {lastError}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

