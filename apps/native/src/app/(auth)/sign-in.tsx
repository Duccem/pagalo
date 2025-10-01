import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import Button from "@/components/ui/button";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOauth, setLoadingOauth] = useState(false);

  const onSubmit = async () => {
    if (loading) return;
    if (!email || !password) {
      Alert.alert("Required fields", "Enter email and password.");
      return;
    }
    try {
      setLoading(true);
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "/(tabs)",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await authClient.getSession();
      router.replace("/(tabs)");
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = e?.error?.message || e?.message || "Error signing in";
      Alert.alert("Couldn't sign in", msg);
    } finally {
      setLoading(false);
    }
  };

  const oauthLogin = async () => {
    if (loadingOauth) return;
    setLoadingOauth(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/(tabs)",
      },
      {
        onSuccess: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await authClient.getSession();
          setLoadingOauth(false);
        },
        onError: (error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert("Login error", error.error.message);
          console.warn("Auth signIn error", error.error.message);
          setLoadingOauth(false);
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <View className="flex-1 justify-start items-center w-full gap-8">
        <View className="w-full flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-row items-center gap-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.back();
            }}
          >
            <ArrowLeft size={30} color={"black"} />
            <Text className="text-xl text-foreground">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full justify-center items-center size-24">
          <Image
            source={require("@/assets/images/logo-green.png")}
            className="w-24"
            resizeMode="contain"
          />
        </View>

        <View className="mt-8 gap-4 w-full">
          <Text className="text-2xl font-bold">Sign in</Text>
          <Text className="text-gray-600">
            Enter your email and password to continue.
          </Text>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">Email</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder="you@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">Password</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>
          <Button action={onSubmit}>
            <Text className="text-white font-semibold">
              {loading ? "Signing in…" : "Sign in"}
            </Text>
          </Button>
          <Button variant="outline" action={oauthLogin}>
            {loadingOauth ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Image
                source={require("@/assets/google.png")}
                className="size-8"
                resizeMode="contain"
              />
            )}
            <Text className="text-black font-semibold">
              {loadingOauth ? "Starting..." : "Continue with Google"}
            </Text>
          </Button>

          <View className="flex-row gap-2 justify-center mt-2">
            <Text className="text-gray-700">Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-up" as any)}
            >
              <Text className="text-blue-600 font-semibold">Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

