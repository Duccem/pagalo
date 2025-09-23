import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback, useState } from "react";
import { preferences } from "./db/schema";
import { useDatabase } from "./db/use-database";

export const SUPPORTED_CURRENCIES = ["USD", "MXN", "VES", "EUR"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
const DEFAULT_CURRENCY: SupportedCurrency = "USD";

const CURRENCY_KEY = "currency"; // key column in preferences table
const SHARE_MESSAGE_KEY = "share_message"; // key for share message preference
const DEFAULT_SHARE_MESSAGE = "Let's split the bill with Pagalo";
// Notification preferences keys
const NOTIF_GENERAL_KEY = "notif_general"; // master enable
const NOTIF_REMINDERS_KEY = "notif_reminders"; // payment reminders
const NOTIF_NEWS_KEY = "notif_news"; // product news / tips
const DEFAULT_NOTIF_GENERAL = "1"; // stored as string "1" | "0"
const DEFAULT_NOTIF_REMINDERS = "1";
const DEFAULT_NOTIF_NEWS = "0";

export function useCurrencyPreference() {
  const db = useDatabase();
  const [error, setError] = useState<string | null>(null);

  // Live query (will re-run whenever table changes)
  const { data, error: liveError } = useLiveQuery(
    db.select().from(preferences).where(eq(preferences.key, CURRENCY_KEY))
  );

  const setCurrency = async (newValue: SupportedCurrency) => {
    try {
      console.log("setCurrency", newValue);
      const dat = await db
        .insert(preferences)
        .values({ key: CURRENCY_KEY, value: newValue })
        .onConflictDoUpdate({
          target: preferences.key,
          set: { value: newValue },
        })
        .returning();
      console.log("Inserted/updated preference:", dat);
    } catch (e: any) {
      console.log(e);
      setError(e?.message || "Failed to save currency");
    }
  };

  return {
    currency: (data[0]?.value as SupportedCurrency) ?? DEFAULT_CURRENCY,
    setCurrency,
    loading: !data && !liveError,
    error: error || liveError?.message || null,
  } as const;
}

// Generic helper (internal) to read a single preference row live
function useSinglePreferenceRow(key: string) {
  const db = useDatabase();
  return useLiveQuery(
    db.select().from(preferences).where(eq(preferences.key, key)).limit(1)
  );
}

export function useShareMessagePreference() {
  const db = useDatabase();
  const [error, setError] = useState<string | null>(null);
  const { data, error: liveError } = useSinglePreferenceRow(SHARE_MESSAGE_KEY);

  const shareMessage = (() => {
    if (!data || data.length === 0) return DEFAULT_SHARE_MESSAGE;
    return data[0].value || DEFAULT_SHARE_MESSAGE;
  })();

  const setShareMessage = useCallback(
    async (value: string) => {
      const sanitized = value.trim() || DEFAULT_SHARE_MESSAGE;
      try {
        await db
          .insert(preferences)
          .values({ key: SHARE_MESSAGE_KEY, value: sanitized })
          .onConflictDoUpdate({
            target: preferences.key,
            set: { value: sanitized },
          });
      } catch (e: any) {
        setError(e?.message || "Failed to save share message");
      }
    },
    [db]
  );

  return {
    shareMessage,
    setShareMessage,
    loading: !data && !liveError,
    error: error || liveError?.message || null,
    defaultValue: DEFAULT_SHARE_MESSAGE,
  } as const;
}

// Generic boolean preference hook
function useBooleanPreference(key: string, defaultValue: string) {
  const db = useDatabase();
  const { data, error } = useSinglePreferenceRow(key);
  const value = data?.[0]?.value ?? defaultValue;
  const setValue = useCallback(
    async (on: boolean) => {
      try {
        await db
          .insert(preferences)
          .values({ key, value: on ? "1" : "0" })
          .onConflictDoUpdate({
            target: preferences.key,
            set: { value: on ? "1" : "0" },
          });
      } catch (e) {
        console.log(e);
      }
    },
    [db, key]
  );
  return { value: value === "1", setValue, loading: !data && !error } as const;
}

export function useNotificationPreferences() {
  const general = useBooleanPreference(
    NOTIF_GENERAL_KEY,
    DEFAULT_NOTIF_GENERAL
  );
  const reminders = useBooleanPreference(
    NOTIF_REMINDERS_KEY,
    DEFAULT_NOTIF_REMINDERS
  );
  const news = useBooleanPreference(NOTIF_NEWS_KEY, DEFAULT_NOTIF_NEWS);

  return {
    generalEnabled: general.value,
    setGeneralEnabled: general.setValue,
    remindersEnabled: reminders.value && general.value, // disabled by master
    setRemindersEnabled: reminders.setValue,
    newsEnabled: news.value && general.value,
    setNewsEnabled: news.setValue,
    loading: general.loading || reminders.loading || news.loading,
  } as const;
}

