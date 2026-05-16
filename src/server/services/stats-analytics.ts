import type { StatsPeriod } from "@/lib/stats-query";
import { formatDurationMinutes, formatUnixDate } from "@/lib/formatters";
import type { TrendPoint } from "@/lib/types";
import type { ExternalReadDataDetail } from "@/server/adapters/weread/types";

function buildTrendFromTimestampMap(
  buckets: Record<string, number>,
  maxPoints: number,
  labelDates: boolean,
): TrendPoint[] {
  const entries = Object.entries(buckets)
    .map(([timestamp, seconds]) => ({
      timestamp: Number(timestamp),
      minutes: formatDurationMinutes(seconds),
    }))
    .sort((left, right) => left.timestamp - right.timestamp);

  return entries.slice(-maxPoints).map((entry, index) => ({
    label: labelDates ? formatUnixDate(entry.timestamp).slice(5) : `${index + 1}日`,
    minutes: entry.minutes,
  }));
}

function buildTrendFromDailyReadTimes(
  dailyReadTimes: Record<string, number>,
  maxDays: number,
): TrendPoint[] {
  const cutoff = Math.floor(Date.now() / 1000) - maxDays * 86_400;
  const entries = Object.entries(dailyReadTimes)
    .map(([timestamp, seconds]) => ({
      timestamp: Number(timestamp),
      minutes: formatDurationMinutes(seconds),
    }))
    .filter((entry) => entry.timestamp >= cutoff)
    .sort((left, right) => left.timestamp - right.timestamp);

  return entries.slice(-maxDays).map((entry) => ({
    label: formatUnixDate(entry.timestamp).slice(5),
    minutes: entry.minutes,
  }));
}

export function buildTrendForPeriod(
  detail: ExternalReadDataDetail,
  period: StatsPeriod,
): TrendPoint[] {
  if (period === "90d" && detail.dailyReadTimes && Object.keys(detail.dailyReadTimes).length > 0) {
    return buildTrendFromDailyReadTimes(detail.dailyReadTimes, 90);
  }

  const readTimes = detail.readTimes ?? {};
  const maxPoints = period === "7d" ? 7 : period === "30d" ? 31 : 90;
  return buildTrendFromTimestampMap(readTimes, maxPoints, true);
}

export function buildTrendFromReadData(
  detail: ExternalReadDataDetail,
  options?: { maxPoints?: number; labelDates?: boolean },
): TrendPoint[] {
  const maxPoints = options?.maxPoints ?? 7;
  return buildTrendFromTimestampMap(detail.readTimes ?? {}, maxPoints, options?.labelDates ?? false);
}
