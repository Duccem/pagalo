import ScreenView from "@/components/screen-view";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Items = () => {
  const params = useLocalSearchParams<{ invoice: string }>();
  return (
    <ScreenView>
      <View className="flex-1 justify-center items-center">
        <Text>{params.invoice}</Text>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default Items;

