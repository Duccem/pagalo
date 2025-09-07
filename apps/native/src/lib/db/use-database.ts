import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "./schema";

export const useDatabase = () => {
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  return database;
};

