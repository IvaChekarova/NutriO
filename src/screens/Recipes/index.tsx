import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../../theme';
import { useRecipesLogic } from './logic';
import { createStyles } from './styles';
import { RecipesStackParamList } from '../../navigation/RecipesNavigator';

const imageOverrides = [
  {
    keys: ['chicken'],
    url: 'https://images.unsplash.com/photo-1604908811697-4a96c4d8d34a?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['salmon', 'fish'],
    url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['tofu', 'vegan'],
    url: 'https://images.unsplash.com/photo-1505576633757-0ac1084af824?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['salad', 'bowl'],
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['egg', 'breakfast'],
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',
  },
  {
    keys: ['shrimp'],
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  },
];

const resolveRecipeImage = (title: string, fallback?: string) => {
  const lower = title.toLowerCase();
  const match = imageOverrides.find(item =>
    item.keys.some(key => lower.includes(key)),
  );

  return match?.url || fallback || '';
};

const RecipesScreen = () => {
  const { recipes, userTags, ingredientFilter, setIngredientFilter } =
    useRecipesLogic();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation =
    useNavigation<NativeStackNavigationProp<RecipesStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Recipes</Text>
        <Text style={styles.subtitle}>Suggestions by dietary preferences.</Text>
        {userTags.length > 0 ? (
          <View style={styles.preferenceRow}>
            {userTags.map(tag => (
              <View key={tag} style={styles.preferenceTag}>
                <Text style={styles.preferenceTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by ingredient</Text>
          <TextInput
            value={ingredientFilter}
            onChangeText={setIngredientFilter}
            placeholder="e.g. chicken, avocado"
            placeholderTextColor={theme.colors.textSecondary}
            style={styles.filterInput}
          />
        </View>

        <View style={styles.list}>
          {recipes.map(recipe => (
            <Pressable
              key={recipe.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('RecipeDetail', { id: recipe.id })
              }
            >
              {resolveRecipeImage(recipe.title, recipe.imageUrl) ? (
                <Image
                  source={{
                    uri: resolveRecipeImage(recipe.title, recipe.imageUrl),
                  }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={styles.cardPlaceholder} />
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{recipe.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>
                <View style={styles.cardMetaRow}>
                  <Text style={styles.cardMetaText}>
                    {recipe.prepTime + recipe.cookTime} min
                  </Text>
                  <Text style={styles.cardMetaDot}>•</Text>
                  <Text style={styles.cardMetaText}>{recipe.difficulty}</Text>
                  <Text style={styles.cardMetaDot}>•</Text>
                  <Text style={styles.cardMetaText}>
                    {recipe.servings} servings
                  </Text>
                </View>
                {recipe.dietTags.length > 0 ? (
                  <View style={styles.tagRow}>
                    {recipe.dietTags.slice(0, 3).map(tag => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecipesScreen;
