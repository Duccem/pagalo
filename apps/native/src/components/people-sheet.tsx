import React, { useCallback, useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetFlashList,
  BottomSheetFlatList,
} from "@gorhom/bottom-sheet";
import { Plus } from "lucide-react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { rem } from "nativewind";

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
  const handleSheetChanges = useCallback((index: number) => {}, []);
  useEffect(() => {
    setSelectedPeople(initialPeople);
  }, [initialPeople]);
  return (
    <>
      <TouchableOpacity
        onPress={handlePresentModalPress}
        className="p-2 border border-dashed border-black rounded-full"
      >
        <Plus color="#000" size={25} />
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
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
            <View className="w-full border border-black rounded-2xl px-4 py-3 my-2 flex-row items-center justify-between">
              <Text className="text-lg">{item.name}</Text>
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
          keyExtractor={(item: any, index: number) => index.toString()}
        />
      </BottomSheetModal>
    </>
  );
};

export default PeopleSheet;

