import {
  enumerateLocalDateKeys,
  localDateKeyFromUnixSeconds,
  localDayOfWeek,
  secondsByLocalDateKey,
  type LocalDateRange,
} from "@/lib/local-calendar";
import { formatDurationMinutes } from "@/lib/formatters";
import type { TrendPoint } from "@/lib/types";

export type HeatmapCell = {
  dateKey: string;
  label: string;
  minutes: number;
};

export type ReadingHeatmapWeek = (HeatmapCell | null)[];

export type HeatmapDateRange = LocalDateRange;

const WEEKDAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"] as const;

function minutesLookup(data: TrendPoint[], readTimes?: Record<string, number>): Map<string, number> {
  const map = new Map<string, number>();

  for (const [dateKey, seconds] of secondsByLocalDateKey(readTimes ?? {})) {
    map.set(dateKey, formatDurationMinutes(seconds));
  }

  for (const point of data) {
    if (point.timestamp) {
      map.set(localDateKeyFromUnixSeconds(point.timestamp), point.minutes);
      continue;
    }
    if (/^\d{2}-\d{2}$/.test(point.label)) {
      const year = new Date().getFullYear();
      map.set(`${year}-${point.label}`, point.minutes);
    }
  }

  return map;
}

export function buildReadingHeatmapGrid(
  data: TrendPoint[],
  range: HeatmapDateRange,
  readTimes?: Record<string, number>,
): { weeks: ReadingHeatmapWeek[]; maxMinutes: number; weekdayLabels: readonly string[] } {
  const minutesByKey = minutesLookup(data, readTimes);
  const dateKeys = enumerateLocalDateKeys(range.startDateKey, range.endDateKey);

  const days: HeatmapCell[] = dateKeys.map((dateKey) => ({
    dateKey,
    label: dateKey.slice(5),
    minutes: minutesByKey.get(dateKey) ?? 0,
  }));

  const leadingPadding = days.length > 0 ? localDayOfWeek(days[0]!.dateKey) : 0;
  const padded: (HeatmapCell | null)[] = [
    ...Array.from({ length: leadingPadding }, () => null),
    ...days,
  ];
  while (padded.length % 7 !== 0) {
    padded.push(null);
  }

  const weeks: ReadingHeatmapWeek[] = [];
  for (let index = 0; index < padded.length; index += 7) {
    weeks.push(padded.slice(index, index + 7));
  }

  const maxMinutes = Math.max(...days.map((day) => day.minutes), 0);

  return { weeks, maxMinutes, weekdayLabels: WEEKDAY_LABELS };
}

export function heatmapCellFill(minutes: number, maxMinutes: number): string {
  if (minutes <= 0) {
    return "color-mix(in srgb, var(--chart-1) 8%, var(--paper))";
  }
  const ratio = maxMinutes > 0 ? minutes / maxMinutes : 1;
  const mix = Math.round(22 + ratio * 78);
  return `color-mix(in srgb, var(--chart-1) ${mix}%, var(--paper))`;
}

export function heatmapLegendLevels(): string[] {
  return [0, 0.25, 0.5, 0.75, 1].map((ratio) =>
    ratio === 0
      ? "color-mix(in srgb, var(--chart-1) 8%, var(--paper))"
      : `color-mix(in srgb, var(--chart-1) ${Math.round(22 + ratio * 78)}%, var(--paper))`,
  );
}
