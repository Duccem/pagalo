import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const ScreenView = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView className="flex-1 w-full">
      <SafeAreaProvider>
        <SafeAreaView className="flex-1  pt-6 bg-gray-100">
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

