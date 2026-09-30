/* ___ DateRangePicker component ______________________
    Full-screen calendar sheet for the rental period,
    the way rental and travel sites do it: months
    scroll vertically, the first tap sets pick-up and
    the second sets return, with the days in between
    highlighted. Past days cannot be picked, and a tap
    before the pick-up starts a new range.
    Next to each date is its time; tapping it swaps
    the calendar for a grid of half-hour slots.
    Nothing is applied until "Confirm dates"; the
    parent decides what happens with the period.
   ____________________________________________________*/

import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme';
import type { RentalPeriod } from '../../types/search';
import {
  addDays,
  calendarMonths,
  daysBetween,
  formatDay,
  isReturnBeforePickup,
  timeSlots,
} from '../../utils/searchInput';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import { styles } from './DateRangePicker.styles';

const MONTHS_AHEAD = 12;
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const TIME_SLOTS = timeSlots(30);

/** the period being edited; the return date is null between the two taps */
type Draft = Omit<RentalPeriod, 'returnDate'> & { returnDate: string | null };

type End = 'pickup' | 'return';

type Props = {
  visible: boolean;
  period: RentalPeriod;
  onConfirm: (period: RentalPeriod) => void;
  onClose: () => void;
};

export function DateRangePicker({ visible, period, onConfirm, onClose }: Props) {
  const today = addDays(new Date(), 0);
  const months = useMemo(() => calendarMonths(today, MONTHS_AHEAD), [today]);

  const [draft, setDraft] = useState<Draft>(period);
  // which end's time the slot grid is showing; null shows the calendar
  const [editingTime, setEditingTime] = useState<End | null>(null);
  const [wasVisible, setWasVisible] = useState(visible);
  // start from the form's period, on the calendar, each time the sheet opens
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setDraft(period);
      setEditingTime(null);
    }
  }

  function pressDay(day: string) {
    setDraft((current) =>
      // a finished range, or a day before the pick-up, starts over
      current.returnDate !== null || day < current.pickupDate
        ? { ...current, pickupDate: day, returnDate: null }
        : { ...current, returnDate: day },
    );
  }

  function pressSlot(time: string) {
    setDraft((current) =>
      editingTime === 'return'
        ? { ...current, returnTime: time }
        : { ...current, pickupTime: time },
    );
    setEditingTime(null);
  }

  const { returnDate } = draft;
  const days = returnDate ? Math.max(daysBetween(draft.pickupDate, returnDate), 1) : null;
  const timeClash =
    returnDate !== null &&
    isReturnBeforePickup(draft.pickupDate, draft.pickupTime, returnDate, draft.returnTime);
  // the date the next calendar tap sets, outlined in the summary
  const nextDate: End = returnDate === null ? 'return' : 'pickup';

  function renderDay(day: string | null, index: number) {
    if (!day) return <View key={`pad-${index}`} style={styles.dayCell} />;

    const isPast = day < today;
    const isStart = day === draft.pickupDate;
    const isEnd = day === returnDate;
    const hasRange = returnDate !== null && returnDate !== draft.pickupDate;
    const isBetween = returnDate !== null && day > draft.pickupDate && day < returnDate;
    const isSelected = isStart || isEnd;

    return (
      <View
        key={day}
        style={[
          styles.dayCell,
          isBetween && styles.inRange,
          hasRange && isStart && styles.rangeStart,
          hasRange && isEnd && styles.rangeEnd,
        ]}
      >
        <Pressable
          onPress={() => pressDay(day)}
          disabled={isPast}
          accessibilityRole="button"
          accessibilityLabel={formatDay(day)}
          accessibilityState={{ disabled: isPast, selected: isSelected }}
          style={[styles.day, day === today && styles.dayToday, isSelected && styles.daySelected]}
        >
          <Text
            style={[
              styles.dayText,
              isPast && styles.dayTextDisabled,
              isSelected && styles.dayTextSelected,
            ]}
          >
            {Number(day.slice(8))}
          </Text>
        </Pressable>
      </View>
    );
  }

  function renderSummary(end: End) {
    const isPickup = end === 'pickup';
    const date = isPickup ? draft.pickupDate : returnDate;
    const time = isPickup ? draft.pickupTime : draft.returnTime;
    const label = isPickup ? 'Pick-up' : 'Return';

    return (
      <View style={styles.summaryRow}>
        <Pressable
          onPress={() => setEditingTime(null)}
          accessibilityRole="button"
          accessibilityLabel={`${label} date`}
          style={[
            styles.summaryCell,
            styles.summaryDate,
            editingTime === null && nextDate === end && styles.summaryCellActive,
          ]}
        >
          <Text style={styles.summaryLabel}>{label}</Text>
          <Text style={[styles.summaryValue, !date && styles.summaryPlaceholder]}>
            {date ? formatDay(date) : 'Select date'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setEditingTime(editingTime === end ? null : end)}
          accessibilityRole="button"
          accessibilityLabel={`${label} time`}
          style={[
            styles.summaryCell,
            styles.summaryTime,
            editingTime === end && styles.summaryCellActive,
          ]}
        >
          <Text style={styles.summaryLabel}>Time</Text>
          <Text style={styles.summaryValue}>{time}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {/* a Modal is outside the app's SafeAreaProvider, so it needs its own */}
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <Text style={styles.title}>Rental dates</Text>
            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={20} color={colors.ink} />
            </Pressable>
          </View>

          {renderSummary('pickup')}
          {renderSummary('return')}

          {editingTime ? (
            <ScrollView contentContainerStyle={styles.list}>
              <View style={styles.slotCard}>
                <Text style={styles.monthTitle}>
                  {editingTime === 'return' ? 'Return time' : 'Pick-up time'}
                </Text>
                <View style={styles.slotGrid}>
                  {TIME_SLOTS.map((slot) => {
                    const current = editingTime === 'return' ? draft.returnTime : draft.pickupTime;
                    const isSelected = slot === current;
                    return (
                      <View key={slot} style={styles.slotCell}>
                        <Pressable
                          onPress={() => pressSlot(slot)}
                          accessibilityRole="button"
                          accessibilityLabel={slot}
                          accessibilityState={{ selected: isSelected }}
                          style={({ pressed }) => [
                            styles.slot,
                            pressed && styles.slotPressed,
                            isSelected && styles.daySelected,
                          ]}
                        >
                          <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                            {slot}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </View>
            </ScrollView>
          ) : (
            <>
              <View style={styles.weekdayRow}>
                {WEEKDAYS.map((weekday) => (
                  <Text key={weekday} style={styles.weekday}>
                    {weekday}
                  </Text>
                ))}
              </View>

              <FlatList
                data={months}
                keyExtractor={(month) => month.title}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                  <View style={styles.month}>
                    <Text style={styles.monthTitle}>{item.title}</Text>
                    {item.weeks.map((week, w) => (
                      <View key={w} style={styles.week}>
                        {week.map(renderDay)}
                      </View>
                    ))}
                  </View>
                )}
              />
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {days === null
                ? 'Select a return date'
                : `${days} ${days === 1 ? 'day' : 'days'} rental`}
            </Text>
            {timeClash ? (
              <Text style={styles.footerWarning}>The return time is before the pick-up time.</Text>
            ) : null}
            <PrimaryButton
              title="Confirm dates"
              disabled={returnDate === null}
              onPress={() => {
                if (returnDate) onConfirm({ ...draft, returnDate });
              }}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
