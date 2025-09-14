import ScreenView from "@/components/screen-view";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Minus, Plus, Trash } from "lucide-react-native";
import { rem } from "nativewind";
import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  FlatList,
} from "react-native";

const Items = () => {
  const params = useLocalSearchParams<{ invoice: string }>();
  const [name, setName] = React.useState<string>("");
  const [price, setPrice] = React.useState<number>(0);
  const [items, setItems] = React.useState<{ name: string; price: number }[]>([
    { name: "Pizza", price: 12.99 },
    { name: "Soda", price: 1.99 },
    { name: "Salad", price: 5.99 },
  ]);
  const [totalPrice, setTotalPrice] = React.useState<number>(
    items.reduce((a, b) => a + b.price, 0)
  );

  const [tax, setTax] = React.useState<number>(0);
  const [tip, setTip] = React.useState<number>(0);

  const addItem = () => {
    if (!name || !price) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }
    setItems((prev) => [...prev, { name, price }]);
    setName("");
    setPrice(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  useEffect(() => {
    setTotalPrice(items.reduce((a, b) => a + b.price, 0) + tax + tip);
  }, [items, tax, tip]);

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
        <View className="absolute bottom-0 gap-6 w-full px-2 bg-white">
          <View className="w-full flex-row justify-between items-center gap-2">
            <View className="w-2/5 gap-2">
              <Text className="text-lg font-medium">Tax:</Text>
              <TextInput
                className="border border-black w-full rounded-2xl px-4 py-3"
                placeholder="$0"
                value={tax ? tax.toString() : ""}
                onChangeText={(text) => setTax(Number(text))}
                keyboardType="numeric"
              />
            </View>
            <View className="w-2/5 gap-2">
              <Text className="text-lg font-medium">Tip:</Text>
              <TextInput
                className="border border-black w-full rounded-2xl px-4 py-3"
                placeholder="$0"
                value={tip ? tip.toString() : ""}
                onChangeText={(text) => setTip(Number(text))}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View>
            <Text className="text-2xl font-medium">
              Total: ${totalPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
            onPress={() => {
              router.push(`/(receipt)/people?invoice=${params.invoice}`);
            }}
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

