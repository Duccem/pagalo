import { router } from "expo-router";
import { Camera, NotebookPen, Scan } from "lucide-react-native";
import { Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import * as Haptics from "expo-haptics";

export default function TabTwoScreen() {
  return (
    <View className="flex-1 items-center justify-center py-10">
      <View className="rounded-full bg-primary/10 p-5">
        <Scan size={20} />
      </View>
      <View className="mt-8 space-y-4 px-12">
        <Text className="text-4xl font-medium text-center">
          Scan. Tap. Split
        </Text>
        <Text className="text-center text-lg text-muted-foreground">
          Snap the receipt, tap your items, see who owes what. No sign-ups, no
          math, no drama.
        </Text>
      </View>
      <View className="mt-10 w-full px-8 gap-6">
        <TouchableOpacity className=" flex-row items-center justify-center gap-4 bg-black p-4 rounded-2xl w-full">
          <Camera color={"#fff"} size={30} />
          <Text className="text-white">Scan receipt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className=" flex-row items-center justify-center gap-4 border border-black p-4 rounded-2xl w-full"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(receipt)/manual");
          }}
        >
          <NotebookPen color={"#000"} size={30} />
          <Text className="text-black">Enter manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

