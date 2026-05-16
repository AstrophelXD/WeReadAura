export type StatsPeriod = "7d" | "30d" | "90d";

export const STATS_PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: "7d", label: "近 7 天" },
  { value: "30d", label: "近 30 天" },
  { value: "90d", label: "近 90 天" },
];

export function parseStatsPeriod(raw?: string | null): StatsPeriod {
  if (raw === "7d" || raw === "90d") {
    return raw;
  }
  return "30d";
}

export function statsPeriodLabel(period: StatsPeriod): string {
  return STATS_PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "近 30 天";
}

export function statsPeriodToWeReadMode(period: StatsPeriod): "weekly" | "monthly" | "annually" {
  if (period === "7d") {
    return "weekly";
  }
  if (period === "90d") {
    return "annually";
  }
  return "monthly";
}
