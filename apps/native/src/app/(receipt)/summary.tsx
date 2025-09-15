import ScreenView from "@/components/screen-view";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Home, Paperclip } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Details = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data, error } = useLiveQuery(
    database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.id, Number(params.id)))
      .limit(1)
  );
  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error</Text>
      </View>
    );
  }
  return (
    <ScreenView>
      <View className="flex-1 px-6">
        <View className="w-full ">
          <TouchableOpacity
            className="flex-row items-center gap-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.back();
            }}
          >
            <ArrowLeft size={30} color={"#000"} />
            <Text className="text-xl">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex-1 justify-start items-center px-2 gap-12">
          <View className="w-full  justify-start items-center gap-4 mt-8">
            <Text className="text-4xl w-full text-start font-bold ">
              Split summary {data[0]?.vendor}
            </Text>
            <Text className="text-lg w-full text-start font-medium">
              Here is how you should split this bill:
            </Text>
          </View>
          <FlatList
            data={[
              { name: "Alice", amount: 15.99 },
              { name: "Bob", amount: 10.5 },
              { name: "Charlie", amount: 5.0 },
            ]}
            className="w-full flex-1 gap-4"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="w-full flex-row justify-between items-center p-4 border border-gray-300 rounded-2xl my-1">
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl font-medium">{item.name}</Text>
                  <Text className="text-2xl font-bold">
                    ${item.amount.toFixed(2)}
                  </Text>
                </View>
                <View>
                  <BouncyCheckbox
                    onPress={(isChecked: boolean) => {}}
                    fillColor="black"
                  />
                </View>
              </View>
            )}
          />
          <View className="w-full gap-4 mb-8">
            <TouchableOpacity
              className="flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Paperclip color={"white"} size={25} />
              <Text className="text-2xl text-white">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-4  w-full border border-black p-4 justify-center rounded-2xl"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/(tabs)");
              }}
            >
              <Home color={"black"} size={25} />
              <Text className="text-2xl text-black">Go Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default Details;

