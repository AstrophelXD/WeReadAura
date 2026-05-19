import type { ReadDataMode } from "@/lib/stats-query";
import {
  buildHeatmapDateRange,
  hasDailyReadDetail,
  heatmapSourceBuckets,
  trendBucketGranularity,
} from "@/lib/stats-chart";
import type { HeatmapDateRange } from "@/lib/reading-heatmap";
import {
  buildLocalMonthRange,
  buildLocalWeekRange,
  buildLocalYearRange,
  buildWeeklyTrendLabels,
  enumerateLocalDateKeys,
  localMidnightUnixSeconds,
  parseLocalDateKey,
  secondsByLocalDateKey,
} from "@/lib/local-calendar";
import { formatDurationMinutes, formatUnixDate } from "@/lib/formatters";
import type { TrendPoint } from "@/lib/types";
import type { ExternalReadDataDetail } from "@/server/adapters/weread/types";

function buildTrendFromTimestampMap(
  buckets: Record<string, number>,
  labelDates: boolean,
  labelFormatter?: (timestamp: number) => string,
): TrendPoint[] {
  const entries = Object.entries(buckets)
    .map(([timestamp, seconds]) => ({
      timestamp: Number(timestamp),
      minutes: formatDurationMinutes(seconds),
    }))
    .filter((entry) => Number.isFinite(entry.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp);

  return entries.map((entry, index) => ({
    label: labelFormatter
      ? labelFormatter(entry.timestamp)
      : labelDates
        ? formatUnixDate(entry.timestamp).slice(5)
        : `${index + 1}`,
    minutes: entry.minutes,
    timestamp: entry.timestamp,
  }));
}

function buildDailyTrendForRange(
  buckets: Record<string, number>,
  range: { startDateKey: string; endDateKey: string },
): TrendPoint[] {
  const lookup = secondsByLocalDateKey(buckets);

  return enumerateLocalDateKeys(range.startDateKey, range.endDateKey).map((dateKey) => {
    const day = parseLocalDateKey(dateKey);
    return {
      label: dateKey.slice(5),
      minutes: formatDurationMinutes(lookup.get(dateKey) ?? 0),
      timestamp: localMidnightUnixSeconds(day),
    };
  });
}

function buildWeeklyTrend(detail: ExternalReadDataDetail): TrendPoint[] {
  const buckets = detail.readTimes ?? {};
  const lookup = secondsByLocalDateKey(buckets);
  const range = buildLocalWeekRange(detail.baseTime);
  const labels = buildWeeklyTrendLabels();
  const dateKeys = enumerateLocalDateKeys(range.startDateKey, range.endDateKey);

  return dateKeys.map((dateKey, index) => {
    const day = parseLocalDateKey(dateKey);
    return {
      label: labels[index] ?? dateKey.slice(5),
      minutes: formatDurationMinutes(lookup.get(dateKey) ?? 0),
      timestamp: localMidnightUnixSeconds(day),
    };
  });
}

function monthLabelFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return `${String(date.getMonth() + 1).padStart(2, "0")}月`;
}

function yearLabelFromTimestamp(timestamp: number): string {
  return String(new Date(timestamp * 1000).getFullYear());
}

export function buildTrendForMode(
  detail: ExternalReadDataDetail,
  mode: ReadDataMode,
): TrendPoint[] {
  if (mode === "weekly") {
    return buildWeeklyTrend(detail);
  }

  const granularity = trendBucketGranularity(mode, detail);

  if (granularity === "day" && hasDailyReadDetail(detail)) {
    const range = buildLocalYearRange(detail.baseTime);
    return buildDailyTrendForRange(detail.dailyReadTimes!, range);
  }

  const readTimes = detail.readTimes ?? {};

  if (mode === "monthly") {
    const range = buildLocalMonthRange(detail.baseTime);
    return buildDailyTrendForRange(readTimes, range);
  }

  if (granularity === "month") {
    return buildTrendFromTimestampMap(readTimes, false, monthLabelFromTimestamp);
  }

  if (granularity === "year") {
    return buildTrendFromTimestampMap(readTimes, false, yearLabelFromTimestamp);
  }

  return buildTrendFromTimestampMap(readTimes, true);
}

export function buildTrendFromReadData(
  detail: ExternalReadDataDetail,
  options?: { maxPoints?: number; labelDates?: boolean },
): TrendPoint[] {
  const maxPoints = options?.maxPoints ?? 7;
  const trend = buildTrendFromTimestampMap(
    detail.readTimes ?? {},
    options?.labelDates ?? false,
  );
  return trend.slice(-maxPoints);
}

export function resolveStatsTrend(
  detail: ExternalReadDataDetail,
  mode: ReadDataMode,
): {
  trend: TrendPoint[];
  heatmapRange?: HeatmapDateRange;
  heatmapBuckets?: Record<string, number>;
} {
  const trend = buildTrendForMode(detail, mode);
  const heatmapRange = buildHeatmapDateRange(mode, detail);
  const heatmapBuckets = heatmapRange ? heatmapSourceBuckets(detail) : undefined;

  return { trend, heatmapRange, heatmapBuckets };
}

/** @deprecated Use `buildTrendForMode`. */
export const buildTrendForPeriod = buildTrendForMode;
