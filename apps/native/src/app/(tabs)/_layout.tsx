import { TabBar } from "@/components/shared/tab-bar";
import { authClient } from "@/lib/auth-client";
import { Tabs, Redirect } from "expo-router";

export default function TabLayout() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (!session) {
    return <Redirect href={"/(auth)/welcome"} />;
  }
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
