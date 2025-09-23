import ScreenView from "@/components/shared/screen-view";
import {
  pushMockNotification,
  timeAgo,
  useMockNotificationList,
} from "@/lib/notifications-mock";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ArrowLeft, Inbox } from "lucide-react-native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const NotificationsScreen = () => {
  const list = useMockNotificationList();
  // Seed with some defaults on first empty mount (one-time)
  if (list.length === 0) {
    pushMockNotification(
      "Bienvenido a Pagalo",
      "Gracias por usar Pagalo. Aquí verás avisos y recordatorios."
    );
    pushMockNotification(
      "Recordatorio de pago",
      "No olvides completar tu pago pendiente este mes."
    );
    pushMockNotification(
      "Nueva función",
      "Explora las nuevas opciones para dividir gastos en grupo."
    );
  }

  return (
    <ScreenView>
      <View className="flex-1 px-6 gap-10 pb-10">
        <View className="w-full flex-row justify-between items-center">
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
          <Text className="text-lg font-medium">Notifications</Text>
        </View>

        <View className="gap-4 flex-1">
          <Text className="text-xs uppercase text-gray-500 tracking-wider">
            Notificaciones
          </Text>
          <View className="flex-1 bg-white rounded-2xl overflow-hidden">
            {list.length === 0 ? (
              <View className="flex-1 items-center justify-center p-6 gap-4">
                <Inbox size={42} color="#999" />
                <Text className="text-sm text-gray-500 text-center">
                  No hay notificaciones.
                </Text>
                <Text className="text-[11px] text-gray-400 text-center px-4">
                  Activa y genera ejemplos desde la pantalla principal de
                  Settings.
                </Text>
              </View>
            ) : (
              <FlatList
                data={list}
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ padding: 12, gap: 10 }}
                renderItem={({ item }) => (
                  <View className="bg-gray-50 rounded-xl p-4 gap-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-semibold" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-[10px] text-gray-400 ml-2">
                        {timeAgo(item.createdAt)}
                      </Text>
                    </View>
                    <Text
                      className="text-[11px] text-gray-600"
                      numberOfLines={3}
                    >
                      {item.body}
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </View>
    </ScreenView>
  );
};

export default NotificationsScreen;

