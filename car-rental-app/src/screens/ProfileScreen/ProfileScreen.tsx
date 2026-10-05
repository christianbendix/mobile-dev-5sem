/* ___ ProfileScreen __________________________________
    The Profile tab: who is logged in, how many
    rentals they have coming up and behind them, their
    personal details (opened in place), a shortcut to
    My Rentals and log out. A guest gets the login
    gate instead.
   ____________________________________________________*/

import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CalendarCheck, Check, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginRequired } from '../../components/LoginRequired';
import { OnlineStatusHeader } from '../../components/OnlineStatusHeader';
import { useAuth } from '../../context/AuthContext';
import { useUserBookings } from '../../hooks/useUserBookings';
import type { MainTabParamList } from '../../navigation/types';
import { colors } from '../../theme';
import { styles } from './ProfileScreen.styles';

function Row({
  label,
  value,
  open,
  last,
  onPress,
}: {
  label: string;
  value?: string;
  /** set for a row that expands: true points the chevron down */
  open?: boolean;
  last?: boolean;
  onPress: () => void;
}) {
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={open === undefined ? undefined : { expanded: open }}
      style={[styles.row, !last && !open && styles.rowDivider]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? (
          <Text style={styles.rowValue} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        <Chevron size={16} color={colors.iconMuted} />
      </View>
    </Pressable>
  );
}

function Tile({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <View style={styles.tileValueRow}>
        {icon}
        <Text style={styles.tileValue}>{value}</Text>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user, logout } = useAuth();
  const { bookings, error, isLoading } = useUserBookings(user);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!user) return <LoginRequired title="Profile" message="Log in to see your account." />;

  const upcoming = bookings.filter((b) => b.status === 'active').length;
  const completed = bookings.length - upcoming;
  const count = (n: number) => (isLoading ? '–' : `${n}`);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <OnlineStatusHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{user.name.charAt(0).toUpperCase() || '?'}</Text>
          </View>
          <View style={styles.userText}>
            <Text style={styles.userName} numberOfLines={1}>
              {user.name}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>

        <View style={styles.tiles}>
          <Tile
            label="Upcoming rentals"
            value={count(upcoming)}
            icon={<CalendarCheck size={15} color={colors.primary} strokeWidth={2.5} />}
          />
          <Tile
            label="Completed rentals"
            value={count(completed)}
            icon={<Check size={15} color={colors.primary} strokeWidth={2.5} />}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.list}>
          <Row
            label="Personal details"
            open={detailsOpen}
            onPress={() => setDetailsOpen((open) => !open)}
          />
          {detailsOpen ? (
            <View style={[styles.details, styles.rowDivider]}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{user.name}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user.email}</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Account ID</Text>
                <Text style={styles.detailValue}>{user.id}</Text>
              </View>
            </View>
          ) : null}
          <Row
            label="My rentals"
            value={isLoading ? undefined : `${bookings.length}`}
            onPress={() => navigation.navigate('Bookings')}
          />
          <Row label="Find a car" last onPress={() => navigation.navigate('Home')} />
        </View>

        <Pressable
          onPress={logout}
          accessibilityRole="button"
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
