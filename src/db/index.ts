import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

const expo = SQLite.openDatabaseSync("smartbusiness.db");
expo.execSync("PRAGMA journal_mode = WAL;");

export const db = drizzle(expo);