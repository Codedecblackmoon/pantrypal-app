import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';

import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import PantryListScreen from '../screens/PantryListScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import RecipesScreen from '../screens/RecipesScreen';
import InsightsScreen from '../screens/InsightsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Pantry" component={PantryListScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { session, loading } = useAuth();

  if (loading) return null; // could show a splash/loading screen here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AddItem" component={AddItemScreen} options={{ headerShown: true }} />
            <Stack.Screen name="ItemDetail" component={ItemDetailScreen} options={{ headerShown: true }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}