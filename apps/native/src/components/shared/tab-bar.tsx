import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import TabBarButton from "./tab-bar-button";

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const [dimensions, setDimensions] = useState({ width: 20, height: 100 });
  const buttonWidth =
    dimensions.width / state.routes.filter((r) => r.name !== "receipt").length;
  const onTabBarLayout = (event: LayoutChangeEvent) => {
    setDimensions({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  };
  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  return (
    <View
      className="absolute bottom-5 right-0 left-0 flex flex-row justify-between items-center bg-white mx-5 py-4  rounded-2xl shadow-lg flex-1"
      onLayout={onTabBarLayout}
    >
      <Animated.View
        className={"rounded-2xl bg-neutral-800 absolute mx-3"}
        style={[
          {
            width: buttonWidth - 25,
            height: dimensions.height - 15,
          },
          animatedStyle,
        ]}
      ></Animated.View>
      {state.routes
        .filter((r) => r.name !== "receipt")
        .map((route: any, index: number) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withSpring(buttonWidth * index, {
              duration: 1000,
            });
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync();
              navigation.navigate(route.name);
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
          return (
            <TabBarButton
              key={route.name}
              isFocused={isFocused}
              route={route}
              options={options}
              onLongPress={onLongPress}
              onPress={onPress}
            />
          );
        })}
    </View>
  );
};
