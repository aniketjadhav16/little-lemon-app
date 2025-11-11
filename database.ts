import * as SQLite from "expo-sqlite";
import { MenuItem } from "./types/MenuItem";

let db: SQLite.SQLiteDatabase | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

async function ensureDatabase(): Promise<void> {
  if (db) {
    return;
  }

  if (isInitializing) {
    return initPromise || Promise.resolve();
  }

  isInitializing = true;

  initPromise = (async () => {
    try {
      db = await SQLite.openDatabaseAsync("little_lemon.db");
    } catch (error) {
      console.error("Database initialization error:", error);
      throw error;
    } finally {
      isInitializing = false;
       initPromise = null;
    }
  })();

  return initPromise;
}

export async function createTable(): Promise<void> {
  await ensureDatabase();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menuitems (
        id INTEGER PRIMARY KEY NOT NULL,
        uuid TEXT UNIQUE,
        title TEXT NOT NULL,
        price TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        imageUrl TEXT
      );
    `);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  await ensureDatabase();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const result = await db.getAllAsync<MenuItem>(
      "SELECT * FROM menuitems ORDER BY id"
    );
    return result || [];
  } catch (error) {
    console.error("Error getting menu items:", error);
    return [];
  }
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<void> {
  await ensureDatabase();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    await db.runAsync("DELETE FROM menuitems");

    for (const item of menuItems) {
      await db.runAsync(
        `INSERT INTO menuitems (uuid, title, price, description, category, imageUrl)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item.uuid, item.title, item.price, item.description, item.category, item.imageUrl]
      );
    }
  } catch (error) {
    console.error("Error saving menu items:", error);
    throw error;
  }
}

export async function filterByQueryAndCategories(
  query: string,
  activeCategories: string[]
): Promise<MenuItem[]> {
  await ensureDatabase();

  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    if (activeCategories.length === 0) {
      return [];
    }

    const placeholders = activeCategories.map(() => "?").join(", ");
    const sql = `
      SELECT * FROM menuitems
      WHERE title LIKE ? AND category IN (${placeholders})
      ORDER BY id
    `;
    const params = [`%${query}%`, ...activeCategories];

    const result = await db.getAllAsync<MenuItem>(sql, params);
    return result || [];
  } catch (error) {
    console.error("Error filtering data:", error);
    return [];
  }
}
