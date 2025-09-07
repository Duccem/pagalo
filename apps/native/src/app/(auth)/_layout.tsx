import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade_from_bottom",
        animationDuration: 10,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
    </Stack>
  );
}

