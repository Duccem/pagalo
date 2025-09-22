import { Redirect, Tabs } from "expo-router";
import { TabBar } from "@/components/shared/tab-bar";
import { authClient } from "@/lib/auth-client";

export default function TabLayout() {
  const { isPending, data } = authClient.useSession();

  if (isPending) return null;
  if (!data?.session) {
    return <Redirect href={"/(auth)/welcome"} />;
  }
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} initialRouteName="new">
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
