import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AccountScreen } from '../screens/AccountScreen';
import { BookingsScreen } from '../screens/BookingsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
