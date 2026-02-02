import { getDatabase } from './database';
import { schema } from './schema';
import { getOrCreateMealPlan } from './mealPlans';

type SeedRecipe = {
  id: string;
  title: string;
  description: string;
  dietTags: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: string[];
};

const imagePool = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1460306855393-0410f61241c7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
];

const baseRecipes = [
  {
    title: 'Mediterranean Chickpea Bowl',
    tags: ['vegetarian', 'mediterranean'],
  },
  { title: 'Lemon Herb Salmon', tags: ['pescatarian', 'high-protein'] },
  { title: 'Chicken Power Salad', tags: ['high-protein', 'gluten-free'] },
  { title: 'Quinoa Veggie Stir Fry', tags: ['vegetarian', 'high-fiber'] },
  { title: 'Turkey Lettuce Wraps', tags: ['low-carb', 'high-protein'] },
  { title: 'Avocado Egg Toast', tags: ['vegetarian', 'breakfast'] },
  { title: 'Greek Yogurt Parfait', tags: ['vegetarian', 'breakfast'] },
  { title: 'Spicy Tofu Rice Bowl', tags: ['vegan', 'high-protein'] },
  { title: 'Sweet Potato Burrito', tags: ['vegetarian', 'high-fiber'] },
  { title: 'Shrimp Zoodle Bowl', tags: ['low-carb', 'pescatarian'] },
];

const ingredientPool = [
  'olive oil',
  'garlic',
  'onion',
  'tomato',
  'spinach',
  'chickpeas',
  'lemon',
  'brown rice',
  'quinoa',
  'chicken breast',
  'salmon',
  'tofu',
  'greek yogurt',
  'cucumber',
  'bell pepper',
  'avocado',
  'egg',
  'sweet potato',
  'black beans',
  'shrimp',
  'zucchini',
  'feta cheese',
  'parsley',
  'cilantro',
  'turkey',
  'whole grain bread',
];

const buildSeeds = () => {
  const seeds: SeedRecipe[] = [];

  for (let i = 0; i < 50; i += 1) {
    const base = baseRecipes[i % baseRecipes.length];
    const id = `recipe_${String(i + 1).padStart(3, '0')}`;
    const ingredients = Array.from({ length: 5 }).map((_, idx) => {
      const name = ingredientPool[(i + idx) % ingredientPool.length];
      return {
        name,
        quantity: 100 + ((i + idx) % 3) * 25,
        unit: 'g',
      };
    });

    seeds.push({
      id,
      title: `${base.title} ${i < 10 ? 'Classic' : i < 25 ? 'Fresh' : 'Light'}`,
      description: 'Balanced meal with fresh ingredients and simple prep.',
      dietTags: base.tags,
      servings: 2 + (i % 3),
      prepTime: 10 + (i % 10),
      cookTime: 15 + (i % 20),
      difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
      imageUrl: imagePool[i % imagePool.length],
      totalCalories: 420 + (i % 8) * 45,
      totalProtein: 18 + (i % 6) * 6,
      totalCarbs: 35 + (i % 7) * 8,
      totalFat: 12 + (i % 5) * 5,
      ingredients,
      steps: [
        'Prep all ingredients and set aside.',
        'Cook the main ingredient until tender.',
        'Combine ingredients, season, and serve.',
      ],
    });
  }

  return seeds;
};

export const seedRecipesIfNeeded = async () => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT COUNT(*) as count FROM ${schema.tables.recipes};`,
  );
  const count = result.rows.item(0)?.count ?? 0;
  if (count > 0) {
    return;
  }

  const seeds = buildSeeds();
  const now = new Date().toISOString();

  const ingredientIds = new Map<string, string>();
  for (const name of ingredientPool) {
    const id = `ing_${name.replace(/\s+/g, '_')}`;
    ingredientIds.set(name, id);
    await db.executeSql(
      `INSERT OR IGNORE INTO ${schema.tables.ingredients}
       (id, name, calories, protein, carbs, fat, fiber, sugar, sodium, unit_default)
       VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, ?);`,
      [id, name, 'serving'],
    );
  }

  for (const recipe of seeds) {
    await db.executeSql(
      `INSERT INTO ${schema.tables.recipes}
       (id, title, description, diet_tags, servings, prep_time_min, cook_time_min, difficulty, image_url, total_calories, total_protein, total_carbs, total_fat, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        recipe.id,
        recipe.title,
        recipe.description,
        recipe.dietTags.join(','),
        recipe.servings,
        recipe.prepTime,
        recipe.cookTime,
        recipe.difficulty,
        recipe.imageUrl,
        recipe.totalCalories,
        recipe.totalProtein,
        recipe.totalCarbs,
        recipe.totalFat,
        now,
        now,
      ],
    );

    for (let index = 0; index < recipe.ingredients.length; index += 1) {
      const ingredient = recipe.ingredients[index];
      const ingredientId = ingredientIds.get(ingredient.name);
      if (!ingredientId) {
        continue;
      }

      await db.executeSql(
        `INSERT INTO ${schema.tables.recipe_ingredients}
         (id, recipe_id, ingredient_id, quantity, unit)
         VALUES (?, ?, ?, ?, ?);`,
        [
          `${recipe.id}_ing_${index}`,
          recipe.id,
          ingredientId,
          ingredient.quantity,
          ingredient.unit,
        ],
      );
    }

    for (let index = 0; index < recipe.steps.length; index += 1) {
      const step = recipe.steps[index];
      await db.executeSql(
        `INSERT INTO ${schema.tables.recipe_steps}
         (id, recipe_id, step_number, instruction)
         VALUES (?, ?, ?, ?);`,
        [`${recipe.id}_step_${index}`, recipe.id, index + 1, step],
      );
    }
  }
};

