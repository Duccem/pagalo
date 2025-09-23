import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import { useColorScheme } from "@/lib/use-color-scheme";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Camera, NotebookPen, Scan } from "lucide-react-native";
import { Text, View } from "react-native";

export default function TabTwoScreen() {
  const { colorScheme } = useColorScheme();
  return (
    <ScreenView>
      <View className="flex-1 items-center justify-center py-10">
        <View className="rounded-full bg-primary p-5">
          <Scan size={20} color={"white"} />
        </View>
        <View className="mt-8 space-y-4 px-12">
          <Text className="text-4xl font-medium text-center text-foreground">
            Scan. Tap. Split
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            Snap the receipt, tap your items, see who owes what. No sign-ups, no
            math, no drama.
          </Text>
        </View>
        <View className="mt-10 w-full px-8 gap-6">
          <Button
            action={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(receipt)/scan");
            }}
          >
            <Camera color={"#fff"} size={30} />
            <Text className="text-white">Scan receipt</Text>
          </Button>
          <Button
            action={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/(receipt)/manual");
            }}
            variant="outline"
          >
            <NotebookPen
              color={colorScheme === "dark" ? "white" : "black"}
              size={30}
            />
            <Text className="text-foreground">Enter manually</Text>
          </Button>
        </View>
      </View>
    </ScreenView>
  );
}

