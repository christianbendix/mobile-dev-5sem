import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BookingsScreen } from '../screens/BookingsScreen/BookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen/ProfileScreen';
import { TabBar } from './TabBar/TabBar';
import { HomeStack } from './HomeStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
