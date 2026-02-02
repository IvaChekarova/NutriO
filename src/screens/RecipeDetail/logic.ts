import { useEffect, useState } from 'react';

import {
  getRecipeById,
  getRecipeIngredients,
  getRecipeSteps,
} from '../../data';

type RecipeDetail = {
  id: string;
  title: string;
  description: string;
  dietTags: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  imageUrl: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  ingredients: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }[];
  steps: {
    id: string;
    stepNumber: number;
    instruction: string;
  }[];
};

export const useRecipeDetailLogic = (recipeId: string) => {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      const recipeRow = await getRecipeById(recipeId);
      if (!recipeRow || !isActive) {
        return;
      }

      const [ingredients, steps] = await Promise.all([
        getRecipeIngredients(recipeId),
        getRecipeSteps(recipeId),
      ]);

      if (!isActive) {
        return;
      }

      setRecipe({
        id: recipeRow.id,
        title: recipeRow.title,
        description: recipeRow.description,
        dietTags: recipeRow.diet_tags ? recipeRow.diet_tags.split(',') : [],
        servings: recipeRow.servings,
        prepTime: recipeRow.prep_time_min ?? 0,
        cookTime: recipeRow.cook_time_min ?? 0,
        difficulty: recipeRow.difficulty ?? 'easy',
        imageUrl: recipeRow.image_url ?? '',
        totalCalories: recipeRow.total_calories ?? 0,
        totalProtein: recipeRow.total_protein ?? 0,
        totalCarbs: recipeRow.total_carbs ?? 0,
        totalFat: recipeRow.total_fat ?? 0,
        ingredients: ingredients.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        })),
        steps: steps.map(item => ({
          id: item.id,
          stepNumber: item.step_number,
          instruction: item.instruction,
        })),
      });
    };

    load();

    return () => {
      isActive = false;
    };
  }, [recipeId]);

  return { recipe } as const;
};
