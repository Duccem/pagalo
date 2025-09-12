import {
  Calendar,
  HeartPlus,
  History,
  Home,
  Receipt,
  Scan,
  Stethoscope,
  UserCheck,
} from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const TabBarButton = ({
  route,
  isFocused,
  onPress,
  onLongPress,
  options = {},
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  options?: any;
}) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const icons: any = {
    index: (props: any) => <Home size={24} color={"#222"} {...props} />,
    new: (props: any) => <Scan size={24} color={"#222"} {...props} />,
    more: (props: any) => <UserCheck size={24} color={"#222"} {...props} />,
    explore: (props: any) => <History size={24} color={"#222"} {...props} />,
    receipt: (props: any) => <Receipt size={24} color={"#222"} {...props} />,
  };

  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="items-center justify-center gap-[5px] flex-1"
    >
      <Animated.View style={[animatedIconStyle]}>
        {icons[route.name]({
          size: 24,
          color: isFocused ? "#fff" : "#000",
        })}
      </Animated.View>
      <Animated.Text
        style={[
          {
            color: isFocused ? "#fff" : "#000",
            fontSize: 12,
            fontFamily: "NunitoSemiBold",
          },
          animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;
