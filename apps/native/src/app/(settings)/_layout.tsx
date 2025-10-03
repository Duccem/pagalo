import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="currency"
        options={{
          title: "Currency",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="share-message"
        options={{
          title: "Share Message",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: "Language",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

