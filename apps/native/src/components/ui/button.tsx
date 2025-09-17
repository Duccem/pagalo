import React from "react";
import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const variantStyles = {
  primary: {
    backgroundColor: "#000000",
    activeBackgroundColor: "#262626",
  },
  outline: {
    backgroundColor: "#f3f4f6",
    activeBackgroundColor: "#E5E5E5",
  },
};

const Button = ({
  children,
  styles,
  action,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  styles?: ViewStyle;
  action?: () => void;
  variant?: "primary" | "outline";
  className?: string;
}) => {
  // Import useSharedValue and useAnimatedStyle from react-native-reanimated

  const background = useSharedValue(0);

  const handlePress = () => {
    background.value = withTiming(1, { duration: 60 });
  };

  const handleRelease = () => {
    background.value = withTiming(0, { duration: 60 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        background.value === 1
          ? variantStyles[variant].activeBackgroundColor
          : variantStyles[variant].backgroundColor,
    };
  });

  return (
    <Pressable
      onPressIn={handlePress}
      onPressOut={handleRelease}
      onPress={action}
      className={className}
    >
      <Animated.View
        style={[
          {
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: "#000000",
            borderWidth: 1,
            gap: 12,
          },
          animatedStyle,
          styles,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default Button;

