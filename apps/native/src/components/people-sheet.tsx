import React, { useCallback, useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Plus } from "lucide-react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const PeopleSheet = ({
  people,
  setPeople,
  initialPeople = [],
}: {
  people: string[];
  setPeople: (people: string[]) => void;
  initialPeople?: string[];
}) => {
  const [selectedPeople, setSelectedPeople] =
    React.useState<string[]>(initialPeople);
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
      >
        <BottomSheetView className="h-full justify-center items-center w-screen rounded-t-2xl border-x border-t border-gray-200 pt-5 relative px-6">
          <FlatList
            className="w-full"
            data={people}
            renderItem={({ item }) => (
              <View className="w-full border border-black rounded-2xl px-4 py-3 my-2 flex-row items-center justify-between">
                <Text className="text-lg">{item}</Text>
                <View>
                  <BouncyCheckbox
                    isChecked={selectedPeople.includes(item)}
                    onPress={(isChecked: boolean) => {
                      if (isChecked) {
                        setSelectedPeople((current) => [...current, item]);
                      } else {
                        setSelectedPeople((current) =>
                          current.filter((person) => person !== item)
                        );
                      }
                    }}
                    fillColor="black"
                  />
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            className="absolute bottom-0 flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
            onPress={() => {
              setPeople(selectedPeople);
              setSelectedPeople(initialPeople);
              bottomSheetModalRef.current?.dismiss();
            }}
          >
            <Text className="text-xl text-white">Done</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default PeopleSheet;

