/** Local-calendar helpers for WeRead natural periods (Mon–Sun week, local month). */

const WEEKDAY_LABELS_MON_FIRST = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] as const;

export function localDateKeyFromDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function localDateKeyFromUnixSeconds(timestamp: number): string {
  return localDateKeyFromDate(new Date(timestamp * 1000));
}

export function localDayOfWeek(dateKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year!, month! - 1, day!).getDay();
}

export function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year!, month! - 1, day!);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function startOfLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Monday 00:00 local — WeRead `weekly` period anchor. */
export function startOfLocalWeekMonday(date: Date): Date {
  const local = startOfLocalDay(date);
  const weekday = local.getDay();
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  local.setDate(local.getDate() - daysFromMonday);
  return local;
}

export function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function localMidnightUnixSeconds(date: Date): number {
  return Math.floor(startOfLocalDay(date).getTime() / 1000);
}

export function secondsByLocalDateKey(buckets: Record<string, number>): Map<string, number> {
  const map = new Map<string, number>();
  for (const [timestamp, seconds] of Object.entries(buckets)) {
    const key = localDateKeyFromUnixSeconds(Number(timestamp));
    if (!Number.isFinite(Number(timestamp))) {
      continue;
    }
    map.set(key, (map.get(key) ?? 0) + seconds);
  }
  return map;
}

export function enumerateLocalDateKeys(startDateKey: string, endDateKey: string): string[] {
  const keys: string[] = [];
  const cursor = parseLocalDateKey(startDateKey);
  const end = parseLocalDateKey(endDateKey);

  while (cursor <= end) {
    keys.push(localDateKeyFromDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

export type LocalDateRange = {
  startDateKey: string;
  endDateKey: string;
};

export function buildLocalMonthRange(baseTime?: number, capToToday = true): LocalDateRange {
  const ref = baseTime ? new Date(baseTime * 1000) : new Date();
  const start = startOfLocalMonth(ref);
  const monthEnd = endOfLocalMonth(ref);
  const today = startOfLocalDay(new Date());
  const end = capToToday && monthEnd > today ? today : monthEnd;

  return {
    startDateKey: localDateKeyFromDate(start),
    endDateKey: localDateKeyFromDate(end),
  };
}

export function buildLocalYearRange(baseTime?: number, capToToday = true): LocalDateRange {
  const ref = baseTime ? new Date(baseTime * 1000) : new Date();
  const year = ref.getFullYear();
  const start = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  const today = startOfLocalDay(new Date());
  const end = capToToday && endOfYear > today ? today : endOfYear;

  return {
    startDateKey: localDateKeyFromDate(start),
    endDateKey: localDateKeyFromDate(end),
  };
}

export function buildLocalWeekRange(baseTime?: number): LocalDateRange {
  const monday = startOfLocalWeekMonday(baseTime ? new Date(baseTime * 1000) : new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDateKey: localDateKeyFromDate(monday),
    endDateKey: localDateKeyFromDate(sunday),
  };
}

export function weeklyAxisLabels(): readonly string[] {
  return WEEKDAY_LABELS_MON_FIRST;
}

export function buildWeeklyTrendLabels(): readonly string[] {
  return WEEKDAY_LABELS_MON_FIRST;
}
