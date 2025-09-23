import { authClient } from "@/lib/auth-client";
import { Redirect, Stack } from "expo-router";

export default function SettingsLayout() {
  const { isPending, data } = authClient.useSession();

  if (isPending) return null;
  if (!data?.session) {
    return <Redirect href={"/(auth)/welcome"} />;
  }
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
    </Stack>
  );
}