export const ensureRecipeMacros = async () => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT COUNT(*) as count
     FROM ${schema.tables.recipes}
     WHERE total_calories > 0;`,
  );
  const count = result.rows.item(0)?.count ?? 0;
  if (count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const seeds = buildSeeds();

  for (const recipe of seeds) {
    await db.executeSql(
      `UPDATE ${schema.tables.recipes}
       SET total_calories = ?,
           total_protein = ?,
           total_carbs = ?,
           total_fat = ?,
           updated_at = ?
       WHERE id = ?;`,
      [
        recipe.totalCalories,
        recipe.totalProtein,
        recipe.totalCarbs,
        recipe.totalFat,
        now,
        recipe.id,
      ],
    );
  }
};
export const getRecipes = async () => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, title, description, diet_tags, servings, prep_time_min, cook_time_min, difficulty, image_url
     FROM ${schema.tables.recipes}
     ORDER BY created_at DESC;`,
  );

  const items: {
    id: string;
    title: string;
    description: string;
    diet_tags: string | null;
    servings: number;
    prep_time_min: number | null;
    cook_time_min: number | null;
    difficulty: string | null;
    image_url: string | null;
  }[] = [];

  for (let i = 0; i < result.rows.length; i += 1) {
    items.push(result.rows.item(i));
  }

  return items;
};

export const getRecipeById = async (id: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, title, description, diet_tags, servings, prep_time_min, cook_time_min, difficulty, image_url,
            total_calories, total_protein, total_carbs, total_fat
     FROM ${schema.tables.recipes}
     WHERE id = ?
     LIMIT 1;`,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows.item(0) as {
    id: string;
    title: string;
    description: string;
    diet_tags: string | null;
    servings: number;
    prep_time_min: number | null;
    cook_time_min: number | null;
    difficulty: string | null;
    image_url: string | null;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  };
};

export const getRecipeByTitle = async (title: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, servings FROM ${schema.tables.recipes} WHERE title = ? LIMIT 1;`,
    [title],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    id: String(result.rows.item(0).id),
    servings: Number(result.rows.item(0).servings) || 1,
  };
};

export const getRecipeIngredients = async (recipeId: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT ri.id, ri.quantity, ri.unit, i.name
     FROM ${schema.tables.recipe_ingredients} ri
     JOIN ${schema.tables.ingredients} i ON i.id = ri.ingredient_id
     WHERE ri.recipe_id = ?
     ORDER BY i.name ASC;`,
    [recipeId],
  );

  const items: {
    id: string;
    quantity: number;
    unit: string;
    name: string;
  }[] = [];

  for (let i = 0; i < result.rows.length; i += 1) {
    const row = result.rows.item(i) as {
      id: string;
      quantity: number;
      unit: string;
      name: string;
    };
    if (row.unit === 'serving' || row.unit === 'servings') {
      items.push({
        ...row,
        quantity: Number(row.quantity) * 100,
        unit: 'g',
      });
    } else {
      items.push(row);
    }
  }

  return items;
};

export const getRecipeSteps = async (recipeId: string) => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT id, step_number, instruction
     FROM ${schema.tables.recipe_steps}
     WHERE recipe_id = ?
     ORDER BY step_number ASC;`,
    [recipeId],
  );

  const items: {
    id: string;
    step_number: number;
    instruction: string;
  }[] = [];

  for (let i = 0; i < result.rows.length; i += 1) {
    items.push(result.rows.item(i));
  }

  return items;
};

export const addRecipeToMealPlan = async (params: {
  recipeId: string;
  date: Date;
  mealType: string;
}) => {
  const db = await getDatabase();
  const plan = await getOrCreateMealPlan(params.date);
  if (!plan) {
    return null;
  }
  const [recipeResult] = await db.executeSql(
    `SELECT title, servings, total_calories, total_protein, total_carbs, total_fat
     FROM ${schema.tables.recipes} WHERE id = ? LIMIT 1;`,
    [params.recipeId],
  );
  const recipeServings = recipeResult.rows.length
    ? Number(recipeResult.rows.item(0).servings) || 1
    : 1;
  const recipeTitle = recipeResult.rows.length
    ? String(recipeResult.rows.item(0).title)
    : 'Recipe';
  const totalCalories = recipeResult.rows.length
    ? Number(recipeResult.rows.item(0).total_calories) || 0
    : 0;
  const totalProtein = recipeResult.rows.length
    ? Number(recipeResult.rows.item(0).total_protein) || 0
    : 0;
  const totalCarbs = recipeResult.rows.length
    ? Number(recipeResult.rows.item(0).total_carbs) || 0
    : 0;
  const totalFat = recipeResult.rows.length
    ? Number(recipeResult.rows.item(0).total_fat) || 0
    : 0;
  const perServingFactor = recipeServings ? 1 / recipeServings : 1;
  const id = `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  await db.executeSql(
    `INSERT INTO ${schema.tables.meal_items}
     (id, meal_plan_id, type, meal_type, name, calories, protein, carbs, fat, servings, serving_unit, base_amount, base_unit)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      plan.id,
      'recipe',
      params.mealType,
      recipeTitle,
      totalCalories * perServingFactor,
      totalProtein * perServingFactor,
      totalCarbs * perServingFactor,
      totalFat * perServingFactor,
      1,
      'serving',
      1,
      'serving',
    ],
  );

  return plan.id;
};
