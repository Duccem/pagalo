import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import * as schema from "@/lib/db/schema";
import { useShareMessagePreference } from "@/lib/preferences";
import { useColorScheme } from "@/lib/use-color-scheme";
import { useMoneyFormatter } from "@/lib/money";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import {
  ArrowLeft,
  Divide,
  Home,
  Package,
  Paperclip,
  Trash,
  Users,
} from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Toast from "react-native-simple-toast";

const Details = () => {
  const { colorScheme } = useColorScheme();
  const params = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { shareMessage } = useShareMessagePreference();
  const { data, error } = useLiveQuery(
    database
      .select()
      .from(schema.invoice)
      .where(eq(schema.invoice.id, Number(params.id)))
      .limit(1)
  );
  const { format } = useMoneyFormatter(data?.[0]?.currency as any);
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

  useEffect(() => {
    const changeToPaid = async () => {
      if (!people || people.length === 0 || !data || data.length === 0) return;
      if (
        people.every((p) => p.status === "payed") &&
        data?.[0].state !== "paid"
      ) {
        await database
          .update(schema.invoice)
          .set({ state: "paid" })
          .where(eq(schema.invoice.id, Number(params.id)));
      }
    };
    changeToPaid();
  }, [people]);

  const copyToClipboard = async () => {
    // Build the body of the summary depending on evenly flag
    let body: string;
    if (data?.[0]?.evenly) {
      const perPerson =
        (data?.[0]?.total ?? 0) / Math.max(people?.length ?? 0, 1);
      body = `Receipt Summary \n\nTotal: ${format(
        data?.[0]?.total
      )} \nTax: ${format(data?.[0]?.tax)} \nTip: ${format(
        data?.[0]?.tip
      )} \n\nEach person pays: ${format(perPerson)}`;
    } else {
      body = `Receipt Summary \n\nTotal: ${format(
        data?.[0]?.total
      )} \nTax: ${format(data?.[0]?.tax)} \nTip: ${format(
        data?.[0]?.tip
      )} \n\nPeople: \n${people
        ?.map((person) => `${person.name}: ${format(person.total)}`)
        .join("\n")}`;
    }
    const text = `${shareMessage}\n\n${body}`;
    await Clipboard.setStringAsync(text.trim());
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
            <ArrowLeft
              size={30}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="text-xl text-foreground">Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-4">
            <Button action={deleteInvoice} styles={{ padding: 10 }}>
              <Trash color={"white"} size={25} />
            </Button>
            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/(tabs)");
              }}
              styles={{ padding: 10 }}
            >
              <Home color={"white"} size={25} />
            </Button>
          </View>
        </View>

        <View className="w-full flex-1 justify-start items-center px-2 gap-6">
          <View className="w-full  flex-row justify-between items-center">
            <Text className="text-2xl text-start font-bold text-foreground">
              Split summary
            </Text>
            <Text className="text-end text-foreground text-2xl">
              {`${Math.round(percentagePayed * 100)}% paid`}
            </Text>
          </View>

          <View className="w-full gap-2 flex-row justify-between items-center border-b border-foreground pb-4">
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium text-foreground">Total</Text>
              <Text className="text-lg font-bold text-muted-foreground">
                {format(data[0]?.total)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium text-foreground">Tax</Text>
              <Text className="text-lg font-bold text-muted-foreground">
                {format(data[0]?.tax)}
              </Text>
            </View>
            <View className="w rounded-2xl">
              <Text className="text-xl font-medium text-foreground">Tip</Text>
              <Text className="text-lg font-bold text-muted-foreground">
                {format(data[0]?.tip)}
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
              <Users
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>

            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/items?invoice=${params.id}`);
              }}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Package
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
            <Button
              action={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/(receipt)/split?invoice=${params.id}`);
              }}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Divide
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
            <Button
              action={copyToClipboard}
              styles={{ padding: 14 }}
              variant="white"
            >
              <Paperclip
                color={colorScheme === "dark" ? "white" : "black"}
                size={25}
              />
            </Button>
          </View>
          <FlatList
            data={people}
            className="w-full flex-1 gap-4"
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <View className="w-full flex-row justify-between items-center p-4 bg-card shadow-none rounded-2xl my-1">
                <View className="flex-row items-center gap-4">
                  <Text className="text-2xl font-medium text-foreground">
                    {item.name}
                  </Text>
                  <Text className="text-2xl font-medium text-foreground">
                    {format(item.total)}{" "}
                  </Text>
                </View>
                <View>
                  <BouncyCheckbox
                    isChecked={item.status === "payed"}
                    onPress={async (isChecked: boolean) => {
                      savePayments(item.id, isChecked);
                    }}
                    fillColor="#4ade80"
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
