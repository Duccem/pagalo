import { useColorScheme } from "@/lib/use-color-scheme";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Plus } from "lucide-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Button from "../ui/button";

const PeopleSheet = ({
  people,
  setPeople,
  removePeople,
  initialPeople = [],
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
        snapPoints={["75%"]}
        bottomInset={0}
        handleStyle={{
          display: "none",
        }}
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          position: "relative",
          paddingTop: 20,
        }}
      >
        <BottomSheetFlatList
          className="w-full "
          estimatedItemSize={43.3}
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
      </BottomSheetModal>
    </>
  );
};

export default PeopleSheet;

