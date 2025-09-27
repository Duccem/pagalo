import { useColorScheme } from "@/lib/use-color-scheme";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Plus, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Button from "../ui/button";

const PeopleSheet = ({
  people,
  setPeople,
  removePeople,
  initialPeople = [],
  item,
}: {
  people: { id: number; invoiceId: number; name: string; total: number }[];
  setPeople: (people: {
    id: number;
    invoiceId: number;
    name: string;
    total: number;
  }) => void;
  removePeople: (people: {
    id: number;
    invoiceId: number;
    name: string;
    total: number;
  }) => void;
  initialPeople?: {
    id: number;
    invoiceId: number;
    name: string;
    total: number;
  }[];
  item: string;
}) => {
  const { colorScheme } = useColorScheme();
  const [selectedPeople, setSelectedPeople] =
    React.useState<
      { id: number; invoiceId: number; name: string; total: number }[]
    >(initialPeople);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((_index: number) => {}, []);
  useEffect(() => {
    setSelectedPeople(initialPeople);
  }, [initialPeople]);
  const closeSheet = () => {
    bottomSheetModalRef.current?.close();
  };
  return (
    <>
      <Button
        action={handlePresentModalPress}
        styles={{ borderRadius: 9999, padding: 5 }}
      >
        <Plus color="#fff" size={25} />
      </Button>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "white",
        }}
        onChange={handleSheetChanges}
        snapPoints={["50%", "90%"]}
        handleStyle={{
          display: "none",
        }}
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
        }}
      >
        <View className="min-h-full">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl text-foreground mb-4 w-2/3">
              Who's sharing <Text className="font-bold">{item}</Text>?
            </Text>
            <TouchableOpacity onPress={closeSheet}>
              <X />
            </TouchableOpacity>
          </View>
          <BottomSheetFlatList
            className="w-full h-full"
            estimatedItemSize={100}
            data={people}
            renderItem={({ item }: any) => (
              <View className="w-full bg-green-400 rounded-2xl px-4 py-3 my-2 flex-row items-center justify-between">
                <Text className="text-lg text-white">{item.name}</Text>
                <View>
                  <BouncyCheckbox
                    isChecked={selectedPeople.some((p) => p.id === item.id)}
                    onPress={(isChecked: boolean) => {
                      if (isChecked) {
                        setPeople(item);
                      } else {
                        removePeople(item);
                      }
                    }}
                    fillColor="black"
                  />
                </View>
              </View>
            )}
            keyExtractor={(_item: any, index: number) => index.toString()}
          />
        </View>
      </BottomSheetModal>
    </>
  );
};

export default PeopleSheet;

