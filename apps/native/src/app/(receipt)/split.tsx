import ScreenView from "@/components/screen-view";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, BrushCleaning, Plus } from "lucide-react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import PeopleSheet from "@/components/people-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Item = {
  name: string;
  price: number;
  persons: string[];
};
const mockedItems: Item[] = [
  { name: "Pizza", price: 12.99, persons: [] },
  { name: "Soda", price: 1.99, persons: [] },
  { name: "Salad", price: 5.99, persons: [] },
];

const persons = ["Alice", "Bob", "Charlie"];

const Split = () => {
  const [items, setItems] = React.useState<Item[]>([...mockedItems]);
  const [evenly, setEvenly] = React.useState<number>(0);
  const changeEvenly = () => {
    setEvenly((current) => (current === 0 ? 1 : 0));
  };
  const canContinue =
    mockedItems.every((item) => item.persons.length > 0) || evenly === 1;
  return (
    <ScreenView>
      <View
        className="flex-1 justify-start items-center relative px-6"
        style={{
          paddingTop: useSafeAreaInsets().top + 16,
          paddingBottom: useSafeAreaInsets().bottom + 16,
        }}
      >
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
        <View className="flex-row justify-between items-center w-full mt-5">
          <Text className="text-4xl font-bold">Assign items</Text>
          <TouchableOpacity
            activeOpacity={1}
            className={`border border-black px-4 py-2 rounded-2xl ${
              evenly === 1 ? "bg-black " : "bg-white "
            }`}
            onPress={changeEvenly}
          >
            <Text
              className={` text-lg ${
                evenly === 1 ? "text-white" : "text-black"
              }`}
            >
              Split evenly
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          className="w-full mt-8 mb-32 flex-1"
          data={items}
          renderItem={({ item }) => (
            <View className="border-b border-black py-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold">
                  {item.name} - ${item.price.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="rounded-full p-2 border border-black border-dashed"
                    activeOpacity={1}
                    onPress={() => {
                      setItems((current) =>
                        current.map((it) =>
                          it.name === item.name ? { ...it, persons: [] } : it
                        )
                      );
                    }}
                  >
                    <BrushCleaning color={"black"} size={25} />
                  </TouchableOpacity>
                  <PeopleSheet
                    initialPeople={item.persons}
                    people={persons}
                    setPeople={(p) => {
                      setItems((current) =>
                        current.map((it) =>
                          it.name === item.name ? { ...it, persons: p } : it
                        )
                      );
                    }}
                  />
                </View>
              </View>
              <View className="flex-row flex-wrap mt-2">
                {item.persons.map((person) => (
                  <TouchableOpacity
                    key={person}
                    className="bg-gray-200 px-3 py-1 rounded-full m-1"
                    onPress={() => {
                      setItems((current) =>
                        current.map((it) =>
                          it.name === item.name
                            ? {
                                ...it,
                                persons: it.persons.filter((p) => p !== person),
                              }
                            : it
                        )
                      );
                    }}
                  >
                    <Text className="text-lg">{person}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          className={`absolute flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl ${
            canContinue ? "" : "bg-gray-500"
          }`}
          style={{ bottom: useSafeAreaInsets().bottom + 16 }}
          onPress={() => {
            router.push("/(receipt)/summary");
          }}
          disabled={!canContinue}
        >
          <Text className="text-2xl text-white">
            {canContinue ? "Continue" : "Split the bill"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default Split;

