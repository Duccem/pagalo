import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";

// Known / legacy keys we used or likely generated previously.
// better-auth with storagePrefix:"pagalo" may produce namespaced keys; we try common variations.
const CANDIDATE_KEYS = [
  "pref_currency",
  "pagalo_pref_currency",
  "pagalo_session",
  "pagalo_token",
  "pagalo_refresh_token",
  "pagalo_access_token",
  "pagalo_user",
];

export async function clearSecureStore(
  options: { includeAuth?: boolean } = {}
) {
  const { includeAuth = true } = options;
  const toDelete = includeAuth
    ? CANDIDATE_KEYS
    : CANDIDATE_KEYS.filter(
        (k) =>
          !k.includes("token") &&
          !k.includes("session") &&
          !k.includes("refresh")
      );
  const results: { key: string; success: boolean; error?: string }[] = [];
  for (const key of toDelete) {
    try {
      await SecureStore.deleteItemAsync(key);
      results.push({ key, success: true });
    } catch (e: any) {
      results.push({ key, success: false, error: e?.message });
    }
  }
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  return results;
}

export async function listSecureStoreKeys() {
  const result = SecureStore.getItem("pagalo_cookie");
  console.log(result);
}

