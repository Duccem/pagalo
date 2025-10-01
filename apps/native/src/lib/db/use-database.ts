import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, useSQLiteContext } from "expo-sqlite";
import * as schema from "./schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../../drizzle/migrations";

export const useDatabase = () => {
  const db = useSQLiteContext();
  const database = drizzle(db, { schema });
  return database;
};

export const useMigrate = () => {
  const expoDb = openDatabaseSync("pagalo");
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  return { success, error };
};

