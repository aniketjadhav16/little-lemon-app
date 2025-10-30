import * as SQLite from "expo-sqlite";
import { MenuItem } from "./types/MenuItem";

const db = await SQLite.openDatabaseAsync("little_lemon.db");

export async function createTable(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menuitems (
      id INTEGER PRIMARY KEY NOT NULL,
      uuid TEXT,
      title TEXT,
      price TEXT,
      category TEXT
    );
  `);
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const result = await db.getAllAsync<MenuItem>("SELECT * FROM menuitems");
  return result;
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<void> {
  await db.withTransactionAsync(async () => {
    for (const item of menuItems) {
      await db.runAsync(
        "INSERT INTO menuitems (uuid, title, price, category) VALUES (?, ?, ?, ?)",
        [item.uuid, item.title, item.price, item.category]
      );
    }
  });
}

export async function filterByQueryAndCategories(
  query: string,
  activeCategories: string[]
): Promise<MenuItem[]> {
  const placeholders = activeCategories.map(() => "?").join(", ");
  const sql = `SELECT * FROM menuitems WHERE title LIKE ? AND category IN (${placeholders})`;
  const params = [`%${query}%`, ...activeCategories];
  const result = await db.getAllAsync<MenuItem>(sql, params);
  return result;
}
