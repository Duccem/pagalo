import { useColorScheme } from "@/lib/use-color-scheme";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
/*
 * Definición de estilos de variantes dependientes del esquema de color.
 * Mantiene compatibilidad con las variantes existentes y mejora contraste en dark mode.
 */

type VariantKey = "primary" | "outline" | "black" | "white";
interface VariantStyle {
  backgroundColor: string;
  activeBackgroundColor: string;
  borderColor: string;
}

function useVariantStyles(isDark: boolean): Record<VariantKey, VariantStyle> {
  if (isDark) {
    return {
      primary: {
        backgroundColor: "#4ade80",
        activeBackgroundColor: "#15803d",
        borderColor: "#4ade80",
      },
      outline: {
        // Fondo transparente para integrarse con el background oscuro
        backgroundColor: "rgba(255,255,255,0.04)",
        activeBackgroundColor: "rgba(255,255,255,0.08)",
        borderColor: "#4ade80", // mantiene acento de marca
      },
      black: {
        // Evitamos #000 puro para diferenciar del fondo (#121212 aprox.)
        backgroundColor: "#1e1e1e",
        activeBackgroundColor: "#2a2a2a",
        borderColor: "#262626",
      },
      white: {
        // Ajustado para que se parezca a la card en dark mode (HSL 0 0% 11%)
        backgroundColor: "#1c1c1c",
        activeBackgroundColor: "#262626",
        borderColor: "#1c1c1c",
      },
    } as const;
  }
  // Light mode (valores anteriores)
  return {
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
  } as const;
}

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
  const { isDarkColorScheme } = useColorScheme();
  const variantStyles = React.useMemo(
    () => useVariantStyles(isDarkColorScheme),
    [isDarkColorScheme]
  );
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
