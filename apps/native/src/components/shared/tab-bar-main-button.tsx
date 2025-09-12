import { Scan } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const TabBarMainButton = ({
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
      className="items-center justify-center gap-[5px] flex-1 border absolute left-1/2 -translate-x-1/2  p-6 bg-black rounded-full"
    >
      <View style={[]}>
        <Scan color={"#fff"} size={24} />
      </View>
    </Pressable>
  );
};

export default TabBarMainButton;

