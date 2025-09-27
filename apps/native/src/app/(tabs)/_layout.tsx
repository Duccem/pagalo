import { TabBar } from "@/components/shared/tab-bar";
import { Tabs } from "expo-router";
("react");

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "New",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "History",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
