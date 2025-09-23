import { AnimationScreen } from "@/components/shared/animation-splash";
import { TabBar } from "@/components/shared/tab-bar";
import { authClient } from "@/lib/auth-client";
import { Redirect, Tabs } from "expo-router";

export default function TabLayout() {
  const { isPending, data } = authClient.useSession();

  if (isPending) return <AnimationScreen appReady={true} finish={() => {}} />;
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
