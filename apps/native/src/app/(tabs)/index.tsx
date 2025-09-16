import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as schema from "@/lib/db/schema";
import { useEffect } from "react";
import ScreenView from "@/components/screen-view";
import { House } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data, error } = useLiveQuery(
    database.select().from(schema.invoice).limit(10)
  );
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error</Text>
      </View>
    );
  }
  useEffect(() => {
    console.log("Data", data);
  }, [data]);
  return (
    <ScreenView>
      <View className="flex-1 items-center justify-center pt-6 gap-6">
        <View className="w-full flex-row justify-between items-center mt-5 px-6">
          <Text className="text-xl text-black">
            {session ? `${session.user.name}` : `User`}
          </Text>
          <TouchableOpacity className="size-16 rounded-full overflow-hidden bg-black">
            <Image
              src={
                session?.user.image ?? "https://ui-avatars.com/api/?name=User"
              }
              className="size-16 rounded-full"
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          className="w-full px-6"
          renderItem={(item) => (
            <TouchableOpacity
              className="w-full bg-white px-4 py-3 my-4 rounded-2xl flex-row justify-between items-center shadow-lg"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/summary?id=${item.item.id}`);
              }}
            >
              <View className="flex-row items-center gap-4">
                <House color={"black"} size={25} />
                <Text className="text-xl text-black">{item.item.vendor}</Text>
              </View>
              <Text className="text-xl text-black">${item.item.total}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, alignItems: "center", justifyContent: "center" },
});

