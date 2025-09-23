import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ScreenView = ({ children }: { children: React.ReactNode }) => {
  useColorScheme();
  return (
    <GestureHandlerRootView className="flex-1 w-full">
      <SafeAreaProvider>
        <SafeAreaView
          className="flex-1  bg-background "
          edges={["top", "bottom"]}
        >
          <KeyboardAvoidingView className="flex-1" behavior={"padding"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default ScreenView;
