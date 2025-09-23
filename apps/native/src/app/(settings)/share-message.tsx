import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import { useShareMessagePreference } from "@/lib/preferences";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Save } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ShareMessageScreen() {
  const { shareMessage, setShareMessage, loading, defaultValue } =
    useShareMessagePreference();
  const [value, setValue] = useState(shareMessage || defaultValue);
  const [saving, setSaving] = useState(false);

  // Sync local state when shareMessage updates live
  useEffect(() => {
    setValue(shareMessage || defaultValue);
  }, [shareMessage, defaultValue]);

  const onSave = async () => {
    if (saving) return;
    setSaving(true);
    Haptics.selectionAsync();
    try {
      await setShareMessage(value);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSaving(false);
    }
  };

  const disabled = loading || saving;

  return (
    <ScreenView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View className="flex-1 px-6 pb-6 gap-6">
          {/* Header */}
          <View className="w-full flex-row justify-between items-center pt-2">
            <Pressable
              className="flex-row items-center gap-3"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.back();
              }}
            >
              <ArrowLeft size={28} color="#000" />
              <Text className="text-lg">Back</Text>
            </Pressable>
            <Button
              action={onSave}
              styles={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Save size={18} color={disabled ? "#555" : "#fff"} />
              <Text
                className={`text-sm font-medium ${
                  disabled ? "text-gray-600" : "text-white"
                }`}
              >
                Save
              </Text>
            </Button>
          </View>

          <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-base font-semibold">Share message</Text>
                <Text className="text-xs text-gray-500">
                  This message will appear when you share bills or receipts. You
                  can customize it for your friends or context.
                </Text>
              </View>

              <View className="bg-white rounded-2xl p-4">
                <TextInput
                  multiline
                  className="text-base text-black"
                  placeholder="Write the message..."
                  value={value}
                  onChangeText={setValue}
                  placeholderTextColor="#9ca3af"
                  textAlignVertical="top"
                  style={{ minHeight: 140 }}
                  maxLength={200}
                  editable={!disabled}
                  returnKeyType="done"
                  blurOnSubmit
                />
                <View className="flex-row justify-between mt-2">
                  <Text className="text-xs text-gray-400">
                    {value.trim().length}/200 characters
                  </Text>
                  {value.trim() !== (shareMessage || defaultValue) && (
                    <Text className="text-xs text-amber-600">Unsaved</Text>
                  )}
                </View>
              </View>

              <View className="bg-white rounded-2xl p-4 gap-2">
                <Text className="text-xs uppercase text-gray-500 tracking-wider">
                  Preview
                </Text>
                <View className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <Text className="text-sm text-gray-800">{value.trim()}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}

