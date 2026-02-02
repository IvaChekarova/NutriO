import { getDatabase } from './database';
import { schema } from './schema';
import { getRecipeByTitle, getRecipeIngredients } from './recipes';
import { getSession } from './session';

type GroceryItem = {
  name: string;
  amount: number;
  unit: string;
  usages: { label: string }[];
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const toKey = (name: string, unit: string) =>
  `${name.trim().toLowerCase()}__${unit.trim().toLowerCase()}`;

export const getGroceryListForRange = async (
  startDate: Date,
  endDate: Date,
) => {
  const db = await getDatabase();
  const session = await getSession();
  if (!session.profileId) {
    return [];
  }
  const startKey = isoDate(startDate);
  const endKey = isoDate(endDate);

  const [result] = await db.executeSql(
    `SELECT mi.type, mi.name, mi.servings, mi.serving_unit, mi.base_amount, mi.base_unit,
            mi.meal_type, mp.date
     FROM ${schema.tables.meal_items} mi
     JOIN ${schema.tables.meal_plans} mp ON mi.meal_plan_id = mp.id
     WHERE mp.date BETWEEN ? AND ? AND mp.profile_id = ?
     ORDER BY mp.date ASC;`,
    [startKey, endKey, session.profileId],
  );

  const aggregate = new Map<string, GroceryItem>();

  const formatDateLabel = (dateKey: string) => {
    const date = new Date(`${dateKey}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatMealType = (mealType: string) =>
    mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const addItem = (
    name: string,
    amount: number,
    unit: string,
    usageLabel: string,
  ) => {
    if (!name || amount <= 0 || !Number.isFinite(amount)) {
      return;
    }
    const safeUnit = unit || 'serving';
    const key = toKey(name, safeUnit);
    const existing = aggregate.get(key);
    if (existing) {
      existing.amount += amount;
      existing.usages.push({ label: usageLabel });
    } else {
      aggregate.set(key, {
        name,
        amount,
        unit: safeUnit,
        usages: [{ label: usageLabel }],
      });
    }
  };

  for (let i = 0; i < result.rows.length; i += 1) {
    const item = result.rows.item(i) as {
      type: string;
      name: string;
      servings: number;
      serving_unit: string;
      base_amount: number;
      base_unit: string;
      meal_type: string;
      date: string;
    };
    const mealLabel = `${formatMealType(item.meal_type)} ${formatDateLabel(item.date)} – ${item.name}`;

    if (item.type === 'recipe') {
      const recipe = await getRecipeByTitle(item.name);
      if (!recipe) {
        addItem(
          item.name,
          item.servings ?? 1,
          item.serving_unit ?? 'serving',
          mealLabel,
        );
        continue;
      }

      const ingredients = await getRecipeIngredients(recipe.id);
      const servingFactor =
        recipe.servings > 0 ? (item.servings ?? 1) / recipe.servings : 1;

      ingredients.forEach(ingredient => {
        const amount = Number(ingredient.quantity) * servingFactor;
        addItem(
          ingredient.name,
          amount,
          ingredient.unit,
          `${formatMealType(item.meal_type)} ${formatDateLabel(item.date)} – ${item.name}`,
        );
      });
      continue;
    }

    const servingUnit = item.serving_unit || 'g';
    if (servingUnit === 'serving' && item.base_amount > 0) {
      addItem(
        item.name,
        (item.servings ?? 1) * item.base_amount,
        item.base_unit || 'g',
        mealLabel,
      );
    } else {
      addItem(item.name, item.servings ?? 1, servingUnit, mealLabel);
    }
  }

  return Array.from(aggregate.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};
