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
      <Stack.Screen
        name="scan"
        options={{
          headerShown: false,
          title: "Scan Receipt",
        }}
      />
      <Stack.Screen
        name="items"
        options={{
          headerShown: false,
          title: "Items",
        }}
      />
      <Stack.Screen
        name="people"
        options={{
          headerShown: false,
          title: "Who's Splitting?",
        }}
      />
      <Stack.Screen
        name="split"
        options={{
          headerShown: false,
          title: "Assign items",
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          headerShown: false,
          title: "Summary",
        }}
      />
    </Stack>
  );
}

