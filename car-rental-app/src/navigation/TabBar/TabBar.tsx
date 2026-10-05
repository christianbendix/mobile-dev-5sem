/* ___ TabBar component _______________________________
    Custom bottom bar for MainTabs, like the design: a
    floating pill with Booking, My Rentals and Profile.
    It floats over the screens, so each tab screen
    keeps TAB_BAR_SPACE free at the bottom.
   ____________________________________________________*/

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CalendarCheck, Search, User, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme';
import type { MainTabParamList } from '../types';
import { styles } from './TabBar.styles';

const TABS: Record<keyof MainTabParamList, { label: string; icon: LucideIcon }> = {
  Home: { label: 'Booking', icon: Search },
  Bookings: { label: 'My Rentals', icon: CalendarCheck },
  Account: { label: 'Profile', icon: User },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { bottom: Math.max(insets.bottom, 12) + 8 }]}>
      {state.routes.map((route, index) => {
        const { label, icon: Icon } = TABS[route.name as keyof MainTabParamList];
        const focused = state.index === index;

        function onPress() {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            style={({ pressed }) => [
              styles.tab,
              focused ? styles.tabActive : pressed && styles.tabPressed,
            ]}
          >
            <Icon size={20} color={focused ? colors.surface : colors.textMuted} />
            <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
