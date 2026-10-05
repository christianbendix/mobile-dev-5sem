import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActualBookingScreen } from '../screens/ActualBookingScreen';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen';
import { LoginScreen } from '../screens/LoginScreen/LoginScreen';
import { PreviewBookingScreen } from '../screens/PreviewBookingScreen/PreviewBookingScreen';
import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      {/* Login is the entry point on every cold start, because the auth token
          is not restored from storage (see src/api/client.ts). */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="PreviewBooking"
          component={PreviewBookingScreen}
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
        />
        <Stack.Screen name="ActualBooking" component={ActualBookingScreen} />
        <Stack.Screen
          name="BookingConfirmation"
          component={BookingConfirmationScreen}
          options={{ headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
