import { History, Home, Receipt, Scan, UserCheck } from "lucide-react-native";
import { Pressable, View } from "react-native";
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
  const icons: any = {
    index: (props: any) => <Home size={24} color={"#fff"} {...props} />,
    new: (props: any) => <Scan size={24} color={"#fff"} {...props} />,
    more: (props: any) => <UserCheck size={24} color={"#fff"} {...props} />,
    explore: (props: any) => <History size={24} color={"#fff"} {...props} />,
    receipt: (props: any) => <Receipt size={24} color={"#fff"} {...props} />,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      className="items-center justify-center flex-1"
    >
      <View>
        {icons[route.name]({
          size: 24,
          color: isFocused ? "#000" : "#fff",
        })}
      </View>
    </Pressable>
  );
};

export default TabBarButton;
