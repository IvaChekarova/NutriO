import { getDatabase } from './database';
import { schema } from './schema';
import { getSession } from './session';

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const addWaterLog = async (
  date: Date,
  amountMl: number,
  source = 'manual',
) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return;
  }
  const id = `water_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const now = new Date().toISOString();

  await db.executeSql(
    `INSERT INTO ${schema.tables.water_logs}
     (id, profile_id, date, amount_ml, target_ml, source, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      session.profileId,
      isoDate(date),
      Math.round(amountMl),
      null,
      source,
      now,
    ],
  );
};

export const getWaterTotalForDate = async (date: Date) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return 0;
  }
  const [result] = await db.executeSql(
    `SELECT SUM(amount_ml) as total
     FROM ${schema.tables.water_logs}
     WHERE date = ? AND profile_id = ?;`,
    [isoDate(date), session.profileId],
  );

  return Number(result.rows.item(0)?.total ?? 0);
};
