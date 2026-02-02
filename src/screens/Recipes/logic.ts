/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from 'react';

import {
  getProfileById,
  getRecipeIngredients,
  getRecipes,
  getSession,
} from '../../data';

type RecipeCard = {
  id: string;
  title: string;
  description: string;
  dietTags: string[];
  ingredients: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  imageUrl: string;
};

export const useRecipesLogic = () => {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [ingredientFilter, setIngredientFilter] = useState('');

  useEffect(() => {
    let isActive = true;
    const load = async () => {
      let nextUserTags: string[] = [];
      const session = await getSession();
      if (session.profileId) {
        const profile = await getProfileById(session.profileId);
        if (profile?.diet_tags) {
          const tags = profile.diet_tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
          nextUserTags = tags;
          if (isActive) {
            setUserTags(tags);
          }
        }
      }

      const rows = await getRecipes();
      if (!isActive) {
        return;
      }

      const tagsLower = nextUserTags.map(tag => tag.toLowerCase());
      const mapped = await Promise.all(
        rows.map(async (row, index) => {
          const ingredients = await getRecipeIngredients(row.id);
          const ingredientNames = ingredients.map(item =>
            item.name.toLowerCase(),
          );
          const dietTags = row.diet_tags
            ? row.diet_tags.split(',').map(tag => tag.trim())
            : [];
          const matchScore = dietTags.some(tag =>
            tagsLower.includes(tag.toLowerCase()),
          )
            ? 1
            : 0;
          return {
            id: row.id,
            title: row.title,
            description: row.description,
            dietTags,
            ingredients: ingredientNames,
            servings: row.servings,
            prepTime: row.prep_time_min ?? 0,
            cookTime: row.cook_time_min ?? 0,
            difficulty: row.difficulty ?? 'easy',
            imageUrl: row.image_url ?? '',
            matchScore,
            index,
          };
        }),
      );

      mapped.sort((a, b) => {
        if (a.matchScore !== b.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.index - b.index;
      });

      setRecipes(mapped.map(({ matchScore, index, ...recipe }) => recipe));
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredRecipes = useMemo(() => {
    const filter = ingredientFilter.trim().toLowerCase();
    if (!filter) {
      return recipes;
    }
    const terms = filter
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
    if (!terms.length) {
      return recipes;
    }
    return recipes.filter(recipe =>
      terms.some(term => recipe.ingredients.some(item => item.includes(term))),
    );
  }, [ingredientFilter, recipes]);

  return {
    recipes: filteredRecipes,
    userTags,
    ingredientFilter,
    setIngredientFilter,
  } as const;
};
