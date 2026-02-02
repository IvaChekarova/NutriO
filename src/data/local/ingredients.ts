import { getDatabase } from './database';
import { schema } from './schema';
import { USDA_API_KEY } from '../../config/usda';
import { searchFoodsForIngredients } from '../usda/client';

const META_KEY = 'ingredients_seeded_v2';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const enrichIngredientsIfNeeded = async () => {
  if (!USDA_API_KEY) {
    return;
  }

  const db = await getDatabase();
  const [metaResult] = await db.executeSql(
    `SELECT value FROM ${schema.tables.meta} WHERE key = ? LIMIT 1;`,
    [META_KEY],
  );

  if (metaResult.rows.length > 0 && metaResult.rows.item(0).value === '1') {
    return;
  }

  const [result] = await db.executeSql(
    `SELECT id, name FROM ${schema.tables.ingredients}
     WHERE calories = 0 AND protein = 0 AND carbs = 0 AND fat = 0;`,
  );

  let hadError = false;
  for (let i = 0; i < result.rows.length; i += 1) {
    const row = result.rows.item(i) as { id: string; name: string };
    try {
      const foods = await searchFoodsForIngredients(row.name);
      const best = foods[0];
      if (best) {
        await db.executeSql(
          `UPDATE ${schema.tables.ingredients}
           SET calories = ?, protein = ?, carbs = ?, fat = ?, unit_default = ?
           WHERE id = ?;`,
          [
            best.calories ?? 0,
            best.protein ?? 0,
            best.carbs ?? 0,
            best.fat ?? 0,
            'g',
            row.id,
          ],
        );
      }
    } catch {
      hadError = true;
      break;
    }

    await sleep(250);
  }

  if (!hadError) {
    await db.executeSql(
      `INSERT OR REPLACE INTO ${schema.tables.meta} (key, value) VALUES (?, ?);`,
      [META_KEY, '1'],
    );
  }
};
