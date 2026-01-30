import { getDatabase } from './database';
import { schema } from './schema';

type MealPlan = {
  id: string;
  date: string;
  notes: string | null;
};

type MealItem = {
  id: string;
  meal_plan_id: string;
  meal_type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const getOrCreateMealPlan = async (date: Date) => {
  const db = await getDatabase();
  const dateKey = isoDate(date);

  const [result] = await db.executeSql(
    `SELECT id, date, notes FROM ${schema.tables.meal_plans} WHERE date = ? LIMIT 1;`,
    [dateKey],
  );

  if (result.rows.length > 0) {
    return result.rows.item(0) as MealPlan;
  }

  const id = `plan_${dateKey}`;
  const now = new Date().toISOString();

  await db.executeSql(
    `INSERT INTO ${schema.tables.meal_plans} (id, date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?);`,
    [id, dateKey, null, now, now],
  );

  return { id, date: dateKey, notes: null } as MealPlan;
};

export const getMealItemsForPlan = async (planId: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, meal_plan_id, meal_type, name, calories, protein, carbs, fat, servings
     FROM ${schema.tables.meal_items}
     WHERE meal_plan_id = ?
     ORDER BY meal_type ASC;`,
    [planId],
  );

  const items: MealItem[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    items.push(result.rows.item(i));
  }

  return items;
};

export const addMealItem = async (params: {
  planId: string;
  mealType: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servings?: number;
}) => {
  const db = await getDatabase();
  const id = `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  await db.executeSql(
    `INSERT INTO ${schema.tables.meal_items}
     (id, meal_plan_id, meal_type, name, calories, protein, carbs, fat, servings)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      params.planId,
      params.mealType,
      params.name,
      params.calories,
      params.protein ?? 0,
      params.carbs ?? 0,
      params.fat ?? 0,
      params.servings ?? 1,
    ],
  );

  return id;
};

export const updateMealItem = async (params: {
  id: string;
  mealType: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servings?: number;
}) => {
  const db = await getDatabase();

  await db.executeSql(
    `UPDATE ${schema.tables.meal_items}
     SET meal_type = ?,
         name = ?,
         calories = ?,
         protein = ?,
         carbs = ?,
         fat = ?,
         servings = ?
     WHERE id = ?;`,
    [
      params.mealType,
      params.name,
      params.calories,
      params.protein ?? 0,
      params.carbs ?? 0,
      params.fat ?? 0,
      params.servings ?? 1,
      params.id,
    ],
  );
};
