import { getDatabase } from './database';
import { schema } from './schema';

export const emailExists = async (email: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id FROM ${schema.tables.profiles} WHERE LOWER(email) = LOWER(?) LIMIT 1;`,
    [email],
  );

  return result.rows.length > 0;
};

export const createProfile = async (params: {
  fullName: string;
  email: string;
}) => {
  const db = await getDatabase();
  const id = `profile_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const createdAt = new Date().toISOString();

  await db.executeSql(
    `INSERT INTO ${schema.tables.profiles} (id, email, display_name, created_at)
     VALUES (?, ?, ?, ?);`,
    [id, params.email.trim(), params.fullName.trim(), createdAt],
  );

  return { id, createdAt };
};

export const updateProfile = async (params: {
  id: string;
  dietTags?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  age?: number | null;
  sex?: string | null;
  activityLevel?: string | null;
  goal?: string | null;
  timezone?: string | null;
}) => {
  const db = await getDatabase();

  await db.executeSql(
    `UPDATE ${schema.tables.profiles}
     SET diet_tags = ?,
         height_cm = ?,
         weight_kg = ?,
         age = ?,
         sex = ?,
         activity_level = ?,
         goal = ?,
         timezone = ?
     WHERE id = ?;`,
    [
      params.dietTags ?? null,
      params.heightCm ?? null,
      params.weightKg ?? null,
      params.age ?? null,
      params.sex ?? null,
      params.activityLevel ?? null,
      params.goal ?? null,
      params.timezone ?? null,
      params.id,
    ],
  );
};

export const getProfileByEmail = async (email: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, email, display_name FROM ${schema.tables.profiles}
     WHERE LOWER(email) = LOWER(?) LIMIT 1;`,
    [email],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.item(0) as {
    id: string;
    email: string;
    display_name: string | null;
  };
};

export const getProfileById = async (id: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id,
            email,
            display_name,
            diet_tags,
            height_cm,
            weight_kg,
            age,
            sex,
            activity_level,
            goal
     FROM ${schema.tables.profiles}
     WHERE id = ? LIMIT 1;`,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.item(0) as {
    id: string;
    email: string | null;
    display_name: string | null;
    diet_tags: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    age: number | null;
    sex: string | null;
    activity_level: string | null;
    goal: string | null;
  };
};
