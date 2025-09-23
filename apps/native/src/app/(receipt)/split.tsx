import PeopleSheet from "@/components/receipt/people-sheet";
import ScreenView from "@/components/shared/screen-view";
import Button from "@/components/ui/button";
import * as schema from "@/lib/db/schema";
import { useColorScheme } from "@/lib/use-color-scheme";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ArrowLeft, BrushCleaning, Check } from "lucide-react-native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const Split = () => {
  const { colorScheme } = useColorScheme();
  const params = useLocalSearchParams<{ invoice: string }>();
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  const { data: items } = useLiveQuery(
    database
      .select()
      .from(schema.item)
      .where(eq(schema.item.invoiceId, Number(params.invoice)))
  );
  const { data: persons } = useLiveQuery(
    database
      .select()
      .from(schema.member)
      .where(eq(schema.member.invoiceId, Number(params.invoice)))
  );
  const { data: personItems } = useLiveQuery(
    database
      .select()
      .from(schema.memberItem)
      .where(eq(schema.memberItem.invoiceId, Number(params.invoice)))
  );
  const [evenly, setEvenly] = React.useState<number>(0);
  const changeEvenly = () => {
    setEvenly((current) => (current === 0 ? 1 : 0));
  };
  const saveAssignments = async () => {
    if (!items || !persons) return;
    const totalByPerson: { id: number; total: number }[] = [];

    if (evenly === 1) {
      const splitAmount =
        items.reduce((a, b) => a + b.price * b.quantity, 0) / persons.length;
      for (const person of persons) {
        totalByPerson.push({ id: person.id, total: splitAmount });
      }
    } else {
      for (const person of persons) {
        totalByPerson.push({ id: person.id, total: 0 });
      }
      for (const item of items) {
        const assignedPersons = personItems
          ? personItems
              .filter((pi) => pi.itemId === item.id)
              .map((pi) => {
                const person = persons.find((p) => p.id === pi.memberId);
                return person ? person.id : null;
              })
              .filter((p): p is number => p !== null)
          : [];
        const splitAmount =
          (item.price * item.quantity) / assignedPersons.length;
        for (const personId of assignedPersons) {
          const personTotal = totalByPerson.find((p) => p.id === personId);
          if (personTotal) {
            personTotal.total += splitAmount;
          }
        }
      }
    }

    await database.transaction(async (tx) => {
      for (const personTotal of totalByPerson) {
        await tx
          .update(schema.member)
          .set({ total: personTotal.total })
          .where(eq(schema.member.id, personTotal.id));
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/(receipt)/summary?id=${params.invoice}`);
  };
  return (
    <ScreenView>
      <View className="flex-1 justify-start items-center relative px-6">
        <View className="w-full flex-row justify-between items-center">
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
          <Button action={saveAssignments} styles={{ padding: 10 }}>
            <Check color={"white"} size={25} />
          </Button>
        </View>
        <View className="flex-row justify-between items-center w-full mt-5">
          <Text className="text-4xl font-bold text-foreground">
            Assign items
          </Text>
          <View className="flex-row items-center">
            <Text className="text-foreground text-lg mr-3">Split evenly</Text>
            <View>
              <BouncyCheckbox
                isChecked={evenly === 1}
                onPress={changeEvenly}
                size={26}
                fillColor="#4ade80"
                unFillColor={colorScheme === "dark" ? "#1c1c1c" : "#ffffff"}
                useBuiltInState={false}
                iconStyle={{ borderRadius: 8, borderColor: "#22c55e" }}
                innerIconStyle={{ borderWidth: 2, borderRadius: 8 }}
              />
            </View>
          </View>
        </View>
        <FlatList
          className="w-full mt-8  flex-1"
          data={items}
          renderItem={({ item }) => (
            <View className="bg-card my-2 rounded-2xl px-4 py-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold text-foreground">
                  {item.name} - ${item.price.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Button
                    action={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await database
                        .delete(schema.memberItem)
                        .where(eq(schema.memberItem.itemId, item.id));
                    }}
                    styles={{ padding: 5, borderRadius: 9999 }}
                  >
                    <BrushCleaning color={"white"} size={25} />
                  </Button>
                  <PeopleSheet
                    initialPeople={persons.filter((p) =>
                      personItems
                        ?.filter((pi) => pi.itemId === item.id)
                        .some((pi) => pi.memberId === p.id)
                    )}
                    people={persons}
                    setPeople={async (p) => {
                      await database.insert(schema.memberItem).values({
                        invoiceId: Number(params.invoice),
                        itemId: item.id,
                        memberId: p.id,
                      });
                    }}
                    removePeople={async (p) => {
                      const personItem = personItems?.find(
                        (pi) => pi.itemId === item.id && pi.memberId === p.id
                      );
                      if (personItem) {
                        await database
                          .delete(schema.memberItem)
                          .where(eq(schema.memberItem.id, personItem.id));
                      }
                    }}
                  />
                </View>
              </View>
              <View className="flex-row flex-wrap">
                {personItems
                  .filter((pi) => pi.itemId === item.id)
                  .map((person) => (
                    <TouchableOpacity
                      key={person.id}
                      className="bg-gray-200 px-3 py-1 rounded-full m-1"
                      onPress={async () => {
                        await database
                          .delete(schema.memberItem)
                          .where(eq(schema.memberItem.id, person.id));
                      }}
                    >
                      <Text className="text-lg">
                        {persons.find((p) => p.id === person.memberId)?.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </ScreenView>
  );
};

export default Split;

