import { useState } from 'react';
import { View, Button, FlatList, Text, StyleSheet } from 'react-native';
import { supabase } from '../../src/config/supabase';
import { api } from '../../src/services/api';
import { Recipe } from '../../src/types';
export default function RecipesScreen() {
//   const [recipes, setRecipes] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFindRecipes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pantry_items')
      .select('name')
      .eq('status', 'active');

    // const ingredientNames = data.map((i) => i.name);
    const handleFindRecipes = async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('pantry_items')
        .select('name')
        .eq('status', 'active');

    if (error || !data) {
        setLoading(false);
        return;
    }

    const ingredientNames = data.map((i) => i.name);
    const result = await api.suggestRecipes(ingredientNames);
    setRecipes(result.recipes);
    setLoading(false);
    };
  };

  return (
    <View style={styles.container}>
      <Button title="Suggest Recipes" onPress={handleFindRecipes} disabled={loading} />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Uses {item.usedIngredientCount} of your ingredients</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontWeight: 'bold' },
});