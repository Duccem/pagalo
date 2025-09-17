import ScreenView from "@/components/screen-view";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, BrushCleaning } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import PeopleSheet from "@/components/people-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const Split = () => {
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
  const canContinue = useMemo(() => {
    if (!items || !persons) return false;
    if (evenly === 1 && persons.length > 0) return true;
    return items.every((item) => {
      const assignedPersons = personItems
        ? personItems
            .filter((pi) => pi.itemId === item.id)
            .map((pi) => {
              const person = persons.find((p) => p.id === pi.memberId);
              return person ? person.name : null;
            })
            .filter((p): p is string => p !== null)
        : [];
      return assignedPersons.length > 0;
    });
  }, [items, persons, evenly, personItems]);
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
        <View className="w-full ">
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
        </View>
        <View className="flex-row justify-between items-center w-full mt-5">
          <Text className="text-4xl font-bold">Assign items</Text>
          <TouchableOpacity
            activeOpacity={1}
            className={`border border-black px-4 py-2 rounded-2xl ${
              evenly === 1 ? "bg-black " : "bg-white "
            }`}
            onPress={changeEvenly}
          >
            <Text
              className={` text-lg ${
                evenly === 1 ? "text-white" : "text-black"
              }`}
            >
              Split evenly
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          className="w-full mt-8 mb-32 flex-1"
          data={items}
          renderItem={({ item }) => (
            <View className="border-b border-black py-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-semibold">
                  {item.name} - ${item.price.toFixed(2)}
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="rounded-full p-2 border border-black border-dashed"
                    activeOpacity={1}
                    onPress={async () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      await database
                        .delete(schema.memberItem)
                        .where(eq(schema.memberItem.itemId, item.id));
                    }}
                  >
                    <BrushCleaning color={"black"} size={25} />
                  </TouchableOpacity>
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
              <View className="flex-row flex-wrap mt-2">
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
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          className={`absolute flex-row items-center gap-4  w-full bg-black p-4 justify-center rounded-2xl ${
            canContinue ? "" : "bg-gray-500"
          }`}
          style={{ bottom: useSafeAreaInsets().bottom + 16 }}
          onPress={saveAssignments}
          disabled={!canContinue}
        >
          <Text className="text-2xl text-white">
            {canContinue ? "Continue" : "Split the bill"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({});

export default Split;

