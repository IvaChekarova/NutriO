import { SQLiteDatabase } from 'react-native-sqlite-storage';

import { schema } from './schema';

const createMetaTable = async (db: SQLiteDatabase) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.meta} (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );`,
  );
};

const getSchemaVersion = async (db: SQLiteDatabase) => {
  await createMetaTable(db);
  const [result] = await db.executeSql(
    `SELECT value FROM ${schema.tables.meta} WHERE key = 'schema_version' LIMIT 1;`,
  );

  if (result.rows.length === 0) {
    return 0;
  }

  const value = result.rows.item(0).value;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setSchemaVersion = async (db: SQLiteDatabase, version: number) => {
  await db.executeSql(
    `INSERT OR REPLACE INTO ${schema.tables.meta} (key, value) VALUES (?, ?);`,
    ['schema_version', String(version)],
  );
};

const migrateToV1 = async (db: SQLiteDatabase) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.profiles} (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT,
      diet_tags TEXT,
      height_cm REAL,
      weight_kg REAL,
      age INTEGER,
      sex TEXT,
      activity_level TEXT,
      goal TEXT,
      timezone TEXT,
      created_at TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.recipes} (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      diet_tags TEXT,
      servings INTEGER NOT NULL DEFAULT 1,
      prep_time_min INTEGER,
      cook_time_min INTEGER,
      difficulty TEXT,
      image_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.ingredients} (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      calories REAL NOT NULL DEFAULT 0,
      protein REAL NOT NULL DEFAULT 0,
      carbs REAL NOT NULL DEFAULT 0,
      fat REAL NOT NULL DEFAULT 0,
      fiber REAL NOT NULL DEFAULT 0,
      sugar REAL NOT NULL DEFAULT 0,
      sodium REAL NOT NULL DEFAULT 0,
      unit_default TEXT
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.recipe_ingredients} (
      id TEXT PRIMARY KEY NOT NULL,
      recipe_id TEXT NOT NULL,
      ingredient_id TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL,
      FOREIGN KEY(recipe_id) REFERENCES ${schema.tables.recipes}(id),
      FOREIGN KEY(ingredient_id) REFERENCES ${schema.tables.ingredients}(id)
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.meal_plans} (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.meal_items} (
      id TEXT PRIMARY KEY NOT NULL,
      meal_plan_id TEXT NOT NULL,
      type TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      name TEXT NOT NULL,
      calories REAL NOT NULL DEFAULT 0,
      protein REAL NOT NULL DEFAULT 0,
      carbs REAL NOT NULL DEFAULT 0,
      fat REAL NOT NULL DEFAULT 0,
      servings REAL NOT NULL DEFAULT 1,
      FOREIGN KEY(meal_plan_id) REFERENCES ${schema.tables.meal_plans}(id)
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.grocery_items} (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      unit TEXT,
      category TEXT,
      notes TEXT,
      priority INTEGER NOT NULL DEFAULT 0,
      checked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.water_logs} (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      amount_ml INTEGER NOT NULL,
      target_ml INTEGER,
      source TEXT NOT NULL DEFAULT 'manual',
      created_at TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.macro_logs} (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      calories REAL NOT NULL DEFAULT 0,
      protein REAL NOT NULL DEFAULT 0,
      carbs REAL NOT NULL DEFAULT 0,
      fat REAL NOT NULL DEFAULT 0,
      goal_calories REAL,
      goal_protein REAL,
      goal_carbs REAL,
      goal_fat REAL,
      created_at TEXT NOT NULL
    );`,
  );
};

export const runMigrations = async (db: SQLiteDatabase) => {
  const currentVersion = await getSchemaVersion(db);

  if (currentVersion < 1) {
    await migrateToV1(db);
    await setSchemaVersion(db, 1);
  }
};
