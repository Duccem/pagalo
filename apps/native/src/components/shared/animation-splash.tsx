import { View, Image } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";

export const AnimationScreen = (_params: {
  finish: (isCancelled: boolean) => void;
  appReady: boolean;
}) => {
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
      <View className="flex-1 justify-center items-center bg-primary w-full">
        <Image
          source={require("@/assets/images/Logo white.png")}
          className="w-[200px]"
          resizeMethod="scale"
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

