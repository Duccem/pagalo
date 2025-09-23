import ScreenView from "@/components/shared/screen-view";
import * as schema from "@/lib/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ListFilter, Receipt, Users } from "lucide-react-native";
import { FlatList, Pressable, Text, View } from "react-native";

export default function TabTwoScreen() {
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
  return (
    <ScreenView>
      <View className="px-6 gap-8">
        <View>
          <Text className="w-full text-start text-2xl font-light">
            History of bills
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Pressable className="px-3 py-2 rounded-full bg-white gap-2 flex-row items-center">
            <ListFilter size={20} color={"black"} />
            <Text className="text-black text-lg">filter</Text>
          </Pressable>
        </View>
        {!data && error && (
          <View className="flex-1 items-center justify-center">
            <Text>{error.message}</Text>
          </View>
        )}
        {data && (
          <FlatList
            data={data.filter((inv) => inv.vendor != null && inv.date != null)}
            renderItem={(item) => {
              return (
                <Pressable
                  className="w-full bg-white px-4 py-3 my-4 rounded-2xl flex-row justify-between items-center shadow-lg"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(`/(receipt)/summary?id=${item.item.id}`);
                  }}
                >
                  <View className="flex-row items-center gap-4">
                    <View
                      className="p-3 rounded-2xl"
                      style={{
                        backgroundColor:
                          item.item.state === "paid"
                            ? "#4ade80"
                            : item.item.state === "cancelled"
                            ? "f87171"
                            : "#60a5fa",
                      }}
                    >
                      <Receipt size={25} color={"white"} />
                    </View>
                    <View className=" gap-1">
                      <Text className="text-xl text-black">
                        {item.item.vendor}
                      </Text>
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
                </Pressable>
              );
            }}
            ListEmptyComponent={() => (
              <View className="w-full h-40 items-center justify-center">
                <Text className="text-gray-400">No data</Text>
              </View>
            )}
            keyExtractor={(_item, index) => index.toString()}
            className="mb-20"
            ItemSeparatorComponent={() => <View className="h-4" />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenView>
  );
}

