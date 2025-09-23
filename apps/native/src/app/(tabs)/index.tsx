import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
} from "react-native";
import * as schema from "@/lib/db/schema";
import ScreenView from "@/components/shared/screen-view";
import { Bell, Receipt, Settings, Users } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/button";
import { eq, getTableColumns, sql } from "drizzle-orm";

export default function HomeScreen() {
  const { data: session } = authClient.useSession();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data, error } = useLiveQuery(
    database
      .select({
        ...getTableColumns(schema.invoice),
        participantCount: sql<number>`count(${schema.member.id})`,
      })
      .from(schema.invoice)
      .leftJoin(schema.member, eq(schema.member.invoiceId, schema.invoice.id))
      .where(eq(schema.invoice.state, "pending"))
      .limit(5)
  );
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error.message}</Text>
      </View>
    );
  }
  const remove = async () => {
    await database.delete(schema.invoice);
    await database.delete(schema.member);
    await database.delete(schema.item);
    await database.delete(schema.memberItem);
  };
  return (
    <ScreenView>
      <View className="flex-1 items-center justify-start  gap-6 w-fulls">
        <View className="w-full flex-row justify-between items-center mt-5 px-6">
          <View className="rounded-2xl overflow-hidden bg-green-400 size-16">
            <Image
              src={
                session?.user.image ?? "https://ui-avatars.com/api/?name=User"
              }
              resizeMethod="auto"
              className="h-full w-full"
            />
          </View>
          <View className="flex-row items-end gap-2">
            <Button variant="white">
              <Bell className="text-black size-6" />
            </Button>
            <Button variant="white" action={remove}>
              <Settings className="text-black size-6" />
            </Button>
          </View>
        </View>
        <View className="flex-col w-full px-6 ">
          <Text className="text-3xl font-normal text-black w-full text-start ">
            Welcome back
          </Text>
          <Text className="text-2xl font-light  w-full text-start ">
            {session?.user.name ?? session?.user.email ?? "User"}
          </Text>
        </View>
        <View className="w-full px-6 flex-row gap-3 items-center">
          <Pressable className="flex-1 w-1/3">
            <View className="bg-white rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/recepcion.png")}
                className="size-12"
              />
              <Text className="text-sm">Split bill</Text>
            </View>
          </Pressable>
          <Pressable className="flex-1 w-1/3">
            <View className="bg-gray-200 rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/presupuesto.png")}
                className="size-12"
              />
              <Text className="text-sm">Record spend</Text>
            </View>
          </Pressable>
          <Pressable className="flex-1 w-1/3">
            <View className="bg-gray-200 rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/hucha.png")}
                className="size-12"
              />
              <Text className="text-sm">Setup budget</Text>
            </View>
          </Pressable>
        </View>
        <View className="flex-row justify-between w-full px-6">
          <Text className="text-lg text-gray-700 font-light ">
            Active bills
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}>
            <Text className="text-sm text-gray-600 font-light">view all</Text>
          </Pressable>
        </View>
        <FlatList
          data={data.filter((i) => i.vendor !== null && i.date !== null)}
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
                <View className="bg-green-400 p-3 rounded-2xl">
                  <Receipt size={25} color={"white"} />
                </View>
                <View className=" gap-1">
                  <Text className="text-xl text-black">{item.item.vendor}</Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(item.item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-xl text-black">
                  ${item.item?.total?.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text>{item.item.participantCount ?? 0}</Text>
                  <Users className="size-2 text-black" size={15} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View className="w-full h-40 items-center justify-center">
              <Text className="text-gray-400">No data</Text>
            </View>
          )}
        />
      </View>
    </ScreenView>
  );
}

