import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const variantStyles = {
  primary: {
    backgroundColor: "#4ade80",
    activeBackgroundColor: "#15803d",
    borderColor: "#4ade80",
  },
  outline: {
    backgroundColor: "#fff",
    activeBackgroundColor: "#E5E5E5",
    borderColor: "#4ade80",
  },
  black: {
    backgroundColor: "#000000",
    activeBackgroundColor: "#262626",
    borderColor: "#000000",
  },
  white: {
    backgroundColor: "#ffffff",
    activeBackgroundColor: "#f3f4f6",
    borderColor: "#ffffff",
  },
};

const Button = ({
  children,
  styles,
  action,
  variant = "primary",
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  styles?: ViewStyle;
  action?: () => void;
  variant?: "primary" | "outline" | "black" | "white";
  className?: string;
  disabled?: boolean;
}) => {
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
      borderColor: variantStyles[variant].borderColor,
    };
  });

  return (
    <Pressable
      onPressIn={handlePress}
      onPressOut={handleRelease}
      onPress={action}
      className={className}
      disabled={disabled}
    >
      <Animated.View
        style={[
          {
            padding: 16,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
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

