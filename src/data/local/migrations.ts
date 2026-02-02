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
      total_calories REAL NOT NULL DEFAULT 0,
      total_protein REAL NOT NULL DEFAULT 0,
      total_carbs REAL NOT NULL DEFAULT 0,
      total_fat REAL NOT NULL DEFAULT 0,
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
    `CREATE TABLE IF NOT EXISTS ${schema.tables.recipe_steps} (
      id TEXT PRIMARY KEY NOT NULL,
      recipe_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL,
      FOREIGN KEY(recipe_id) REFERENCES ${schema.tables.recipes}(id)
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
      serving_unit TEXT NOT NULL DEFAULT 'g',
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

const hasColumn = async (db: SQLiteDatabase, table: string, column: string) => {
  const [result] = await db.executeSql(`PRAGMA table_info(${table});`);
  for (let i = 0; i < result.rows.length; i += 1) {
    const row = result.rows.item(i);
    if (row?.name === column) {
      return true;
    }
  }
  return false;
};

const migrateToV2 = async (db: SQLiteDatabase) => {
  const exists = await hasColumn(db, schema.tables.meal_items, 'serving_unit');
  if (exists) {
    return;
  }
  await db.executeSql(
    `ALTER TABLE ${schema.tables.meal_items}
     ADD COLUMN serving_unit TEXT NOT NULL DEFAULT 'g';`,
  );
};

const migrateToV3 = async (db: SQLiteDatabase) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.custom_foods} (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      serving_size_g REAL NOT NULL,
      calories REAL NOT NULL DEFAULT 0,
      protein REAL NOT NULL DEFAULT 0,
      carbs REAL NOT NULL DEFAULT 0,
      fat REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );`,
  );
};

const migrateToV4 = async (db: SQLiteDatabase) => {
  const hasBaseAmount = await hasColumn(
    db,
    schema.tables.meal_items,
    'base_amount',
  );
  if (!hasBaseAmount) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.meal_items}
       ADD COLUMN base_amount REAL NOT NULL DEFAULT 0;`,
    );
  }

  const hasBaseUnit = await hasColumn(
    db,
    schema.tables.meal_items,
    'base_unit',
  );
  if (!hasBaseUnit) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.meal_items}
       ADD COLUMN base_unit TEXT NOT NULL DEFAULT 'g';`,
    );
  }
};

const migrateToV5 = async (db: SQLiteDatabase) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${schema.tables.recipe_steps} (
      id TEXT PRIMARY KEY NOT NULL,
      recipe_id TEXT NOT NULL,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL,
      FOREIGN KEY(recipe_id) REFERENCES ${schema.tables.recipes}(id)
    );`,
  );
};

const migrateToV6 = async (db: SQLiteDatabase) => {
  const hasTotalCalories = await hasColumn(
    db,
    schema.tables.recipes,
    'total_calories',
  );
  if (!hasTotalCalories) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.recipes}
       ADD COLUMN total_calories REAL NOT NULL DEFAULT 0;`,
    );
  }

  const hasTotalProtein = await hasColumn(
    db,
    schema.tables.recipes,
    'total_protein',
  );
  if (!hasTotalProtein) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.recipes}
       ADD COLUMN total_protein REAL NOT NULL DEFAULT 0;`,
    );
  }

  const hasTotalCarbs = await hasColumn(
    db,
    schema.tables.recipes,
    'total_carbs',
  );
  if (!hasTotalCarbs) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.recipes}
       ADD COLUMN total_carbs REAL NOT NULL DEFAULT 0;`,
    );
  }

  const hasTotalFat = await hasColumn(db, schema.tables.recipes, 'total_fat');
  if (!hasTotalFat) {
    await db.executeSql(
      `ALTER TABLE ${schema.tables.recipes}
       ADD COLUMN total_fat REAL NOT NULL DEFAULT 0;`,
    );
  }
};

const migrateToV7 = async (db: SQLiteDatabase) => {
  const addProfileId = async (table: string) => {
    const exists = await hasColumn(db, table, 'profile_id');
    if (!exists) {
      await db.executeSql(
        `ALTER TABLE ${table}
         ADD COLUMN profile_id TEXT;`,
      );
    }
  };

  await addProfileId(schema.tables.meal_plans);
  await addProfileId(schema.tables.water_logs);
  await addProfileId(schema.tables.macro_logs);
  await addProfileId(schema.tables.custom_foods);
  await addProfileId(schema.tables.grocery_items);

  await db.executeSql(
    `DELETE FROM ${schema.tables.meal_plans} WHERE profile_id IS NULL;`,
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.meal_items}
     WHERE meal_plan_id NOT IN (SELECT id FROM ${schema.tables.meal_plans});`,
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.water_logs} WHERE profile_id IS NULL;`,
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.macro_logs} WHERE profile_id IS NULL;`,
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.custom_foods} WHERE profile_id IS NULL;`,
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.grocery_items} WHERE profile_id IS NULL;`,
  );
};

export const runMigrations = async (db: SQLiteDatabase) => {
  const currentVersion = await getSchemaVersion(db);

  if (currentVersion < 1) {
    await migrateToV1(db);
    await migrateToV2(db);
    await migrateToV3(db);
    await migrateToV4(db);
    await migrateToV5(db);
    await migrateToV6(db);
    await migrateToV7(db);
    await setSchemaVersion(db, 7);
    return;
  }

  if (currentVersion < 2) {
    await migrateToV2(db);
    await setSchemaVersion(db, 2);
  }

  if (currentVersion < 3) {
    await migrateToV3(db);
    await setSchemaVersion(db, 3);
  }

  if (currentVersion < 4) {
    await migrateToV4(db);
    await setSchemaVersion(db, 4);
  }

  if (currentVersion < 5) {
    await migrateToV5(db);
    await setSchemaVersion(db, 5);
  }

  if (currentVersion < 6) {
    await migrateToV6(db);
    await setSchemaVersion(db, 6);
  }

  if (currentVersion < 7) {
    await migrateToV7(db);
    await setSchemaVersion(db, 7);
  }
};
