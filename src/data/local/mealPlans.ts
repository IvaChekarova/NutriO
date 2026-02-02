import { getDatabase } from './database';
import { schema } from './schema';
import { emitMealPlanChange } from '../../utils/mealPlanEvents';
import { getSession } from './session';

type MealPlan = {
  id: string;
  date: string;
  notes: string | null;
};

type MealItem = {
  id: string;
  meal_plan_id: string;
  meal_type: string;
  type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  serving_unit: string;
  base_amount: number;
  base_unit: string;
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const getOrCreateMealPlan = async (date: Date) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return null;
  }
  const dateKey = isoDate(date);

  const [result] = await db.executeSql(
    `SELECT id, date, notes FROM ${schema.tables.meal_plans}
     WHERE date = ? AND profile_id = ? LIMIT 1;`,
    [dateKey, session.profileId],
  );

  if (result.rows.length > 0) {
    return result.rows.item(0) as MealPlan;
  }

  const id = `plan_${session.profileId}_${dateKey}`;
  const now = new Date().toISOString();

  await db.executeSql(
    `INSERT INTO ${schema.tables.meal_plans} (id, profile_id, date, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [id, session.profileId, dateKey, null, now, now],
  );

  return { id, date: dateKey, notes: null } as MealPlan;
};

export const getMealItemsForPlan = async (planId: string) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return [];
  }
  const [result] = await db.executeSql(
    `SELECT mi.id, mi.meal_plan_id, mi.meal_type, mi.type, mi.name, mi.calories, mi.protein, mi.carbs, mi.fat, mi.servings, mi.serving_unit, mi.base_amount, mi.base_unit
     FROM ${schema.tables.meal_items} mi
     JOIN ${schema.tables.meal_plans} mp ON mi.meal_plan_id = mp.id
     WHERE mi.meal_plan_id = ? AND mp.profile_id = ?
     ORDER BY mi.meal_type ASC;`,
    [planId, session.profileId],
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
  type: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servings?: number;
  servingUnit?: string;
  baseAmount?: number;
  baseUnit?: string;
}) => {
  const db = await getDatabase();
  const id = `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  await db.executeSql(
    `INSERT INTO ${schema.tables.meal_items}
     (id, meal_plan_id, type, meal_type, name, calories, protein, carbs, fat, servings, serving_unit, base_amount, base_unit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      params.planId,
      params.type,
      params.mealType,
      params.name,
      params.calories,
      params.protein ?? 0,
      params.carbs ?? 0,
      params.fat ?? 0,
      params.servings ?? 1,
      params.servingUnit ?? 'g',
      params.baseAmount ?? 0,
      params.baseUnit ?? 'g',
    ],
  );

  emitMealPlanChange();
  return id;
};

export const updateMealItem = async (params: {
  id: string;
  mealType: string;
  type: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servings?: number;
  servingUnit?: string;
  baseAmount?: number;
  baseUnit?: string;
}) => {
  const db = await getDatabase();

  await db.executeSql(
    `UPDATE ${schema.tables.meal_items}
     SET meal_type = ?,
         type = ?,
         name = ?,
         calories = ?,
         protein = ?,
         carbs = ?,
         fat = ?,
         servings = ?,
         serving_unit = ?,
         base_amount = ?,
         base_unit = ?
     WHERE id = ?;`,
    [
      params.mealType,
      params.type,
      params.name,
      params.calories,
      params.protein ?? 0,
      params.carbs ?? 0,
      params.fat ?? 0,
      params.servings ?? 1,
      params.servingUnit ?? 'g',
      params.baseAmount ?? 0,
      params.baseUnit ?? 'g',
      params.id,
    ],
  );
  emitMealPlanChange();
};

export const clearMealPlansAndLogs = async () => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return;
  }
  await db.executeSql(
    `DELETE FROM ${schema.tables.meal_items}
     WHERE meal_plan_id IN (
       SELECT id FROM ${schema.tables.meal_plans} WHERE profile_id = ?
     );`,
    [session.profileId],
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.meal_plans} WHERE profile_id = ?;`,
    [session.profileId],
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.macro_logs} WHERE profile_id = ?;`,
    [session.profileId],
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.water_logs} WHERE profile_id = ?;`,
    [session.profileId],
  );
  await db.executeSql(
    `DELETE FROM ${schema.tables.grocery_items} WHERE profile_id = ?;`,
    [session.profileId],
  );
  emitMealPlanChange();
};

export const deleteMealItem = async (id: string) => {
  const db = await getDatabase();
  await db.executeSql(`DELETE FROM ${schema.tables.meal_items} WHERE id = ?;`, [
    id,
  ]);
  emitMealPlanChange();
};

export const getMealPlanDatesFrom = async (startDate: Date) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return [];
  }
  const startKey = isoDate(startDate);
  const [result] = await db.executeSql(
    `SELECT DISTINCT date FROM ${schema.tables.meal_plans}
     WHERE date >= ? AND profile_id = ?
     ORDER BY date ASC;`,
    [startKey, session.profileId],
  );

  const dates: string[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    dates.push(String(result.rows.item(i).date));
  }

  return dates;
};
