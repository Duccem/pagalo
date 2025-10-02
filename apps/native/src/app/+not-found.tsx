import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { t } from "@/lib/i18n";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: t("notFound.oops") }} />
      <View style={styles.container}>
        <Text>{t("notFound.doesNotExist")}</Text>
        <Link href="/" style={styles.link}>
          <Text>{t("notFound.goHome")}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

