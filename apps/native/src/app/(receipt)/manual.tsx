import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import * as schema from "@/lib/db/schema";
import { useColorScheme } from "@/lib/use-color-scheme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowLeft, Calendar, Key } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Manual() {
  const { colorScheme } = useColorScheme();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);
  const [vendor, setVendor] = useState<string>("");
  const showMode = () => {
    setShowPicker(true);
  };
  const showDatepicker = () => {
    showMode();
  };
  const create = async () => {
    if (!vendor || !date) {
      Alert.alert("Error", "Please fill in all fields");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject);
    const invoice = await database
      .insert(schema.invoice)
      .values({
        total: 0,
        date: date ? date.toISOString() : new Date().toISOString(),
        tip: 0,
        tax: 0,
        vendor,
        state: "pending",
      })
      .returning();
    router.push(`/(receipt)/items?invoice=${invoice[0].id}`);
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
            <ArrowLeft
              size={30}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-xl text-foreground">Back</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center w-full gap-12">
          <View className="items-center gap-2">
            <Text className="text-4xl font-medium text-center text-foreground">
              Manual entry
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              Enter your receipt details manually
            </Text>
          </View>
          <View className="w-full gap-2">
            <Text className="text-lg font-medium text-foreground">
              Restaurant name:
            </Text>
            <View className="relative h-fit w-full">
              <TextInput
                className="border bg-card border-gray-200 text-foreground placeholder:text-foreground w-full rounded-2xl px-5 pl-12 py-3"
                placeholder="eg. Joe's Pizza"
                value={vendor}
                onChangeText={setVendor}
              />
              <View className="absolute left-4 top-1/4">
                <Key
                  className=" "
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </View>
            </View>
          </View>

          <View className="w-full gap-2">
            <Text className="text-lg font-medium text-foreground">Date:</Text>
            <TouchableOpacity
              className="flex-row items-center gap-4  w-full border bg-card border-gray-200 pr-4 pl-12 py-2 justify-start rounded-2xl relative"
              onPress={showDatepicker}
            >
              <Text className="text-lg text-foreground">
                {date ? format(date, "Pp") : "Select date"}
              </Text>
              <View className="absolute left-4 top-1/3">
                <Calendar
                  className=" "
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </View>
            </TouchableOpacity>
            {showPicker && (
              <Modal
                animationType="slide"
                visible={showPicker}
                transparent={true}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setShowPicker(!showPicker);
                }}
              >
                <TouchableOpacity
                  className="justify-center items-center  flex-1 w-full   p-4 "
                  onPress={() => setShowPicker(false)}
                >
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date || new Date()}
                    mode={"date"}
                    display="inline"
                    style={{
                      width: "100%",
                      height: "auto",
                      backgroundColor: "gray",
                      padding: 10,
                      borderRadius: 10,
                    }}
                    textColor="black"
                    accentColor="black"
                    onChange={(_, selectedDate) => {
                      const currentDate = selectedDate || date;
                      setShowPicker(false);
                      setDate(currentDate);
                    }}
                  />
                </TouchableOpacity>
              </Modal>
            )}
          </View>
        </View>

        <Button className="absolute bottom-2 w-full " action={create}>
          <Text className="text-2xl text-white">Continue</Text>
        </Button>
      </View>
    </ScreenView>
  );
}

