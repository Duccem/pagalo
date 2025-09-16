import ScreenView from "@/components/screen-view";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowLeft,
  Divide,
  Home,
  Package,
  Paperclip,
  Users,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Progress from "react-native-progress";

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
  const { data: people } = useLiveQuery(
    database
      .select()
      .from(schema.member)
      .where(eq(schema.member.invoiceId, Number(params.id)))
  );

  const percentagePayed =
    data && data.length > 0 && people && people.length > 0 && data[0].total > 0
      ? people
          .filter((p) => p.status === "payed")
          .reduce((acc, person) => acc + person.total, 0) /
        (data[0].total - data[0].tip - data[0].tax)
      : 0;

  const savePayments = async (id: number, checked: boolean) => {
    const newStatus = checked ? "payed" : "pending";
    await database
      .update(schema.member)
      .set({ status: newStatus })
      .where(eq(schema.member.id, id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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

        <View className="w-full flex-1 justify-start items-center px-2 gap-6">
          <View className="w-full  justify-start items-center gap-4 mt-8">
            <Text className="text-4xl w-full text-start font-bold ">
              Split summary
            </Text>
            <Text className="text-lg w-full text-start font-medium">
              Here is how you should split this bill:
            </Text>
          </View>
          <View className="flex-row w-full justify-between items-center">
            <Text className="text-end text-black text-2xl">
              {`${Math.round(percentagePayed * 100)}% paid`}
            </Text>
          </View>
          <View className="w-full gap-2 flex-row justify-between items-center border-b border-black pb-4">
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Total</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.total.toFixed(2)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Tax</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.tax.toFixed(2)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Tip</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.tip.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="w-full flex-row justify-between items-center">
            <TouchableOpacity
              className="flex-row items-center gap-2 bg-black px-2 py-3 rounded-2xl"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/people?invoice=${params.id}`);
              }}
            >
              <Users color={"white"} size={25} />
              <Text className="text-white text-lg">Members</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2 border border-black px-2 py-3 rounded-2xl"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/items?invoice=${params.id}`);
              }}
            >
              <Package color={"black"} size={25} />
              <Text className="text-black text-lg">Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-2 border border-black px-2 py-3 rounded-2xl"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/split?invoice=${params.id}`);
              }}
            >
              <Divide color={"black"} size={25} />
              <Text className="text-black text-lg">Split</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={people}
            className="w-full flex-1 gap-4"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="w-full flex-row justify-between items-center p-4 bg-white shadow-lg rounded-2xl my-1">
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl font-medium">{item.name}</Text>
                  <Text className="text-2xl font-bold">
                    ${item.total.toFixed(2)}{" "}
                  </Text>
                </View>
                <View>
                  <BouncyCheckbox
                    isChecked={item.status === "payed"}
                    onPress={async (isChecked: boolean) => {
                      console.log(isChecked);
                      savePayments(item.id, isChecked);
                    }}
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

