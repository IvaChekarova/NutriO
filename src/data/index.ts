export { getSupabaseClient } from './supabase/client';
export { getDatabase, initDatabase } from './local/database';
export {
  createProfile,
  emailExists,
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
  getMealItemsForPlan,
  getOrCreateMealPlan,
  updateMealItem,
} from './local/mealPlans';
