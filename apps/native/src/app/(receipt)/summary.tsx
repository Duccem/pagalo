import ScreenView from "@/components/screen-view";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import {
  ArrowLeft,
  Divide,
  Home,
  Package,
  Paperclip,
  Trash,
  Users,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-simple-toast";
import Button from "@/components/ui/button";

const Details = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data, error } = useLiveQuery(
    database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.id, Number(params.id)))
      .limit(1)
  );
  const { data: people } = useLiveQuery(
    database
      .select()
      .from(schema.member)
      .where(eq(schema.member.invoiceId, Number(params.id)))
  );

  const percentagePayed =
    data && data.length > 0 && people && people.length > 0 && data[0].total > 0
      ? people
          .filter((p) => p.status === "payed")
          .reduce((acc, person) => acc + person.total, 0) /
        (data[0].total - data[0].tip - data[0].tax)
      : 0;

  const savePayments = async (id: number, checked: boolean) => {
    const newStatus = checked ? "payed" : "pending";
    await database
      .update(schema.member)
      .set({ status: newStatus })
      .where(eq(schema.member.id, id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const copyToClipboard = async () => {
    const text = `Receipt Summary \n\nTotal: $${data[0]?.total.toFixed(
      2
    )} \nTax: $${data[0]?.tax.toFixed(2)} \nTip: $${data[0]?.tip.toFixed(
      2
    )} \n\nPeople: \n${people
      .map((person) => `${person.name}: $${person.total.toFixed(2)}`)
      .join("\n")}
    `;
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Toast.show("Copied to clipboard", Toast.SHORT);
  };

  const deleteInvoice = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await database
      .delete(schema.invoice)
      .where(eq(schema.invoice.id, Number(params.id)));
    router.push("/(tabs)");
  };

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error</Text>
      </View>
    );
  }
  return (
    <ScreenView>
      <View className="flex-1 px-6">
        <View className="w-full flex-row justify-between items-center mb-4">
          <TouchableOpacity
            className="flex-row items-center gap-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.back();
            }}
          >
            <ArrowLeft size={30} color={"#000"} />
            <Text className="text-xl">Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-4">
            <Button
              action={deleteInvoice}
              variant="white"
              styles={{ padding: 10 }}
            >
              <Trash color={"black"} size={25} />
            </Button>
            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/(tabs)");
              }}
              variant="white"
              styles={{ padding: 10 }}
            >
              <Home color={"black"} size={25} />
            </Button>
          </View>
        </View>

        <View className="w-full flex-1 justify-start items-center px-2 gap-6">
          <View className="w-full  flex-row justify-between items-center">
            <Text className="text-2xl text-start font-bold ">
              Split summary
            </Text>
            <Text className="text-end text-black text-2xl">
              {`${Math.round(percentagePayed * 100)}% paid`}
            </Text>
          </View>

          <View className="w-full gap-2 flex-row justify-between items-center border-b border-black pb-4">
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Total</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.total.toFixed(2)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Tax</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.tax.toFixed(2)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium">Tip</Text>
              <Text className="text-lg font-bold text-neutral-500">
                ${data[0]?.tip.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="w-full flex-row justify-between items-center gap-2">
            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/people?invoice=${params.id}`);
              }}
              styles={{ padding: 12 }}
              variant="white"
            >
              <Users color={"black"} size={25} />
            </Button>

            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/items?invoice=${params.id}`);
              }}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Package color={"black"} size={25} />
            </Button>
            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/split?invoice=${params.id}`);
              }}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Divide color={"black"} size={25} />
            </Button>
            <Button
              action={copyToClipboard}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Paperclip color={"black"} size={25} />
            </Button>
          </View>
          <FlatList
            data={people}
            className="w-full flex-1 gap-4"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="w-full flex-row justify-between items-center p-4 bg-white shadow-lg rounded-2xl my-1">
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl font-medium">{item.name}</Text>
                  <Text className="text-2xl font-bold">
                    ${item.total.toFixed(2)}{" "}
                  </Text>
                </View>
                <View>
                  <BouncyCheckbox
                    isChecked={item.status === "payed"}
                    onPress={async (isChecked: boolean) => {
                      savePayments(item.id, isChecked);
                    }}
                    fillColor="black"
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </ScreenView>
  );
};

export default Details;

