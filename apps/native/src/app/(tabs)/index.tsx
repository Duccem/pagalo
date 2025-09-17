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
import { House, Trash } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { eq } from "drizzle-orm";
import Button from "@/components/ui/button";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data, error } = useLiveQuery(
    database.select().from(schema.invoice).limit(10)
  );
  async function remove(id: number) {
    await database
      .delete(schema.memberItem)
      .where(eq(schema.memberItem.invoiceId, id));
    await database.delete(schema.member).where(eq(schema.member.invoiceId, id));
    await database.delete(schema.item).where(eq(schema.item.invoiceId, id));
    await database.delete(schema.invoice).where(eq(schema.invoice.id, id));
  }
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
      <View className="flex-1 items-center justify-start  gap-6">
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
          className="w-full px-6 mb-20"
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
              <View className="flex-row items-center gap-4">
                <Text className="text-xl text-black">${item.item.total}</Text>
                <TouchableOpacity
                  className="bg-red-400  rounded-2xl px-4 py-3 justify-center items-center"
                  onPress={() => remove(item.item.id)}
                >
                  <Text className="text-white">
                    <Trash size={25} color={"#fff"} />
                  </Text>
                </TouchableOpacity>
              </View>
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

