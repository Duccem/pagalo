import ScreenView from "@/components/screen-view";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowLeft, DollarSign, Minus, Plus, Trash } from "lucide-react-native";
import { rem } from "nativewind";
import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ta } from "date-fns/locale";

const Items = () => {
  const params = useLocalSearchParams<{ invoice: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data: items } = useLiveQuery(
    database
      .select()
      .from(schema.item)
      .where(eq(schema.item.invoiceId, Number(params.invoice)))
  );
  const { data: invoice } = useLiveQuery(
    database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.id, Number(params.invoice)))
      .limit(1)
  );
  const [name, setName] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);

  const [tax, setTax] = React.useState<string>(invoice[0]?.tax?.toFixed(2));
  const [tip, setTip] = React.useState<string>(invoice[0]?.tip?.toFixed(2));

  const totalPrice = useMemo(() => {
    if (!items || !invoice) return 0;
    return (
      items.reduce((a, b) => a + b.price * b.quantity, 0) +
      (Number(tax || 0) + (Number(tip) || 0))
    );
  }, [items, invoice, tax, tip]);

  const addItem = async () => {
    if (!name || !price) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Alert.alert("Error", "Please enter a name and price");
      return;
    }
    await database.insert(schema.item).values({
      name,
      price,
      invoiceId: Number(params.invoice),
      quantity: 1,
    });
    setName("");
    setPrice(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeItem = async (index: number) => {
    await database
      .delete(schema.item)
      .where(eq(schema.item.id, items[index].id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const saveTotal = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const total =
      items.reduce((a, b) => a + b.price, 0) + Number(tax) + Number(tip);
    await database
      .update(schema.invoice)
      .set({ total, tax: Number(tax), tip: Number(tip) })
      .where(eq(schema.invoice.id, Number(params.invoice)));
    router.push(`/(receipt)/people?invoice=${params.invoice}`);
  };

  useEffect(() => {
    setTax(invoice ? invoice[0]?.tax.toFixed(2) : "0");
    setTip(invoice ? invoice[0]?.tip.toFixed(2) : "0");
  }, [invoice]);

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
        <View className="w-full flex-1 justify-start items-center px-2">
          <Text className="text-4xl w-full text-start font-bold my-12">
            Add Items
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              className="border border-black w-3/5 rounded-2xl px-4 py-3 "
              placeholder="eg. Pizza"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              className="border border-black w-1/5 rounded-2xl px-4 "
              placeholder="$0"
              keyboardType="numeric"
              value={price ? price.toString() : ""}
              onChangeText={(text) => setPrice(Number(text))}
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
                    <Text className="text-lg">
                      ${item.item.price.toFixed(2)}
                    </Text>
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
        <View className="absolute bottom-0 gap-6 w-full px-2 bg-gray-100">
          <View className="w-full flex-row justify-between items-center gap-2">
            <View className="w-2/5 gap-2">
              <Text className="text-lg font-medium">Tax:</Text>

              <View className="relative">
                <TextInput
                  className="border border-black w-full rounded-2xl px-4 py-4 pl-8"
                  placeholder="$0"
                  value={tax ?? "0"}
                  onChangeText={(text) => setTax(text)}
                  keyboardType="numeric"
                />
                <View className="absolute left-2 top-4">
                  <DollarSign size={20} color={"black"} />
                </View>
              </View>
            </View>
            <View className="w-2/5 gap-2">
              <Text className="text-lg font-medium">Tax:</Text>

              <View className="relative">
                <TextInput
                  className="border border-black w-full rounded-2xl px-4 py-4 pl-8"
                  placeholder="$0"
                  value={tip ?? "0"}
                  onChangeText={(text) => setTip(text)}
                  keyboardType="numeric"
                />
                <View className="absolute left-2 top-4">
                  <DollarSign size={20} color={"black"} />
                </View>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-2xl font-medium">
              Total: ${totalPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
            onPress={saveTotal}
          >
            <Text className="text-2xl text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default Items;

