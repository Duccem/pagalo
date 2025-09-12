import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

export default function Manual() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };
  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date ?? new Date(),
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };
  return (
    <View className="flex-1 justify-start items-center pt-24 relative px-6">
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
      <View className="flex-1 justify-center items-center w-full gap-12">
        <View className="items-center gap-2">
          <Text className="text-4xl font-medium text-center">Manual entry</Text>
          <Text className="text-center text-lg text-muted-foreground">
            Enter your receipt details manually
          </Text>
        </View>
        <View className="w-full gap-2">
          <Text className="text-lg font-medium">Restaurant name:</Text>
          <TextInput
            className="border border-black w-full rounded-2xl px-4"
            placeholder="eg. Joe's Pizza"
          ></TextInput>
        </View>

        <View className="w-full gap-2">
          <Text className="text-lg font-medium">Date:</Text>
          <TouchableOpacity
            className="flex-row items-center gap-4  w-full border border-black px-4 py-2 justify-start rounded-2xl"
            onPress={showMode}
          >
            <Text className="text-lg">
              {date ? format(date, "Pp") : "Select date"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="absolute bottom-10 flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl"
        onPress={() => {
          Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject);
          router.back();
        }}
      >
        <Text className="text-2xl text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

