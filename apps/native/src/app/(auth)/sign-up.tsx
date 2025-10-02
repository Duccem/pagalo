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
import { t } from "@/lib/i18n";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOauth, setLoadingOauth] = useState(false);

  const onSubmit = async () => {
    if (loading) return;
    if (!email || !password) {
      Alert.alert(t("auth.requiredFields"), t("auth.requiredFieldsMsg"));
      return;
    }
    if (password !== confirm) {
      Alert.alert(
        t("auth.passwordsDontMatch"),
        t("auth.passwordsDontMatchMsg")
      );
      return;
    }
    try {
      setLoading(true);
      await authClient.signUp.email({
        email,
        name: name || email.split("@")[0],
        password,
        callbackURL: "/(tabs)",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await authClient.getSession();
      router.replace("/(tabs)");
    } catch (e: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = e?.error?.message || e?.message || t("auth.signUpErrorTitle");
      Alert.alert(t("auth.signUpErrorTitle"), msg);
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
            <Text className="text-xl text-foreground">{t("common.back")}</Text>
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
          <Text className="text-2xl font-bold">{t("auth.signUpHeader")}</Text>
          <Text className="text-gray-600">{t("auth.signUpSubtext")}</Text>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">{t("auth.name")}</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder={t("placeholders.yourName")}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">{t("auth.email")}</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder={t("placeholders.email")}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">{t("auth.password")}</Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder={t("placeholders.password")}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>
          <View className="gap-2">
            <Text className="text-sm text-gray-700">
              {t("auth.confirmPassword")}
            </Text>
            <TextInput
              className="bg-white border rounded-xl px-4 py-3"
              placeholder={t("placeholders.password")}
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              editable={!loading}
            />
          </View>
          <Button disabled={loading} action={onSubmit}>
            <Text className="text-white font-semibold">
              {loading ? t("auth.creating") : t("auth.createAccount")}
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
              {loadingOauth
                ? t("actions.starting")
                : t("actions.continueWithGoogle")}
            </Text>
          </Button>

          <View className="flex-row gap-2 justify-center mt-2">
            <Text className="text-gray-700">
              {t("auth.alreadyHaveAccount")}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/sign-in" as any)}
            >
              <Text className="text-blue-600 font-semibold">
                {t("auth.signIn")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

