import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { supabase } from "@/lib/supabase/client";
import { decode } from "base64-arraybuffer";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, Loader2 } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState<string | undefined>(
    user?.image || undefined
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permission needed",
          "We need media library permission to pick an avatar"
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });
      if (!result.canceled) {
        setUploading(true);
        await supabase.storage
          .from("pagalo-receipts")
          .upload(
            `avatars/${result.assets[0].fileName}`,
            decode(result.assets[0].base64 ?? ""),
            {
              contentType: `${result.assets[0].mimeType}`,
            }
          );
        const url = supabase.storage
          .from("pagalo-receipts")
          .getPublicUrl(`avatars/${result.assets[0].fileName}`).data.publicUrl;
        setImage(url);
        setUploading(false);
      }
    } catch (e) {
      console.error(e);
      setUploading(false);
      Alert.alert("Error", "Could not pick image");
    }
  };

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      // Use better-auth update user method
      await authClient.updateUser({ name, image });
      // Refresh session to get updated user info
      await authClient.getSession();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenView>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 px-6 gap-10 pb-10">
          <View className="w-full flex-row justify-between items-center">
            <TouchableOpacity
              className="flex-row items-center gap-4"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.back();
              }}
            >
              <ArrowLeft size={30} color={"#000"} />
              <Text className="text-xl">Back</Text>
            </TouchableOpacity>
            <Text className="text-lg font-medium">Edit profile</Text>
          </View>

          {/* Avatar */}
          <View className="items-center gap-4">
            <Pressable onPress={pickImage} className="relative">
              <View className="size-28 rounded-3xl bg-white overflow-hidden items-center justify-center">
                {image ? (
                  <Image source={{ uri: image }} className="h-full w-full" />
                ) : (
                  <Text className="text-gray-400">No image</Text>
                )}
                {uploading && (
                  <View className="absolute inset-0 bg-black/40 items-center justify-center">
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </View>
              <Text className="text-sm mt-2 text-gray-600 text-center">
                Tap to change
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View className="gap-6">
            <View>
              <Text className="text-xs uppercase text-gray-500 mb-2 tracking-wider">
                Name
              </Text>
              <TextInput
                className="border bg-white border-gray-300  rounded-2xl p-4 text-base"
                placeholder="Your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                maxLength={60}
              />
            </View>
            <View>
              <Text className="text-xs uppercase text-gray-500 mb-2 tracking-wider">
                Email
              </Text>
              <View className="bg-gray-100 rounded-2xl p-4">
                <Text className="text-base text-gray-600">{user?.email}</Text>
              </View>
            </View>
          </View>

          <View className="mt-auto gap-4">
            <Button disabled={submitting || !name.trim()} action={submit}>
              {submitting ? (
                <View className="flex-row items-center gap-2">
                  <Loader2 size={18} color="#fff" />
                  <Text className="text-white font-semibold">Saving...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-base">
                  Save changes
                </Text>
              )}
            </Button>
            <Text className="text-center text-xs text-gray-400">
              Avatar upload pending server endpoint. Changes may not persist
              after re-login.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenView>
  );
};

export default ProfileScreen;

