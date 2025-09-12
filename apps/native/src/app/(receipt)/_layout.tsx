import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="manual"
        options={{
          headerShown: false,
          title: "Manual Entry",
        }}
      />
    </Stack>
  );
}

