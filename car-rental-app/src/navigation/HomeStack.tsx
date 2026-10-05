import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen/HomeScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen/SearchResultsScreen';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

/**
 * The Booking tab: the search form and its results. They live inside the tab
 * so the tab bar stays visible on the results; pressing the tab again pops
 * back to the search form.
 */
export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={HomeScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    </Stack.Navigator>
  );
}
