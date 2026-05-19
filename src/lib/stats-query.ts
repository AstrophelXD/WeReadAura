/** Matches `/readdata/detail` `mode` — natural calendar periods only. */
export type ReadDataMode = "weekly" | "monthly" | "annually" | "overall";

export const READ_DATA_MODE_OPTIONS: { value: ReadDataMode; label: string }[] = [
  { value: "weekly", label: "本周" },
  { value: "monthly", label: "本月" },
  { value: "annually", label: "本年" },
  { value: "overall", label: "总计" },
];

const LEGACY_MODE_MAP: Record<string, ReadDataMode> = {
  "7d": "weekly",
  "30d": "monthly",
  "90d": "annually",
};

export function parseReadDataMode(raw?: string | null): ReadDataMode {
  if (raw === "weekly" || raw === "monthly" || raw === "annually" || raw === "overall") {
    return raw;
  }
  if (raw && raw in LEGACY_MODE_MAP) {
    return LEGACY_MODE_MAP[raw]!;
  }
  return "monthly";
}

/** @deprecated Use `parseReadDataMode` — kept for URL param name `period`. */
export const parseStatsPeriod = parseReadDataMode;

export type StatsPeriod = ReadDataMode;

export const STATS_PERIOD_OPTIONS = READ_DATA_MODE_OPTIONS;

export function readDataModeLabel(mode: ReadDataMode): string {
  return READ_DATA_MODE_OPTIONS.find((option) => option.value === mode)?.label ?? "本月";
}

/** @deprecated Use `readDataModeLabel`. */
export const statsPeriodLabel = readDataModeLabel;

export function readDataModeScopeHint(mode: ReadDataMode): string {
  switch (mode) {
    case "weekly":
      return "本周";
    case "monthly":
      return "本月";
    case "annually":
      return "本年";
    case "overall":
      return "累计";
  }
}
