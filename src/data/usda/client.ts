import { USDA_API_KEY } from '../../config/usda';

const API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const CACHE_TTL_MS = 5 * 60 * 1000;
const foodSearchCache = new Map<string, { timestamp: number; results: FoodSearchResult[] }>();
const foodSearchInflight = new Map<string, Promise<FoodSearchResult[]>>();

type UsdaNutrient = {
  nutrientId?: number;
  nutrientName?: string;
  value?: number;
};

type UsdaFood = {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodNutrients?: UsdaNutrient[];
};

export type FoodSearchResult = {
  id: number;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize?: number;
  servingSizeUnit?: string;
  source: 'usda' | 'custom';
};

const getNutrientValue = (
  nutrients: UsdaNutrient[] | undefined,
  ids: number[],
) => {
  if (!nutrients) {
    return 0;
  }

  const match = nutrients.find(
    nutrient =>
      (nutrient.nutrientId && ids.includes(nutrient.nutrientId)) ||
      (nutrient.nutrientName &&
        ids.includes(mapNameToId(nutrient.nutrientName))),
  );

  return Number(match?.value ?? 0);
};

const mapNameToId = (name: string) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('energy')) return 1008;
  if (normalized.includes('protein')) return 1003;
  if (normalized.includes('carbohydrate')) return 1005;
  if (normalized.includes('fat')) return 1004;

  return 0;
};

const mapFood = (food: UsdaFood) => {
  const calories = getNutrientValue(food.foodNutrients, [1008]);
  const protein = getNutrientValue(food.foodNutrients, [1003]);
  const carbs = getNutrientValue(food.foodNutrients, [1005]);
  const fat = getNutrientValue(food.foodNutrients, [1004]);

  return {
    id: food.fdcId,
    name: food.description,
    brand: food.brandOwner,
    calories,
    protein,
    carbs,
    fat,
    servingSize: (food as { servingSize?: number }).servingSize,
    servingSizeUnit: (food as { servingSizeUnit?: string }).servingSizeUnit,
    source: 'usda' as const,
  };
};

export const searchFoods = async (
  query: string,
  options?: { signal?: AbortSignal },
): Promise<FoodSearchResult[]> => {
  if (!USDA_API_KEY) {
    throw new Error('USDA_API_KEY is missing.');
  }

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const cached = foodSearchCache.get(normalizedQuery);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  const inflight = foodSearchInflight.get(normalizedQuery);
  if (inflight) {
    return inflight;
  }

  const request = (async () => {
    const response = await fetch(
      `${API_BASE_URL}/foods/search?api_key=${USDA_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: options?.signal,
        body: JSON.stringify({
          query: normalizedQuery,
          pageSize: 8,
          dataType: ['Foundation', 'SR Legacy'],
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Unable to fetch foods.');
    }

    const data = await response.json();
    const foods: UsdaFood[] = data?.foods ?? [];
    const results = foods.map(mapFood);
    foodSearchCache.set(normalizedQuery, { timestamp: Date.now(), results });
    return results;
  })();

  foodSearchInflight.set(normalizedQuery, request);
  try {
    return await request;
  } finally {
    foodSearchInflight.delete(normalizedQuery);
  }
};

const scoreIngredientMatch = (query: string, description: string) => {
  const q = query.toLowerCase();
  const d = description.toLowerCase();
  let score = 0;

  if (d === q) score += 5;
  if (d.startsWith(q)) score += 3;
  if (d.includes(q)) score += 1;

  const avoid = ['powder', 'dried', 'dehydrated', 'flakes', 'granules'];
  const hasAvoid = avoid.some(term => d.includes(term));
  const queryWantsAvoid = avoid.some(term => q.includes(term));
  if (hasAvoid && !queryWantsAvoid) score -= 3;

  return score;
};

export const searchFoodsForIngredients = async (query: string) => {
  if (!USDA_API_KEY) {
    throw new Error('USDA_API_KEY is missing.');
  }

  const response = await fetch(
    `${API_BASE_URL}/foods/search?api_key=${USDA_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        pageSize: 10,
        requireAllWords: true,
        dataType: ['Foundation', 'SR Legacy'],
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Unable to fetch foods.');
  }

  const data = await response.json();
  const foods: UsdaFood[] = data?.foods ?? [];

  return foods
    .map(mapFood)
    .map(item => ({
      item,
      score: scoreIngredientMatch(query, item.name),
    }))
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.item);
};
