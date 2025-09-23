import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import * as schema from "@/lib/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Bell, Receipt, Settings, Users } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
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
            <Button
              variant="white"
              action={() => router.push("/(settings)/notifications")}
            >
              <Bell
                className="text-foreground size-6"
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </Button>
            <Button
              variant="white"
              action={() => router.push("/(settings)/settings")}
            >
              <Settings
                className="text-foreground size-6"
                color={colorScheme === "dark" ? "white" : "black"}
              />
            </Button>
          </View>
        </View>
        <View className="flex-col w-full px-6 ">
          <Text className="text-3xl font-normal text-foreground w-full text-start ">
            Welcome back
          </Text>
          <Text className="text-2xl font-light  w-full text-start text-foreground">
            {session?.user.name ?? session?.user.email ?? "User"}
          </Text>
        </View>
        <View className="w-full px-6 flex-row gap-3 items-center">
          <Pressable
            className="flex-1 w-1/3"
            onPress={() => router.push("/(receipt)/manual")}
          >
            <View className="bg-card rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/recepcion.png")}
                className="size-12"
              />
              <Text className="text-sm text-foreground">Split bill</Text>
            </View>
          </Pressable>
          <Pressable className="flex-1 w-1/3">
            <View className="bg-card rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/presupuesto.png")}
                className="size-12"
              />
              <Text className="text-sm text-foreground">Record spend</Text>
            </View>
          </Pressable>
          <Pressable className="flex-1 w-1/3">
            <View className="bg-card rounded-2xl px-4 py-3 items-center gap-3">
              <Image
                source={require("@/assets/images/hucha.png")}
                className="size-12"
              />
              <Text className="text-sm text-foreground">Setup budget</Text>
            </View>
          </Pressable>
        </View>
        <View className="flex-row justify-between w-full px-6">
          <Text className="text-lg text-muted-foreground font-light ">
            Active bills
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/explore")}>
            <Text className="text-sm text-muted-foreground font-light">
              view all
            </Text>
          </Pressable>
        </View>
        <FlatList
          data={data.filter((i) => i.vendor !== null && i.date !== null)}
          className="w-full px-6 mb-20"
          renderItem={(item) => (
            <TouchableOpacity
              className="w-full bg-card px-4 py-3 my-4 rounded-2xl flex-row justify-between items-center shadow-lg"
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
                  <Text className="text-xl text-foreground">
                    {item.item.vendor}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {new Date(item.item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <View className="gap-1 items-end">
                <Text className="text-xl text-foreground">
                  ${item.item?.total?.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-foreground">
                    {item.item.participantCount ?? 0}
                  </Text>
                  <Users
                    className="size-2 text-foreground"
                    size={15}
                    color={colorScheme === "dark" ? "white" : "black"}
                  />
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

