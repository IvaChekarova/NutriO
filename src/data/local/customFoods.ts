import { getDatabase } from './database';
import { schema } from './schema';
import { getSession } from './session';

export type CustomFood = {
  id: string;
  name: string;
  serving_size_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const addCustomFood = async (params: {
  name: string;
  servingSizeG: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return null;
  }
  const id = `custom_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const now = new Date().toISOString();

  await db.executeSql(
    `INSERT INTO ${schema.tables.custom_foods}
     (id, profile_id, name, serving_size_g, calories, protein, carbs, fat, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      session.profileId,
      params.name.trim(),
      params.servingSizeG,
      params.calories,
      params.protein ?? 0,
      params.carbs ?? 0,
      params.fat ?? 0,
      now,
    ],
  );

  return id;
};

export const getCustomFoods = async (query: string) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return [];
  }
  const likeQuery = `%${query.trim()}%`;
  const [result] = await db.executeSql(
    `SELECT id, name, serving_size_g, calories, protein, carbs, fat
     FROM ${schema.tables.custom_foods}
     WHERE name LIKE ? AND profile_id = ?
     ORDER BY created_at DESC
     LIMIT 8;`,
    [likeQuery, session.profileId],
  );

  const foods: CustomFood[] = [];
  for (let i = 0; i < result.rows.length; i += 1) {
    foods.push(result.rows.item(i));
  }

  return foods;
};
