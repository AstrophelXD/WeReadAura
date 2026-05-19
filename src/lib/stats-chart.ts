import type { ReadDataMode } from "@/lib/stats-query";
import {
  buildLocalMonthRange,
  buildLocalYearRange,
  type LocalDateRange,
} from "@/lib/local-calendar";

export type TrendChartVariant = "bar" | "heatmap";

export type TrendBucketGranularity = "day" | "month" | "year";

export type HeatmapDateRange = LocalDateRange;

type ReadDataShape = {
  readTimes?: Record<string, number>;
  dailyReadTimes?: Record<string, number>;
  baseTime?: number;
};

export function hasDailyReadDetail(detail: ReadDataShape): boolean {
  const daily = detail.dailyReadTimes;
  return Boolean(daily && Object.keys(daily).length > 0);
}

export function trendBucketGranularity(
  mode: ReadDataMode,
  detail: ReadDataShape,
): TrendBucketGranularity {
  if (mode === "weekly" || mode === "monthly") {
    return "day";
  }
  if (mode === "annually" && hasDailyReadDetail(detail)) {
    return "day";
  }
  if (mode === "annually") {
    return "month";
  }
  return "year";
}

/** Weekly uses daily bars; monthly / annual-with-daily use heatmaps; coarser buckets use bars. */
export function trendChartVariant(mode: ReadDataMode, detail: ReadDataShape): TrendChartVariant {
  const granularity = trendBucketGranularity(mode, detail);
  if (granularity === "day" && mode !== "weekly") {
    return "heatmap";
  }
  return "bar";
}

export function buildHeatmapDateRange(
  mode: ReadDataMode,
  detail: ReadDataShape,
): HeatmapDateRange | undefined {
  if (trendChartVariant(mode, detail) !== "heatmap") {
    return undefined;
  }

  if (mode === "monthly") {
    return buildLocalMonthRange(detail.baseTime);
  }

  if (mode === "annually") {
    return buildLocalYearRange(detail.baseTime);
  }

  return undefined;
}

export function trendChartDescription(
  mode: ReadDataMode,
  detail: ReadDataShape,
): string {
  const variant = trendChartVariant(mode, detail);
  const granularity = trendBucketGranularity(mode, detail);

  if (variant === "heatmap") {
    return mode === "monthly"
      ? "自然月内按日阅读时长（日历热力图，本地时区）。"
      : "自然年内按日阅读时长（日历热力图，本地时区）。";
  }

  if (granularity === "day") {
    return "本周一至周日按日阅读时长（固定 7 天横轴）。";
  }
  if (granularity === "month") {
    return "本年内按月分桶的阅读时长。";
  }
  return "历史总计按年分桶的阅读时长。";
}

export function heatmapSourceBuckets(detail: ReadDataShape): Record<string, number> | undefined {
  if (hasDailyReadDetail(detail)) {
    return detail.dailyReadTimes;
  }
  return detail.readTimes;
}
