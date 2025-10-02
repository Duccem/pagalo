import { useColorScheme } from "@/lib/use-color-scheme";
import { SUPPORTED_CURRENCIES, SupportedCurrency } from "@/lib/preferences";
import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import { DollarSign, X } from "lucide-react-native";
import { useCallback, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { t } from "@/lib/i18n";

type Props = {
  value?: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  label?: string;
};

// A bottom sheet selector for invoice currency using @gorhom/bottom-sheet
const CurrencySheet = ({
  value,
  onChange,
  label = t("settings.currency"),
}: Props) => {
  const { colorScheme } = useColorScheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const present = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const close = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const renderItem = ({ item }: { item: SupportedCurrency }) => {
    const selected = value === item;
    return (
      <TouchableOpacity
        className="w-full rounded-2xl px-4 py-3 my-2 flex-row items-center justify-between"
        style={{
          backgroundColor: selected
            ? "#22c55e" // green-500
            : colorScheme === "dark"
            ? "#2c2c2e"
            : "#f3f4f6", // gray-100
        }}
        onPress={() => {
          onChange(item);
          close();
        }}
      >
        <Text
          className="text-lg"
          style={{
            color: selected
              ? "#fff"
              : colorScheme === "dark"
              ? "#fff"
              : "#111827",
          }}
        >
          {item}
        </Text>
        {selected ? (
          <Text className="text-white">{t("common.selected")}</Text>
        ) : (
          <View />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Trigger field styled like other inputs */}
      <TouchableOpacity
        className="flex-row items-center gap-4  w-full border bg-card border-gray-200 pr-4 pl-12 py-2 justify-start rounded-2xl relative"
        onPress={present}
      >
        <Text className="text-lg text-foreground">{value ?? label}</Text>
        <View className="absolute left-4 top-1/3">
          <DollarSign
            size={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </View>
      </TouchableOpacity>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "white",
        }}
        snapPoints={["50%", "90%"]}
        handleStyle={{ display: "none" }}
        style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 20 }}
      >
        <View className="min-h-full">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl text-foreground mb-4">
              {t("settings.currency")}
            </Text>
            <TouchableOpacity onPress={close}>
              <X color={colorScheme === "dark" ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          <BottomSheetFlatList
            className="w-full h-full"
            estimatedItemSize={64}
            data={[...SUPPORTED_CURRENCIES]}
            keyExtractor={(c: SupportedCurrency) => c}
            renderItem={renderItem}
          />
        </View>
      </BottomSheetModal>
    </>
  );
};

export default CurrencySheet;

