import ScreenView from "@/components/screen-view";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Minus, Plus, Trash } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const People = () => {
  const params = useLocalSearchParams<{ invoice: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data: items } = useLiveQuery(
    database
      .select()
      .from(schema.member)
      .where(eq(schema.member.invoiceId, Number(params.invoice)))
  );
  const [name, setName] = useState<string>("");
  const addItem = async () => {
    if (!name) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert("Error", "Please enter a name");
      return;
    }
    console.log("Adding", name);
    await database.insert(schema.member).values({
      name,
      invoiceId: Number(params.invoice),
      total: 0,
    });
    setName("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeItem = async (index: number) => {
    await database
      .delete(schema.member)
      .where(eq(schema.member.id, items[index].id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  return (
    <ScreenView>
      <View className="flex-1 justify-start items-center relative px-6">
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
        <View className="flex-1 justify-center items-center w-full gap-6 mt-10">
          <View className="gap-2">
            <Text className="text-4xl w-full text-start font-bold">
              Who's Splitting?
            </Text>
            <Text className="text-start text-lg text-muted-foreground">
              Add people to split the bill with. You can add them later too.
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TextInput
              className="border border-black w-4/5 rounded-2xl px-4 py-3"
              placeholder="eg. Jose"
              value={name}
              onChangeText={setName}
            />

            <TouchableOpacity
              className="bg-black w-1/5 rounded-2xl px-4 justify-center items-center"
              onPress={addItem}
              activeOpacity={1}
            >
              <Plus size={25} color={"#fff"} />
            </TouchableOpacity>
          </View>
          <FlatList
            className="w-full mt-8 mb-32 flex-1"
            data={items}
            renderItem={(item) => {
              return (
                <View className="flex-row justify-between items-center border-b border-black py-4">
                  <View className="flex-row gap-4 items-center">
                    <Text className="text-lg">{item.item.name}</Text>
                  </View>
                  <TouchableOpacity
                    className="bg-red-400  rounded-2xl px-4 py-3 justify-center items-center"
                    onPress={() => removeItem(item.index)}
                  >
                    <Text className="text-white">
                      <Trash size={25} color={"#fff"} />
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          ></FlatList>
        </View>
        <TouchableOpacity
          className="absolute bottom-0 flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/(receipt)/split?invoice=${params.invoice}`);
          }}
        >
          <Text className="text-2xl text-white">Continue</Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default People;

