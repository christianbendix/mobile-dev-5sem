import {
  addDays,
  calendarMonths,
  daysBetween,
  formatDay,
  isReturnBeforePickup,
  parseDriverAge,
  timeSlots,
} from '../src/utils/searchInput';

describe('parseDriverAge', () => {
  it('accepts whole ages from 18 to 99', () => {
    expect(parseDriverAge('18')).toBe(18);
    expect(parseDriverAge(' 42 ')).toBe(42);
    expect(parseDriverAge('99')).toBe(99);
  });

  it('rejects ages out of range, and anything that is not a whole number', () => {
    for (const text of ['17', '100', '', '2.5', '-20', 'abc', '21 years']) {
      expect(parseDriverAge(text)).toBeNull();
    }
  });
});

describe('dates', () => {
  it('adds and counts days across a month end', () => {
    expect(addDays('2026-09-30', 3)).toBe('2026-10-03');
    expect(addDays(new Date(2026, 8, 30), 1)).toBe('2026-10-01');
    expect(daysBetween('2026-09-30', '2026-10-03')).toBe(3);
  });

  it('counts whole days across a daylight-saving change', () => {
    // Denmark moves the clocks back on 25 Oct 2026
    expect(daysBetween('2026-10-24', '2026-10-26')).toBe(2);
  });

  it('formats a date as the search card shows it', () => {
    expect(formatDay('2026-10-02')).toBe('Fri 2 Oct');
  });
});

describe('calendarMonths', () => {
  it('lays a month out in Monday-first weeks', () => {
    const [october] = calendarMonths('2026-10-15', 1);

    expect(october.title).toBe('October 2026');
    // 1 Oct 2026 is a Thursday: three blanks, then the 1st
    expect(october.weeks[0]).toEqual([
      null,
      null,
      null,
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
    expect(october.weeks.flat().filter(Boolean)).toHaveLength(31);
    expect(october.weeks.every((week) => week.length === 7)).toBe(true);
  });

  it('continues into the next year', () => {
    const titles = calendarMonths('2026-11-01', 3).map((month) => month.title);

    expect(titles).toEqual(['November 2026', 'December 2026', 'January 2027']);
  });
});

describe('times', () => {
  it('offers every half hour of the day', () => {
    const slots = timeSlots(30);

    expect(slots).toHaveLength(48);
    expect(slots.slice(0, 3)).toEqual(['00:00', '00:30', '01:00']);
    expect(slots[slots.length - 1]).toBe('23:30');
  });

  it('only flags a same-day return that is not after the pick-up', () => {
    expect(isReturnBeforePickup('2026-10-02', '10:00', '2026-10-02', '09:30')).toBe(true);
    expect(isReturnBeforePickup('2026-10-02', '10:00', '2026-10-02', '10:00')).toBe(true);
    expect(isReturnBeforePickup('2026-10-02', '10:00', '2026-10-02', '14:00')).toBe(false);
    // a later day is fine whatever the times
    expect(isReturnBeforePickup('2026-10-02', '18:00', '2026-10-03', '08:00')).toBe(false);
  });
});
