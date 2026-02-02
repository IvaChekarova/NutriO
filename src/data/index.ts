export { getSupabaseClient } from './supabase/client';
export { getDatabase, initDatabase } from './local/database';
export {
  createProfile,
  emailExists,
  getProfileById,
  getProfileByEmail,
  updateProfile,
} from './local/profiles';
export {
  clearSession,
  getSession,
  setSession,
  subscribeSession,
} from './local/session';
export {
  addMealItem,
  clearMealPlansAndLogs,
  deleteMealItem,
  getMealItemsForPlan,
  getMealPlanDatesFrom,
  getOrCreateMealPlan,
  updateMealItem,
} from './local/mealPlans';
export { addCustomFood, getCustomFoods } from './local/customFoods';
export { enrichIngredientsIfNeeded } from './local/ingredients';
export { getGroceryListForRange } from './local/grocery';
export { addWaterLog, getWaterTotalForDate } from './local/water';
export {
  addRecipeToMealPlan,
  ensureRecipeMacros,
  getRecipeById,
  getRecipeByTitle,
  getRecipeIngredients,
  getRecipeSteps,
  getRecipes,
  seedRecipesIfNeeded,
} from './local/recipes';
export { searchFoods } from './usda/client';
