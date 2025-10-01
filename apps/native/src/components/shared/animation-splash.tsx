import { useColorScheme } from "@/lib/use-color-scheme";
import { View, Image } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

export const AnimationScreen = (_params: {
  finish: (isCancelled: boolean) => void;
  appReady: boolean;
}) => {
  const { colorScheme } = useColorScheme();
  return (
    <Animated.View
      exiting={FadeOut.duration(300)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4ade80",
      }}
    >
      <View className="flex-1 justify-center items-center bg-background w-full">
        {colorScheme === "dark" ? (
          <Image
            source={require("@/assets/images/logo-white.png")}
            className="w-[200px]"
            resizeMethod="scale"
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require("@/assets/images/logo-black.png")}
            className="w-[200px]"
            resizeMethod="scale"
            resizeMode="contain"
          />
        )}
      </View>
    </Animated.View>
  );
};

